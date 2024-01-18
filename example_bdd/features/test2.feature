Feature: test string stuff and saving
    Scenario:
        Given I save generate a random string with length 10 and save as 'randomStr'
        Then I log '$$randomStr' to the console
        Given I save 'Hello World!' as 'var1'
        And I save 'Hello World' as 'var2'
        Then '$$var1' should equal '$$var2'
        Then I log '$$var1' to the console
        Then I log '$$var2' to the console
        Then I log 'Hello World!' to the console