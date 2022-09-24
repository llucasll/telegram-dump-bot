import { Update } from 'typegram';

import bot from './bot.js';

bot.on('update', async (update: Update) => {
	if (!('message' in update))
		return;
	
	const { message } = update;
	
	// console.log(message);
	
	await bot.sendMessage({
		chat_id: message.chat.id,
		text: '```json\n' + JSON.stringify(message, null, 4) + '```',
		parse_mode: 'MarkdownV2',
		reply_to_message_id: message.message_id,
	});
});
await bot.start();

console.log('Bot started!');
