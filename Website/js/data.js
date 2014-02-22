var f1App = angular.module("F1App", ["firebase"]);

f1App.controller('CalendarDataCtrl', function ($scope, angularFire) {
    alert('foo');
    var ref;
    ref = new Firebase("https://f1kaapo.firebaseio.com/calendar");
    $scope.calendars = [];

    $scope.addCalendar = function() {
        $scope.calendar.push($scope.newCalendar);
        return $scope.newProp = "";
    };

    return angularFire(ref, $scope, "calendars");
});
    
