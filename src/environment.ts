import os from 'node:os';
import fs from 'node:fs';
import process from 'node:process';

import * as dotenv from 'dotenv';

const possiblyPaths = [
	'.env',
	'../.env',
	os.homedir() + '/bot.env',
];
const path = possiblyPaths.find(path => fs.existsSync(path));

if (!path) {
	console.error(
		'Environment file not provided at '
			+ '`./.env`, `../.env` or `~/bot.env`'
			+ ' (this precedence order)'
	);
	process.exit(1);
}

dotenv.config({ path });
