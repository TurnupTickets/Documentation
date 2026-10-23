---
title: Statystyki wydarzenia
---

# Statystyki wydarzenia

Zakładka "Statystyki" na stronie edycji wydarzenia, dostępna dla Admina oraz dla Kontrahenta będącego właścicielem danego wydarzenia (wymaga uprawnienia do podglądu statystyk).

## Filtr zakresu dat

Nad wszystkimi sekcjami zakładki znajduje się filtr zakresu dat (od — do). Filtr działa **tylko na tej zakładce** — nie jest globalnym filtrem panelu. Bez ustawionego zakresu wszystkie liczby poniżej obejmują całą historię wydarzenia. Ten sam zakres dat jest automatycznie uwzględniany przy generowaniu raportu PDF (patrz sekcja "Eksport PDF" poniżej) — PDF zawsze pokazuje to, co widać aktualnie na ekranie.

## Tabela: Grupa biletów / Zarobiono / VAT

Dla każdej grupy biletów wydarzenia:
- **Zarobiono** — przychód z opłaconych biletów tej grupy w wybranym zakresie dat, po odliczeniu prowizji kontrahenta (jeśli kontrahent ma ustawioną prowizję większą niż 0%).
- **VAT** — stawka podatku ustawiona na grupie biletów (informacyjnie, bez przeliczania kwoty).
- Wiersz podsumowania na dole pokazuje sumę "Zarobiono" ze wszystkich grup.

Pełny opis wzorów stojących za tą tabelą: [Wzory wyliczania kwot](../technical/amouts_patterns.md).

## Wykresy sprzedanych biletów

Wykresy liczby sprzedanych biletów — łącznie dla wydarzenia oraz w podziale na grupy biletów.

## Oś czasu sprzedaży

Wykres kwoty sprzedaży dzień po dniu, w wybranym zakresie dat — pozwala zobaczyć, kiedy sprzedaż przyspieszała lub zwalniała.

## Bilety z rabatem

Tabela pokazująca, dla każdej grupy biletów: liczbę biletów sprzedanych z rabatem, typ rabatu (procentowy/kwotowy), jego wartość oraz łączną kwotę zaoszczędzoną przez kupujących.

## Lista gości (bilety bezpłatne)

Lista biletów oznaczonych jako bezpłatne (gościnne), z podziałem na grupy biletów i liczbą sztuk.

## Dodatkowe liczniki sprzedaży

- Liczba biletów zakupionych jako prezent.
- Liczba biletów z dostawą fizyczną.
- Liczba biletów z wysyłką SMS.

## Liczba odwiedzin (Google Analytics)

Liczba wyświetleń strony wydarzenia, pobierana z Google Analytics. Wartość jest odświeżana maksymalnie raz dziennie i pojawia się tylko wtedy, gdy integracja z Google Analytics jest skonfigurowana dla danego środowiska — jeśli nie jest, ta liczba po prostu się nie pojawia, zamiast pokazywać błąd.

## Zweryfikowane (zeskanowane) bilety

Liczba biletów zeskanowanych przy wejściu na wydarzenie, w podziale na grupy biletów, z sumą łączną. Dla wydarzeń obsługiwanych wcześniej zewnętrznym skanerem (poza nowym systemem) ta liczba może wynosić zero — skanowanie musi przejść przez nowy system, aby zostało tu zliczone.

## Eksport PDF (tylko Kontrahent)

Kontrahent może wygenerować raport PDF ze statystykami swojego wydarzenia. Raport:
- honoruje aktywny filtr zakresu dat (to samo okno czasowe, które widać na ekranie),
- pokazuje przychód **po odliczeniu prowizji** — prowizja kontrahenta jest wyodrębniona jako osobna pozycja w podsumowaniu, nie ukryta w jednej sumarycznej liczbie.

## Podsumowanie

Zakładka Statystyki jest miejscem, w którym wzory finansowe z [Wzory wyliczania kwot](../technical/amouts_patterns.md) stają się widoczne dla realnego użytkownika — w szczególności to jedyne miejsce w systemie, gdzie prowizja kontrahenta ma jakiekolwiek znaczenie (nigdy w samym procesie zakupu biletu).
