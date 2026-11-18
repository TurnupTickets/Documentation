---
title: SEO
---

# Ustawienia SEO

Ekran SEO to jeden globalny formularz ustawień (nie lista rekordów) — zmiany zapisują się na jednym, wspólnym zestawie ustawień strony.

## Skrypty śledzące

Dwa pola na skrypty wklejane bezpośrednio do strony publicznej, niezależne od języka: skrypt w `<head>` oraz skrypt w `<body>` (np. Google Tag Manager, Meta Pixel).

## Meta dane (per język)

Osobna zakładka dla każdego aktywnego języka strony, z polami: meta tytuł, meta opis, meta słowa kluczowe, kod weryfikacyjny Google Search Console, Google Measurement ID, klucz API Google Analytics, oraz dodatkowe pola na skrypty (Google w `<head>`, w `<body>`, na końcu `<body>`) — wszystkie skoped do danego języka. Pozostawienie całej zakładki pustej usuwa tłumaczenie tego języka, zamiast trzymać pusty wpis.

## Czego NIE zarządza się tutaj

- **robots.txt** — nie jest już zarządzany z panelu. Odpowiada za niego warstwa CDN (Cloudflare).
- **Mapa strony (sitemap)** — generowana automatycznie, bez ekranu administracyjnego.
- **Przekierowania** — nie są tworzone ręcznie z tego ekranu. Powstają automatycznie, gdy zmienia się adres (slug) taga lub wydarzenia — system sam zapisuje przekierowanie ze starego adresu na nowy, żeby stary link nie zaczął zwracać błędu.

## Podsumowanie

Ustawienia SEO to jeden formularz: skrypty śledzące (globalne) + meta dane i integracje Google (per język). Robots.txt, mapa strony i przekierowania dzieją się poza tym ekranem — automatycznie albo na innej warstwie infrastruktury.
