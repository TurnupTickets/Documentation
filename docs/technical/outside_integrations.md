# Zewnętrzne usługi i ich przeznaczenie

## QueueSystem

Serwis napisany w Laravel odpowiedzialny za dodawanie zadań do SQS oraz obsługę kolejki. Wysyła maile poprzez MailGun.
Działa na AWS Lambda. Centralny system zarządzania zadaniami asynchronicznymi w aplikacji.

**Endpoint:** : 
* Prod: `https://8l8sfo2grj.execute-api.eu-central-1.amazonaws.com/api`
* Beta: `https://nm4je6sjh7.execute-api.eu-central-1.amazonaws.com/api`
**Autoryzacja:** Bearer Token
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
* `/send-mail`
* `/delivered-email`
* `/add-to-mailing-list`
* `/unsubscribe-from-mailing-list/{email}`

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
