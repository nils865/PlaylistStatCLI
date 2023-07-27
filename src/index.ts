import { artist_counter, sort_object } from './analysis/dataHandling.js';
import { get_access_token } from './spotifyAPI.js';
import { get_all_user_songs, get_user_playlists } from './analysis/userData.js';
import chalk from 'chalk';
import { get_id, select_stats } from './cli.js';

// const token = await get_access_token();

// const playlistID = '4NAeFwwinX6tS5RN5voNbg';
// const user_playlists = await get_playlist_content(playlistID, token);

// const artist_count = await artist_counter(user_playlists)

// const userID = '31vcslluzy32h77ak63kmdq4uqgq';
// const userPlaylists = await get_user_playlists(userID, token);
// const all_songs = await get_all_user_songs(userPlaylists, token);
// const artist_count = await artist_counter(all_songs);

// console.log(sort_object(artist_count));

// console.log(chalk.bgGreen("test"))

console.log(`Welcome to ${chalk.green("Your favourite Spotify Analytics CLI")}`)

const scope = await select_stats()

const id = await get_id(scope)

console.log(id)
