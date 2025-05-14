---
title: Administratorzy
---

## Definicja

Administrator to osoba mająca dostęp do panelu zarządzającego aplikacją. Administrator może otrzymać jedną z określonych ról:
- Admin
- Kontrahent

## Wymagania bezpieczeństwa
### Role i uprawnienia
Role:
- Admin
- Kontrahent

Uprawnienia: 
- Strony statyczne
  - Edycja
  - Dodawanie
  - Usuwanie
  - Podgląd
- Wydarzenia: 
  - Podgląd
  - Edycja
  - Dodawanie
  - Usuwanie
  - Dostęp do statystyk
  - Generowanie kontrolnej listy biletów
  - Generowanie listy maili z wydarzenia
  - Dostęp do wszystkich wydarzeń
  - Edycja/Przypisanie planu miejsc do wydarzenia
- Kategorie wydarzeń
  - Edycja
  - Dodawanie
  - Usuwanie
  - Podgląd
- Kody rabatowe
  - Edycja
  - Dodawani
  - Usuwanie
  - Podgląd
- Płatności
  - Podgląd
  - Manualne zarządzanie płatnością (Zatwierdzenie/Anulowanie)
- Metody płatności
  - Edycja
  - Dodawanie
  - Usuwanie
  - Podgląd
- Kontrahenci
  - Edycja
  - Dodawanie
  - Usuwanie
  - Blokowanie
  - Podgląd
- Plan miejsc
  - Podgląd
  - Edycja
  - Dodawanie
  - Usuwanie
- Użytkownicy
  - Edycja
  - Podgląd
- Nawigacja strony
  - Edycja
- Języki i kraje
  - Edycja
  - Dodawani
  - Usuwanie
- Historia systemu
  - Podgląd
  - Przywracanie 
- SEO
  - Edycja
- Konfiguracja
  - Edycja
## Wymagane dane użytkownika panelu

| Pole | Opis |
|------|------|
| Email | Adres email użytkownika |
| Login | Nazwa użytkownika do logowania |
| Hasło | Może być ustalone przez administratora lub ustawiane przez użytkownika poprzez formularz wysłany na email |
| Imię i nazwisko | Dane personalne użytkownika |
| Domyślny język panelu | Określa w jakim języku będą wyświetlane treści w panelu |
| Rola | Określa uprawnienia użytkownika (Admin lub Kontrahent) |
| Prowizja | Wartość procentowa określająca kwotę, jaką powinien otrzymać kontrahent po wyprzedaniu wydarzenia |
| Format wyświetlania godzin | Określa format godzin (12h/24h), który zobaczy klient kupujący wydarzenie |
| Status | Określa czy konto jest aktywne |

## Szczegóły pól

### Domyślny język panelu dla użytkownika
Określa w jakim języku będą wyświetlane treści w panelu administracyjnym.

### Prowizja
Pole przyjmuje wartość procentową. Określa kwotę jaką powinien otrzymać kontrahent po wyprzedaniu wydarzenia.

### Format wyświetlania godzin
Pole określające format godzin (12h/24h), który zobaczy klient kupujący wydarzenie.

### Język
Każdy użytkownik ma ustawiony domyślny język panelu administracyjnego. 