import process from 'node:process';

import TelegramBot from 'telegram-bot-api';
import { Telegram } from 'typegram';
import fetch from 'node-fetch';

import './environment.js';
import { sleep } from './utils.js';

export const apiUrl = process.env.apiUrl ?? 'https://api.telegram.org';
export const token = process.env.telegramToken!;

const bot = new TelegramBot({
	token,
	baseUrl: apiUrl,
});
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
		get <T extends keyof Telegram> (target: TelegramBot, key: T) {
			if ([ 'on', 'start', 'setMessageProvider' ].includes(key))
				// @ts-ignore
				return (...args: unknown[]) => target[key](...args);
			
			return (data: Parameters<Telegram[T]>[0]) => callApi(key, data);
		},
	},
);
