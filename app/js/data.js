function compare(a, b) {
    if (a.totalpoints < b.totalpoints)
        return -1;
    if (a.totalpoints > b.totalpoints)
        return 1;
    if (a.totalpoints == b.totalpoints) {
        if (a.hiddenpoints < b.hiddenpoints)
            return -1;
        if (a.hiddenpoints > b.hiddenpoints)
            return 1;
        return 0;
    }
    return 0;
}

function reverseCompare(a, b) {
    if (a.totalpoints < b.totalpoints)
        return 1;
    if (a.totalpoints > b.totalpoints)
        return -1;
    if (a.totalpoints == b.totalpoints) {
        if (a.hiddenpoints < b.hiddenpoints)
            return 1;
        if (a.hiddenpoints > b.hiddenpoints)
            return -1;
        return 0;
    }
    return 0;
}

function reverseCompareNoHidden(a, b) {
    if (a.totalpoints < b.totalpoints)
        return 1;
    if (a.totalpoints > b.totalpoints)
        return -1;
    return 0;
}


function mySort(obj) {
    var result = [];
    angular.forEach(obj, function (val, key) {
        if (angular.isObject(val)) {
            result.push(val);
        }
    });
    return result;
}

function mySortByPoints(obj) {
    var result = [];
    var usersid = [];
    angular.forEach(obj, function (val, key) {
        if (angular.isObject(val)) {
            result.push(val);
        }
    });
    result.sort(reverseCompare);
    return result;
}

// Initialize angular module

angular.module('f1app', ['firebase'])
      .filter("toArray", function () {
          return function (obj) {
              return mySort(obj);
          };
      }).filter("sortByPoints", function () {
          return function (obj) {
              return mySortByPoints(obj);
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
              $scope.selected_gp_scores = calendardata.scores;
          }
      })

  }]) // controller Calendar ends
    .controller('GpScores', ['$scope', '$firebase',
  function ($scope, $firebase) {
      var calendardatas = calendarSingleton.getInstance().getCalendarData();
      $scope.gpscores = [];      
      $scope.selected_gp_score = null;
      $scope.selected_gp_results = null;
      $scope.selected_gp_id = null;

	  // hack to fix gp_id ordering with current seasons gp_number
	  var hiGpNumber = 0;	  
	  
      if ($scope.gpscores.length == 0) {
          console.log($scope.gpscores.length);
          angular.forEach(calendardatas, function (calendardata) {
              if (calendardata.gp_status >= 3) {
                  $scope.gpscores.push(calendardata);
				  if (calendardata.gp_number > hiGpNumber) {
						hiGpNumber = calendardata.gp_number;						
						$scope.selected_gp_score = calendardata.scores;
						$scope.selected_gp_results = calendardata.results;
						$scope.selected_gp_id = calendardata.gp_id;
				  }
              }
          })
      }

      $scope.selectedGpData = function () {          
          angular.forEach($scope.gpscores, function (gpscore) {              
              if (gpscore.gp_id == $scope.selected_gp_id) {
                  $scope.selected_gp_score = gpscore.scores;
                  $scope.selected_gp_results = gpscore.results;
              }
          })
          
          $scope.$watch('selected_gp_score', function () {
              logger.debug("Results for gp " + $scope.selected_gp_id, JSON.stringify($scope.selected_gp_results));
          }, true);
      }


  }]) // controller gp scores ends
      // controller Drivers
    .controller('Drivers', ['$scope', '$firebase',
  function ($scope, $firebase) {
      $scope.drivers = driverSingleton.getInstance().getDriverData();
      $scope.range = [1, 2, 3, 4, 5, 6]; // number of driver selections
  }]) // controller Drivers ends
      // Controller Scores
     .controller('Scores', ['$scope', '$firebase',
  function ($scope, $firebase) {	  
	  
      var firebaseRef = firebaseSingleton.getInstance().getReference();
      var ref = firebaseRef.child("users");
      
	  $scope.users = $firebase(ref);
	  $scope.highestTotalPoints = 0;
	  
      $scope.$watch('users', function () {
          angular.forEach($scope.users, function (user) {
              user.totalpoints = 0;
              user.hiddenpoints = 0;
              if (angular.isObject(user)) {
                  angular.forEach(user.scores, function (score) {
                      if (angular.isObject(score)) {
                          user.hiddenpoints += score.hiddenpoints;
                          user.totalpoints += score.totalpoints;
                      }
                  })
              }
			  if (user.totalpoints > $scope.highestTotalPoints) {
				$scope.highestTotalPoints = user.totalpoints;
			  }
          })
      }, true);


  }]) // controller Scores ends.
      // controller User
    .controller('User', ['$scope', '$firebase',
        function ($scope, $firebase) {

            logger.debug('Bets: User ' + myUser.userid + ", email: " + myUser.email);
            $scope.bets = [];
            $scope.switchStatus = 0;
            var firebaseRef = firebaseSingleton.getInstance().getReference();
            var ref = firebaseRef.child('users/' + myUser.userid + "/bets");

            $scope.bets = $firebase(ref);
            $scope.$watch('bets', function () {
                var doubleAvailable = true;
                angular.forEach($scope.bets, function (bet) {
                    if (angular.isObject(bet) && bet.doubled) {
                        logger.info("Found double bet " + JSON.stringify(bet));
                        doubleAvailable = false;
                        $('#double-bet').hide();
                        $('#doubleIsAvailable').hide();
                        $('#doubleNotAvailable').show();
                    }
                })
                if (doubleAvailable) {
                    $('#doubleNotAvailable').hide();
                }
            }, true);

        }])
      // controller user ends
      // controller Bets    
    .controller('Bets', ['$scope', '$firebase',
  function ($scope, $firebase) {
      logger.debug('Bets: User ' + myUser.userid + ", email: " + myUser.email);
      $scope.bets = [];
      $scope.switchStatus = 0;
      var firebaseRef = firebaseSingleton.getInstance().getReference();
      var ref = firebaseRef.child('users/' + myUser.userid + "/bets");

      $scope.bets = $firebase(ref);

      $scope.$watch('bets', function () {
          var totalpoints = 0;

          angular.forEach($scope.bets, function (bet) {
              if (angular.isObject(bet)) {
                  totalpoints += bet.totalpoints;
              }
          })

          $scope.totalpoints = totalpoints;
      }, true);

  }]);
// controller bets ends.

// Angular module ends.

function addBet($firebase) {

    var betslip = new Object();
    betslip.gp_id = $("#gp_id").val();
    betslip.gp_name = $("#gp_id option:selected").text();

    logger.info("gp_id = " + betslip.gp_id);

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
        fastestlap.points = 0;
        betslip.fastestlap = fastestlap;
        betslip.doubled = $("#double-bet").is(':checked');

        var text = "<div class='row'><div class='col-sm-6'><span class='label label-default'>Kilpailu<br/></span>" + betslip.gp_name + "</div><div class='col-sm-6'><span/></div></div><div class='row'>";
        var qhtml = "<div class='col-sm-6'><span class='label label-default'>Aika-ajo</br></span>";
        var gphtml = "<div class='col-sm-6'><span class='label label-default'>Kilpailu</br></span>";
        for (i = 1; i <= 6; i++) {
            logger.debug("#q_id_" + i + "=" + $("#q_id_" + i).val());
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
        flhtml = "<div class='row'><div class='col-sm-6'><span class='label label-default'>Nopein kierrosaika</span><br />" + betslip.fastestlap.d_info + "</div>";
        doubledhtml = "<div class='row'><div class='col-sm-6'>";
        if ( betslip.doubled == true) {
            doubledhtml += "<span class='label label-danger'>Tuplattu veto</span>";
        } else {
            doubledhtml += "<span class='label label-default'>Ei tuplausta</span>";
        }
        doubledhtml += "</div>";
        text = text.concat(qhtml, gphtml, "</div>", flhtml, doubledhtml);

        logger.debug(JSON.stringify(betslip));
        var betref = ref.child("bets/" + betslip.gp_id);
        
        var onComplete = function(error) {
            if (error) {
                // Something went wrong
                logger.info('Bet synchronization failed');
                $("#dialog-bet-title").html("Vetosi epäonnistui.")
                $("#dialog-bet-body").html("Yritä myöhemmin tai lähetä vetosi tekstiviestinä ylläpitäjälle 0456517228.");
                $("#dialog-bet").modal('show');
                
            } else {
                // everything went ok - now show summary
                logger.info('Bet synchronization succeeded');
                $("#dialog-bet-title").html("Vetosi on tallennettu.")
                $("#dialog-bet-body").html(text);
                $("#dialog-bet").modal('show');

                if (betslip.doubled) {
                    $("#double-bet").prop('disabled', true);
                    $("#betslip").trigger('reset');
                    $("#double-bet").hide();
                    $("#doubleIsAvailable").hide();
                    $("#doubleNotAvailable").show();
                    logger.info("Set users doubled available to false");
                    ref.doubleAvailable = false;
                }
            }
        };
        
        betref.set(betslip, onComplete);

    }
}

function showBet(object) {
    var gp_id = object.id.split('_')[2];
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
        flhtml = "<div class='row'><div class='col-sm-6'><span class='label label-default'>Nopein kierrosaika</span><br />" + betslip.fastestlap.d_info + " " + ((betslip.fastestlap.points < 0) ? '' : betslip.fastestlap.points) + "</div>"
        doubledhtml = "<div class='row'><div class='col-sm-6'>";
        if ( betslip.doubled == true) {
            doubledhtml += "<span class='label label-danger'>Tuplattu veto</span>";
        } else {
            doubledhtml += "<span class='label label-default'>Ei tuplausta</span>";
        }
        doubledhtml += "</div>";

        scorehtml = "<div class='row'><div class='col-sm-6'><span class='label label-default'>Pisteet</span><br />" + ((betslip.totalpoints < 0) ? 'Ei viel&auml; tuloksia' : betslip.totalpoints) + "</div></div>";
        text = text.concat(qhtml, gphtml, "</div>", flhtml, doubledhtml, scorehtml);

        logger.debug(JSON.stringify(betslip));

        $('#btnCopyBet').attr("onclick", "copyBet('" + gp_id + "')");

        var betDate = new Date(betslip.date);
        $("#dialog-bet-title").html("Aikaisempi vetolippu " + myformatDate(betDate));
        $("#dialog-bet-body").html(text);
        $("#dialog-bet").modal('show');

    });
    ref.off();
}

function copyBet(gp_id) {
    console.log("copy bet " + gp_id);
    var firebaseRef = firebaseSingleton.getInstance().getReference();
    var ref = firebaseRef.child('users/' + myUser.userid + "/bets/" + gp_id);

    ref.on('value', function (dataSnapshot) {
        // code to handle new value.    
        var betslip = dataSnapshot.val();
        console.log(betslip);
        for (val in betslip.qbets) {
            bet = betslip.qbets[val];

            console.log("ql" + JSON.stringify(bet));
            $("#q_id_" + bet.position + " option:contains(" + bet.driverid + ")").attr('selected', true);
            console.log("#q_id_" + bet.position + " option:contains(" + bet.driverid + ")");
        }
        for (val in betslip.gpbets) {
            bet = betslip.gpbets[val];
            console.log("gp" + JSON.stringify(bet));
            $("#gp_id_" + bet.position + " option:contains(" + bet.driverid + ")").attr('selected', true);
            console.log("#gp_id_" + bet.position + " option:contains(" + bet.driverid + ")");
        }

    });
    ref.off();
}

function myformatDate(date) {
    return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
}