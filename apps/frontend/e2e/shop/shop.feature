Feature: Shop checkout journeys
  As a signed-in shopper
  I want safe checkout navigation
  So that I can only proceed when the cart is valid

  Scenario: Signed-in user with an empty cart is redirected back to the cart
    @gherkin @shop @checkout @guest
    Given a signed-in user opens the checkout page with an empty cart
    Then the user is redirected to the cart page

  Scenario: Signed-in user adds an available product and reaches checkout
    @gherkin @shop @checkout @catalog
    Given a signed-in user opens the catalog
    When the user adds an available product to the cart
    And the user proceeds to checkout from the cart
    Then the checkout page is visible
