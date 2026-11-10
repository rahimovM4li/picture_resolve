# Bewegungsverhalten

Der Einstieg öffnet zwei Bildblenden. Ramans Aufnahme fährt über drei Sekunden von 140 auf 108 Prozent. Der äußere Bildrahmen verkleinert sich mit der Scrollposition auf 86 Prozent und erhält einen Eckenradius von 24 Pixeln. Die Wörter der Überschrift steigen zeitversetzt durch eine Maske. Beim Verlassen der Szene bewegt sich der Text nach oben und blendet aus.

Am Desktop steuert das Mausrad über Lenis und GSAP ScrollTrigger die seitliche Portfoliofahrt und die vier Produktionsphasen. Beim Zurückscrollen laufen Bildausschnitt, Maske und Fortschrittsanzeige zurück. Die Kontaktfläche folgt dem Mauszeiger. An den Leistungskarten reagiert eine kleine perspektivische Drehung auf die Position des Zeigers.

Auf dem Smartphone bleibt der Touch-Scroll nativ. Die Bildfolgen sind vertikal angeordnet. Die mobile Eröffnung nutzt CSS, für weitere Texte und Bildmasken verwenden wir IntersectionObserver und die Web Animations API. Bei reduzierter Bewegung wechseln Bildfolgen in die statische Lesereihenfolge. Ein Tastaturfokus auf den Filmstart hält den Text sichtbar.

Im mobilen Hochformat lassen die oberen und unteren Blenden beim Laden bereits die mittleren 70 Prozent des Startbilds frei. Sie öffnen sich in 820 Millisekunden.

Startseite und Kamerastudie öffnen denselben Filmplayer. Zwei Blenden geben das Filmbild frei. Eine kleine Spule neben dem Studionamen dreht sich während der Wiedergabe und hält bei Pause, beim Puffern und am Filmende an. In einem Hintergrundtab ruht die Spule ebenfalls. Bei reduzierter Bewegung erscheinen Rahmen und Bild sofort, die Spule bleibt stehen. Die Schleifentaste schaltet die Wiederholung des Films ein und aus. Native Videosteuerung und Untertitel sind verfügbar. Escape schließt den Dialog und gibt den Fokus an den Auslöser zurück.
