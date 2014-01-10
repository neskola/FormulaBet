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
