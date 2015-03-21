'use strict';
angular.module('bassPracticeApp', [])

/**********************************************************************/
/** FACTORIES                                                        **/
/**********************************************************************/

.factory('GameEngineFactory', function(SystemsFactory, FretBoardFactory) {
	var gameEngineFactory,
		turn,
		totalTurns,
		canPlay,
		note,
		results;

	canPlay = false;

	function _turn() {
		if (turn-- == 0) {
			note = null;
			canPlay = false;
			return;
		}

		note = FretBoardFactory.getRandomNote(SystemsFactory.getSelected());
		canPlay = true;
	}

	function start(initTurns) {
		turn = totalTurns = parseInt(initTurns) || 5;
		results = {correct: 0, incorrect: 0};

		_turn();
	}

	function playNote(playedNote) {
		if (!canPlay) {
			return null;
		}

		var result;
		if (playedNote.join && !!~playedNote.indexOf(note) || playedNote == note) {
			result = true;
			results.correct++;
		}
		else {
			results.incorrect++;
		}
		_turn();
		return result;
	}

	function getExpectedNote() {
		return note;
	}

	function getTurn() {
		return Math.min(totalTurns - turn, totalTurns);
	}

	function getTotalTurns() {
		return totalTurns;
	}

	function getResults() {
		return results;
	}

	function isFinished() {
		return turn < 0;
	}

	gameEngineFactory = {
		start: start,
		playNote: playNote,
		getExpectedNote: getExpectedNote,
		getTurn: getTurn,
		getTotalTurns: getTotalTurns,
		isFinished: isFinished,
		getResults: getResults
	};

	return gameEngineFactory;
})

/**
 * Factory to work with modes.
 * The available modes are:
 * - Learning: To see a fret board and learn the chords.
 * - Practice: The fret board is empty and the user is prompted notes
 * 		must place them on the board.
 */
.factory('ModesFactory', function() {
	var modesFactory = {
		modes: {
			available: {
				LEARNING: 'learning',
				PRACTICE: 'practice'
			},
			selected: null
		},

		setSelected: function(mode) {
			modesFactory.modes.selected = mode;
		}
	};
	return modesFactory;
})

/**
 * Factory to work with notes systems.
 * The systems are English (C, C#, D, D#, E, F, F#, G, G#, A, A#, B),
 * Romance (Do Ré Mi Fa Sol La Si) and All (both previous combined).
 */
.factory('SystemsFactory', function() {
	var systems;

	systems = {
		systems: {
			english: {
				chordsRange: [0, 11],
				label: 'English',
				id: 'english'
			},
			romance: {
				chordsRange: [12, 23],
				label: 'Romance',
				id: 'romance'
			},
			all: {
				chordsRange: [0, 23],
				label: 'All',
				id: 'all'
			}
		},
		selected: null,

		setSelected: function(s) {
			systems.selected = s;
		},

		getSelected: function() {
			return systems.selected;
		},
	};

	return systems;
})

/**
 * Factory to manage the fret board.
 * The factory can provide the existing chords, the base tuning and
 * from a system and a tuning, returns the list of chords for each fret
 * of the tuning.
 */
.factory('FretBoardFactory', function(SystemsFactory) {
	// constants
	var defaultVal, maxVal, scaleLength, chords, chordsBaseTuning,
		// instances attributes
		fretsNumber, stringsNumber,
		fretBoard;

	defaultVal = {
		frets: 12,
		strings: 6
	};
	maxVal = {
		frets: 12,
		strings: 6
	};
	scaleLength = 12;

	chords = [
		// English
		'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
		// Romance
		'Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si',
	];

	chordsBaseTuning = [4, 11, 7, 2, 9, 4];
	stringsNumber = 4;

	function _getChord(tuning, fret, system) {
		// The absolute chord is not system dependant, just the index
		//	of the chord in the scale
		// The returned value is the index of the chord in the actual
		//	scale
		var absoluteChord = (tuning + fret) % scaleLength;
		return chords[
			absoluteChord
			+ SystemsFactory.systems[system].chordsRange[0]
		];
	}

	function _getChords(system, tuning) {
		var returnedChords = {},
			chord,
			c;

		for (c = 0; c <= fretsNumber; c++) {
			if (system == SystemsFactory.systems.english.id || system == SystemsFactory.systems.romance.id) {
				chord = _getChord(tuning, c, system);
			}
			else if (system == SystemsFactory.systems.all.id) {
				chord = [
					_getChord(tuning, c, 'english'),
					_getChord(tuning, c, 'romance')
				];
			}

			if (c == 0) {
				returnedChords.tuning = chord;
				if (system == SystemsFactory.systems.all.id) {
					returnedChords.tuning = returnedChords.tuning.join(' / ');
				}

				returnedChords.chords = [];
			}
			returnedChords.chords.push(chord);
		}

		return returnedChords;
	}

	function getRandomNote(system) {
		var firstChord = SystemsFactory.systems[system].chordsRange[0],
			lastChord = SystemsFactory.systems[system].chordsRange[1];
		return chords[Math.floor(Math.random() * (lastChord - firstChord + 1)) + firstChord];
	}

	function getBoard(system) {
		var board, chordTuning, chordTuningIndex;

		board = [];
		for (chordTuningIndex in chordsBaseTuning) {
			chordTuning = chordsBaseTuning[chordTuningIndex];
			board.push(_getChords(system, chordTuning));
		}

		return board;
	}

	function setFretsNumber(nbFrets) {
		fretsNumber = Math.min(parseInt(nbFrets) || defaultVal.frets, maxVal.frets);
	}

	fretBoard = {
		chords: chords,
		baseTuning: chordsBaseTuning,

		getBoard: getBoard,
		getRandomNote: getRandomNote,
		setFretsNumber: setFretsNumber
	};

	return fretBoard;
})
/**********************************************************************/
/** END FACTORIES                                                    **/
/**********************************************************************/

/**********************************************************************/
/** CONTROLLERS                                                      **/
/**********************************************************************/
.controller('BoardController', function(SystemsFactory, FretBoardFactory, GameEngineFactory) {
	this.chordsTuning = FretBoardFactory.getBoard(
		SystemsFactory.getSelected()
	);

	this.getExpectedNote = GameEngineFactory.getExpectedNote;
	this.getTotalTurns = GameEngineFactory.getTotalTurns;
	this.getTurn = GameEngineFactory.getTurn;
	this.isFinished = GameEngineFactory.isFinished;
	this.getResults = GameEngineFactory.getResults;

	this.click = function(string, fret) {
		var result = GameEngineFactory.playNote(
			this.chordsTuning[string].chords[fret]
		);
	};

	this.displayChord = function(chord) {
		return chord.join && chord.join(' / ') || chord;
	}
})
/**********************************************************************/
/** END CONTROLLERS                                                  **/
/**********************************************************************/

/**********************************************************************/
/** DIRECTIVES                                                       **/
/**********************************************************************/
/**
 * Main directive of the page, loads the menu and displays the different
 * modes according the choices in the menu.
 */
.directive('bassPracticePage', function() {
	function PageController(ModesFactory) {
		this.availableModes = ModesFactory.modes.available;

		this.checkMode = function(against) {
			return ModesFactory.modes.selected == against;
		}
	}

	return {
		restrict: 'E',
		replace: true,
		scope: true,
		templateUrl: 'templates/bassPracticePage.html',
		controllerAs: 'pageController',
		controller: PageController
	};
})

/**
 * Directive for the menu to choose the mode and system
 */
.directive('modeSelection', function() {
	function ModeController(ModesFactory, SystemsFactory, FretBoardFactory, GameEngineFactory) {
		this.availableModes = ModesFactory.modes.available;
		this.availableSystems = SystemsFactory.systems;

		// There may be other options later, such as tuning, number of
		// strings...
		this.mode = {
			mode: ModesFactory.modes.available.PRACTICE,
			system: SystemsFactory.systems.english.id
		};

		this.start = function(frets, turns) {
			ModesFactory.setSelected(this.mode.mode);
			SystemsFactory.setSelected(this.mode.system);
			FretBoardFactory.setFretsNumber(frets);

			if (this.mode.mode == ModesFactory.modes.available.PRACTICE) {
				GameEngineFactory.start(turns);
			}
		};
	}

	return {
		restrict: 'E',
		replace: true,
		scope: true,
		templateUrl: 'templates/modeSelection.html',
		controllerAs: 'modeController',
		controller: ModeController
	};
})

/**
 * Directive to display the practice mode, where the fret board is
 * interactive.
 */
.directive('modePractice', function() {
	function PracticeController($controller) {
		angular.extend(this, $controller('BoardController', {}));
	}

	return {
		restrict: 'E',
		replace: true,
		scope: true,
		templateUrl: 'templates/modePractice.html',
		controllerAs: 'practiceController',
		controller: PracticeController
	};
})

/**
 * Directive to display the learning mode, where the fret board is not
 * interactive, with all then notes displayed.
 */
.directive('modeLearning', function() {
	function LearningController($controller) {
		angular.extend(this, $controller('BoardController', {}));
		this.click = function() {};
	}

	return {
		restrict: 'E',
		replace: true,
		scope: true,
		templateUrl: 'templates/modeLearning.html',
		controllerAs: 'learningController',
		controller: LearningController
	};
})

.directive('board', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			controller: '=',
			displayChords: '='
		},
		templateUrl: 'templates/board.html'
	};
});
/**********************************************************************/
/** END DIRECTIVES                                                   **/
/**********************************************************************/
