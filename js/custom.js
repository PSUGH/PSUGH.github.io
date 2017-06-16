'use strict';
(function () {
function copyright() {
	// Die Funktion erstellt den Eintrag für das Copyright
	// inkl. aktueller Jahreszahl
	var jetzt = new Date(),
	jahr = jetzt.getFullYear(),
        text = '&copy; PowerShell Usergroup Hannover ' + jahr;
	document.getElementById('copyright').innerHTML = text;
	}
	
 function loadJSON(callback) {
	 // Diese Funktion lädt die JSON-Datei mit den Daten zum
	 // Treffen der PowerShell Usergroup	 
	 var xobj = new XMLHttpRequest();
	 xobj.overrideMimeType("application/json");
	 xobj.open('GET', 'data.json', true); // Pfad zur JSON-Datei
	 xobj.onreadystatechange = function () {
		 if (xobj.readyState == 4 && xobj.status == "200") {
			 // Der Anonymous Callback wird benötigt weil .open 
			 // keinen Wert zurückliefert, sondern nur einen 
			 // undefinierten asynchronen Mode
			 callback(xobj.responseText);
		 	}	 
         	};
    	xobj.send(null);  
 	}
	
	// Der EventListener prüft, ob das DOM der Website bereits geladen wurde:
	document.addEventListener("DOMContentLoaded", function () {
		// Ist das der Fall, werden die Funktionen ausgeführt:
		copyright();
		// Die JSON-Datei wird geladen und abgearbeitet:
		loadJSON(function(response) {
			// Der Inhalt der JSON-Datei wird in das data-Objekt kopiert
			var data = JSON.parse(response);
			
			// Treffen-Box:
			document.getElementById("Treffen").innerHTML = '<p>Das nächste Treffen ist <strong>am ' + data.Datum + 
			' um ' + data.Zeit + ' bei ' + data.Ort + '.</strong></p>' + 
			'<p>Die Adresse lautet: <strong>' + data.Strasse + ', ' + data.Stadt + '<strong>.</p>';
			
			// Button zu Google Maps
			var mapsStreet = data.Strasse.replace(" ","+");
			var mapsPlace  = data.Stadt.replace(" ","+");
			var mapsUrl = 'http://maps.google.com/maps?f=q&source=s_q&hl=de&geocode=&q=' +
			          mapsStreet + ',+' + mapsPlace;
			document.getElementById("Route").innerHTML = '<a class="btn btn-default" href=' + mapsUrl + ' role="button" target="_blank">Route planen &raquo;</a>';
			
			// Themen-Box mit For-Schleife über das JSON-Array "Themen":
			var themen = '';
			for ( var i = 0; i < data.Themen.length; i++ ) {
    			var obj = data.Themen[i];
    			// console.log(obj.Id);
				themen += '<p><b>' + obj.Id + '.</b> ' + obj.Vortrag + '</p>';
			}
			document.getElementById("Themen").innerHTML = themen;
			
			// Terminal-Box
			var currentLocation = window.location;
			document.getElementById("Terminal").innerHTML = '<p>Du kannst dir unseren nächsten Termin auch in der PowerShell anschauen: </p>' + 
			'<p id="pscode"><code>iwr ' + currentLocation + 'data.json | ConvertFrom-Json</code></p>' +
			'<p>Weitere Skripte findest du auf unserer Github-Seite.</p>';
		}); // loadJSON
	}); // addEventListener
}()); // function
