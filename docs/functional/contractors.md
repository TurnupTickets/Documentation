---
title: Kontrahenci
---

# Kontrahenci

Ekran "Kontrahenci" korzysta z tego samego konta panelu, które opisuje [administrators.md](./administrators.md) — Kontrahent to po prostu inna rola na tym samym typie konta co Administrator, nie osobna encja. Ten dokument opisuje tylko to, co jest specyficzne dla roli Kontrahenta — resztę (wymagane dane, role, uprawnienia) patrz w administrators.md.

## Lista kontrahentów

Lista pokazuje: login, imię i nazwisko, domyślny język panelu, przypisaną grupę/rolę, status aktywności. Filtrowanie po grupie, statusie aktywności oraz formacie wyświetlania godzin. Akcje: podgląd, edycja; usuwanie zbiorcze.

## Prowizja

Każdy Kontrahent ma pole Prowizja — wartość procentowa określająca, ile ma zostać odliczone od jego przychodu widocznego w statystykach i raporcie PDF (patrz [Statystyki wydarzenia](./event_statistics.md) oraz [Wzory wyliczania kwot](../technical/amouts_patterns.md)). Prowizja **nie wpływa na cenę płaconą przez klienta** — ma znaczenie wyłącznie przy prezentacji zarobku kontrahentowi.

## Format wyświetlania godzin

Kontrahent ma ustawiony format wyświetlania godzin (12h/24h) — to ustawienie wpływa na to, w jakim formacie klient kupujący bilet na wydarzeniu tego kontrahenta zobaczy godziny.

## Dezaktywacja konta

Dezaktywacja konta kontrahenta odbywa się poprzez przełącznik "Aktywny" w formularzu edycji konta — nie jest to osobna, jednoklikowa akcja z listy.

## Wydarzenia kontrahenta

Przypisanie wydarzenia do kontrahenta (główny właściciel / dodatkowi właściciele) ustawiane jest po stronie wydarzenia, nie z tego ekranu — ekran Kontrahenci nie ma obecnie zakładki pokazującej listę wydarzeń danego kontrahenta.

## Podsumowanie

Ekran Kontrahenci to widok konta panelu (patrz administrators.md) ograniczony do roli Kontrahent, rozszerzony o prowizję i format godzin — bez dedykowanej zakładki własnych wydarzeń i bez jednoklikowej blokady konta.
