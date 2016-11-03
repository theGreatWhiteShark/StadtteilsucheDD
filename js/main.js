globaldata = null;
heatlayer = null;
$().ready(function(){
	console.log('ready');

	$.get('./data/all_pois.json', function(res) {
		globaldata = [];
		res.features.forEach(function(feature) {
			globaldata.push([[feature.properties.dichte,  feature.properties.farbe, feature.properties.wahl],
					 [feature.properties.wohnung, feature.properties.stops, feature.properties.kinder],
					  feature.geometry.coordinates]);
		});
		render([],0,0);
	});
});



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

		var stadtteilfactor = 2/(1+Math.exp(3.*distance/num_props));

		if(stadtteilfactor > 0.3)
		{
			var gewicht =  stadtteilfactor * (feature[1][0] * 0.1 + feature[1][1] * s5 - feature[1][2] * s4);
			if(gewicht > 0.01)
			{					   // ReLU
				var coordinates = feature[2];
				datalist.push([coordinates[1], coordinates[0], gewicht])
			}
		}
	});
	heatlayer = L.heatLayer(datalist, {radius: 50}).addTo(map);
}



function renderObj()
{
	var district_props = [];
	if( $('#cb_dichte:checked').val() ) {
		var val1 = $('#slider1').val();
		val1 = (val1 / 5) - 1;
		district_props.push([val1, 0]);
	}

	if( $('#cb_farbe:checked').val() ) {
		var val2 = $('#slider2').val();
		val2 = (val2 / 5) - 1;
		district_props.push([val2, 1]);
	}

	if( $('#cb_wahl:checked').val() ) {
		var val3 = $('#slider3').val();
		val3 = (val3 / 5) - 1;
		district_props.push([val3, 2]);
	}

	var val4 = $('#slider4').val();
	val4 = (val4 / 5) - 1;
	
	var val5 = $('#slider5').val();
	val5 = (val5 / 10);

	render(district_props,val4,val5);
}
