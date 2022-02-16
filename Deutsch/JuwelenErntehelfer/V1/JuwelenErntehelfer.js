// ==UserScript==
// @name         Juwelen Erntehelfer - Juwelen von T1 oder T2
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Zählt bei Juwelenernte wieviele Juwelen von T1 und T2 Grundstücken generiert wurden
// @author       ExKcir (0QWUS0HCNP)
// @include      https://*app.earth2.io/
// @icon         https://www.google.com/s2/favicons?domain=earth2.io
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==




// ! ---------------!   Script Einstellungen  ! --------------- !
// Anpassen wie benötigt

var T1oderT2 = "1"; // 1 für T1; 2 für T2


// Klein- und Großschreibung beachten!
var Bezeichnung1 = "C1"; //
var Bezeichnung2 = "C2"; // Wenn nicht benötigt gleichen Wert wie bei Bezeichnung1 eintragen
var Bezeichnung3 = "C3"; // Wenn nicht benötigt gleichen Wert wie bei Bezeichnung1 oder Bezeichnung2 eintragen


// ! ---------------!   Script Einstellungen  ! --------------- !







console.log('Juwelen Erntehelfer - Juwelen von T1 oder T2 von ExKcir hinzugefügt');



var JuwelenGesamt = 0;
var JuwelenT1 = 0;
var JuwelenT2 = 0;
var PageLink = "https://app.earth2.io/api/v2/my/jewels/?expires__isnull=false&limit=10&offset=0&ordering=created";
var DelayTime = 0;


//Laden Anzeigen
var LoadingDIV = document.createElement ('div');
 LoadingDIV.innerHTML ='<div id="loading" style="width:100%; border: 5px solid red; text-align:center">Daten werden berechnet und geladen...</div>'
document.body.prepend(LoadingDIV);





setTimeout(function GetJewel() {
        $.getJSON(PageLink, function(data) {




            PageLink = data.next;







        JuwelenGesamt = JuwelenGesamt + (Object.keys(data.results).length);




        for(var i = 0; i<Object.keys(data.results).length; i++)
        {


            if(data.results[i].landfield.description.includes(Bezeichnung1) || data.results[i].landfield.description.includes(Bezeichnung2) || data.results[i].landfield.description.includes(Bezeichnung3))
            {
                if(T1oderT2 == "1") //T1 zählen
                {
                    JuwelenT1++;
                }

                if(T1oderT2 == "2") //T2 zählen
                {
                    JuwelenT2++;
                }
            }
        }


            if(PageLink != null)
            {
                DelayTime = DelayTime+1000;
                GetJewel();
            }
            else
            {
                if(T1oderT2 == "1")
                {
                    JuwelenT2 = JuwelenGesamt - JuwelenT1;
                }
                if(T1oderT2 == "2")
                {
                    JuwelenT1 = JuwelenGesamt - JuwelenT2;
                }


                document.getElementById("loading").style.display = "none"; //loading DIV ausblenden

                var newHTML = document.createElement ('div');
                newHTML.innerHTML =
                    `
                        <div  style="width:100%; border: 3px solid red; text-align:center">
                        <b>Juwelen Erntehelfer:</b><br>
                        Juwelen von T1: ` + JuwelenT1 + ` <br>
                        Juwelen von T2: ` + JuwelenT2 + ` <br>
                        ---------------------------<br>
                        Juwelen gesamt: ` + JuwelenGesamt + ` </div>`
                ;


                document.body.prepend(newHTML);
            }
    });
  }, DelayTime);



