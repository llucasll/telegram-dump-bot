import { Update } from 'typegram';

import { mdJson } from './utils.js';
import bot from './bot.js';

bot.on('update', async (update: Update) => {
	if (!('message' in update))
		return;
	
	const { message } = update;
	
	// console.log(message);
	
	await bot.sendMessage({
		chat_id: message.chat.id,
		text: mdJson(message),
		parse_mode: 'MarkdownV2',
		reply_to_message_id: message.message_id,
	});
});
await bot.start();

console.log('Bot started!');
