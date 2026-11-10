## Purpose

Present each verified film with sufficient context and clearly identified viewing options.

## ADDED Requirements

### Requirement: Reusable evidence-led project story

The project detail page SHALL present sourced identity, available media, description, onward navigation to work and inquiry.

#### Scenario: Inspecting an individual film

- **WHEN** a visitor opens a valid project slug
- **THEN** the visitor can identify the film and explore another work or submit a project brief.

#### Scenario: Mobile and assistive playback

- **WHEN** a visitor activates available media using touch or keyboard
- **THEN** the chosen media or labelled external destination opens deliberately and controls remain accessible.

#### Scenario: Unavailable project or playback

- **WHEN** a slug is unknown or playback is unavailable
- **THEN** an unknown slug produces a real 404 and an existing project retains its readable description and viewing fallback.
