var positions = [1,2,3,4,5,6];

$.getJSON( "drivers.json", function( data ) {

  var items = [];
  items.push("<option value='null'>Valitse kuski</option>");
  $.each( data, function( key, val ) {
	  if (val && typeof val === 'object') {
	      items.push( "<option value='" + val.d_id + "'>" +
	      val.d_name + " (" + val.d_team + ")</option>" );
	  }
  });

  for ( var i in positions) {

  $( "<select/>", {
	  "name" : "select-qualification-driver-" + positions[i],
	  "id" : "select-qualification-driver-" + positions[i],
	      "style" : "background:url('" + positions[i] + ".png') no-repeat left",
      html : items.join( "" ) }).appendTo( "#select-qualification-driver" );

      $('#select-qualification-driver-'+positions[i]).attr('disabled','disabled');
  }

  for ( var i in positions) {

  $( "<select/>", {
	  "name" : "select-gp-driver-" + positions[i],
	  "id" : "select-gp-driver-" + positions[i],
	      "style" : "background:url('img/" + positions[i] + ".png') no-repeat left",
      html : items.join( "" ) }).appendTo( "#select-gp-driver" );

  $('#select-gp-driver-'+positions[i]).attr('disabled','disabled');

  }

});

$.getJSON( "calendar.json", function( data ) {
  var items = [];
  var today = new Date();
  
  items.push("<option value='null'>Valitse kisa</option>");
  $.each( data, function( key, val ) {
	  if (val && typeof val === 'object') {
	      var date = new Date(val.gp_date);
	      var friday = new Date(val.gp_date);
	      friday.setDate(date.getDate() -2);
	      friday.setHours(23);
	      friday.setMinutes(59);
	      if (today.getTime() < friday.getTime()) {
	      items.push( "<option value='" + val.gp_id + "'>" + val.gp_shortname + " (" + date.toDateString() + ") </option>" );
	      }
	  }
  });

  $( "<select/>", {
	  "name" : "select-gp",
	  "id" : "select-gp",
	  "style" : "background:url('img/flag.png') no-repeat left",
      html : items.join( "" ) }).appendTo( "#select-gp" );

  $('#select-gp').change( function () {
	  if ($('#select-gp option:selected').val() != 'null') {
	      for (var i in positions) {
	      $('#select-gp-driver-'+positions[i]).removeAttr('disabled');
	      $('#select-qualification-driver-'+positions[i]).removeAttr('disabled');
	      }
	  } else {
	      for (var i in positions) {
	      $('#select-gp-driver-'+positions[i]).attr('disabled','disabled');
	      $('#select-qualification-driver-'+positions[i]).attr('disabled','disabled');
	      }
	  }
  });

});

