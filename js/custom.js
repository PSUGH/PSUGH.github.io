'use strict';
(function () {
function copyright() {
		var jetzt = new Date(),
			jahr = jetzt.getFullYear(),
            text = '&copy; PowerShell Usergroup Hannover ' + jahr;
		document.getElementById('copyright').innerHTML = text;
	}
 function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', true); // Replace 'data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }
	document.addEventListener("DOMContentLoaded", function () {
		copyright();
		loadJSON(function(response) {
			var data = JSON.parse(response);
			document.getElementById("Treffen").innerHTML = '<p>Das <strong>nächste Treffen findet am ' + data.Datum + 
			' um ' + data.Zeit + ' in den Räumen von ' + data.Ort + ',</strong> ' + data.Strasse + 
			', ' + data.Stadt + ' statt.</p>';

			var mapsStreet = data.Strasse.replace(" ","+");
			var mapsPlace  = data.Stadt.replace(" ","+");
			var mapsUrl = 'http://maps.google.com/maps?f=q&source=s_q&hl=de&geocode=&q=' +
			          mapsStreet + ',+' + mapsPlace;
			document.getElementById("Route").innerHTML = '<a class="btn btn-default" href=' + mapsUrl + ' role="button" target="_blank">Route planen &raquo;</a>';

			var themen = '';
			for ( var i = 0; i < data.Thema.length; i++ ) {
    			var obj = data.Thema[i];
    			// console.log(obj.Id);
				themen += '<p><b>' + obj.Id + '.</b> ' + obj.Vortrag + '</p>';
			}
			document.getElementById("Themen").innerHTML = themen;

			var currentLocation = window.location;
			document.getElementById("Terminal").innerHTML = '<p>Du kannst dir unseren nächsten Termin auch in der PowerShell anschauen: </p>' + 
			'<p id="pscode"><code>curl "' + currentLocation + 'data.json" | ConvertFrom-Json</code></p>' +
			'<p>Weitere Skripte findest du auf unserer Github-Seite.</p>';
		});
	});
}());