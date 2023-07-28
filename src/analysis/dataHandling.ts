export type Song = {
	title: string;
	album: string,
	artists: string[];
};

export type ArtistScore = { [artist: string]: number }

export function sort_object(obj: ArtistScore): ArtistScore {
	const keyValueArray = Object.entries(obj);

	keyValueArray.sort((a, b) => b[1] - a[1]);

	return Object.fromEntries(keyValueArray);
}

export function compare_songs(a: Song, b: Song): boolean {
	if (a.title !== b.title) return false;

	if (a.artists.length !== b.artists.length) return false;

	for (let i = 0; i < a.artists.length; i++) {
		if (a.artists[i] !== b.artists[i]) return false;
	}

	return true;
}

export async function artist_counter(playlist: Song[]) {
	const artists: ArtistScore = {};
	const finished_songs: Song[] = [];

	for (let i = 0; i < playlist.length; i++) {
		const song = playlist[i];

		let skip = false;
		finished_songs.forEach(e => {
			if (compare_songs(e, song)) skip = true;
		});
		if (skip) continue;

		song.artists.forEach(artist => {
			artist in artists ? artists[artist]++ : (artists[artist] = 1);
		});

		finished_songs.push(song);
	}

	return artists;
}
