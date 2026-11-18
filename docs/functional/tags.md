---
title: Tagi
---

# Tagi

Tagi zastąpiły stary system kategorii przypisanych do wydarzeń (patrz historyczna nota w [events.md](./events.md), sekcja "Kategorie wydarzeń") — obecnie są jedynym sposobem organizowania wydarzeń w grupy tematyczne.

## Tworzenie tagu

Pola tagu: nazwa, slug (adres URL — podpowiadany automatycznie z nazwy, edytowalny ręcznie; jeśli kolidowałby z już istniejącym, system doda numer, np. `-1`), język (tag należy do jednego konkretnego języka — **tagi nie są wspólne między językami**), status aktywności, kolejność.

## Lista tagów

Lista pokazuje: nazwę, slug, język, status aktywności, liczbę przypisanych wydarzeń, kolejność. Filtrowanie po języku i aktywności.

## Przypisywanie wydarzeń do tagu

Z zakładki "Wydarzenia" na ekranie edycji tagu można dołączyć lub odłączyć wydarzenia. Każde wydarzenie może mieć wiele tagów, ale jeden z nich może być oznaczony jako tag główny (primary) — używany jako kanoniczny dla tego wydarzenia.

## Adresy URL i przekierowania

Slug każdego tagu jest unikalny w ramach swojego języka. Jeśli slug zostanie później zmieniony, system automatycznie zapisuje przekierowanie ze starego adresu na nowy (ten sam mechanizm, który opisuje [seo.md](./seo.md) dla innych adresów w systemie) — stary link nie zaczyna zwracać błędu.

## Migracja ze starych kategorii

Przejście na tagi odbyło się jednorazowo — istniejące wcześniej przypisania kategorii do wydarzeń (wraz z ich adresami URL) zostały skopiowane do nowej struktury tagów, tak aby stare adresy wydarzeń dalej działały. Stara tabela kategorii pozostała w bazie nienaruszona (patrz [database.md](../technical/database.md)), ale nowe wydarzenia korzystają już wyłącznie z tagów.

## Podsumowanie

Tagi to język-specyficzny, elastyczny zamiennik starych kategorii: jedno wydarzenie może mieć wiele tagów z jednym oznaczonym jako główny, a adresy URL tagów są chronione tym samym mechanizmem automatycznych przekierowań, co resztą systemu.
