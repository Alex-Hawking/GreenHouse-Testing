Feature: Open url

    Scenario:
        Given I open 'https://www.google.com'
        Then I wait 3s
        And I say hello