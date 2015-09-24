const OCTAVE = [
	['C', 16.35],
	['C#', 17.32],
	['D', 18.35],
	['D#', 19.45],
	['E', 20.60],
	['F', 21.83],
	['F#', 23.12],
	['G', 24.50],
	['G#', 25.96],
	['A', 27.50],
	['A#', 29.14],
	['B', 30.87]
];

const NOTES = [0, 1, 2, 3, 4, 5, 6, 7].reduce((arr, octave) => {
	const pow = Math.pow(2, octave);
	return arr.concat(OCTAVE.map(note => {
		return {
			name: note[0],
			frequency: note[1] * pow,
			octave: octave
		};
	}));
}, []);

export default function getNote(frequency) {
	var lastNote = NOTES[0], i, toPrev, toNext;
	for (i = 0; i < NOTES.length; i ++) {
		toPrev = Math.abs(lastNote.frequency - frequency);
		toNext = Math.abs(NOTES[i].frequency - frequency);
		if (toNext <= toPrev) {
			lastNote = NOTES[i];
		} else {
			return lastNote;
		}
	}
}
