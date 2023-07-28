import chalk from "chalk";
import { Song } from "./dataHandling.js";

export function beautify_song(song: Song, title_color: (str: string) => string, artist_color: (str: string) => string, album_color: (str: string) => string): string {
    const artists = song.artists.join(', ')

    return `${title_color(song.title)} - ${artist_color(artists)} - ${album_color(song.album)}`
}

export function display_songs(list: Song[]) {
    for (let i = 0; i < list.length; i++) {
        const song = list[i]
        const title_color: (str: string) => string = i % 2 ? chalk.cyan : chalk.greenBright
        const artist_color: (str: string) => string = i % 2 ? chalk.yellowBright : chalk.redBright
        const album_color: (str: string) => string = i % 2 ? chalk.magentaBright : chalk.magenta

        console.log(beautify_song(song, title_color, artist_color, album_color))
    }
}
