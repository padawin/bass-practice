/**
 * Features:
 * - choose a random note and ask the user to place it on the board (training mode)
 * - count the time the user needs to place the note and save it
 * - for each note, log which position the user knows the most
 * - see the full fretboard in romance and english system (learning mode)
 */
(function() {
	var bassPractice, chords, systems, positions, difficulties;

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

	function _checkNote(note, available) {
		return !!~available.indexOf(note);
	}

	bassPractice = function(element, mode) {
		if (!systems[mode]) {
			throw 'Invalid mode: ' + mode;
		}

		this.element = B.$id('board');
		this.mode = mode;
		this.results = {correct: 0, incorrect: 0};
	};

	bassPractice.modes = {ENGLISH: 'english', ROMANCE: 'romance', ALL: 'all'};

	bassPractice.prototype.getRandomNote = function() {
		var firstChord = systems[this.mode][0],
			lastChord = systems[this.mode][1];
		return chords[Math.floor(Math.random() * (lastChord - firstChord + 1)) + firstChord];
	};

	bassPractice.prototype.start = function(turns) {
		var note, canClick = false, instance = this, totalTurns = turns;
		B.$id('result').innerHTML = '';

		function _turn() {
			if (turns-- == 0) {
				B.$id('result').innerHTML = 'Finished, your results are: <br />Corrects: ' + instance.results.correct
					+ '<br /> Incorrect: ' + instance.results.incorrect;
				return;
			}

			note = instance.getRandomNote();
			B.$id('note-to-play').innerHTML = note;
			canClick = true;
			B.$id('turn').innerHTML = (totalTurns - turns) + ' out of ' + totalTurns;
		}

		function _clickTable(event) {
			var clickedChord = event.target,
				clickedString = clickedChord.parentNode,
				fret = clickedChord.parentNode.children.indexOf(clickedChord) - 1,
				string = clickedString.parentNode.children.indexOf(clickedString);

			if (!canClick || clickedChord.tagName != 'TD') {
				return false;
			}

			canClick = false;
			if (_checkNote(note, positions[string][fret])) {
				B.addClass('answer', 'right');
				B.removeClass('answer', 'wrong');
				B.$id('answer').innerHTML = 'Correct';
				instance.results.correct++;
			}
			else {
				B.addClass('answer', 'wrong');
				B.removeClass('answer', 'right');
				B.$id('answer').innerHTML = 'Incorrect';
				instance.results.incorrect++;
			}
			_turn();
		}

		B.addEvent(this.element, 'click', _clickTable);
		B.addEvent(B.$id('restart'), 'click', function(e) {
			instance.start(totalTurns);
			return e.preventDefault();
		});
		_turn();
	};

	window.BassPractice = bassPractice;
})();
