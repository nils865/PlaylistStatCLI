import chalk from 'chalk';
import {
	analayze_user,
	analyze_playlist,
	display_artist_scoreboard,
	get_id,
	run_analysis,
	select_stats,
} from './cli.js';
import { get_access_token } from './spotifyAPI.js';

console.log(
	`Welcome to ${chalk.green('Your favourite Spotify Analytics CLI')}`,
);

const scope = await select_stats();

const id = await get_id(scope);

const token = await get_access_token();

let data

if (scope === 'Playlist') {
	data = await analyze_playlist(id, token)
} else if (scope === 'User') {
	data = await analayze_user(id, token)
} else throw new Error('Scope not found!')

// const data = await run_analysis(scope, id);

display_artist_scoreboard(data);
