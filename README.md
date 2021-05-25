# Akahu Matata

It means no worries.

## What does it do?

This system monitors bank/savings/investment account amounts and transfers funds between them when the level gets too low/high.

This way, users can automatically have excess funds move to their savings account on payday (rather than specifying a static amount).

For each account, users specify a mininmum, a maximum (optionally), and a tier. Excess funds are transfered up the tiers to maximize interest.

## Project setup

Create a file called `.env` in your project root dir with the following.

Do NOT check it into git.

```bash
AKAHU_APP_TOKEN={your app token}
AKAHU_USER_TOKEN={your user token}
BASE_URL=https://api.akahu.io/v1/
```

## Cascading Savings Service

**Flow**

  1. Users use the main web page to register, set up their accounts, and specify a schedule.
  2. On that schedule, the app gets the latest balances from akahu and generates a "transfer plan."
  3. The user is sent an email or text message with a summary of the plan. If the user does not approve the plan in 3 days, it is deleted and nothing happens.
  4. If the user replies with their approval, the transfers are executed and the user is sent a new message with the updated balances.

**Architecture**

  The main web page is a static site hosted on S3. The browser makes API calls to Akahu and a serverless api for the system.

  Users with the same schedule are processed at the same time. The logic to build the transfer plan runs on ECS and stores its data as json objects in S3.

  Data storage can move to dynamo in the future if needed.

  SMS/emails are sent via SNS. Approvals also come in via SNS, which are then forwarded to SQS.

  Another ECS process using long polling of the approvals to execute the plans.
  
**Components**

  * UI
    * Static site on s3
    * API gateway + lambda functions
    * Web page makes calls to Akahu, formats data based on user input, and POSTs it to API gateway
    * Payloads are stored in s3
  * Scheduler (tbd)
    * ... executes the plan maker with 1 or more user IDs
  * Plan Maker
    * runs on ECS. can handle multiple requests at a time
    * grabs the user's data & most recent account balances from akahu
    * generates the plan and saves in S3
    * generates text and pushes to SNS
  * SNS listener
    * Recieves sms/email approvals
    * Pushes those approvals to sqs
  * Plan executor
    * Runs on ecs. handles batches of sqs messages via long polling.
    * POSTs transfer payloads to Akahu based on the transfer plans in s3.
    * Generates a text message w/ the latest balances & sends to SNS

## TODO

* ~~flag for 'only upward' transfers~~
* ~~return type of cascade function~~
* ~~dummy data to match each scenario~~
* ~~unit tests w/ conditions~~
* ~~generating the text message~~
* ~~user data? files for now s3 in cloud~~
* ~~integration w/ api~~
* ~~should akahu api methods return raw object? no~~
* ~~dao to load users~~
* ~~tests for api methods~~
* ~~message txt generation to use new fields~~
* ~~gen/test account names~~
* ~~message sender impl~~
* ~~test for sender & dao~~
* ~~main.ts~~
* test main
* class-ify/refactor/rename
* containerization
* documentation

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
