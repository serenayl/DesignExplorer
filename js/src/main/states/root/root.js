/**
 * Base state for all nested future states we may have
 */
app.config(function ($stateProvider) {
	$stateProvider.state('root', {
		name: 'root',
		// abstract: true,
		url: '/',
		templateUrl: 'js/src/main/states/root/root.html',
		controller: 'RootStateCtrl'
	});
});

app.controller('RootStateCtrl', function ($rootScope, $scope, $timeout) {

	var designExplorer;

	var spect;

	d3.csv("design_explorer_data/kpf/20160811_DataTable_Formatted.csv")
		.get(function (error, rows) {
			$scope.designExplorer = new DesignExplorer(rows);
		});

	$scope.viewMode = 'thumbnails';

	$scope.selectedIteration = null;

	$scope.DesignExplorer = {
		'typeDisplayDictionary': DesignExplorer.typeDisplayDictionary
	};

	$timeout(function () {
		spect = new SPECTACLES($('#spectacles-container'));
	});

	/*
	███████  ██████  ██████  ██████  ███████     ███████ ███    ██
	██      ██      ██    ██ ██   ██ ██          ██      ████   ██
	███████ ██      ██    ██ ██████  █████       █████   ██ ██  ██
	     ██ ██      ██    ██ ██      ██          ██      ██  ██ ██
	███████  ██████  ██████  ██      ███████     ██      ██   ████
	*/

	$scope.selectIteration = function (iteration) {
		$scope.resultMode = 'image';
		$scope.selectedIteration = iteration;
		$scope.designExplorer.populateIterationTable($('#selected-iteration-info'),iteration);
		$scope.designExplorer.graphs.parcoords.highlight([iteration]);
	};

	$scope.set2dMode = function () {
		$scope.resultMode = 'image';
	};

	$scope.set3dMode = function () {
		if (!$scope.selectedIteration) return;
		$scope.resultMode = '3d';
		d3.json($scope.selectedIteration.threeD, function (data) {
			spect.loadNewModel(data);
		});
		$timeout(function () {
			$('#spectacles-container')
				.trigger('resize');
		});
	};



	/*
	██     ██  █████  ████████  ██████ ██   ██
	██     ██ ██   ██    ██    ██      ██   ██
	██  █  ██ ███████    ██    ██      ███████
	██ ███ ██ ██   ██    ██    ██      ██   ██
	 ███ ███  ██   ██    ██     ██████ ██   ██
	*/

	$scope.$watch('designExplorer', drawDesignExplorer);


	/*
	 █████  ███    ██  ██████  ███    ██
	██   ██ ████   ██ ██    ██ ████   ██
	███████ ██ ██  ██ ██    ██ ██ ██  ██
	██   ██ ██  ██ ██ ██    ██ ██  ██ ██
	██   ██ ██   ████  ██████  ██   ████
	*/

	function drawDesignExplorer() {
		$timeout(function () {
			if ($scope.designExplorer) {
				$scope.designExplorer.drawParallelCoordinates('#parallel-coords');
				$scope.designExplorer.graphs.parcoords.on('brush', setFilteredEntries);
				setFilteredEntries();
			}
		});
	}

	function setFilteredEntries(entries) {
		$scope.filteredEntries = entries || $scope.designExplorer.getData();
		$timeout(function () {
			$scope.$apply();
		});
	}

});
