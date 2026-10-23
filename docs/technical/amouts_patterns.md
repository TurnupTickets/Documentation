---
title: Wzory wyliczania kwot
---

# Wzory wyliczania kwot

Karta referencyjna do wyliczeń kwot w systemie — ceny biletu, prowizji serwisowej, rabatu, płatności za zamówienie oraz prowizji kontrahenta. Wszystkie wzory poniżej zweryfikowane względem kodu TurnupCms (stan: 2026-10-23) — poprzednia wersja tej strony zawierała błędny wzór (rabat naliczany tylko na cenę biletu, bez prowizji serwisowej) oraz nierozwiązaną wątpliwość co do prowizji kontrahenta w płatności; obie kwestie są tu rozstrzygnięte.

## Kolumny na bilecie (`tickets`)

| Kolumna | Znaczenie |
|---|---|
| `ticket_price` | Cena biletu po rabacie, **bez** prowizji serwisowej (cena grupy × rabat) |
| `additional_cost` | Prowizja serwisowa doliczana do ceny biletu |
| `price` | Cena biletu do zapłaty = rabat liczony **łącznie** od (cena grupy + prowizja serwisowa) |

Rabat obejmuje łącznie cenę grupy i prowizję serwisową — nie tylko samą cenę biletu. To jest poprawka względem starszej wersji tej strony, która liczyła rabat tylko od ceny biletu, a prowizję dodawała już po rabacie.

## 1. Cena biletu

Cena biletu to 1:1 wartość pola ceny ustawionego w grupie biletów danego wydarzenia.

## 2. Prowizja serwisowa (per bilet)

Kwota, którą zatrzymuje platforma (operator) — kupujący płaci ją jako część ceny biletu do zapłaty.

- Jeśli wydarzenie ma wyłączone doliczanie kosztów dodatkowych — prowizja wynosi 0.
- W przeciwnym razie: jeśli grupa biletów nie ma ustawionej własnej wartości serwisowej, stosowana jest wartość domyślna (procent konfigurowalny systemowo, domyślnie 3%) od ceny grupy.
- Jeśli grupa ma ustawioną własną wartość serwisową — stosowana jest ona, jako kwota stała albo jako procent ceny grupy (zależnie od ustawienia grupy).

## 3. Rabat (per bilet)

Rabat (kod rabatowy) może być kwotą stałą (odejmowaną od ceny) albo wartością procentową (redukującą cenę o dany procent). Wynik nigdy nie spada poniżej zera. Rabat stosowany jest tylko wtedy, gdy kod rabatowy jest aktywny i możliwy do użycia dla danego wydarzenia/grupy biletów.

Rzeczywista zaoszczędzona kwota per bilet = (cena grupy + prowizja serwisowa) − cena biletu do zapłaty.

## 4. Cena biletu do zapłaty

Cena biletu do zapłaty to wynik zastosowania rabatu na sumie ceny grupy i prowizji serwisowej — czyli: `rabat(cena_grupy + prowizja_serwisowa)`.

> **Poprawka względem wcześniejszej wersji tej strony**: wzór nie brzmi „(cena biletu × rabat) + prowizja” — rabat obejmuje też prowizję serwisową, nie tylko cenę biletu.

## 5. Płatność za zamówienie

Płatność za całe zamówienie to suma cen do zapłaty wszystkich biletów w zamówieniu, plus koszty dodatkowe wybrane w formularzu zamówienia:

- koszt dostawy (fizyczny bilet),
- koszt opcji „bilet jako prezent”,
- koszt wysyłki SMS,
- inne skonfigurowane koszty dodatkowe wybrane przy zamówieniu.

> **Poprawka względem wcześniejszej wersji tej strony**: płatność za zamówienie **nie** zawiera osobno doliczonej prowizji serwisowej — jest ona już wliczona w sumę cen biletów do zapłaty. Pytanie „+ Prowizja?” z poprzedniej wersji strony jest tym samym rozstrzygnięte: nie, prowizja serwisowa nie jest dodawana drugi raz na poziomie zamówienia.

## 6. Prowizja kontrahenta

Każdy kontrahent (właściciel wydarzenia) może mieć ustawioną własną wartość procentową prowizji — widoczną i edytowalną na jego koncie panelu (patrz [administrators.md](../functional/administrators.md)).

**Ważne**: prowizja kontrahenta **nie jest stosowana przy zakupie biletu** — nie wpływa na cenę, jaką płaci klient. Jest wykorzystywana wyłącznie w zakładce Statystyki wydarzenia oraz w eksportowanym raporcie PDF, jako kwota odliczana od przychodu pokazywanego kontrahentowi (patrz punkt 8). To jest gwarancja z PRD projektu: „żadnej cichej zmiany w sposobie wypłacania kontrahentom” — prowizja nigdy nie zmienia tego, co płaci klient, tylko to, co widzi kontrahent jako swój zarobek.

Prowizja kontrahenta liczona jest na tym samym, przefiltrowanym (np. po zakresie dat) zbiorze transakcji co przychód brutto — nie od wszystkich transakcji w historii.

## 7. Kwota dzienna w statystykach (oś czasu sprzedaży)

Kwota dzienna to suma cen biletów do zapłaty (patrz punkt 4), pogrupowana po dacie sprzedaży, tylko dla biletów opłaconych.

## 8. Tabela statystyk: Grupa biletów / Zarobiono / VAT

Dla każdej grupy biletów, w zakresie dat wybranym na filtrze zakładki Statystyki:

- **Zarobiono** = suma cen biletów po rabacie, bez prowizji serwisowej (opłacone zamówienia) − prowizja kontrahenta (tylko jeśli kontrahent ma ustawioną prowizję większą niż 0%).
- **Prowizja kontrahenta** = procent prowizji kontrahenta × ta sama suma przychodu w zakresie dat.
- **VAT** = stawka podatku ustawiona na grupie biletów — wyświetlana informacyjnie, bez przeliczania kwoty.
- **Suma** = suma „Zarobiono” po wszystkich grupach biletów wydarzenia.

Gdy kontrahent ma ustawioną prowizję większą niż 0%, prowizja musi być odliczona od sumy „Zarobiono” **oraz** wyodrębniona jako osobna pozycja w raporcie PDF.

## 9. Filtr zakresu dat

Filtr zakresu dat obowiązuje wyłącznie na zakładce Statystyki (nie jest filtrem globalnym panelu) i jest respektowany również przy generowaniu raportu PDF — czyli PDF zawsze odpowiada temu, co aktualnie widać na ekranie. Bez ustawionego zakresu dat, wszystkie metryki liczone są od początku istnienia wydarzenia.

## Podsumowanie

Cały łańcuch wyliczeń — cena biletu → prowizja serwisowa → rabat → cena do zapłaty → suma zamówienia → prowizja kontrahenta w statystykach — jest wewnętrznie spójny i w pełni zweryfikowany względem działającego kodu. Jedyne miejsce, w którym prowizja kontrahenta ma znaczenie, to zakładka Statystyki wydarzenia i jej eksport PDF — nigdzie w procesie zakupu biletu.
