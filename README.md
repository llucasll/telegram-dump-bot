# Telegram Dump Bot

> Conceptually inspired by `Pyrogram JSON Dump` ([GitHub](https://github.com/ColinShark/json-dump), [Telegram](https://t.me/pyrogramjsondumpbot))

The simplest TypeScript/NodeJS Telegram bot implementation to dump a Message Update as raw JSON (in a reply message).

It's mainly focused for studying/testing the Telegram Bot API purposes.

It's intended to run in Linux or Linux-like (e.g. WSL, Termux) environments. Not tested in another SOs yet.

## Running

To run this project locally, you need to:

1. Copy the `.env.example` file to `.env` and fill the `telegramToken` (case-sensitive) field (available via [@BotFather](https://t.me/BotFather)), or do the same in `../.env` or `~/bot.env` (in this precedence order).
1. Install the project's dependencies (`npm install`)
1. Start the bot (`npm start`).

Done! Enjoy!
