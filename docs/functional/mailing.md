---
title: Kampanie mailingowe
---

# Moduł mailingowy

Moduł do przygotowania i zaplanowania wysyłki wiadomości e-mail do klientów. Dostępny tylko dla Administratora.

## Tworzenie kampanii

Kampania ma: nazwę (wewnętrzną, roboczą), temat wiadomości, adres nadawcy oraz treść wiadomości edytowaną w edytorze WYSIWYG (formatowanie tekstu, linki, listy — bez kodowania HTML ręcznie).

## Lista odbiorców

Odbiorcy kampanii są podawani jako lista adresów e-mail, oddzielonych średnikiem, wpisywana ręcznie w pole formularza.

**Obecne ograniczenie**: moduł nie pozwala jeszcze na wybranie odbiorców na podstawie segmentu klientów (np. "osoby, które kupiły bilet na wydarzenie X") — mimo że to był pierwotnie zakładany cel tego modułu. Docelowe targetowanie po bazie klientów/zamówień nie jest jeszcze zaimplementowane; jest to odnotowany, otwarty temat do dalszej pracy nad systemem, a nie coś, co można ustawić z tego ekranu dzisiaj.

## Planowanie wysyłki

Do kampanii można dodać jeden lub więcej terminów wysyłki (data i godzina) — każdy termin to osobne, zaplanowane zadanie. System automatycznie sprawdza co minutę, czy nadszedł czas wysyłki jakiegoś zaplanowanego zadania, i wtedy wysyła wiadomość do wszystkich adresów z listy odbiorców tej kampanii.

## Wysyłka

Wiadomości są wysyłane w tle (w kolejce), nie blokując pracy w panelu. W zależności od konfiguracji środowiska, wysyłka odbywa się bezpośrednio przez serwer pocztowy albo przez zewnętrzny system kolejkowy zintegrowany z MailGun (patrz [outside_integrations.md](../technical/outside_integrations.md)) — z perspektywy admina różnica jest niewidoczna, kampania po prostu zostaje wysłana w zaplanowanym czasie.

## Podsumowanie

Moduł pozwala przygotować treść wiadomości i zaplanować jej wysyłkę do ręcznie podanej listy adresów. Rozbudowa o wybór odbiorców na podstawie segmentów klientów (np. kupujących konkretnego wydarzenia) jest otwartym tematem do zaplanowania jako kolejny krok rozwoju tego modułu.
