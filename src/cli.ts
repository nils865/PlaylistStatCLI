import inquirer from 'inquirer';
import { Song, sort_object } from './analysis/dataHandling.js';
import chalk from 'chalk';

export type StatType = 'User' | 'Playlist' | 'Song';

export async function select_stats(): Promise<StatType> {
	const answers = await inquirer.prompt({
		name: 'scope',
		type: 'list',
		message: 'Select your Scope',
		choices: ['Playlist', 'User', 'Song'],
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

export async function playlist_prompt(): Promise<
	| 'Song List'
	| 'Artist Scoreboard'
	| 'Filter for Artist'
	| 'Convert to Non-Explicit'
> {
	const answers = await inquirer.prompt({
		name: 'analysis_type',
		type: 'list',
		message: 'Select your Output',
		choices: [
			'Song List',
			'Artist Scoreboard',
			'Filter for Artist',
			'Convert to Non-Explicit',
		],
	});

	return answers.analysis_type;
}

export async function user_prompt(): Promise<
	'Song List' | 'Artist Scoreboard' | 'Filter for Artist'
> {
	const answers = await inquirer.prompt({
		name: 'analysis_type',
		type: 'list',
		message: 'Select your Output',
		choices: ['Song List', 'Artist Scoreboard', 'Filter for Artist'],
	});

	return answers.analysis_type;
}

export async function song_prompt(): Promise<'Display Song' | 'Non-Explicit'> {
	const answers = await inquirer.prompt({
		name: 'analysis_type',
		type: 'list',
		message: 'Select your Output',
		choices: ['Display Song', 'Non-Explicit'],
	});

	return answers.analysis_type;
}

export async function filter_for_artist(songList: Song[]): Promise<Song[]> {
	const filteredSongList = [];

	const answers = await inquirer.prompt({
		name: 'name',
		type: 'input',
		message: `Enter the Artist Name`,
	});

	const artistName: string = answers.name;

	console.log(artistName);

	songList.forEach(song => {
		song.artists.forEach(artist => {
			if (artist.toLowerCase() === artistName.toLowerCase())
				filteredSongList.push(song);
		});
	});

	return filteredSongList;
}
