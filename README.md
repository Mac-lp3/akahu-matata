# Akahu Matata

It means no worries.

## What does it do?

On your prefered schedule, this system gets the latest balance of your checking, savings, and/or investment accounts and automatically "rebalances" your assets to maximize interest.

Automatic transfers are well and good, but it is hard to pick an exact number that suits from paycheck to paycheck.

With this, you just specify a minimum and/or maximum and it will take care of the rest.

## Project setup

Assuming you already have Node and TypeScript, checkout the project and run `npm install`.

The project relies on an `.env` file in the project root, which you will need to create.

Create a file called `.env` with the following:

**Do NOT check it into git.**

```bash
AKAHU_APP_TOKEN={your Akahu app token}
AKAHU_USER_TOKEN={your Akahu user token}
BASE_URL=https://api.akahu.io/v1/
```

## System overview 

**Components**

* UI (tbd)
  * Web page for users to create a profile and link their accounts
* Scheduler (tbd)
  * Executes and submits batches of users to the Plan Maker
* Plan maker (this repository)
  * Executed by the scheduer on EC2
  * Generates and stores the bank transfers required
  * Generates an SMS/email summary for user approval
* SNS listener ()
  * Listens for SMS/email approvals from users
  * Executes the plan executor
* Plan executor
  * Runs on EC2 and handles batches of approvals
  * Executes the transfers via Akahu API
  * Generates an SMS/email with the latest account balances

