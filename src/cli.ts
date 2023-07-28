import inquirer from 'inquirer';
import { get_access_token } from './spotifyAPI.js';
import { get_playlist_content } from './analysis/playlistaData.js';
import { Song, artist_counter, sort_object } from './analysis/dataHandling.js';
import { get_all_user_songs, get_user_playlists } from './analysis/userData.js';
import { createSpinner } from 'nanospinner';
import chalk from 'chalk';

export type StatType = 'User' | 'Playlist';

export async function select_stats(): Promise<StatType> {
	const answers = await inquirer.prompt({
		name: 'scope',
		type: 'list',
		message: 'Select your Scope',
		choices: ['Playlist', 'User'],
	});

	return answers.scope;
}

export async function get_id(scope: StatType): Promise<string> {
	const answers = await inquirer.prompt({
		name: 'id',
		type: 'input',
		message: `Enter the ${scope} ID`,
	});

	return answers.id;
}

export async function run_analysis(scope: StatType, id: string) {
	const token = await get_access_token();
	let songList: Song[];

	const spinner = createSpinner('Get Data from spotify').start();
	let scoreboard: { [artist: string]: number };

	try {
		if (scope === 'Playlist') {
			songList = await get_playlist_content(id, token);
		} else if (scope === 'User') {
			const userPlaylists = await get_user_playlists(id, token);
			songList = await get_all_user_songs(userPlaylists, token);
		} else return;

		scoreboard = await artist_counter(songList);

		spinner.success();
	} catch (error) {
		spinner.error({ text: "Couldn't get Data" });
		process.exit(1);
	}

	return scoreboard;
}

export function display_artist_scoreboard(scoreboard: {
	[artist: string]: number;
}) {
	console.log(`\n---- ${chalk.magenta('Artist Leaderboard')} ----`);

	let i = 0;
	for (const artist in sort_object(scoreboard)) {
		const name = i % 2 == 0 ? chalk.blue(artist) : chalk.green(artist);
		const score = chalk.yellow(scoreboard[artist]);

		console.log(`${name} ${chalk.grey('-')} ${score}`);

		i++;
	}
}

export async function analyze_playlist(id: string, token: string) {
	const songList = await get_playlist_content(id, token);

	return await artist_counter(songList)
}

export async function analayze_user(id: string, token: string) {
	const userPlaylists = await get_user_playlists(id, token);

	const songList = await get_all_user_songs(userPlaylists, token);

	return await artist_counter(songList)
}
