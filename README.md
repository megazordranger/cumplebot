# Cumplebot

Telegram bot that remembers your birthday for you and your chat partners

<!-- PROJECT SHIELDS -->

![](https://img.shields.io/badge/build-node-brightgreen) ![](https://img.shields.io/badge/license-MIT-green)

## Description

The bot save your birthday and in the the record date the bot display a happy birthday message to you.

## Installation

### Local launch

1. Clone this repo: `git clone https://github.com/megazordranger/cumplebot`
2. Launch the [mongo database](https://www.mongodb.com/) locally
3. Create `.env.development` with the environment variables listed below
4. Run `yarn install` in the root folder

### Production launch

For production launch create `.env.production` file instead

### Environment variables

-   `DB_HOST` — URL of the mongo database
-   `DB_NAME`— name of mongo database
-   `RULE_HOUR`— day hour that the happy birthday message will be displayed
-   `BOT_TOKEN`— Telegram bot token

Also, please, consider looking at `.env.sample`.

## Multi-laguage support

For add new language to bot:

1. Create new locale file in `src/locale` (the file name must be the respective language code)
2. Import the new file in `src/locale/index.js` and add it to `Languages` class constructor, example:

```
// src/locale/index.js
const es = require('./es.js');
...
constructor() {
    // Added new locale to lacale object
	this.locale = {
		es,
		en,
	};
}
```

## Commands

-   `/start` — Setting bot commands
-   `/help`— Show commands info
-   `/addme`— Save your birthday
-   `/channel`— Invoke all chat members registered in cumplebot
