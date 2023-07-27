import { get_access_token, spotify_get_request } from './spotifyAPI.js';

const sort_object = (obj: { [key: string]: number }) => {
	const keyValueArray = Object.entries(obj);

	keyValueArray.sort((a, b) => b[1] - a[1]);

	return Object.fromEntries(keyValueArray);
};

const get_playlist_content = async (playlistID, token) => {
	const data = await spotify_get_request(`/playlists/${playlistID}/tracks`, token);

	const playlist = [];

	for (let i = 0; i < data.items.length; i++) {
		const song = data.items[i].track;

		if (song == null) continue;

		const current_song = {
			title: song.name,
			artists: [],
		};

		for (let j = 0; j < song.artists.length; j++) {
			current_song.artists.push(song.artists[j].name);
		}

		playlist.push(current_song);
	}

	return playlist;
};

const artist_counter = async playlist => {
	const artists = {};
	const finished_songs = [];

	for (let i = 0; i < playlist.length; i++) {
		const song = playlist[i];

		let skip = false;
		finished_songs.forEach(current_song => {
			if (current_song.title === song.title) {
				let next = false;

				for (let j = 0; j < current_song.artists.length; j++) {
					if (current_song.artists[j] !== song.artists[j]) {
						next = true;
						break;
					}
				}

				if (!next) {
					skip = true;
				}
			}
		});

		if (skip) continue;

		song.artists.forEach(artist => {
			if (artist in artists) artists[artist]++;
			else artists[artist] = 1;
		});

		finished_songs.push(song);
	}

	return artists;
};

const get_user_playlists = async (userID, token) => {
	const playlists = [];

	const data = (await spotify_get_request(`/users/${userID}/playlists`, token)).items;

	data.forEach(playlist => {
		playlists.push(playlist.id);
	});

	return playlists;
};

const get_all_user_songs = async (playlists, token) => {
	const all_songs = [];

	for (let i = 0; i < playlists.length; i++) {
		const id = playlists[i];

		const content = await get_playlist_content(id, token);

		content.forEach(song => {
			all_songs.push(song);
		});
	}

	return all_songs;
};

const token = await get_access_token();

// const playlistID = '4NAeFwwinX6tS5RN5voNbg';
// const user_playlists = await get_playlist_content(playlistID, token);

// const artist_count = await artist_counter(user_playlists)
// console.log(artist_count);

const userID = '31vcslluzy32h77ak63kmdq4uqgq';
const userPlaylists = await get_user_playlists(userID, token);
const all_songs = await get_all_user_songs(userPlaylists, token);
const artist_count = await artist_counter(all_songs);

console.log(sort_object(artist_count));

