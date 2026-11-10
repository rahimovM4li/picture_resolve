## Purpose

Provide a typed editorial source that can later be populated by a CMS while keeping MVP data local.

## ADDED Requirements

### Requirement: Portable structured content

The MVP SHALL define local typed models for site settings, navigation, services, portfolio, locations, testimonials and SEO, and identify editorial review status for draft copy. CMS functionality is outside MVP v0.1.

#### Scenario: Editing content

- **WHEN** an editor updates a typed entry and rebuilds
- **THEN** all linked displays use the updated entry without duplicating its business data in view components.

#### Scenario: One entry across screen sizes

- **WHEN** the same entry is rendered on desktop and mobile
- **THEN** both views share its identity, editorial truth and image alternative.

#### Scenario: Missing optional proof

- **WHEN** a project lacks an approved quote, credit or result
- **THEN** the corresponding optional content is omitted and other routes still render.
