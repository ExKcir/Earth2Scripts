// ==UserScript==
// @name         Jewel harvest helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Counts the amount of jewels generated from T1 and T2 Properties; You need a marker text in the properties title, something like "C1", "C2", "C3" or "T1" for T1 Properties or "T2" for T2 properties.
// @author       FreeX (0QWUS0HCNP)
// @include      https://*app.earth2.io/
// @icon         https://www.google.com/s2/favicons?domain=earth2.io
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==




// ! ---------------!   Script settings  ! --------------- !


var T1orT2 = "1"; // 1 for T1; 2 for T2


//Pay attention to lower and upper case!
var MarkerText1 = "C1"; 
var MarkerText2 = "C2"; // If not needed, change it to the same value as MarkerText1
var MarkerText3 = "C3"; // If not needed, change it to the same value as MarkerText1 or MarkerText2


// ! ---------------!   Script settings  ! --------------- !







console.log('Jewel harvest helper by FreeX added');



var JewelsTotal = 0;
var JewelsT1 = 0;
var JewelsT2 = 0;



$.getJSON('https://app.earth2.io/api/v2/my/jewels/?expires__isnull=false', function(data) {
    JewelsTotal = Object.keys(data.results).length;




    for(var i = 0; i<Object.keys(data.results).length; i++)
    {


        if(data.results[i].landfield.description.includes(MarkerText1) || data.results[i].landfield.description.includes(MarkerText2) || data.results[i].landfield.description.includes(MarkerText3))
        {
            if(T1orT2 == "1") //T1 counting
            {
                JewelsT1++;
            }

            if(T1orT2 == "2") //T2 counting
            {
                JewelsT2++;
            }
        }
    }


    if(T1orT2 == "1")
    {
        JewelsT2 = JewelsTotal - JewelsT1;
    }
    if(T1orT2 == "2")
    {
        JewelsT1 = JewelsTotal - JewelsT2;
    }




    var newHTML = document.createElement ('div');
    newHTML.innerHTML =
        `

                        <div  style="width:100%; border: 3px solid red; text-align:center">
                        <b>Jewel harvest helper:</b><br>
                        Jewels from T1: ` + JewelsT1 + ` <br>
                        Jewels from T2: ` + JewelsT2 + ` <br>
                        ---------------------------<br>
                        Jewels total: ` + JewelsTotal + ` </div>`
    ;


    document.body.prepend(newHTML);

});