Feature: Open website and look at it

    Scenario:
        Given I open 'https://www.alexhawking.dev'
        Then I wait 2s
        Then I log 'Wow! This looks great!' to the console
        Then I was 5s