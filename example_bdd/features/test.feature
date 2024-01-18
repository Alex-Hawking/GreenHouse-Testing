Feature: Open website and look at it

    Scenario:
        Given I open 'https://www.alexhawking.dev'
        And I click '#scene-btn'
        Then I wait for element '.v-overlay__content' to be 'attached'
        And I click '.mdi-white-balance-sunny'
        Then I wait for element '#sun' to be 'attached'
        Then I wait 2s
