import chalk from 'chalk';
import {
	display_artist_scoreboard,
	get_id,
	playlist_prompt,
	select_stats,
	user_prompt,
} from './cli.js';
import { get_access_token } from './spotifyAPI.js';
import { Spinner, createSpinner } from 'nanospinner';
import { ArtistScore } from './analysis/dataHandling.js';
import { analyze_playlist } from './analysis/playlistaData.js';
import { analayze_user } from './analysis/userData.js';

console.log(
	`Welcome to ${chalk.green('Your favourite Spotify Analytics CLI')}`,
);

const scope = await select_stats();
const id = await get_id(scope);
const token = await get_access_token();

let data: ArtistScore

let spinner: Spinner

try {
	if (scope === 'Playlist') {
		const analysis_type = await playlist_prompt();
		
		spinner = createSpinner('Get Data from Spotify').start();

		if (analysis_type === 'Artist Scoreboard') {
			data = await analyze_playlist(id, token)

			spinner.success();
		} else throw new Error('Wrong Analysis Type')
	} else if (scope === 'User') {
		const analysis_type = await user_prompt();

		spinner = createSpinner('Get Data from Spotify').start();

		if (analysis_type === 'Artist Scoreboard') {
			data = await analayze_user(id, token)

			spinner.success();
		} else throw new Error('Wrong Analysis Type')
	} else throw new Error('Scope not found!')
} catch (error) {
	spinner.error({ text: "Couldn't get Data" });
	process.exit(1);
}

display_artist_scoreboard(data);
