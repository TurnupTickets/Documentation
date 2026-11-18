# Zewnętrzne usługi i ich przeznaczenie

## QueueSystem

Serwis napisany w Laravel odpowiedzialny za dodawanie zadań do SQS oraz obsługę kolejki. Wysyła maile poprzez MailGun, a SMS-y poprzez SmsApi.
Działa na AWS Lambda. Centralny system zarządzania zadaniami asynchronicznymi w aplikacji.

**Uwaga — ścieżka wysyłki SMS**: QueueSystem jest ścieżką **zapasową** dla wysyłki SMS, nie domyślną. TurnupCms wysyła SMS-y z potwierdzeniem biletu bezpośrednio przez SmsApi (`App\Services\Sms\SmsService`); przełączenie na dispatch przez QueueSystem/Lambda odbywa się przez `SMS_DISPATCH_VIA_LAMBDA=true` (domyślnie `false`) — tak, by wysyłka SMS działała nawet jeśli QueueSystem jest niedostępny. Dla maili QueueSystem jest ścieżką domyślną (`mail_dispatch_via_lambda`, zarządzane z panelu, patrz przełączniki systemowe).

**Endpoint:** : 
* Prod: `https://8l8sfo2grj.execute-api.eu-central-1.amazonaws.com/api`
* Beta: `https://nm4je6sjh7.execute-api.eu-central-1.amazonaws.com/api`
**Autoryzacja:** Bearer Token. Po stronie TurnupCms token/URL są pod `QUEUE_SERVICE_API_TOKEN`/`QUEUE_SERVICE_API_URL` — ta sama para zmiennych obsługuje dispatch i maila, i SMS-a (wspólny token, wspólny URL), weryfikowana po stronie QueueSystem jako `API_TOKEN` przez `TokenAuthMiddleware`.
**Dokumentacja API:** Swagger dostępny pod `/docs`

### MailGun

Serwis do wysyłki e-maili transakcyjnych i marketingowych. Integracja poprzez REST API.

**Konfiguracja:**
- Domain: `mail.turnup.eu`
- API Key: przechowywany w AWS Secrets Manager
- Webhook URL: `/webhooks/mailgun` dla obsługi statusów dostarczenia

### Lambda

Funkcje AWS Lambda hostujące logikę QueueSystem. Automatyczne skalowanie w zależności od obciążenia.

**Funkcje:**
- przetwarzanie zadań z SQS
- wysyłka e-maili przez MailGun
- obsługa webhooków zewnętrznych

### SQS

Amazon Simple Queue Service do zarządzania kolejkami zadań. Zapewnia niezawodność i skalowalność.

**Kolejki:**
- SERVERLESS_AWS_SQS_QUEUE: zadania wysyłki e-maili

### SSM Parameter Store

AWS Systems Manager Parameter Store do bezpiecznego przechowywania konfiguracji aplikacji i sekretów.

**Funkcje:**
- przechowywanie kluczy API i tokenów autoryzacyjnych
- konfiguracja środowiskowa (prd/stg)

### Serverless przez https://bref.sh/

Framework Serverless do zarządzania infrastrukturą AWS Lambda i powiązanych zasobów jako kod.

**Konfiguracja:**
- **Framework:** Serverless Framework v3.x
- **Provider:** AWS
- **Runtime:** Node.js 20.x, PHP 8.2
- **Deployment:** automatyczne przez CI/CD pipeline
- **Monitoring:** CloudWatch Logs i X-Ray tracing
- **Stages:** staging: stg, main: prd z oddzielnymi zasobami

### Laravel

Framework PHP wykorzystywany do budowy QueueSystem. Wersja 10.x z dodatkowymi pakietami.

**Kluczowe endpointy:**
* `/send-ordered-mail`
* `/send-ordered-sms` — dispatch SMS z potwierdzeniem biletu (używany tylko gdy `SMS_DISPATCH_VIA_LAMBDA=true` po stronie TurnupCms)
* `/send-mail`
* `/webhook-smsapi` — callback statusu dostarczenia SMS z SmsApi. Autoryzacja: **nie** Bearer Token jak resztę API — SmsApi nie wspiera Bearer/HMAC na swoim `notifyUrl`, więc endpoint używa współdzielonego sekretu w query stringu (`?token=...`) i jest jedynym wyjątkiem od standardowej autoryzacji tego serwisu. **Uwaga:** nazwy pól w payloadzie (`idx`, `status`) są na razie najlepszym przypuszczeniem opartym na konwencji innych gateway'ów SMS — nie zostały zweryfikowane na żywym payloadzie SmsApi. Traktować jako otwarte ryzyko do zweryfikowania przed poleganiem na automatycznym potwierdzaniu dostawy SMS.
* `/add-to-mailing-list`
* `/unsubscribe-from-mailing-list/{email}`

**Idempotencja dispatch'u** (`/send-ordered-mail`, `/send-ordered-sms`): każde zamówienie ma kolumnę `added_to_queue`/`added_to_queue_sms` w `payments`, która pilnuje, by to samo zamówienie nie trafiło do kolejki dwa razy (np. przy retry z API Gateway). Guard jest zaimplementowany jako atomowy warunkowy `UPDATE ... WHERE added_to_queue = false` (nie read-then-write) — wcześniejsza wersja (SELECT, potem dispatch, potem UPDATE) miała realny wyścig: dwa równoczesne requesty mogły obie przejść guard przed zapisem żadnego z nich, co prowadziło do podwójnej, płatnej wysyłki tego samego maila/SMS-a.

## AWS DynamoDB (cache store TurnupCms)

Backend cache'u TurnupCms (`CACHE_STORE=dynamodb`) na produkcji — nie część QueueSystem, ale ta sama infrastruktura AWS (konto `087887948460`, region `eu-central-1`).

**Dlaczego nie Redis/plik:** zakup biletu serializuje się per-wydarzenie przez `Cache::lock()` (`App\Services\Orders\OrderService::createOrder`, klucz `order_lock:event:{id}`) oraz per-płatność (`App\Services\Payments\PaymentService`) — to jest mechanizm, który chroni przed przesprzedaniem biletów przy równoczesnych zakupach (dwa requesty czytające "dostępne" przed zapisem żadnego z nich). Taki lock musi być atomowy między **wszystkimi** serwerami aplikacji — `file`/`array` cache store tego nie gwarantuje na wdrożeniu wieloserwerowym. DynamoDB w trybie on-demand (pay-per-request) wybrano nad Redis/ElastiCache ze względu na koszt: ruch zakupowy jest skokowy (cisza między eventami, spike przy starcie sprzedaży biletów), a stały węzeł Redis kosztowałby niezależnie od tego, czy jest ruch, czy nie.

**Konfiguracja:**
- **Tabela:** `turnupcms-cache` — partition key `key` (String), billing `PAY_PER_REQUEST`, natywne TTL na atrybucie `expires_at`.
- **IAM:** dedykowany, scoped user (`turnupcms-cache`) z uprawnieniami ograniczonymi tylko do tej jednej tabeli (`GetItem`/`PutItem`/`UpdateItem`/`DeleteItem`/`BatchGetItem`/`BatchWriteItem`) — bez dostępu do innych zasobów konta.
- **Zmienne środowiskowe:** `CACHE_AWS_ACCESS_KEY_ID`, `CACHE_AWS_SECRET_ACCESS_KEY`, `CACHE_AWS_DEFAULT_REGION`, `DYNAMODB_CACHE_TABLE` — nazewnictwo z prefiksem per-usługa (jak `TICKETS_AWS_*` dla bucketu S3 na bilety), **nie** generyczne `AWS_*`, żeby uniknąć kolizji z innymi, osobno scoped credentialami AWS używanymi w tej aplikacji.

## GA (Google Analytics)

System Google Analytics 4 wykorzystywany do analityki ruchu i zachowań użytkowników. Integracja poprzez Google Tag Manager i Measurement Protocol.

**Konfiguracja:**
- Measurement ID: `G-XXXXXXXXXX`
- API Key: Google Analytics Reporting API v4
- Tracking: Enhanced E-commerce, Custom Events
- **Endpoint:** `https://www.google-analytics.com/mp/collect`

## SmsApi

Serwis odpowiedzialny za wysyłkę SMS-ów transakcyjnych związanych z zamówieniami i powiadomieniami.

**Integracja:**
- **Endpoint:** `https://api.smsapi.pl/`
- **Autoryzacja:** Bearer Token (OAuth 2.0)
- **Formaty:** JSON/XML
- **Funkcje:** wysyłka SMS, sprawdzanie statusu, zarządzanie szablonami

## Timezonedb

API do określenia strefy czasowej na podstawie współrzędnych geograficznych lub adresu IP użytkownika.

**Integracja:**
- **Endpoint:** `http://api.timezonedb.com/v2.1/`
- **Autoryzacja:** API Key
- **Metody:** `get-time-zone`, `list-time-zone`, `convert-time-zone`
- **Format odpowiedzi:** JSON/XML
- **Limit:** 1000 zapytań/miesiąc (plan darmowy)

## Cloudflare

CDN i serwis bezpieczeństwa używany do filtrowania ruchu, cache'owania zasobów oraz zarządzania rekordami DNS.

**Funkcje:**
- **DNS Management:** zarządzanie rekordami A, CNAME, MX
- **SSL/TLS:** automatyczne certyfikaty Let's Encrypt
- **Cache:** reguły cache'owania dla statycznych zasobów
- **Security:** DDoS protection, Web Application Firewall

## Przelewy24

System obsługi płatności online w złotówkach (PLN). Integracja poprzez REST API i notyfikacje webhook.

**Konfiguracja:**
- **Merchant ID:** identyfikator sprzedawcy
- **Endpoint:** `https://secure.przelewy24.pl/api/v1/`
- **Autoryzacja:** Basic Auth (login + hasło)
- **Metody płatności:** karty, BLIK, przelewy bankowe
- **Webhook:** `/webhooks/przelewy24` dla statusów płatności
- **Środowisko testowe:** `https://sandbox.przelewy24.pl/`

## Stripe

Międzynarodowy system obsługi płatności w walutach obcych (EUR, UAH, CAD). Integracja poprzez Stripe API i webhooks.

**Konfiguracja:**
- **Publishable Key:** klucz publiczny do frontend
- **Secret Key:** klucz prywatny do backend (w AWS Secrets Manager)
- **Endpoint:** `https://api.stripe.com/v1/`
- **Webhook:** `/webhooks/stripe` z weryfikacją podpisu
- **Funkcje:** płatności jednorazowe, subskrypcje, zwroty
- **3D Secure:** automatyczna obsługa SCA compliance
