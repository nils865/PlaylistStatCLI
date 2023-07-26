require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const get_access_token = async _ => {
    const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`
    const encoded_credentials = Buffer.from(credentials).toString('base64')

    const url = 'https://accounts.spotify.com/api/token'

    const authOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${encoded_credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    };

    const response = await fetch(url, authOptions)
    const data = await response.json()

    if (response.ok) return data.access_token;
    else throw new Error("Failed to fetch")
}

get_access_token()
