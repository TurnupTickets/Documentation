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
- `user_id` – ID użytkownika (może być puste)
- `morph_relation` – elacja do wydarzeń (wymagane) pola to module oraz record_id
- `inserted` – data utworzenia
- `payed_date` – data opłacenia
- `to_pay` – kwota do zapłaty
- `exchange` – kurs waluty
- `pay_status` – status płatności
- `pay_method` – metoda płatności
- `total_payment`
- `first_name` - Imię podane w formularzu podczas zakupu,
- `last_name` - Nazwisko podane w formularzu podczas zakupu
- `phone` - Numer telefonu podany w formularzu podczas zakupu, 
- `email` - Adres email podany w formularzu podczas zakupu
- `address` - Ulica i numer domu podany w formularzu podczas zakupu,
- `city` - Miasto podane w formularzu podczas zakupu,
- `zip` - Kod pocztowy podany w formularzu podczas zakupu, 
- `is_payment_retryable` – status ponowienia płatności
- `payment_log` – logi zwrócone przez system płatności (P24)
- `payment_code` – unikalny kod płatności
- `p24_session_id` – unikalna sesja płatności (P24)
- `user_name`,
- `user_email`,
- `user_ip`,
- `discount_id` - Id kodu promocyjnego użytego w zamówieniu,
- `discount_code` - Treść kodu użytego w zamówieniu,
- `discount_value` - Wartość kodu,
- `discount_info`,
- `items_data`,
- `currency` - Waluta,
- `additional_cost` - Koszty dodatkowe doliczone do kwoty biletów,
- `is_sent` - Informacja czy bilet został wysłany na email,
- `sent_date` - Data wysłania biletów na email,
- `expiration_date`
- `code` - Język systemu z którego zostało złożone zamówienie (np. pl_pl),
- `sms` - Czy zamówienie posiada wysyłke sms,
- `city_code`,
- `street_number`
- `is_gift` - Czy zamówienie ma być spakowane jako prezent,
- `is_yello_buddy_pack`,
- `record_additional_cost_params` - Czy zamówienie posiada jakieś dodatkowe koszty dodane tylko do wydarzenia,
- `comments` - Uwagi do zamówienia,
- `send_email_token` - Token wysyłki wiadomości przez mailguna.

# Działanie modułu

## Proces zakupu

1. **Wybór wydarzenia i biletów**
    - Klient może kupić bilety tylko na jedno wydarzenie w ramach jednego zamówienia.
    - Ilość biletów jest ograniczona do dostępnej puli w danej grupie biletów.
    - Administrator zarządza grupami biletów w module wydarzeń.

2. **Elementy dodatkowe**
    - Do zamówienia można dodać opcje dodatkowe przypisane do wydarzenia, np.:
        - wysyłka biletu SMS,
        - wysyłka pocztą,
        - zapakowanie jako prezent.

3. **Miejsca siedzące**
    - System umożliwia sprzedaż biletów z przypisanymi miejscami siedzącymi.

4. **Rabaty**
    - Klient może dodać kod rabatowy w trakcie składania zamówienia.
    - Cena końcowa jest aktualizowana na bieżąco po każdej zmianie.

5. **Formularz zamówienia**
    - Po kliknięciu **"Kupuję i płacę"**, klient przechodzi do formularza zamówienia.
    - Formularz zawiera pola:
        - Imię,
        - Nazwisko,
        - Adres e-mail,
        - Numer telefonu (z wyborem numeru kierunkowego),
        - Akceptacja regulaminu.
    - Przy wyborze wysyłki fizycznej wymagany jest **adres korespondencyjny**.

6. **Płatności**
    - Po zatwierdzeniu formularza klient jest przenoszony do operatora płatności.
    - Obsługiwane systemy płatności:
        - **PLN** → Przelewy24
        - **inne waluty** → Stripe

---

## Statusy zamówienia

Zamówienie może przyjmować różne stany:

- **W trakcie**
    - Ustawiany po wysłaniu formularza.
    - Bilety wchodzące w skład zamówienia są blokowane w puli.
    - Stan trwa do momentu opłacenia lub anulowania zamówienia.

- **Opłacone**
    - System wysyła bilety elektroniczne na adres e-mail podany w zamówieniu.
    - Jeśli klient wybrał opcję SMS, dodatkowo wysyłany jest link do pobrania biletu.

- **Anulowane**  
  Zamówienie trafia do tego stanu w przypadku:
    - braku płatności w ciągu 15 minut,
    - anulowania przez administratora,
    - niezaksięgowania płatności.

  → Bilety wracają do puli dostępnych.

---

## Panel administracyjny

### Lista zamówień

Każde zamówienie jest widoczne w module płatności. Administrator ma dostęp do listy zawierającej m.in.:

- LP
- Numer zamówienia
- Data dodania
- Imię i nazwisko zamawiającego
- Data płatności
- Nazwa wydarzenia
- Kwota do zapłaty
- Opłata operacyjna (prowizja)
- Metoda płatności (operator)
- Informacje dodatkowe:
    - uwagi,
    - oznaczenie jako prezent,
    - wysyłka pocztą,
    - wysyłka SMS,
    - czy wysłano na e-mail,
    - czy wysłano na SMS
- **Status zamówienia** (Opłacone, W trakcie, Anulowane)

### Filtrowanie zamówień

Lista zamówień może być filtrowana po:

- numerze zamówienia,
- nazwisku, imieniu, e-mailu zamawiającego,
- zakresie kwoty (od–do),
- zakresie dat utworzenia (od–do),
- zakresie dat opłacenia (od–do),
- statusie zamówienia,
- opcji wysyłki pocztą,
- oznaczeniu biletu jako prezent,
- kosztach dodatkowych,
- wysyłce biletów na e-mail,
- wysyłce biletów na SMS,
- obecności uwag,
- wydarzeniu.

### Operacje administratora

Administrator może:
- pobrać bilety z listy,
- otworzyć szczegóły zamówienia,
- anulować zamówienie.

---

## Statystyki

Każdy zakup jest rejestrowany, przetwarzany i wyświetlany w zakładce **statystyk** w module wydarzeń.
