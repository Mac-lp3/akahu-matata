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

## TODO

* ~~TS or PY?~~ Both. start with ts
* ~~where you putting the hidden stuff?~~ Docker secrets are ideal
* ~~what request lib?~~ got
* ~~first request~~
* ~~add your acct~~
* ~~get some stuff~~
* ~~add CT account~~
* ~~get K-S~~
* now what?

## CSS

* ~~flag for 'only upward' transfers~~
* ~~return type of cascade function~~
* ~~dummy data to match each scenario~~
* ~~unit tests w/ conditions~~
* clean up / names for cascade functions
* generating the text message
* integration w/ api

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
