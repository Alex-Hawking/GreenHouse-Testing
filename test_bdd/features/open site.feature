Feature: Open alexsite

    Scenario:
        Given I open 'https://www.alexhawking.dev'
        Then I wait 3s
        And I say hello