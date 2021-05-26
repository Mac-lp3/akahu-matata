# Akahu Matata

It means no worries.

## What does it do?

On your prefered schedule, this system gets the latest balance of your checking, savings, and/or investment/retirement accounts and automatically redistributes your assets to maximize interest.

Automatic transfers are well and good, but it is hard to pick an exact number that suits from paycheck to paycheck. 

With this, you just specify a minimum and/or maximum for your accounts and it will take care of the rest.

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