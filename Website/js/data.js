
function mySort(obj) {
    var result = [];
    angular.forEach(obj, function (val, key) {
        if (angular.isObject(val)) {
            result.push(val);
        }

    });
    return result;
}

angular.module('f1app', ['firebase'])
      .filter("toArray", function () {
          return function (obj) {
              return mySort(obj);
          };
      })
    .controller('Calendar', ['$scope', '$firebase',
  function ($scope, $firebase) {
      // year should be fetched from this year
      var ref = new Firebase('https://f1kaapo.firebaseio.com/calendar/2014');
      $scope.calendars = $firebase(ref.limit(20));                  
  }])
    .controller('Drivers', ['$scope', '$firebase',
  function ($scope, $firebase) {
      // year should be fetched from this year
      var ref = new Firebase('https://f1kaapo.firebaseio.com/drivers/2014');
      $scope.drivers = $firebase(ref);      
  }]);
    
angular.module('drivers', ['firebase'])
      .filter("toArray", function () {
          return function (obj) {
              return mySort(obj);
          };
      })
    .controller('Drivers', ['$scope', '$firebase',
  function ($scope, $firebase) {
      // year should be fetched from this year
      var ref = new Firebase('https://f1kaapo.firebaseio.com/drivers/2014');
      $scope.drivers = $firebase(ref);
      $scope.range = _.range(1, 6);
  }]);
