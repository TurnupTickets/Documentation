---
title: Języki i kraje
---

# Języki i kraje

Moduł do zarządzania językami dostępnymi na stronie. Uproszczona wersja względem starego systemu — bez importu/eksportu CSV i bez mechanizmu grup tłumaczeń.

## Języki

Główny, nawigowalny ekran modułu. Lista pokazuje: kod (locale), kod języka, kraj, aktywność, czy jest domyślny, kolejność wyświetlania. Filtrowanie po aktywności i statusie domyślnym.

Pola formularza języka: kod języka, kraj, format godziny (12h/24h, domyślnie 24h), kolejność, aktywny, domyślny.

## Kraje — tworzone z formularza języka

Kraje **nie mają własnego, osobnego ekranu w menu**. Dodaje się je bezpośrednio z formularza języka — pole wyboru kraju ma wbudowaną mini-formę "dodaj/edytuj", dzięki której nie trzeba wychodzić z ekranu edycji języka. Pola kraju: kod kraju, kolejność, aktywny, domeny (informacyjne — routing per-domena nie jest obecnie obsługiwany), przekierowanie.

## Tylko jeden język domyślny

Dokładnie jeden język może być oznaczony jako domyślny. Nie można wyłączyć flagi domyślności bez ustawienia innego języka jako domyślnego — oznaczenie nowego domyślnego automatycznie zdejmuje flagę z poprzedniego.

## Blokada edycji kodu

Gdy język (lub kraj) zaczyna być już gdziekolwiek wykorzystywany w systemie (tagi, menu, szablony mailowe, tłumaczenia), jego kod przestaje być edytowalny — pole jest zablokowane, z wyjaśnieniem dlaczego. Aby zmienić kod, trzeba usunąć wpis i stworzyć nowy.

## Ochrona przed usunięciem

Nie można usunąć języka, który jest domyślny, jest ostatnim aktywnym językiem, albo wciąż jest używany przez tagi/menu/tłumaczenia — system pokazuje wyjaśniające ostrzeżenie zamiast błędu. Ta sama ochrona obowiązuje przy usuwaniu kraju, jeśli jakiś język wciąż go używa.

## Podsumowanie

Moduł Języki i kraje to dwa połączone ekrany: Języki jako główny punkt zarządzania, z krajami tworzonymi "w locie" z tego samego formularza — bez importu CSV i bez grup tłumaczeń, ale z trwałą blokadą kodu po pierwszym użyciu i ochroną przed przypadkowym usunięciem.
