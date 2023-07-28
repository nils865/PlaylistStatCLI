import { Song, compare_songs } from './dataHandling.js';
import { get_playlist_content } from './playlistaData.js';
import { spotify_get_request } from '../spotifyAPI.js';

export async function get_user_playlists(userID: string, token: string) {
	const playlists: string[] = [];

	const data = (
		await spotify_get_request(`/users/${userID}/playlists`, token)
	).items;

	data.forEach(playlist => {
		playlists.push(playlist.id);
	});

	return playlists;
}

export async function get_all_user_songs(playlists: string[], token: string) {
	const all_songs: Song[] = [];

	for (let i = 0; i < playlists.length; i++) {
		const id = playlists[i];

		const content = await get_playlist_content(id, token);

		content.forEach(song => {
			let skip = false;
			all_songs.forEach(current_song => {
				if (compare_songs(current_song, song)) skip = true;
			});
			if (skip) return;

			all_songs.push(song);
		});
	}

	return all_songs;
}
