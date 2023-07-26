require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const URL_BASE = 'https://api.spotify.com/v1';

const get_access_token = async _ => {
	const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
	const encoded_credentials = Buffer.from(credentials).toString('base64');

	const url = 'https://accounts.spotify.com/api/token';

	const authOptions = {
		method: 'POST',
		headers: {
			Authorization: `Basic ${encoded_credentials}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: 'grant_type=client_credentials',
	};

	const response = await fetch(url, authOptions);
	const data = await response.json();

	if (response.ok) return data.access_token;
	else throw new Error('Failed to fetch');
};

const spotify_post = async (url, token) => {
	const full_url = URL_BASE + url;
	const authOptions = {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await fetch(full_url, authOptions);
	const data = await response.json();

	if (response.ok) return data;
	else throw new Error(`Post to ${url} failed!`);
};

const get_playlist_content = async (playlistID, token) => {
	const data = spotify_post(
		`${URL_BASE}/playlists/${playlistID}/tracks`,
		token,
	);
};

const token = get_access_token();

const playlistID = '4NAeFwwinX6tS5RN5voNbg';
const user_playlists = get_playlist_content(playlistID, token);
