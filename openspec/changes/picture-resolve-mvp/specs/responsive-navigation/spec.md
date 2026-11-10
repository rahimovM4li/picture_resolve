## Purpose

Allow visitors to move between services, work, studio information and inquiry from every viewport.

## ADDED Requirements

### Requirement: Persistent access to primary destinations

The navigation SHALL give every primary destination a descriptive link and support keyboard and touch interaction with visible focus.

#### Scenario: Opening a service

- **WHEN** a visitor opens the services navigation
- **THEN** both service pages can be reached without hover-only interaction.

#### Scenario: Using the mobile menu

- **WHEN** a keyboard visitor opens and closes the small-screen menu
- **THEN** the control communicates its expanded state and the visitor can resume navigation from its trigger.

#### Scenario: Recovering from an invalid path

- **WHEN** a visitor reaches an unknown address
- **THEN** the error page provides a working route back into the website.
