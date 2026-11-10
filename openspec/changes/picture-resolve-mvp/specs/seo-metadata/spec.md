## Purpose

Make the available German pages discoverable through consistent page metadata and safe preview settings.

## ADDED Requirements

### Requirement: Route-specific discoverability

Each indexable page SHALL have a unique title, description, canonical, social preview metadata and one primary heading. Preview indexing SHALL be disabled by default.

#### Scenario: Inspecting a built page

- **WHEN** a crawler requests a valid public route
- **THEN** initial HTML contains its content and metadata, and the sitemap represents eligible routes on the configured origin.

#### Scenario: Metadata on a phone

- **WHEN** the same page is visited with a mobile viewport
- **THEN** the metadata and meaningful heading hierarchy remain consistent with desktop.

#### Scenario: Draft configuration and missing routes

- **WHEN** the build has no production indexing approval or an unknown path is requested
- **THEN** preview directives prevent indexing by default, and unknown paths return HTTP 404.

#### Scenario: Checking structured data

- **WHEN** a page includes structured data
- **THEN** it describes visible verified facts and omits unsupported video, address and review claims.
