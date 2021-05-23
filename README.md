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

* return type of cascade function
* clean up / names for cascade functions
* dummy data to match each scenario
* unit tests w/ conditions
* generating the text message
* integration w/ api

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
