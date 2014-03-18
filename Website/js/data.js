function mySort(obj) {
    var result = [];
    angular.forEach(obj, function (val, key) {
        if (angular.isObject(val)) {
            result.push(val);
        }
    });
    return result;
}

// Initialize angular module

angular.module('f1app', ['firebase'])
      .filter("toArray", function () {
          return function (obj) {
              return mySort(obj);
          };
      }) // Controller Calendar
    .controller('Calendar', ['$scope', '$firebase',
  function ($scope, $firebase) {
      // year should be fetched from this year      
      var calendardatas = calendarSingleton.getInstance().getCalendarData();
      $scope.calendars = [];
      angular.forEach(calendardatas, function (calendardata) {
          if (calendardata.gp_status > 1) {
              calendardata.disabled = "disabled";
          } else {
              $scope.calendars.push(calendardata);
          }

          console.log(JSON.stringify(calendardata));
      })

  }]) // controller Calendar ends
      // controller Drivers
    .controller('Drivers', ['$scope', '$firebase',
  function ($scope, $firebase) {
      $scope.drivers = driverSingleton.getInstance().getDriverData();
      $scope.range = [1, 2, 3, 4, 5, 6]; // number of driver selections
  }]) // controller Drivers ends
      // Controller Scores
     .controller('Scores', ['$scope', '$firebase',
  function ($scope, $firebase) {
      console.log('Fetch all users and scores');

      $scope.users = [];      
      $scope.scores = [];
      var calculatedbets = {};

      var calendardatas = calendarSingleton.getInstance().getCalendarData();

      var firebaseRef = firebaseSingleton.getInstance().getReference();
      var ref = firebaseRef.child("users");
      console.log("Users ref=" + ref);

      ref.on('value', function (dataSnapshot) {
          var tmpusers = [];
          var tmpscores = [];
          angular.forEach(dataSnapshot.val(), function (user) {
              console.log(user);
              user.totalpoints = 0;
              if (user.name.indexOf(" ") > 0) {
                  user.listingname = user.name.split(" ")[0] + user.name.split(" ")[1].charAt(0);
              } else {
                  user.listingname = user.name;
              }
              
              user.calculatedbets = [];

              angular.forEach(user.bets, function (bet) {                  
                  if (bet.totalpoints === undefined || bet.totalpoints < 0) {
                      console.log("Bet not calculated yet.");                                            
                  } else {                      
                      user.totalpoints += bet.totalpoints;
                      bet.label = (bet.status < -1) ? 'label label-warning' : 'label label-info';
                      bet.info = (bet.status < -1) ? 'Veikkaus joko uupuu tai on virheellinen.' : 'Veikkaus ok.';                      
                      user.calculatedbets.push(bet);                      
                      if (calculatedbets[bet.gp_id]) {                          
                          calculatedbets[bet.gp_id].push(bet);
                      } else {                          
                          calculatedbets[bet.gp_id] = [];
                          calculatedbets[bet.gp_id].push(bet);
                      }
                  }
              });                       
              tmpusers.push(user);
          });
          angular.forEach(calendardatas, function (calendardata) {
              if (calendardata.gp_status > 2) { // gp is closed and calculated
                  calendardata.bets = [];
                  console.log("GP " + calendardata.gp_id + " " + calendardata.gp_name + " is closed and calculated.");
                  angular.forEach(calculatedbets[calendardata.gp_id], function (bet) {             
                      if (calendardata.gp_id == bet.gp_id) {
                          calendardata.bets.push(bet);
                      }
                  });                  
                  tmpscores.push(calendardata);
                  //console.log(JSON.stringify(calendardata));
              } else {
                  //console.log("GP " + calendardata.gp_id + " " + calendardata.gp_name + " is not closed and calculated.");
              }
          });
          $scope.users = tmpusers;
          $scope.scores = tmpscores;
          console.log(JSON.stringify(tmpusers));
          console.log(JSON.stringify(tmpscores));
          console.log("Scores are ready, return true");
          return true;
      });
      return false;
  }]) // controller Scores ends.
      // controller Bets    
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
// controller bets ends.

// Angular module ends.

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
            qhtml = qhtml.concat(qbet.position + ". " + qbet.info + " " + ((qbet.points < 0) ? '' : qbet.points) + "</br>");
        }
        for (val in betslip.gpbets) {
            gpbet = betslip.gpbets[val];
            gphtml = gphtml.concat(gpbet.position + ". " + gpbet.info + " " + ((gpbet.points < 0) ? '' : gpbet.points) + "</br>");
        }
        qhtml = qhtml.concat("</div>");
        gphtml = gphtml.concat("</div>");
        flhtml = "<div class='row'><div class='col-sm-6'><span class='label label-default'>Nopein kierrosaika</span><br />" + betslip.fastestlap.d_info + " " + ((betslip.fastestlap.points < 0) ? '': betslip.fastestlap.points) + "</div></div>"

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