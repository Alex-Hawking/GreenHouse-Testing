Feature: Check the sun works

    Scenario:
        Given I open 'https://www.alexhawking.dev'
        Then I log '$$testVar'
        Given I save 'Hello World2' as 'var2'
        Then I save 'Hello World3' as 'testVar'
        Then I log '$$var2'
        And I log '$$testVar'