// ==UserScript==
// @name         Juwelen Erntehelfer V2
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Zählt bei Juwelenernte wieviele Juwelen von T1 und T2 Grundstücken generiert wurden
// @author       ExKcir (0QWUS0HCNP)
// @include      https://*app.earth2.io/
// @icon         https://www.google.com/s2/favicons?domain=earth2.io
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==




console.log('Juwelen Erntehelfer - Juwelen von T1 oder T2 von ExKcir hinzugefügt');



var JuwelenGesamt = 0;
var JuwelenT1 = 0;
var JuwelenT2 = 0;
var PageLink = "https://app.earth2.io/api/v2/my/jewels/?expires__isnull=false&limit=10&offset=0&ordering=created";
var PageNR = 0;
var DelayTime = 0;


//Laden Anzeigen
var LoadingDIV = document.createElement ('div');
 LoadingDIV.innerHTML ='<div id="loading" style="width:100%; border: 5px solid red; text-align:center">Daten werden berechnet und geladen...</div>'
document.body.prepend(LoadingDIV);





setTimeout(function GetJewel() {
        $.getJSON(PageLink, function(data) {




            PageLink = data.next;
           // console.log(data.count);







         JuwelenGesamt = JuwelenGesamt + (Object.keys(data.results).length);




        for(var i = 0; i<Object.keys(data.results).length; i++)
        {
             console.log((i+1)+(PageNR*10) + '. Juwel wird analysiert');



                $.getJSON('https://app.earth2.io/api/v2/my/landfields/'+ data.results[i].landfield.id, function(data2) {

                if(data2.landfield_tier == 2)
                {
                    JuwelenT2++;
                    console.log('Juwel von T2 Grundstück erkannt');
                }
                else
                {
                    JuwelenT1++;
                    console.log('Juwel von T1 Grundstück erkannt');
                }
            });


        }


            if(PageLink != null)
            {
                DelayTime = DelayTime+1000;
                PageNR++;
                GetJewel();
            }
            else
            {
                

                setTimeout(function ShowResult() {
                 //console.log('Ergebnis ausgeben');
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

                }, DelayTime+3000);

            }
    });
  }, DelayTime);




























