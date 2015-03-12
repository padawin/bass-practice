/**
 * Features:
 * - choose a random note and ask the user to place it on the board (training mode)
 * - count the time the user needs to place the note and save it
 * - for each note, log which position the user knows the most
 * - see the full fretboard in romance and english system (learning mode)
 */
(function() {
	var chords, systems, positions, difficulties;

	chords = [
		// English
		'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
		// Romance
		'Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si',
	];

	systems = {
		english: [0, 11],
		romance: [12, 23],
		all: [0, 23]
	};

	positions = [
		// G string, highest
		[['G', 'Sol'],['G#', 'Sol#'], ['A', 'La'], ['A#', 'La#'], ['B', 'Si'], ['C', 'Do'], ['C#', 'Do#'], ['D', 'Ré'], ['D#', 'Ré#'], ['E', 'Mi'], ['F', 'Fa'], ['F#', 'Fa#'], ['G', 'Sol']],
		// D string
		[['D', 'Ré'],['D', 'Ré#'], ['E', 'Mi'], ['F', 'Fa'], ['F#', 'Fa#'], ['G', 'Sol'], ['G#', 'Sol#'], ['A', 'La'], ['A#', 'La#'], ['B', 'Si'], ['C', 'Do'], ['C#', 'Do#'], ['D', 'Ré']],
		// A string
		[['A', 'La'],['A#', 'La#'], ['B', 'Si'], ['C', 'Do'], ['C#', 'Do#'], ['D', 'Ré'], ['D#', 'Ré#'], ['E', 'Mi'], ['F', 'Fa'], ['F#', 'Fa#'], ['G', 'Sol'], ['G#', 'Sol#'], ['A', 'La']],
		// E string, lowest
		[['E', 'Mi'],['F', 'Fa'], ['F#', 'Fa#'], ['G', 'Sol'], ['G#', 'Sol#'], ['A', 'La'], ['A#', 'La#'], ['B', 'Si'], ['C', 'Do'], ['C#', 'Do#'], ['D', 'Ré'], ['D#', 'Ré#'], ['Mi', 'Mi#']]
	];

	difficulties = {
		english: systems.english,
		romance: systems.romance,
		all: systems.english + systems.romance
	};
})();
