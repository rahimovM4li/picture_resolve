## Purpose

Deliver the studio’s actual creative work in formats and dimensions appropriate to the viewing context.

## ADDED Requirements

### Requirement: Provenance and responsive delivery

Published media SHALL have traceable sources, intended use and rights notes, local copies when available, accurate alt handling and declared layout dimensions.

#### Scenario: Loading a hero or project

- **WHEN** the page loads with approved source media
- **THEN** a local optimized image renders with a meaningful description or decorative empty alternative as appropriate.

#### Scenario: Downloading assets on a phone

- **WHEN** a mobile visitor loads a media-heavy route
- **THEN** the browser can choose an appropriate size and offscreen images can load lazily.

#### Scenario: Missing external media

- **WHEN** the source is inaccessible or the playback service fails
- **THEN** poster and text remain usable, and the missing item is recorded for handoff.
