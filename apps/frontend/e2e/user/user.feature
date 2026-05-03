Feature: User area and access control
    As an authenticated visitor
    I want deterministic protected-area behaviour
    So that profile, locale and access-control regressions are covered

    @gherkin @user @signup
    Scenario: Visitor signs up and lands in user area
        Given the backend is reachable
        When the visitor signs up as a standard user
        Then the visitor reaches the user area

    @gherkin @user @locale
    Scenario: Authenticated user changes locale and signs out
        Given a signed-in standard user exists
        When the user switches locale to "en"
        And the user signs out
        Then the visitor returns to the auth page

    @gherkin @access @user
    Scenario: Standard user cannot access the admin dashboard
        Given a signed-in standard user exists
        When the user opens the admin dashboard
        Then the user is redirected to the user area

    @gherkin @access @anonymous
    Scenario: Anonymous visitor cannot access the admin dashboard
        Given the visitor is not authenticated
        When the visitor opens the admin dashboard
        Then the visitor is redirected to the auth page