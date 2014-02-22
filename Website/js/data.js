
angular.module('calendar', ['firebase']).controller('Calendar', ['$scope', '$firebase',
  function ($scope, $firebase) {
      var ref = new Firebase('https://f1kaapo.firebaseio.com/calendar/2014');
      $scope.calendars = $firebase(ref.limit(20));
      $scope.predicate = 'gp_number';

/*      $scope.addCalendar = function () {
          $scope.calendars.$add({
              from: $scope.calendar, content: $scope.calendar.gp_name
          });
          $scope.calendars = "";
      }
*/
  }]);
    
angular.module('drivers', ['firebase']).controller('Drivers', ['$scope', '$firebase',
  function ($scope, $firebase) {
      var ref = new Firebase('https://f1kaapo.firebaseio.com/drivers/2014');
      $scope.drivers = $firebase(ref);
      $scope.predicate = 'd_team';
  }]);
