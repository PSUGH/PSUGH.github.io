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
	 xobj.open('GET', 'sat_data.json', true); // Pfad zur JSON-Datei
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
			document.getElementById("Treffen").innerHTML = '<p>Der PowerShell Saturday ist <strong>am ' + data.Datum + 
			' ab ' + data.Zeit + ' bei ' + data.Ort + '.</strong></p>' + 
			'<p>Die Adresse lautet: <strong>' + data.Strasse + ', ' + data.Stadt + '<strong>.</p>';
			
			// Button zu Google Maps
			
			var mapsUrl = 'https://goo.gl/maps/AKg33MQbiKQ2';
			document.getElementById("Route").innerHTML = '<a class="btn btn-default" href=' + mapsUrl + ' role="button" target="_blank">Route planen &raquo;</a>';

			// Themen-Box mit For-Schleife über das JSON-Array "Themen":
			var themen = '';
			for ( var i = 0; i < data.Themen.length; i++ ) {
    			var obj = data.Themen[i];
    			// console.log(obj.Id);
				themen += '<p><b>' + obj.Id + '.</b> ' + obj.Vortrag + '</p>';
			}
			themen  += '<a class="btn btn-default" href="https://www.meetup.com/de-DE/PowerShell-Usergroup-Hannover/events/262836522/" role="button" target="_blank">Gleich anmelden &raquo;</a>'
			document.getElementById("Themen").innerHTML = themen;
			
			// Terminal-Box
			var currentLocation = window.location;
			document.getElementById("Terminal").innerHTML = '<p><strong>Tobias Weltner</strong>, MVP PowerShell, Consultant, Trainer, Autor</p>' + 
			'<p><strong>Holger Voges</strong>, Trainer, Consultant, Inhaber Netz-Weise</p>';
		}); // loadJSON
	}); // addEventListener
}()); // function
