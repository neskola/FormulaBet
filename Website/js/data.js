
angular.module('calendar', ['firebase'])
      .filter("toArray", function () {
          return function (obj) {
              var result = [];
              angular.forEach(obj, function (val, key) {                  
                  result.push(val);                  
              });              
              return result;
          };
      })
    .controller('Calendar', ['$scope', '$firebase',
  function ($scope, $firebase) {
      // year should be fetched from this year
      var ref = new Firebase('https://f1kaapo.firebaseio.com/calendar/2014');
      $scope.calendars = $firebase(ref.limit(20));
      $scope.predicate = 'gp_number';

  }]);
    
angular.module('drivers', ['firebase'])
      .filter("toArray", function () {
          return function (obj) {
              var result = [];
              angular.forEach(obj, function (val, key) {
                  result.push(val);
              });
              return result;
          };
      })
    .controller('Drivers', ['$scope', '$firebase',
  function ($scope, $firebase) {
      // year should be fetched from this year
      var ref = new Firebase('https://f1kaapo.firebaseio.com/drivers/2014');
      $scope.drivers = $firebase(ref);
      $scope.predicate = '-d_id';
  }]);
