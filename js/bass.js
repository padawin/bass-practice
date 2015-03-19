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
	var chords, systems;

	chords = [
		// English
		'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
		// Romance
		'Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si',
	];

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
		selected: null,

		setSelected: function(s) {
			systems.selected = s;
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
	return {
		restrict: 'E',
		replace: true,
		scope: true,
		templateUrl: 'templates/modePractice.html'
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
