angular.module('bassPracticeApp', [])

.directive('modeSelection', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: true,
		templateUrl: 'templates/modeSelection.html'
	};
})
