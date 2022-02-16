// ==UserScript==
// @name         Jewel harvest helper V2
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Counts the amount of jewels generated from T1 and T2 properties and how many came from a single tile property.
// @author       FreeX (0QWUS0HCNP)
// @include      https://*app.earth2.io/
// @icon         https://www.google.com/s2/favicons?domain=earth2.io
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==




console.log('Jewel harvest helper by FreeX(0QWUS0HCNP) added');



var JuwelenGesamt = 0;
var JuwelenT1 = 0;
var JuwelenT2 = 0;

var JewelsFromT1Single = 0;
var JewelsFromT2Single = 0;

var PageLink = "https://app.earth2.io/api/v2/my/jewels/?expires__isnull=false&limit=10&offset=0&ordering=created";
var PageNR = 0;
var DelayTime = 0;
var LoadingText = "<b>Data is calculating and loading...</b> <br>";


//Laden Anzeigen
var LoadingDIV = document.createElement ('div');
 LoadingDIV.innerHTML ='<div id="loading" style="width:100%; border: 5px solid red; text-align:center"><b>Data is calculating and loading...</b></div>'
document.body.prepend(LoadingDIV);





setTimeout(function GetJewel() {
        $.getJSON(PageLink, function(data) {




            PageLink = data.next;
            //console.log(data);







         JuwelenGesamt = JuwelenGesamt + (Object.keys(data.results).length);




        for(var i = 0; i<Object.keys(data.results).length; i++)
        {
             console.log((i+1)+(PageNR*10) + '. jewel analyzed');
            document.getElementById('loading').innerHTML = LoadingText + ((i+1)+(PageNR*10)) + '. jewel analyzed' ;


                $.getJSON('https://app.earth2.io/api/v2/my/landfields/'+ data.results[i].landfield.id, function(data2) {

                    //console.log(data2);

                    if(data2.landfield_tier == 2)
                    {
                        JuwelenT2++;
                        console.log('Jewel from T2 property recognized');
                        document.getElementById('loading').innerHTML = LoadingText + 'Jewel from T2 property recognized' ;

                        if(Object.keys(data2.tile_indexes).length == "1")
                        {
                            JewelsFromT2Single++;
                            console.log('T2 single tile recognized');
                        }
                    }
                    else
                    {
                        JuwelenT1++;
                        console.log('Jewel from T1 property recognized');
                        document.getElementById('loading').innerHTML = LoadingText + 'Jewel from T1 property recognized' ;

                        if(Object.keys(data2.tile_indexes).length == "1")
                        {
                           JewelsFromT1Single++;
                            console.log('T1 single tile recognized');
                        }
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
                        <b>Jewel harvest helper:</b><br>
                        Jewels from T1: ` + JuwelenT1 + ` (` + JewelsFromT1Single + ` from single tiles) <br>
                        Jewels from T2: ` + JuwelenT2 + ` (` + JewelsFromT2Single + ` from single tiles) <br>
                        ---------------------------<br>
                        Jewels total: ` + JuwelenGesamt + ` </div>`
                ;


                document.body.prepend(newHTML);

                }, DelayTime+3000);

            }
    });
  }, DelayTime);