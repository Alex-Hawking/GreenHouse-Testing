Feature: Check the sun works

    Scenario:
        Given I open 'https://www.alexhawking.dev'
        Then I wait 2s
        And I click '.mdi-pencil'
        Then I wait 2s
        And I click '.mdi-white-balance-sunny'
        Then I wait 5s