globaldata = null;
heatlayer = null;
$().ready(function(){
	console.log('ready');

	$.get('./data/myfile.json', function(res){
		//console.log(res)
		//var data = JSON.parse(res);
		//var features = res['features'];
		console.log(res);
		globaldata = res;
		render(0,0,0,0,0);
	});
});

function render(s1,s2,s3,s4,s5)
{

	if (heatlayer)
	{
		map.removeLayer(heatlayer)
	}
	var datalist = [];
	var features = globaldata['features'];

	features.forEach(function(feature){
		var gewicht = feature.properties.dichte * s1 + feature.properties.farbe * s2 + feature.properties.wahl * s3 + feature.properties.kinder * s4 + feature.properties.haltestelle * s5 * 3;
		var coordinates = feature['geometry']['coordinates'];

		gewicht = (gewicht > 0) * gewicht;
		//if (gewicht > 3) {
		//	gewicht = 3;
		//}
	
		datalist.push([coordinates[1], coordinates[0], gewicht])
	});
	heatlayer = L.heatLayer(datalist, {radius: 50}).addTo(map);
}

function renderObj()
{
	var val1 = $('#slider1').val();
	val1 = (val1 / 5) - 1;

	var val2 = $('#slider2').val();
	val2 = (val2 / 5) - 1;

	var val3 = $('#slider3').val();
	val3 = (val3 / 5) - 1;

	var val4 = $('#slider4').val();
	val4 = (val4 / 5) - 1;
	
	var val5 = $('#slider5').val();
	val5 = (val5 / 10);

	console.log(val1)
	console.log(val2)
	console.log(val3)
	console.log(val4)
	console.log(val5)


	render(val1,val2,val3,val4,val5);
}


function scoring_function(s1, s2, s3, s4) {

	var len = globaldata.features.length;
	var s = new Array(len);

	for (var i = 0; i<len; i++) {
		s[i] = globaldata.features[i].properties.dichte * s1 + globaldata.features[i].properties.farbe * s2 + globaldata.features[i].properties.wahl * s3;
		s[i] = s[i] + globaldata.features[i].properties.kinder * s4;
		s[i] = (s[i] < 0) * (s[i] > 4) * s[i];
		console.log(s[i]);
		//if (s[i] < 0) {
		//  s[i] = 0;
		//}
	}

	return s;
}
