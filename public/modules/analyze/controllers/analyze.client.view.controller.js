(function() {
  'use strict';

  angular
    .module('analyze')
    .controller('AnalyzeViewController', AnalyzeViewController);

  AnalyzeViewController.$inject = ['$rootScope', '$scope', '$state', '$location', 'Authentication', 'httpq', 'analysisData', 'maufConfig', 'tableConfig', 'graphConfig', 'mapConfig'];

  function AnalyzeViewController($rootScope, $scope, $state, $location, Authentication, $httpq, analysisData, analysisConfig, maufConfig, tableConfig, graphConfig, mapConfig) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.currentRoute = 'Analyze';
    // console.log($scope.currentRoute);
    // $state.go('analyze.layout'); // Required to get nested named views to populate correctly. Not routing correctly from routes.js without this.

    // console.log(analysisData);
    // console.log(analysisConfig);
    // console.log(maufConfig);
    // console.log(tableConfig);
    // console.log(graphConfig);
    // console.log(mapConfig);

    // $scope.analysisData = analysisData;

    // Manual data loading.
    // $scope.parseCsvData = parseCsvData;
    $scope.sourceFile_A = './data/BSGAM_Heads_Wells_Drains_Zones_Master.csv';
    // $scope.sourceData = {};

    $httpq.get($scope.sourceFile_A)
      .then(function(data) {
        // ...
      })
      .catch(function(data, status) {
        console.error('Load error', response.status, response.data);
      })
      .finally(function() {
        // console.log($scope.sourceData);
        // Data is available here to inject into sub-controllers for Graph, Map and Datatable.
        // console.log('Analysis data loaded. Broadcasting...');
        // $scope.$broadcast('analysisDataLoaded', $scope.sourceData);

        // Works here, does not work in stateChangeSuccess... WTH??
        $scope.$broadcast('analysisDataLoaded', analysisData.datagridConfig.datasources.tabledata.datum);
      });

    $scope.$on('$stateChangeSuccess', function() {
      // console.log('stateChangeSuccess');
      // console.log(analysisData);
      // $scope.$broadcast('analysisDataLoaded', analysisData);

      // $scope.$broadcast('analysisDataLoaded', { analysisData, analysisConfig, maufConfig, tableConfig, graphConfig, mapConfig });
      // $scope.$broadcast('analysisDataLoaded', {});

      // $scope.analysisData = analysisData;
      // $scope.$broadcast('analysisDataLoaded', analysisData.datagridConfig.datasources.tabledata.datum);

      // $scope.$broadcast('analysisDataLoaded', $scope.analysisData);
    });

    // PubSub between Graph and Map.
    $scope.$on('currentGraphTarget', function(event, args) {
      // console.log('you touched the graph at record: ' + args);
      $rootScope.$broadcast('addMapTarget', args);
    });

    $scope.$on('clearGraphTarget', function(event, args) {
      // console.log('you stopped touching the graph record: ' + args[0]);
      $rootScope.$broadcast('removeMapTarget', args);
    });

    // PubSub between Datatable and Graph.
    $scope.$on('currentDatatableTarget', function(event, args) {
      // console.log('you touched the datatable at row: ' + args[0]);
      $rootScope.$broadcast('newDatatableTarget', args[0]);
    });

    $scope.$on('clearDatatableTarget', function(event, args) {
      // console.log('you stopped touching the datatable row: ' + args[0]);
      $rootScope.$broadcast('removeDatatableTarget', args[0]);
    });
  }

})();
