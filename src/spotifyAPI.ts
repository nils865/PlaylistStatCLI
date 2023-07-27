import dotenv from 'dotenv'

export async function get_access_token(): Promise<string> {
    dotenv.config()
    
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;

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
}

export async function spotify_get_request(url: string, token: string) {
    const full_url = 'https://api.spotify.com/v1' + url

    const authOptions = {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

    const response = await fetch(full_url, authOptions);
	const data = await response.json();

	if (response.ok) return data;
	else throw new Error(`Get request to ${url} failed!`);
}
