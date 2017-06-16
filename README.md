# Wie die Seite für PSUGH entstanden ist #

Die PowerShell Usergroup Hannover (PSUGH) brauchte dringend eine Website. Die Idee war, sie mit _Github Pages_ zu erstellen.

# Wie erstellt man eine Github-Seite (_Github Pages_) #

Auf Github ein neues öffentliches Repo anlegen:

    username.github.io

Der _username_ muss genau mit dem Benutzername bei Git übereinstimmen.

In unserem Beispiel 

    psugh.github.io

Die Website http://www.psconf.eu/ liegt bspw. in diesem Repo:

    https://github.com/PowerShellConferenceEU/PowerShellConferenceEU.github.io

Im Verzeichnis, in dem man das Projekt abspeichern will, muss man es clonen:

    git clone https://github.com/datenteiler/datenteiler.github.io

In dem gecloneten Verzeichnis legt man dann eine index.html an:

    cd username.github.io
    echo "Hello World" > index.html

Um die Seite online zu bringen, nimmt man _add_, _commit_ und _push_:

    git add --all
    git commit -m "Initial commit"
    git push -u origin master

# _Bootstrap_ als Framework #

Bootstrap (http://holdirbootstrap.de/) ist ein anpassungsfähiges CSS-Framework für alle Geräte-Typen wie Smartphones, PC etc. von Twitter. 

Egal, wie gut man sich auskennt, kann man damit einfach und schnell kleine und große Projekte entwickeln.

 Es wird unter anderem von der NASA und dem US Nachrichtensender MSNBC oder für die Website der PSConfEU eingesetzt.
 
 
