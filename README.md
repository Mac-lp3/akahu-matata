# Akahu Matata

It means no worries.

## Notes

Create a file called `.env` in your project root dir with the following.

Do NOT check it into git.

```bash
AKAHU_APP_TOKEN={your app token}
AKAHU_USER_TOKEN={your user token}
BASE_URL=https://api.akahu.io/v1/
```

## CSS

flow:
  Users use a web page to register & set up their accounts
    The page accepts their details, forwards to akahu, and saves tokens in s3
  On the specificed schedule, logic loads that data, gets the latest $ from akahu, generates a plan, sends that plan to the user, and stores the plan in s3 for later.
  Separate process listens for approvals. Once recieved, the plan is executed and a message w/ latest values is sent.
  If no approval given, plan is deleted after X time.

Architecture:
  S3 as app data storage (users, transfer plans, etc). Move to mongo if needed.
  Static s3 hosted page for sign up/ui. Browser calls both akahu and serverless api for display & sign up.
  Based on selected time frame, user ID is added to a list of accounts to process on that schedule.
  The plan building logic runs on ECS, generating the plans in batch.
  text/email approvals are sent to SNS, which forwards to SQS.
  ECS using long polling calls akahu to execute the transfers & generate a new message w/ the latest balance
  
Components:
  * UI
    * Static site on s3
    * API gateway + lambda functions
    * web page makes calls to akahu, formats data based on user input, and POSTs it to API gateway
    * payloads are stored in s3
  * Scheduler (tbd)
    * ... executes the plan maker with 1 or more user IDs
  * Plan Maker
    * runs on ECS. can handle multiple requests at a time
    * grabs the user's data & most recent account balances from akahu
    * generates the plan and saves in s3
    * generates text and pushes to sns
  * SNS listener
    * recieves sms/email approvals
    * pushes those approvals to sqs
  * Plan executor
    * runs on ecs. handles batches of sqs messages via long polling.
    * POSTs transfer payloads to Akahu based on the transfer plans in s3.
    * generates a text message w/ the latest balances & sends to sns

## TODO
* ~~flag for 'only upward' transfers~~
* ~~return type of cascade function~~
* ~~dummy data to match each scenario~~
* ~~unit tests w/ conditions~~
* ~~generating the text message~~
* ~~user data? files for now s3 in cloud~~
* ~~should akahu api methods return raw object? no~~
* tests for api methods
* constructor in types/accounts.ts
  * takes objects right from api

* update message txt gen to use the fields
* update all maps to use account.akahuId as the key


* dao methods? where does the 
  * createUser
    * accepts a user pref object, plus some akahu account objects?

* integration w/ api
* user data + api data
* main script
* persisting plan
* listening for text/email response
* applying plan after additional transactions
* clean up / names for cascade functions


`EXCESS` funds transfer to:
  1. `UNDER` funds of any tier (preferring below)
  2. `BETWEEN` funds at or above this tier

`BETWEEN` funds transfer to:
  1. `UNDER` funds of any tier (preferring below)

```
t1 excess, t2 between, t3 reserve
    t1->t2->t3
t1 excess, t2 under, t3 reserve:
    t1->t2->t3
t1 between, t2 under, t3 reserve
    t1->t2
t1 between, t2 excess, t3 reserve
    t2->t3
t1 under, t2 w/ excess, t3 reserve
    t2->t1
t1 under, t2 between, t3 reserve
    t2->t1

t1 excess, t2 under, t3 between, t4 reserve
    t1->t2, t3->t2, t4->t2
    t1->t4

t1 excess, t2 under, t3 excess, t4 reserve
    t1->t2, t3->t2, t4->t2
    t1->t4, t3->t4
```

triggers every X days

gets balance of t1, t2, t3, tN & checks against their max/min

t1 at/over max
t1 under min
    t2 at/under min
    t2 over min
        xfer excess to t1.
        was it enough? end
            t3 at/under min
            t3 over min
                xfer excess to t1
                was it enough? end
                    tN has a min?
                        xfer what is needed to tier 1 (to the min)
                        end
text/email user with summary & ask for approval
```
hey, its "your money guy". (<- noun configurable)

you cool with this?

ANZ CHECKING:
+25$ to 1000$

ANZ SAVINGS:
-15$ to 5000$ (minimum)

Simplicity INVESTMENT:
-10$ to 9990$

reply "yes" in 3 days and i'll do it.

:peace:
```

## itr
