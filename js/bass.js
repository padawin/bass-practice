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

.directive('bassPracticePage', function() {
	function PageController(ModesFactory) {
		this.availableModes = ModesFactory.modes.available;
		this.mode = ModesFactory.modes.selected;

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
	function ModeController(ModesFactory) {
		this.availableModes = ModesFactory.modes.available;
		this.mode = {
			mode: ModesFactory.modes.available.PRACTICE
		};

		this.start = function() {
			console.log(this.mode, 'start');
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
});
