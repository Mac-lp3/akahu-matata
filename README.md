# Akahu Matata

It means no worries.

## What does it do?

On your prefered schedule, this system gets the latest balance of your checking, savings, and/or investment/retirement accounts and automatically redistributes your assets to maximize interest.

Automatic transfers are well and good, but it is hard to pick an exact number that suits from paycheck to paycheck. 

With this, you just specify a minimum and/or maximum for your accounts and it will take care of the rest.

## Project setup

**1)Installation**

Assuming you already have Node and TypeScript, checkout the project and run `npm install`.

**2) Create a `.env`**

The project relies on an `.env` file in the project root, which you will need to create.

Create a file called `.env` with the following:

Do **NOT** check it into git.

```bash
AKAHU_APP_TOKEN={your Akahu app token}
AKAHU_USER_TOKEN={your Akahu user token}
BASE_URL=https://api.akahu.io/v1/
```

**3) Add your Akahu account data**

The app needs to know the IDs of the accounts you want to use.

Update the `accounts` section in the `src/data/users/123.json` file.

```json
{
  ...
  "accounts": [{
    "akahuId" : "acc_xyz", // replace this
    "tier": 1,             // checking accounts: 1, savings: 2, investment: 3, whatever else: 4+
    "nickName": "",        // optional. used in the text message summary.
    "min": 0,              // the minimum balance the app should maintain
    "max": 0               // any excess is transfered up the tiers (see note below)
  }, ... ]
}
```
_Note: your highest tier account should not have a max. This is refered to as your "reserve" account. All excess cash from the lower tiers eventually flows into this account._

Note that multiple accounts can be in the same tier. For example, you may have a personal and joint savings account.

This file would normally be created by the user sign up page and API (not built yet).

See the next section for how it all is meant to fit together.

## System overview 

**Components**

* UI (tbd)
  * Web page for users to create a profile and link their accounts
* Scheduler (tbd)
  * Executes and submits batches of users to the Plan Maker
* **Plan maker (this repository)**
  * Executed by the scheduer on EC2
  * Generates and stores the required bank transfers
  * Generates an SMS/email summary for user approval
* SNS listener (tbd)
  * Listens for SMS/email approvals from users
  * Executes the plan executor
* Plan executor (tbd)
  * Runs on EC2 and handles batches of approvals
  * Executes the transfers via Akahu API
  * Generates an SMS/email with the latest account balances

## Project struture

```bash
root/
|- dist/           # typescript is compiled here
|- src/            # the typescript code is kept here
|  |- core/
|  |- data/        # dummy data for development
|  |- io/
|  |- types/
|  `- main.ts      # start reading here 
|- test/
|- .env            # not in git. you need to add this (scroll up)
`- package.json
```