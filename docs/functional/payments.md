---
title: Płatności
---

# Moduł płatności

## Konfiguracja metod płatności

Metody płatności obsługiwane przez system są definiowane w **pliku konfiguracyjnym**.

Aktualnie obsługiwane metody płatności:
- **Przelewy24 (P24)** – dla waluty **PLN**
- **Stripe** – dla **pozostałych walut**

## Struktura modułu

Moduł zawiera listę płatności. Każda płatność:
- jest powiązana z konkretną **grupą biletów**,
- ma przypisane **wiele biletów**.

## Statusy płatności

Płatność może znajdować się w jednym z następujących statusów:

| Status                      | Wartość |
|----------------------------|---------|
| Nieopłacone (anulowane)    | -1      |
| W trakcie                  | 0       |
| Opłacone ręcznie           | 1       |
| Opłacone automatycznie     | 2       |

## Powiadomienia

System wysyła powiadomienia:
- **Email** – po **anulowaniu** lub **zatwierdzeniu** transakcji,
- **SMS** – po udanej transakcji, **jeśli użytkownik wybrał taką opcję**.

## Kluczowe pola w bazie danych

- `id`
- `user_id` – ID użytkownika
- `morph_relation` – relacja do wydarzeń
- `created_at` – data utworzenia
- `paid_at` – data opłacenia
- `amount` – kwota do zapłaty
- `currency_rate` – kurs waluty
- `status` – status płatności
- `payment_method` – metoda płatności
- `first_name`, `last_name`
- `phone_number`, `email`
- `address`, `city`, `postal_code`, `city_code`, `street_number`
- `retry_status` – status ponowienia płatności
- `payment_logs` – logi zwrócone przez system płatności (P24)
- `payment_code` – unikalny kod płatności
- `payment_session` – unikalna sesja płatności (P24)
- `promo_code_id`, `promo_code`, `promo_code_value`
- `promo_code_info` – dodatkowe informacje o kodzie promocyjnym (np. wydarzenie lub grupa biletów)
- `currency`
- `additional_costs` – koszty dodatkowe
- `email_sent`, `email_sent_at` – status i data wysyłki emaila
- `expires_at` – data wygaśnięcia płatności
- `language_code` – język, w jakim dokonano płatności
- `sms_send_status` – czy wysłać SMS
- `sms_sent` – czy SMS został wysłany
- `sms_sent_at` – data wysyłki SMS
- `is_gift` – czy zakupiono dla kogoś jako prezent
- `additional_ticket_costs` – JSON z dodatkowymi kosztami przypisanymi do biletów
- `order_notes` – uwagi do zamówienia
