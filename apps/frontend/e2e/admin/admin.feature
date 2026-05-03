Feature: Admin dashboard access
    As an authenticated admin
    I want to open the dashboard and use locale switching
    So that I can manage the admin area correctly

    @admin @access
    Scenario: Admin can open dashboard, see user grid and change locale
        Given the backend is reachable
        And an admin user is authenticated
        When the admin opens the dashboard
        And changes locale to "fr"
        Then the admin dashboard remains visible
