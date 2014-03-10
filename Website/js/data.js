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
      // var ref = new Firebase('https://f1kaapo.firebaseio.com/calendar/2014');
      // $scope.calendars = $firebase(ref.limit(20));
      $scope.calendars = [{
          'gp_id': '914',
          'gp_date': '2014-03-16T17:00+11:00',
          'gp_number': 1,
          'gp_name': ' 2014 FORMULA 1 ROLEX AUSTRALIAN GRAND PRIX (Melbourne)  ',
          'gp_year': '2014',
          'gp_short_name': 'Melbourne',
          'gp_qual_date': '2014-03-15T17:00+11:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Australia.svg/125px-Flag_of_Australia.svg.png'
      }, {
          'gp_id': '915',
          'gp_date': '2014-03-30T16:00+08:00',
          'gp_number': 2,
          'gp_name': ' 2014 FORMULA 1 PETRONAS MALAYSIA GRAND PRIX (Kuala Lumpur)  ',
          'gp_year': '2014',
          'gp_short_name': 'Kuala Lumpur',
          'gp_qual_date': '2014-03-29T16:00+08:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Flag_of_Kuala_Lumpur_Malaysia.svg/100px-Flag_of_Kuala_Lumpur_Malaysia.svg.png'
      }, {
          'gp_id': '916',
          'gp_date': '2014-04-06T18:00+03:00',
          'gp_number': 3,
          'gp_name': ' 2014 FORMULA 1 GULF AIR BAHRAIN GRAND PRIX (Sakhir)  ',
          'gp_year': '2014',
          'gp_short_name': 'Sakhir',
          'gp_qual_date': '2014-04-05T18:00+03:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Bahrain.svg/125px-Flag_of_Bahrain.svg.png'
      }, {
          'gp_id': '917',
          'gp_date': '2014-04-20T15:00+08:00',
          'gp_number': 4,
          'gp_name': ' 2014 FORMULA 1 UBS CHINESE GRAND PRIX (Shanghai)  ',
          'gp_year': '2014',
          'gp_short_name': 'Shanghai',
          'gp_qual_date': '2014-04-19T14:00+08:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/125px-Flag_of_the_People%27s_Republic_of_China.svg.png'
      }, {
          'gp_id': '919',
          'gp_date': '2014-05-11T14:00+02:00',
          'gp_number': 5,
          'gp_name': ' FORMULA 1 GRAN PREMIO DE ESPAÑA PIRELLI 2014 (Catalunya)  ',
          'gp_year': '2014',
          'gp_short_name': 'Catalunya',
          'gp_qual_date': '2014-05-10T14:00+02:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/125px-Flag_of_Spain.svg.png'
      }, {
          'gp_id': '920',
          'gp_date': '2014-05-25T14:00+02:00',
          'gp_number': 6,
          'gp_name': ' FORMULA 1 GRAND PRIX DE MONACO 2014 (Monte Carlo)  ',
          'gp_year': '2014',
          'gp_short_name': 'Monte Carlo',
          'gp_qual_date': '2014-05-24T14:00+02:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Brasao_montecarlo.jpg/100px-Brasao_montecarlo.jpg'
      }, {
          'gp_id': '922',
          'gp_date': '2014-06-08T14:00-04:00',
          'gp_number': 7,
          'gp_name': ' FORMULA 1 GRAND PRIX DU CANADA 2014 (Montréal)  ',
          'gp_year': '2014',
          'gp_short_name': 'Montreal',
          'gp_qual_date': '2014-06-07T13:00-04:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Canada.svg/125px-Flag_of_Canada.svg.png'
      }, {
          'gp_id': '923',
          'gp_date': '2014-06-22T14:00+02:00',
          'gp_number': 8,
          'gp_name': ' FORMULA 1 GROSSER PREIS VON ÖSTERREICH 2014 (Spielberg)  ',
          'gp_year': '2014',
          'gp_short_name': 'Spielberg',
          'gp_qual_date': '2014-06-21T14:00+02:00',
          'gp_flag_url' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_Austria.svg/125px-Flag_of_Austria.svg.png'
      }, {
          'gp_id': '924',
          'gp_date': '2014-07-06T13:00+01:00',
          'gp_number': 9,
          'gp_name': ' 2014 FORMULA 1 SANTANDER BRITISH GRAND PRIX (Silverstone)  ',
          'gp_year': '2014',
          'gp_short_name': 'Silverstone',
          'gp_qual_date': '2014-07-05T13:00+01:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/125px-Flag_of_the_United_Kingdom.svg.png'
      }, {
          'gp_id': '925',
          'gp_date': '2014-07-20T14:00+02:00',
          'gp_number': 10,
          'gp_name': ' FORMULA 1 GROSSER PREIS SANTANDER VON DEUTSCHLAND 2014 (Hockenheim)  ',
          'gp_year': '2014',
          'gp_short_name': 'Hockenheim',
          'gp_qual_date': '2014-07-19T14:00+02:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/125px-Flag_of_Germany.svg.png'
      }, {
          'gp_id': '926',
          'gp_date': '2014-07-27T14:00+02:00',
          'gp_number': 11,
          'gp_name': ' FORMULA 1 PIRELLI MAGYAR NAGYDÍJ 2014 (Budapest)  ',
          'gp_year': '2014',
          'gp_short_name': 'Budapest',
          'gp_qual_date': '2014-07-26T14:00+02:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/130px-Flag_of_Hungary.svg.png'
      }, {
          'gp_id': '927',
          'gp_date': '2014-08-24T14:00+02:00',
          'gp_number': 12,
          'gp_name': ' 2014 FORMULA 1 SHELL BELGIAN GRAND PRIX (Spa-Francorchamps)  ',
          'gp_year': '2014',
          'gp_short_name': 'Spa-Francorchamps',
          'gp_qual_date': '2014-08-23T14:00+02:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Belgium.svg/125px-Flag_of_Belgium.svg.png'
      }, {
          'gp_id': '928',
          'gp_date': '2014-09-07T14:00+02:00',
          'gp_number': 13,
          'gp_name': ' FORMULA 1 GRAN PREMIO D ITALIA 2014 (Monza)  ',
          'gp_year': '2014',
          'gp_short_name': 'Monza',
          'gp_qual_date': '2014-09-06T14:00+02:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/125px-Flag_of_Italy.svg.png'
      }, {
          'gp_id': '929',
          'gp_date': '2014-09-21T20:00+08:00',
          'gp_number': 14,
          'gp_name': ' 2014 FORMULA 1 SINGAPORE GRAND PRIX (Singapore)  ',
          'gp_year': '2014',
          'gp_short_name': 'Singapore',
          'gp_qual_date': '2014-09-20T21:00+08:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Singapore.svg/125px-Flag_of_Singapore.svg.png'
      }, {
          'gp_id': '931',
          'gp_date': '2014-10-05T15:00+09:00',
          'gp_number': 15,
          'gp_name': ' 2014 FORMULA 1 JAPANESE GRAND PRIX (Suzuka)  ',
          'gp_year': '2014',
          'gp_short_name': 'Suzuka',
          'gp_qual_date': '2014-10-04T14:00+09:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/125px-Flag_of_Japan.svg.png'
      }, {
          'gp_id': '930',
          'gp_date': '2014-10-12T15:00+04:00',
          'gp_number': 16,
          'gp_name': ' 2014 FORMULA 1 RUSSIAN GRAND PRIX (Sochi)  ',
          'gp_year': '2014',
          'gp_short_name': 'Sochi',
          'gp_qual_date': '2014-10-11T15:00+04:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/125px-Flag_of_Russia.svg.png'
      }, {
          'gp_id': '933',
          'gp_date': '2014-11-02T14:00-06:00',
          'gp_number': 17,
          'gp_name': ' 2014 FORMULA 1 UNITED STATES GRAND PRIX (Austin)  ',
          'gp_year': '2014',
          'gp_short_name': 'Austin',
          'gp_qual_date': '2014-11-01T13:00-06:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/125px-Flag_of_the_United_States.svg.png'
      }, {
          'gp_id': '935',
          'gp_date': '2014-11-09T14:00-02:00',
          'gp_number': 18,
          'gp_name': ' FORMULA 1 GRANDE PRÊMIO DO BRASIL 2014 (São Paulo)  ',
          'gp_year': '2014',
          'gp_short_name': 'Sao Paulo',
          'gp_qual_date': '2014-11-08T14:00-02:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/125px-Flag_of_Brazil.svg.png'
      }, {
          'gp_id': '932',
          'gp_date': '2014-11-23T17:00+04:00',
          'gp_number': 19,
          'gp_name': ' 2014 FORMULA 1 ETIHAD AIRWAYS ABU DHABI GRAND PRIX (Yas Marina)  ',
          'gp_year': '2014',
          'gp_short_name': 'Yas Marina',
          'gp_qual_date': '2014-11-22T17:00+04:00',
          'gp_flag_url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Flag_of_Abu_Dhabi.svg/100px-Flag_of_Abu_Dhabi.svg.png'
      }];


  }])
    .controller('Drivers', ['$scope', '$firebase',
  function ($scope, $firebase) {
      // year should be fetched from this year
      //var ref = new Firebase('https://f1kaapo.firebaseio.com/drivers/2014');
      //$scope.drivers = $firebase(ref);

      $scope.drivers = [{
          "d_id": "822",
          "d_team": "Red Bull Racing",
          "d_sort_id": "01",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_822.jpg",
          "d_name": "Sebastian Vettel"
      }, {
          "d_id": "857",
          "d_team": "Red Bull Racing",
          "d_sort_id": "02",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_857.jpg",
          "d_name": "Daniel Ricciardo"
      }, {
          "d_id": "887",
          "d_team": "Marussia",
          "d_sort_id": "20",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_887.jpg",
          "d_name": "Max Chilton"
      }, {
          "d_id": "809",
          "d_team": "Mercedes",
          "d_sort_id": "06",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_809.jpg",
          "d_name": "Nico Rosberg"
      }, {
          "d_id": "12",
          "d_team": "Ferrari",
          "d_sort_id": "04",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_12.jpg",
          "d_name": "Kimi Raikkonen"
      }, {
          "d_id": "838",
          "d_team": "Lotus",
          "d_sort_id": "07",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_838.jpg",
          "d_name": "Romain Grosjean"
      }, {
          "d_id": "862",
          "d_team": "Caterham",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_862.jpg",
          "d_name": "Marcus Ericsson"
      }, {
          "d_id": "837",
          "d_team": "Caterham",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_837.jpg",
          "d_name": "Kamui Kobayashi"
      }, {
          "d_id": "867",
          "d_team": "Force India",
          "d_sort_id": "15",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_867.jpg",
          "d_name": "Sergio Perez"
      }, {
          "d_id": "869",
          "d_team": "Lotus",
          "d_sort_id": "08",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_869.jpg",
          "d_name": "Pastor Maldonado"
      }, {
          "d_id": "30",
          "d_team": "Ferrari",
          "d_sort_id": "03",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_30.jpg",
          "d_name": "Fernando Alonso"
      }, {
          "d_id": "850",
          "d_team": "Marussia",
          "d_sort_id": "19",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_850.jpg",
          "d_name": "Jules Bianchi"
      }, {
          "d_id": "18",
          "d_team": "Williams",
          "d_sort_id": "11",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_18.jpg",
          "d_name": "Felipe Massa"
      }, {
          "d_id": "899",
          "d_team": "McLaren",
          "d_sort_id": "09",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_899.jpg",
          "d_name": "Kevin Magnussen"
      }, {
          "d_id": "854",
          "d_team": "Sauber",
          "d_sort_id": "13",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_854.jpg",
          "d_name": "Esteban Gutierrez"
      }, {
          "d_id": "6",
          "d_team": "McLaren",
          "d_sort_id": "10",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_6.jpg",
          "d_name": "Jenson Button"
      }, {
          "d_id": "870",
          "d_team": "Toro Rosso",
          "d_sort_id": "17",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_870.jpg",
          "d_name": "Jean-Eric Vergne"
      }, {
          "d_id": "906",
          "d_team": "Toro Rosso",
          "d_sort_id": "18",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_906.jpg",
          "d_name": "Daniil Kvyat"
      }, {
          "d_id": "840",
          "d_team": "Force India",
          "d_sort_id": "16",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_840.jpg",
          "d_name": "Nico Hulkenberg"
      }, {
          "d_id": "828",
          "d_team": "Mercedes",
          "d_sort_id": "05",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_828.jpg",
          "d_name": "Lewis Hamilton"
      }, {
          "d_id": "865",
          "d_team": "Williams",
          "d_sort_id": "12",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_865.jpg",
          "d_name": "Valtteri  Bottas"
      }, {
          "d_id": "818",
          "d_team": "Sauber",
          "d_sort_id": "14",
          "d_imgsrc": "http://www.formula1.com/photos/teams_and_drivers/driver_index/portrait/portrait_818.jpg",
          "d_name": "Adrian Sutil"
      }];

      $scope.range = [1, 2, 3, 4, 5, 6]; // number of driver selections
  }])
    .controller('Bets', ['$scope', '$firebase',
  function ($scope, $firebase) {    
      console.log('Bets: User ' + myUser.userid + ", email: " + myUser.email);
      $scope.bets = [];
      var ref = new Firebase('https://f1kaapo.firebaseio.com/users/' + myUser.userid + "/bets");
      $scope.bets = $firebase(ref);
      console.log(ref);
      console.log($scope.userbets);
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
        var ref = new Firebase('https://f1kaapo.firebaseio.com/users/' + myUser.userid);
 
        betslip.userid = ref.name();
        betslip.qbets = [];
        betslip.gpbets = [];
        betslip.date = new Date().toJSON();
        var fastestlap = new Object();
        fastestlap.d_id = $("#fastest-lap").val();
        fastestlap.d_info = $("#fastest-lap option:selected").text();
        betslip.fastestlap = fastestlap;

        var text = "<div class='row'><div class='col-sm-6'><span>Kilpailu: " + betslip.gp_name + "</span></div><div class='col-sm-6'><span/></div></div><div class='row'>";
        var qhtml = "<div class='col-sm-6'>Aika-ajo</br>";
        var gphtml = "<div class='col-sm-6'>Kilpailu</br>";
        for (i = 1; i <= 6; i++) {
            console.log("#q_id_" + i + "=" + $("#q_id_" + i).val());
            var qbet = new Object();
            qbet.position = i;
            qbet.driverid = $("#q_id_" + i).val();
            qbet.info = $("#q_id_" + i + " option:selected").text();
            qhtml = qhtml.concat(qbet.position + ". " + qbet.info + "</br>");

            var gpbet = new Object();
            gpbet.position = i;
            gpbet.driverid = $("#gp_id_" + i).val();
            gpbet.info = $("#gp_id_" + i + " option:selected").text();
            gphtml = gphtml.concat(gpbet.position + ". " + gpbet.info + "<br/>");
            
            betslip.qbets.push(qbet);
            betslip.gpbets.push(gpbet);
        }
        qhtml = qhtml.concat("</div>");
        gphtml = gphtml.concat("</div>");
        text = text.concat(qhtml, gphtml, "</div>");
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
    var ref = new Firebase('https://f1kaapo.firebaseio.com/users/' + myUser.userid + "/bets/" + gp_id);
    ref.on('value', function (dataSnapshot) {
        // code to handle new value.    
        var betslip = dataSnapshot.val();
        console.log(betslip);

        var text = "<div class='row'><div class='col-sm-6'><span>Kilpailu: " + betslip.gp_name + "</span></div><div class='col-sm-6'><span/></div></div><div class='row'>";
        var qhtml = "<div class='col-sm-6'>Aika-ajo</br>";
        var gphtml = "<div class='col-sm-6'>Kilpailu</br>";
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
        text = text.concat(qhtml, gphtml, "</div>");
        console.log(text);

        $("#dialog-bet-title").html("Aikaisempi vetolippu " + betslip.date)
        $("#dialog-bet-body").html(text);
        $("#dialog-bet").modal('show');

    });
    ref.off();

}