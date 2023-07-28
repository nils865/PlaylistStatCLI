import chalk from 'chalk';
import {
	analayze_user,
	analyze_playlist,
	display_artist_scoreboard,
	get_id,
	select_stats,
} from './cli.js';
import { get_access_token } from './spotifyAPI.js';
import { createSpinner } from 'nanospinner';

console.log(
	`Welcome to ${chalk.green('Your favourite Spotify Analytics CLI')}`,
);

const scope = await select_stats();
const id = await get_id(scope);
const token = await get_access_token();

let data: { [key: string]: number }

const spinner = createSpinner('Get Data from Spotify').start();

try {
	if (scope === 'Playlist') {
		data = await analyze_playlist(id, token)
	} else if (scope === 'User') {
		data = await analayze_user(id, token)
	} else throw new Error('Scope not found!')

	spinner.success();
} catch (error) {
	spinner.error({ text: "Couldn't get Data" });
	process.exit(1);
}

display_artist_scoreboard(data);
