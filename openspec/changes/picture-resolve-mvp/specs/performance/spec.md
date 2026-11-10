## Purpose

Keep the showroom responsive on mobile networks and make media and interaction costs measurable.

## ADDED Requirements

### Requirement: Observable load and interaction budgets

The site SHALL prerender primary content, reserve space for media, avoid eager third-party playback and report reproducible local performance measurements.

#### Scenario: Cold-loading the homepage

- **WHEN** a visitor opens a fresh production build
- **THEN** text and hero imagery appear without waiting for scroll animation or a player.

#### Scenario: Phone performance

- **WHEN** a phone visitor scrolls the homepage
- **THEN** the view avoids full-resolution desktop video downloads and offscreen media is deferred where appropriate.

#### Scenario: Missing field evidence

- **WHEN** real-user traffic data is unavailable
- **THEN** the report labels laboratory measurements and records unmeasured metrics against LCP ≤2.5 s, CLS ≤0.1 and INP ≤200 ms targets.
