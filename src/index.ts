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
	
	if ('text' in message) {
		await bot.sendMessage({
			chat_id: message.chat.id,
			text: message.text,
			entities: message.entities,
			reply_to_message_id: message.message_id,
		});
		
		const custom_emoji_ids = message.entities
			?.filter(({ type }) => type === 'custom_emoji')
			.map(entity => (entity as any).custom_emoji_id) ?? [];
		
		if (custom_emoji_ids.length) {
			const customEmojis = await bot.getCustomEmojiStickers({ custom_emoji_ids });
			
			await bot.sendMessage({
				chat_id: message.chat.id,
				text: mdJson(customEmojis),
				parse_mode: 'MarkdownV2',
				reply_to_message_id: message.message_id,
			});
		}
	}
});
await bot.start();

console.log('Bot started!');
