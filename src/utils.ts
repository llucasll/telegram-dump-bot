export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function mdJson (value: unknown) {
	return '```json\n' + JSON.stringify(value, null, 4) + '```';
}
