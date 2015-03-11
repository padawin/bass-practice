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
		romance: [12, 23]
	};

	positions = [
		// E string, lowest
		[['E', 'Mi'],['F', 'Fa'], ['F#', 'Fa#'], ['G', 'Sol'], ['G#', 'Sol#'], ['A', 'La'], ['A#', 'La#'], ['B', 'Si'], ['C', 'Do'], ['C#', 'Do#'], ['D', 'Ré'], ['D#', 'Ré#'], ['Mi', 'Mi#']],
		// A string
		[['A', 'La'],['A#', 'La#'], ['B', 'Si'], ['C', 'Do'], ['C#', 'Do#'], ['D', 'Ré'], ['D#', 'Ré#'], ['E', 'Mi'], ['F', 'Fa'], ['F#', 'Fa#'], ['G', 'Sol'], ['G#', 'Sol#'], ['A', 'La']],
		// D string
		[['D', 'Ré'],['D', 'Ré#'], ['E', 'Mi'], ['F', 'Fa'], ['F', 'Fa#'], ['G', 'Sol'], ['G#', 'Sol#'], ['A', 'La'], ['A#', 'La#'], ['B', 'Si'], ['C', 'Do'], ['C#', 'Do#'], ['D', 'Ré']],
		// G string, highest
		[['G', 'Sol'],['G#', 'Sol#'], ['A', 'La'], ['A#', 'La#'], ['B', 'Si'], ['C', 'Do'], ['C#', 'Do#'], ['D', 'Ré'], ['D#', 'Ré#'], ['E', 'Mi'], ['F', 'Fa'], ['F#', 'Fa#'], ['G', 'Sol']],
	];

	difficulties = {
		english: systems.english,
		romance: systems.romance,
		all: systems.english + systems.romance
	};
})();
