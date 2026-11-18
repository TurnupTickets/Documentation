---
title: Metody płatności
---

# Metody płatności

Ekran do zarządzania skonfigurowanymi metodami płatności (obecnie Przelewy24 dla złotówek, Stripe dla innych walut — patrz [outside_integrations.md](../technical/outside_integrations.md)).

## Co można zmienić z panelu

- Nazwa metody płatności.
- Status aktywności (aktywna/nieaktywna).
- Widoczność dla klientów (czy pojawia się jako opcja przy zakupie).
- Tryb testowy (sandbox dostawcy).
- Kolejność wyświetlania wśród dostępnych metod.

Typ dostawcy (Przelewy24 / Stripe) wybiera się tylko przy tworzeniu nowej metody — po zapisaniu nie można go już zmienić.

## Co jest tylko podglądem (dane dostawcy)

Dane uwierzytelniające dostawcy (np. dla Przelewy24: Merchant ID, API Key, CRC Key i jego wersja testowa; dla Stripe: Secret Key, Publishable Key, Webhook Secret, oraz ich wersje testowe) **nie są edytowalne z panelu**. Ekran pokazuje dla każdego z nich tylko status: "Skonfigurowano" albo "Nie skonfigurowano". Same wartości ustawiane są na poziomie serwera (zmienne środowiskowe), nie w bazie danych — zmianę trzeba zlecić osobie zarządzającej wdrożeniem.

## Podsumowanie

Panel pozwala włączać/wyłączać i konfigurować widoczność/kolejność metod płatności, ale same sekrety dostawców (klucze, identyfikatory) są poza zasięgiem panelu — administrator widzi tylko, czy są skonfigurowane, nie ich wartości.
