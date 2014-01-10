


function CalendarDataCtrl($scope, $http) {

    $scope.entries = [];

    $http.get('data/calendar.json')
      .then(function (result) {
          $scope.entries = result.data;
    });

    /*$.getJSON("data/calendar.json", function (data) {

        $.each(data, function (key, val) {
            if (val && typeof val === 'object') {

                $scope.entries = data;
            }
        });
        alert('bar' + $scope.entries);
    });*/

}


// {text:'workshop', min:'-15', max:'15'},
