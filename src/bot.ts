import fs from 'node:fs';
import process from 'node:process';
import os from 'node:os';

// @ts-ignore
import TelegramBot from 'telegram-bot-api';
import { Telegram } from 'typegram';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

import { sleep } from './utils.js';

const possiblyPaths = [
	'.env',
	'../.env',
	os.homedir() + '/bot.env',
];
const path = possiblyPaths.find(path => fs.existsSync(path));
dotenv.config({ path });

const apiUrl = 'https://api.telegram.org';

type Methods = {
	[Property in keyof Telegram]: Telegram[Property] extends Function
		? (...args: Parameters<Telegram[Property]>) =>
			Promise<ReturnType<Telegram[Property]>>
		: Telegram[Property]
} & {
	// TODO
	on (eventName: string, handler: Function): unknown,
	start (): Promise<void>,
	// TODO
	setMessageProvider (provider: unknown): void,
}

export const token = process.env.telegramToken;

const bot = new TelegramBot({
	token,
	baseUrl: apiUrl,
}) as Methods;
bot.setMessageProvider(new TelegramBot.GetUpdateMessageProvider());

const errorCodes = {
	tooManyRequests: 429,
};

let requestsCount = 0;

async function callApi
	<T extends keyof Telegram>
	(method: T, data: Parameters<Telegram[T]>[0])
{
	while (true) {
		const request = await fetch(`${apiUrl}/bot${token}/${method}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		
		requestsCount++;
		
		const json = await request.json() as any;
		
		if (json.error_code === errorCodes.tooManyRequests) {
			// console.log(
			// 	'Requests count:',
			// 	requestsCount,
			// 	// json,
			// );
			
			await sleep(json.parameters.retry_after * 1000);
			continue;
		}
		
		if (!json.result)
			throw json;
		
		return json.result as ReturnType<Telegram[T]>;
	}
}

export default new Proxy(
	bot,
	{
		get <T extends keyof Telegram> (target: Methods, key: T) {
			if ([ 'on', 'start', 'setMessageProvider' ].includes(key))
				// @ts-ignore
				return (...args: unknown[]) => target[key](...args);
			
			return (data: Parameters<Telegram[T]>[0]) => callApi(key, data);
		},
	},
);
