Feature: Authentication flows on the landing page
    As a visitor
    I want to sign in or sign up through the main auth forms
    So that I can access user or admin protected areas

    @gherkin @auth @validation
    Scenario: Visitor switches to sign up and gets client-side weak password validation
        Given the visitor is on the auth page
        When the visitor switches to sign up mode
        And the visitor submits sign up with weak password "weak"
        Then the visitor sees a password strength validation error

    @gherkin @auth @lockout
    Scenario: Registered user gets blocked after repeated failed sign in attempts
        Given a registered user exists for lockout checks
        And the visitor is on the auth page
        When the visitor submits wrong credentials 5 times
        Then the visitor sees the account blocked warning
