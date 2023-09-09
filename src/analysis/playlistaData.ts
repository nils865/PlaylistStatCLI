import { Song } from './dataHandling.js';
import { spotify_get_request, spotify_post_request } from '../spotifyAPI.js';
import { display_songs, get_song } from './songData.js';

export async function get_playlist_content(playlistID: string, token: string) {
	const data = await spotify_get_request(
		`/playlists/${playlistID}/tracks`,
		token,
	);

	const playlist: Song[] = [];

	for (let i = 0; i < data.items.length; i++) {
		const song = data.items[i].track;

		if (song == null || song.is_local == true) continue;

		const current_song: Song = {
			title: song.name,
			album: song.album.name,
			artists: [],
			id: song.id,
			explicit: song.explicit,
		};

		for (let j = 0; j < song.artists.length; j++) {
			current_song.artists.push(song.artists[j].name);
		}

		playlist.push(current_song);
	}

	return playlist;
}

export async function convert_to_non_explicit(songList: Song[], token: string): Promise<Song[]> {
	const filteredSongs: Song[] = [];

	for (const song of songList) {
		const res = await spotify_get_request(`/search?&limit=10&type=track&q=track:${song.title}`, token)

		for (const item of res.tracks.items) {
			const track = await get_song(item.id, token)

			if (track.explicit == false && track.title.toLowerCase() == song.title.toLowerCase() && track.artists.join('%69').toLowerCase() == song.artists.join('%69').toLowerCase()) {
				filteredSongs.push(track)
				break;
			}
		}
	}

	return filteredSongs;
}

export async function append_playlist(songList: Song[], playlist_id: string) {
	for (const song of songList) {
		await spotify_post_request(`/playlists/${playlist_id}/tracks?uris=spotify:track:${song.id}`);
	}
}
