---
title: REST API dla aplikacji webowej
---

# REST API dla aplikacji webowej (TurnupApp)

TurnupCms udostępnia dwie niezależne przestrzenie REST API, obie konsumowane przez **tę samą** aplikację TurnupApp (nie ma integracji z zewnętrzną platformą marketplace — "marketplace" to nazwa własna nowszej wersji API, patrz niżej).

## Uwierzytelnianie

**Laravel Sanctum, sesja cookie (SPA auth)** — nie bearer token.

1. Klient wywołuje `GET /sanctum/csrf-cookie` (jednorazowo, memoizowane) — ustawia cookie `XSRF-TOKEN`.
2. Każdy request wysyłany z `credentials: include`.
3. Na mutujących endpointach `auth/*` i `account/*` dołączany jest header `X-XSRF-TOKEN` z wartości cookie.
4. Przy renderowaniu SSR klient przekazuje dalej nagłówki `Cookie` i `Origin` z żądania przychodzącego (Node `fetch` nie ma własnego cookie-jara, a Sanctum wymaga zgodnego `Origin`/`Referer`).

Guard: `web` (Sanctum SPA), niezależny od guardu `admins` (Filament) i middleware `async-auth` (legacy admin API).

## `api/v1/*` — oryginalna przestrzeń

| Metoda | Endpoint | Kontroler | Auth |
|---|---|---|---|
| GET | `/v1/ping` | health check | publiczny |
| GET | `/v1/homepage` | `HomepageController` | publiczny |
| GET | `/v1/events` | `EventController@index` (page, per_page, search, tag, upcoming) | publiczny |
| GET | `/v1/events/{tag}/{event}` | `EventController@show` | publiczny |
| GET | `/v1/pages`, `/v1/pages/{slug}` | `PageController` | publiczny |
| GET | `/v1/seo-settings` | `SeoSettingController` | publiczny |
| GET | `/v1/languages`, `/v1/translations` | `LanguageController`, `TranslationController` | publiczny |
| POST | `/v1/events/{event}/quote` | `QuoteController` (wycena przed checkout, header `X-Cart-Token` dla rezerwacji miejsc) | publiczny |
| POST | `/v1/events/{event}/orders` | `OrderController@store` (checkout) | publiczny |
| GET | `/v1/orders/{code}` | `OrderController@status` | publiczny (po kodzie płatności) |
| POST | `/v1/auth/register`, `/v1/auth/login` | throttle `auth` | publiczny |
| POST | `/v1/auth/logout`, GET `/v1/auth/me` | — | `auth:sanctum` |
| GET | `/v1/account/orders`, `/v1/account/orders/{code}`, `/v1/account/tickets` | — | `auth:sanctum` |
| PATCH | `/v1/account/profile` | — | `auth:sanctum` |
| PUT | `/v1/account/password` | — | `auth:sanctum` |

## `api/marketplace/v1/*` — nowsza przestrzeń

**Ważne:** mimo nazwy, to nie jest integracja z zewnętrznym marketplace. To wewnętrzna konwencja nazewnicza ("three-surface-architecture") dla nowszej wersji publicznego API, konsumowanej przez ten sam front TurnupApp.

| Metoda | Endpoint | Kontroler | Auth |
|---|---|---|---|
| GET | `/marketplace/v1/redirects/lookup` | `RedirectLookupController` | publiczny |
| GET | `/marketplace/v1/sitemap.xml` | `SitemapController` | publiczny |
| GET | `/marketplace/v1/menu/{code}` | `MenuController` (`main`/`footer`) | publiczny |
| GET | `/marketplace/v1/events/{tag}/{event}/seat-map` | `SeatMapController` | publiczny |
| POST | `/marketplace/v1/tickets/lookup` | `TicketLookupController` (throttle `ticket-lookup`) | publiczny (gość, kod SMS) |
| POST | `/marketplace/v1/tickets/verify` | `TicketVerifyController` (throttle `ticket-lookup`) | publiczny (gość, kod SMS) |
| POST | `/marketplace/v1/password/reset` | `PasswordResetController` (throttle `password-reset`) | publiczny z tokenem |

## Admin-internal API (legacy)

`routes/admin_api.php`: `GET admin/api/events` → `Admin\ApiController@events`, pod middleware `async-auth` — jeden, legacy endpoint dla starszego async UI panelu. Nie jest częścią kontraktu z aplikacją kliencką.

## Kontrakt błędów

- **Walidacja Laravel (422):** `{ "message": "...", "errors": { "pole": ["błąd1", "błąd2"] } }`
- **Błędy domenowe (409/422):** `{ "success": false, "error": { "code": "...", "message": "..." } }` — używane np. przez wyjątki zamówień: `INSUFFICIENT_TICKETS`, `SEATS_OCCUPIED`, `ORDER_ALREADY_PAID`, `PURCHASE_IN_PROGRESS`, `INVALID_CURRENT_PASSWORD`, `INVALID_VERIFICATION_CODE`, `invalid_or_expired_token`.

## Kluczowe kontrakty danych (zgodne z `TurnupApp/src/lib/api/types.ts`)

- Ceny (`price`) serializowane jako **string** (Laravel decimal cast); statusy (`TicketGroupStatus`, `TicketStatus`, `PaymentStatus`) jako **integer**.
- `cover_url` / `gallery_urls` to ścieżki względne serwera — klient rozwiązuje je względem `API_ORIGIN`.
- Mapa miejsc: discriminated union `{type: "none" | "scheme" | "custom"}` — `scheme` niesie surowe SVG + listę miejsc, `custom` niesie siatkę (rows/cols) + listę miejsc. Każde miejsce ma `id` (do quote/order) i `real_id` (tylko do wyświetlania).
- QR kod biletu (`qr_code`) to base64 PNG osadzony bezpośrednio w JSON odpowiedzi.

## Podsumowanie

Dwie przestrzenie API (`v1`, `marketplace/v1`) to dwie generacje tego samego publicznego kontraktu z klientem TurnupApp, nie integracja z zewnętrzną platformą handlową. Uwierzytelnianie oparte na sesji Sanctum odróżnia ten kontrakt od integracji z zewnętrznymi usługami (Przelewy24, Stripe, SmsApi), opisanych w [outside_integrations.md](./outside_integrations.md), które używają własnych mechanizmów auth (API key / Basic Auth / webhook signature).
