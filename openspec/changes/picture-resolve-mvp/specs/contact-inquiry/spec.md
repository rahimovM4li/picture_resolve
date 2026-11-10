## Purpose

Enable business visitors to validate a project brief and understand exactly where their information goes.

## ADDED Requirements

### Requirement: Local demo with accessible input and recovery

The inquiry SHALL accept name, email, optional company, service, description, optional budget and privacy acknowledgment. Submission SHALL expose validation, pending, error and local preview states through a replaceable adapter.

#### Scenario: Submitting a valid brief

- **WHEN** a visitor completes the required fields in demo mode
- **THEN** a local preview is shown, demo status is clear, and the data is neither transmitted nor reported as delivered.

#### Scenario: Using invalid input on mobile

- **WHEN** a keyboard or touch visitor submits missing or invalid required fields
- **THEN** the form identifies the affected controls and preserves entered values for correction.

#### Scenario: Repeated or failed submission

- **WHEN** submission is pending or the adapter fails
- **THEN** concurrent submissions are prevented while pending, and a recoverable error preserves the draft.
