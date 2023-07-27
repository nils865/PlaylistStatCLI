import chalk from 'chalk';
import {
	display_artist_scoreboard,
	get_id,
	run_analysis,
	select_stats,
} from './cli.js';

console.log(
	`Welcome to ${chalk.green('Your favourite Spotify Analytics CLI')}`,
);

const scope = await select_stats();

const id = await get_id(scope);

const data = await run_analysis(scope, id);

display_artist_scoreboard(data);
