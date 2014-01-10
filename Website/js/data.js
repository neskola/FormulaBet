function CalendarDataCtrl($scope, $http) {

    $scope.entries = [];

    $http.get('data/calendar.json')
      .then(function (result) {
          $scope.entries = result.data;
    });

}

function DriverDataCtrl($scope, $http) {

    $scope.entries = [];

    $http.get('data/drivers.json')
      .then(function (result) {
          $scope.entries = result.data;
      });
}

function LatestResults($scope, $http) {
    $scope.entries = [ 
        { user : "ile", qpoints: 5, gpoints : 15 }, 
        { user : "niki", qpoints: 3, gpoints: 11 } ];
}