import chalk from 'chalk';
import { Song } from './dataHandling.js';
import { spotify_get_request } from '../spotifyAPI.js';
import terminalLink from 'terminal-link';

export function generate_song_link(song: Song): string {
	return `https://open.spotify.com/track/${song.id}`
}

export function beautify_song(
	song: Song,
	title_color: (str: string) => string,
	artist_color: (str: string) => string,
	album_color: (str: string) => string,
): string {
	const artists = song.artists.join(', ');

	const link = terminalLink(title_color(song.title), generate_song_link(song))

	return `${link} - ${artist_color(
		artists,
	)} - ${album_color(song.album)}`;
}

export function display_songs(list: Song[]) {
	console.log(`\n---- ${chalk.magenta('Song List')} ----`);

	for (let i = 0; i < list.length; i++) {
		const song = list[i];
		const title_color: (str: string) => string =
			i % 2 ? chalk.cyan : chalk.greenBright;
		const artist_color: (str: string) => string =
			i % 2 ? chalk.yellowBright : chalk.redBright;
		const album_color: (str: string) => string =
			i % 2 ? chalk.magentaBright : chalk.magenta;

		console.log(
			beautify_song(song, title_color, artist_color, album_color),
		);
	}
}

export async function get_song(id: string, token: string): Promise<Song> {
	const data = await spotify_get_request(`/tracks/${id}`, token);
	const artists: string[] = data.artists.map(artist => artist.name);

	const song: Song = {
		title: data.name,
		album: data.album.name,
		artists: artists,
		id: id,
		explicit: data.explicit,
	};

	return song;
}
