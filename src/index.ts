import chalk from 'chalk';
import {
	display_artist_scoreboard,
	filter_for_artist,
	get_id,
	playlist_prompt,
	select_stats,
	song_prompt,
	user_prompt,
} from './cli.js';
import { get_access_token } from './spotifyAPI.js';
import { Spinner, createSpinner } from 'nanospinner';
import { Song, artist_counter } from './analysis/dataHandling.js';
import {
	append_playlist,
	convert_to_non_explicit,
	get_playlist_content,
} from './analysis/playlistaData.js';
import { get_all_user_songs, get_user_playlists } from './analysis/userData.js';
import {
	beautify_song,
	display_songs,
	find_non_explicit,
	get_song,
} from './analysis/songData.js';

import terminalLink from 'terminal-link';

const link = terminalLink('My Website', 'https://sindresorhus.com');
console.log(link);

console.log(
	`Welcome to ${chalk.green('Your favourite Spotify Analytics CLI')}`,
);

const scope = await select_stats();
const id = await get_id(scope);
const token = await get_access_token();
const spinnerText = 'Get Data from Spotify...';

let spinner: Spinner;

try {
	if (scope === 'Playlist') {
		const analysis_type = await playlist_prompt();

		spinner = createSpinner(spinnerText).start();

		const songList: Song[] = await get_playlist_content(id, token);

		if (analysis_type === 'Artist Scoreboard') {
			const data = await artist_counter(songList);

			spinner.success();

			display_artist_scoreboard(data);
		} else if (analysis_type === 'Song List') {
			spinner.success();

			display_songs(songList);
		} else if (analysis_type === 'Filter for Artist') {
			spinner.success();

			const filteredSongList = await filter_for_artist(songList);

			display_songs(filteredSongList);
		} else if (analysis_type === 'Convert to Non-Explicit') {
			const filteredSongList = await convert_to_non_explicit(
				songList,
				token,
			);

			spinner.success();

			display_songs(filteredSongList);

			append_playlist(filteredSongList, await get_id(scope));
		} else throw new Error('Wrong Analysis Type');
	} else if (scope === 'User') {
		const analysis_type = await user_prompt();

		spinner = createSpinner(spinnerText).start();

		const userPlaylists = await get_user_playlists(id, token);
		const songList: Song[] = await get_all_user_songs(userPlaylists, token);

		if (analysis_type === 'Artist Scoreboard') {
			const data = await artist_counter(songList);

			spinner.success();

			display_artist_scoreboard(data);
		} else if (analysis_type === 'Song List') {
			spinner.success();

			display_songs(songList);
		} else if (analysis_type === 'Filter for Artist') {
			spinner.success();

			const filteredSongList = await filter_for_artist(songList);

			display_songs(filteredSongList);
		} else throw new Error('Wrong Analysis Type');
	} else if (scope === 'Song') {
		const analysis_type = await song_prompt();

		spinner = createSpinner(spinnerText).start();

		const song = await get_song(id, token);

		spinner.success();

		if (analysis_type === 'Display Song') {
			console.log(
				beautify_song(
					song,
					chalk.cyan,
					chalk.yellowBright,
					chalk.magentaBright,
				),
			);
		} else if (analysis_type === 'Non-Explicit') {
			const non_explicit = await find_non_explicit(song, token);

			if (non_explicit === null) {
				console.log('No Non-Explicit Version found');
			} else {
				console.log(
					beautify_song(
						non_explicit,
						chalk.cyan,
						chalk.yellowBright,
						chalk.magentaBright,
					),
				);
			}
		} else throw new Error('Wrong Analysis Type');
	} else throw new Error('Scope not found!');
} catch (error) {
	spinner.error({ text: "Couldn't get Data" });
	process.exit(1);
}
