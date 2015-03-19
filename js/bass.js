angular.module('bassPracticeApp', [])

.factory('ModesFactory', function () {
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

.factory('FretBoardFactory', function(SystemsFactory) {
	var chords, fretsNumber, stringsNumber, maxStringsNumber, chordsBaseTuning, fretBoard;

	chords = [
		// English
		'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
		// Romance
		'Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si',
	];

	chordsBaseTuning = [4, 11, 7, 2, 9, 4];
	fretsNumber = 12;
	stringsNumber = 4;
	maxStringsNumber = 4;

	function getChord(tuning, fret, system) {
		return chords[(tuning + fret) % fretsNumber + SystemsFactory.systems[system].chordsRange[0]];
	}

	fretBoard = {
		chords: chords,
		baseTuning: chordsBaseTuning,

		getChords: function(system, tuning) {
			var returnedChords = {},
				chord,
				c;

			for (c = 0; c <= fretsNumber; c++) {
				if (system == SystemsFactory.systems.english.id || system == SystemsFactory.systems.romance.id) {
					chord = getChord(tuning, c, system);
				}
				else if (system == SystemsFactory.systems.all.id) {
					chord = getChord(tuning, c, 'english')
						+ ' / ' + getChord(tuning, c, 'romance')
				}

				if (c == 0) {
					returnedChords.tuning = chord;
					returnedChords.chords = [];
				}
				returnedChords.chords.push(chord);
			}

console.log(returnedChords);
			return returnedChords;
		}
	};

	return fretBoard;
})

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

.directive('modeSelection', function() {
	function ModeController(ModesFactory, SystemsFactory) {
		this.availableModes = ModesFactory.modes.available;
		this.availableSystems = SystemsFactory.systems;

		// There may be other options later, such as tuning, number of strings...
		this.mode = {
			mode: ModesFactory.modes.available.PRACTICE,
			system: SystemsFactory.systems.english.id
		};

		this.selectMode = function() {
			ModesFactory.setSelected(this.mode.mode);
			SystemsFactory.setSelected(this.mode.system);
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

.directive('modePractice', function() {
	function PracticeController(SystemsFactory, FretBoardFactory) {
		var system = SystemsFactory.getSelected(),
			chordTuningIndex,
			chordTuning,
			chord;
		this.chordsTuning = [];
		for (chordTuningIndex in FretBoardFactory.baseTuning) {
			chordTuning = FretBoardFactory.baseTuning[chordTuningIndex];
			this.chordsTuning.push(FretBoardFactory.getChords(system, chordTuning));
		}
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

.directive('modeLearning', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: true,
		templateUrl: 'templates/modeLearning.html'
	};
});
