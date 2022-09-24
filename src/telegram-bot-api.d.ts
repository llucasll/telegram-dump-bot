type Promisify <T extends Function> =
	T extends (...args: infer A) => infer R
		? (...args: A) => Promise<R>
		: never;

declare module 'telegram-bot-api' {
	type Telegram = import('typegram').Telegram;
	const Methods: new () => {
		[Property in keyof Telegram]: Promisify<Telegram[Property]>;
	};
	
	interface ApiConstructorParameters {
		token: string,
		baseUrl?: string,
		http_proxy?: string,
	}
	class Api extends Methods {
		static GetUpdateMessageProvider: new () => unknown;
		constructor (parameters: ApiConstructorParameters);
		
		// TODO
		on (eventName: string, handler: Function): unknown;
		start (): Promise<void>;
		// TODO
		setMessageProvider (provider: unknown): void;
	}
	
	export default Api;
}
