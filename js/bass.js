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
	var chords, fretsNumber, stringsNumber, maxStringsNumber, chordsBaseTuning, systems;

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
		chords: chords,
		baseTuning: chordsBaseTuning,
		selected: null,

		setSelected: function(s) {
			systems.selected = s;
		},

		getSelected: function() {
			return systems.selected;
		},

		getChords: function(tuning, system) {
			var returnedChords = {},
				chord,
				c;

			for (c = 0; c <= fretsNumber; c++) {
				if (system == systems.systems.english.id || system == systems.systems.romance.id) {
					chord = chords[(tuning + c) % fretsNumber + systems.systems[system].chordsRange[0]];
				}
				else if (system == systems.systems.all.id) {
					chord = chords[(tuning + c) % fretsNumber + systems.systems.english.chordsRange[0]]
						+ ' / ' + chords[(tuning + c) % fretsNumber + systems.systems.romance.chordsRange[0]]
				}

				if (c == 0) {
					returnedChords.tuning = chord;
					returnedChords.chords = [];
				}
				returnedChords.chords.push(chord);
			}

			return returnedChords;
		}
	};

	return systems;
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
	function PracticeController(SystemsFactory) {
		var system = SystemsFactory.getSelected(),
			chordTuning,
			chord;
		this.chordsTuning = [];
		for (chordTuning in SystemsFactory.baseTuning) {
			chord = SystemsFactory.baseTuning[chordTuning];
			this.chordsTuning.push(SystemsFactory.getChords(chord, system));
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
