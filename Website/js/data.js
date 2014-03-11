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
      $scope.calendars = calendarSingleton.getInstance().getCalendarData();
  }])
    .controller('Drivers', ['$scope', '$firebase',
  function ($scope, $firebase) {
      $scope.drivers = driverSingleton.getInstance().getDriverData();
      $scope.range = [1, 2, 3, 4, 5, 6]; // number of driver selections
  }])
     .controller('Users', ['$scope', '$firebase',
  function ($scope, $firebase) {    
      console.log('Fetch all users');
      $scope.users = [];
      var firebaseRef = firebaseSingleton.getInstance().getReference();
      var ref = firebaseRef.child("users");      
      console.log("Users ref=" + ref);      
      ref.on('value', function (dataSnapshot) {          
           angular.forEach(dataSnapshot.val(), function (user) {               
              console.log(user);
              user.totalpoints = 0;
              
              angular.forEach(user.bets, function (bet) {
                  console.log(bet.totalpoints);
                  if (bet.totalpoints === undefined) {

                  } else {
                      user.totalpoints += bet.totalpoints;
                  }                  
                  
              });
              console.log(user.totalpoints);
              $scope.users.push(user);
           });
           
      });
      
  }])
    .controller('Bets', ['$scope', '$firebase',
  function ($scope, $firebase) {    
      console.log('Bets: User ' + myUser.userid + ", email: " + myUser.email);
      $scope.bets = [];
      var firebaseRef = firebaseSingleton.getInstance().getReference();
      var ref = firebaseRef.child('users/' + myUser.userid + "/bets");

      $scope.bets = $firebase(ref);
      console.log("Bets ref=" + ref);

      $scope.$watch('bets', function () {
          var totalpoints = 0;
          
          angular.forEach($scope.bets, function (bet) {              
              if (angular.isObject(bet)) {                  
                  totalpoints += bet.totalpoints;
              }
          })

          $scope.totalpoints = totalpoints;          
      }, true);
      console.log($scope.totalpoints);
  }]);

function addBet($firebase) {

    var betslip = new Object();
    betslip.gp_id = $("#gp_id").val();
    betslip.gp_name = $("#gp_id option:selected").text();
    
    console.log("gp_id = " + betslip.gp_id);

    if (myUser == -1) {
        $("#dialog-login").modal('show');
    } else if (betslip.gp_id === "") {
        $("#dialog-choose-gp").modal('show');
    } else {
        var firebaseRef = firebaseSingleton.getInstance().getReference();
        var ref = firebaseRef.child('users/' + myUser.userid);
 
        betslip.userid = ref.name();
        betslip.qbets = [];
        betslip.gpbets = [];
        betslip.totalpoints = -1; // -1 not calculated yet
        betslip.date = new Date().toJSON();
        var fastestlap = new Object();
        fastestlap.d_id = $("#fastest-lap").val();
        fastestlap.d_info = $("#fastest-lap option:selected").text();
        betslip.fastestlap = fastestlap;

        var text = "<div class='row'><div class='col-sm-6'><span class='label label-default'>Kilpailu<br/></span>" + betslip.gp_name + "</div><div class='col-sm-6'><span/></div></div><div class='row'>";
        var qhtml = "<div class='col-sm-6'><span class='label label-default'>Aika-ajo</br></span>";
        var gphtml = "<div class='col-sm-6'><span class='label label-default'>Kilpailu</br></span>";
        for (i = 1; i <= 6; i++) {
            console.log("#q_id_" + i + "=" + $("#q_id_" + i).val());
            var qbet = new Object();
            qbet.points = -1; // -1 not calculated yet
            qbet.position = i;
            qbet.driverid = $("#q_id_" + i).val();
            qbet.info = $("#q_id_" + i + " option:selected").text();
            qhtml = qhtml.concat(qbet.position + ". " + qbet.info + "</br>");

            var gpbet = new Object();
            gpbet.points = -1; // -1 not calculated yet
            gpbet.position = i;
            gpbet.driverid = $("#gp_id_" + i).val();
            gpbet.info = $("#gp_id_" + i + " option:selected").text();
            gphtml = gphtml.concat(gpbet.position + ". " + gpbet.info + "<br/>");
            
            betslip.qbets.push(qbet);
            betslip.gpbets.push(gpbet);
        }
        qhtml = qhtml.concat("</div>");
        gphtml = gphtml.concat("</div>");
        flhtml = "<div class='row'><div class='col-sm-6'><span class='label label-default'>Nopein kierrosaika</span><br />" + betslip.fastestlap.d_info + "</div></div>"        
        text = text.concat(qhtml, gphtml, "</div>", flhtml);
        console.log(text);

        console.log(JSON.stringify(betslip));
        var betref = ref.child("bets/" + betslip.gp_id);
        betref.set(betslip);

        // everything went ok - now show summary
        
        $("#dialog-bet-title").html("Vetosi on tallennettu.")
        $("#dialog-bet-body").html(text);
        $("#dialog-bet").modal('show');
    }
}

function showBet(object) {
    var gp_id = object.id.split('_')[2];
    console.log(gp_id);
    var firebaseRef = firebaseSingleton.getInstance().getReference();
    var ref = firebaseRef.child('users/' + myUser.userid + "/bets/" + gp_id);

    ref.on('value', function (dataSnapshot) {
        // code to handle new value.    
        var betslip = dataSnapshot.val();
        console.log(betslip);        
        var text = "<div class='row'><div class='col-sm-6'><span class='label label-default'>Kilpailu</span><br/>" + betslip.gp_name + "</div><div class='col-sm-6'><span/></div></div><div class='row'>";
        var qhtml = "<div class='col-sm-6'><span class='label label-default'>Aika-ajo</span><br/>";
        var gphtml = "<div class='col-sm-6'><span class='label label-default'>Kilpailu</span><br/>";
        for (val in betslip.qbets) {
            qbet = betslip.qbets[val];
            qhtml = qhtml.concat(qbet.position + ". " + qbet.info + "</br>");
        }
        for (val in betslip.gpbets) {
            gpbet = betslip.gpbets[val];
            gphtml = gphtml.concat(gpbet.position + ". " + gpbet.info + "</br>");
        }
        qhtml = qhtml.concat("</div>");
        gphtml = gphtml.concat("</div>");
        flhtml = "<div class='row'><div class='col-sm-6'><span class='label label-default'>Nopein kierrosaika</span><br />" + betslip.fastestlap.d_info + "</div></div>"
        
        scorehtml = "<div class='row'><div class='col-sm-6'><span class='label label-default'>Pisteet</span><br />" + ((betslip.totalpoints < 0) ? 'Ei viel&auml; tuloksia' : betslip.totalpoints) + "</div></div>";
        text = text.concat(qhtml, gphtml, "</div>", flhtml, scorehtml);
        
        console.log(text);

        var betDate = new Date(betslip.date);
        $("#dialog-bet-title").html("Aikaisempi vetolippu " + myformatDate(betDate));
        $("#dialog-bet-body").html(text);
        $("#dialog-bet").modal('show');

    });
    ref.off();
}

function myformatDate(date) {
    return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
}