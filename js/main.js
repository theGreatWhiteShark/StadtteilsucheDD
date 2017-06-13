globaldata = null;
heatlayer = null;

function OnLoad(filename){
	console.log('ready');

	$.get(filename, function(res) {
		globaldata = [];
		res.features.forEach(function(feature) {
			globaldata.push([[feature.properties.dichte,  feature.properties.farbe, feature.properties.wahl],
					 [feature.properties.wohnung, feature.properties.stops, feature.properties.kinder],
					  feature.geometry.coordinates]);
		});
		render([],0,0);
	});
  /* Every time the page is loaded all sliders should be hidden
  and all checkboxes should be uncheck */
  $( "#slider1" ).css( "visibility", "hidden" );
  $( "#slider2" ).css( "visibility", "hidden" );
  $( "#slider3" ).css( "visibility", "hidden" );
  $( "#cb_dichte" ).prop( "checked", false );
  $( "#cb_farbe" ).prop( "checked", false );
  $( "#cb_wahl" ).prop( "checked", false );
}



function render(district_props,s4,s5)
{
	num_props = district_props.length;
	if (heatlayer)
	{
		map.removeLayer(heatlayer)
	}
	if(num_props == 0) return;

	var datalist = [];
	globaldata.forEach(function(feature) {

		var distance = 0.0;
		district_props.forEach(function(prop)
				{
					distance += Math.abs(feature[0][prop[1]] - prop[0]);
				});

		var stadtteilfactor = 2/(1+Math.exp(2.*distance/num_props));

		if(stadtteilfactor > 0.1)
		{
			var gewicht =  stadtteilfactor * (feature[1][0] * 3.0 + feature[1][1] * s5 - feature[1][2] * s4);
			if(gewicht > 0.01)
			{					   // ReLU
				var coordinates = feature[2];
				datalist.push([coordinates[1], coordinates[0], gewicht])
			}
		}
	});
	heatlayer = L.heatLayer(datalist, {radius: 50}).addTo(map);
}


function disableSlider(slider_id)
{
	$(slider_id).prop('disabled',  true);
}


function enableSlider(slider_id)
{
	$(slider_id).prop('disabled',  false);
}


function renderObj()
{
	var district_props = [];
	if( $('#cb_dichte:checked').val() )
	{
		enableSlider('#slider1');
		var val1 = $('#slider1').val();
		val1 = (val1 / 5) - 1;
		district_props.push([val1, 0]);
	}
	else
	{
		$('#slider1').prop('disabled', true);
	}

	if( $('#cb_farbe:checked').val() )
	{
		enableSlider('#slider2');
		var val2 = $('#slider2').val();
		val2 = (val2 / 5) - 1;
		district_props.push([val2, 1]);
	}
	else
	{
		$('#slider2').prop('disabled', true);
	}

	if( $('#cb_wahl:checked').val() )
	{
		enableSlider('#slider3');
		var val3 = $('#slider3').val();
		val3 = (val3 / 5) - 1;
		district_props.push([val3, 2]);
	}
	else
	{
		$('#slider3').prop('disabled', true);
	}

	if( district_props.length == 0 )
	{
		disableSlider('#slider4');
		disableSlider('#slider5');
	}
	else
	{
		enableSlider('#slider4');
		enableSlider('#slider5');
	}

	
	var val4 = $('#slider4').val();
	val4 = (val4 / 5) - 1;
	
	var val5 = $('#slider5').val();
	val5 = (val5 / 10);

	render(district_props, val4, val5);
}

// toggle the visibility of the sliders using the sliders action
// button form
// (so I am the only one commenting?)
$(function(){
    // short for $(document).ready(function(){
    $('#cb_dichte').change( function(){
	// whenenver the status of the checkbox changes apply the
	// following changes to the sliders style values (depending
	// on its current state)
	renderObj();
	if ( $( "#slider1" ).css( "visibility" ) === "hidden" ){
	    $( "#slider1" ).css( "visibility", "visible" );
	    $( "#label_dichte_left" ).css( "visibility", "visible" );
	    $( "#label_dichte_right" ).css( "visibility", "visible" );
	    $( "#p_dichte" ).css( "visibility", "hidden" );
	} else {
	    $( "#slider1" ).css( "visibility", "hidden" );
	    $( "#label_dichte_left" ).css( "visibility", "hidden" );
	    $( "#label_dichte_right" ).css( "visibility", "hidden" );
	    $( "#p_dichte" ).css( "visibility", "visible" );
	}
    });
    $('#cb_farbe').change( function(){
	// whenenver the status of the checkbox changes apply the
	// following changes to the sliders style values (depending
	// on its current state)
	renderObj();
	if ( $( "#slider2" ).css( "visibility" ) === "hidden" ){
	    $( "#slider2" ).css( "visibility", "visible" );
	    $( "#label_farbe_left" ).css( "visibility", "visible" );
	    $( "#label_farbe_right" ).css( "visibility", "visible" );
	    $( "#p_farbe" ).css( "visibility", "hidden" );
	} else {
	    $( "#slider2" ).css( "visibility", "hidden" );
	    $( "#label_farbe_left" ).css( "visibility", "hidden" );
	    $( "#label_farbe_right" ).css( "visibility", "hidden" );
	    $( "#p_farbe" ).css( "visibility", "visible" );
	}
    });
    $('#cb_wahl').change( function(){
	// whenenver the status of the checkbox changes apply the
	// following changes to the sliders style values (depending
	// on its current state)
	renderObj();
	if ( $( "#slider3" ).css( "visibility" ) === "hidden" ){
	    $( "#slider3" ).css( "visibility", "visible" );
	    $( "#label_wahl_left" ).css( "visibility", "visible" );
	    $( "#label_wahl_right" ).css( "visibility", "visible" );
	    $( "#p_wahl" ).css( "visibility", "hidden" );
	} else {
	    $( "#slider3" ).css( "visibility", "hidden" );
	    $( "#label_wahl_left" ).css( "visibility", "hidden" );
	    $( "#label_wahl_right" ).css( "visibility", "hidden" );
	    $( "#p_wahl" ).css( "visibility", "visible" );
	}
    });		       
});
