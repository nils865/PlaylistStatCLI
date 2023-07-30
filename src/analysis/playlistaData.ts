import { Song } from './dataHandling.js';
import { spotify_get_request } from '../spotifyAPI.js';

export async function get_playlist_content(playlistID: string, token: string) {
	const data = await spotify_get_request(
		`/playlists/${playlistID}/tracks`,
		token,
	);

	const playlist: Song[] = [];

	for (let i = 0; i < data.items.length; i++) {
		const song = data.items[i].track;

		if (song == null) continue;

		const current_song: Song = {
			title: song.name,
			album: song.album.name,
			artists: [],
			id: song.id
		};

		for (let j = 0; j < song.artists.length; j++) {
			current_song.artists.push(song.artists[j].name);
		}

		playlist.push(current_song);
	}

	return playlist;
}
