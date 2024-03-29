// ==UserScript==
// @name         E2 Multitool for earth2.io
// @namespace    http://tampermonkey.net/
// @version      11.0
// @description  E2 Multitool for earth2.io
// @author       ExKcir (Referral-Code: E2Multitool)
// @include      https://*app.earth2.io/
// @icon         https://www.google.com/s2/favicons?domain=earth2.io
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @require https://raw.githubusercontent.com/ExKcir/Earth2Scripts/main/English/E2Multitool/include/version.js
// @require https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/build/ol.js
// @require https://www.webglearth.com/v2/api.js
// @grant        none
// ==/UserScript==

var version = "11.0";



var TimetoWait = 500; //500 ms
var TotalApiRequests = 0 ;
var tmp = "";


var EssenceBeforeClaimAndTransform = 0;
var PromisedEssenceBeforeClaimAndTransform = 0;
var Ether = 0;


console.log('E2 Multitool by ExKcir added');



function OutputStorageAll() {

    //LocalStorage
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        values.push( localStorage.getItem(keys[i]) );
    }


    //SessionStorage
     var values2 = [],
        keys2 = Object.keys(sessionStorage),
        i2 = keys.length;

    while ( i2-- ) {
        values2.push( localStorage.getItem(keys2[i2]) );
    }


    Output(Object.keys(localStorage)); //Output Name localStorage
    Output(Object.keys(sessionStorage));//Output Name sessionStorage

    Output(values); //Output Value localStorage
    Output(values2); //Output Value sessionStorage
}


function Output (Data)
{
    console.log(Data); //Output to Console
     document.getElementById('ScriptTextOutput').innerHTML = document.getElementById('ScriptTextOutput').innerHTML + Data + "<br>"; //Output to Script
}

function ScrollOutput()
{
    var tmpDiv = document.getElementById("ScriptTextOutput");
    tmpDiv.scrollTop = tmpDiv.scrollHeight;
}

function ScriptIsWorking (IsWorking)
{
    if(IsWorking == 0)
    {
        TimetoWait = 500;
        TotalApiRequests = 0;

        document.getElementById('LoadingBox').style.backgroundColor = "green";
        document.getElementById('LoadingBox').innerHTML = "Script has finished";
    }
    else
    {
        document.getElementById('LoadingBox').style.backgroundColor = "red";


        switch(document.getElementById('LoadingBox').textContent)
        {
                case "Script is working....":
               document.getElementById('LoadingBox').innerHTML = "Script is working";
                break;

                case "Script is working...":
                document.getElementById('LoadingBox').innerHTML = "Script is working....";
                break;

                case "Script is working..":
                document.getElementById('LoadingBox').innerHTML = "Script is working...";
                break;

                 case "Script is working.":
                document.getElementById('LoadingBox').innerHTML = "Script is working..";
                break;

                case "Script is working":
                document.getElementById('LoadingBox').innerHTML = "Script is working.";
                break;

                case "Script is ready":
                document.getElementById('LoadingBox').innerHTML = "Script is working";
                break;

                case "Script has finished":
               document.getElementById('LoadingBox').innerHTML = "Script is working";
                break;
        }

    }
}

function ClearOutput ()
{
     document.getElementById('ScriptTextOutput').innerHTML = "";
}

 function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function GetAPIData(URL)
{

    TotalApiRequests++;

    if(TotalApiRequests == 50 || TotalApiRequests == 100)
    {
        TimetoWait = TimetoWait+500; //+500 ms
    }

    var IsSuccessful = 0;
    var APIData = null;

    while(IsSuccessful == 0)
    {
        ScriptIsWorking(1);
        try{
            APIData = await $.getJSON('https://app.earth2.io/api/v2/' + URL, {_: new Date().getTime()})
                .done(function() {
                IsSuccessful = 1;
            });
        }catch(error){
            //console.log(error);
            Output('<span style="display: inline-block; color: darkred; font-weight: bold">Error: ' + error.status + ' - Script waits now 2 minutes and then tries again!</span>');
            ScrollOutput();
            await timeout(120000);
        }

    }

   ScriptIsWorking(1);

    //Speed throttling
   if(localStorage.getItem('E2MultiTool_IsSpeedThrottlingActive') == 1)
   {
       console.log("Speed throttling: Wait " + TimetoWait + "ms");
       await timeout(TimetoWait);
   }

   return APIData;
}



async function RequestJewelsDataInventory()
{
    Output('Loading jewels from inventory.....');
   /* $.getJSON('https://app.earth2.io/api/v2/my/jewels/?expires__isnull=true&limit=5', function(data) {
        JewelsTotalInventory = data.count;
        //console.log(data.count);
    });*/

    var APIData = await GetAPIData("my/jewels/?expires__isnull=true&limit=5");
     return APIData.count;
    //console.log(APIData.count);

}


async function RequestJewelsDataBazar()
{
    Output('Loading jewels from bazar.....');

    var APIData = await GetAPIData("my/offers/?offset=0&ordering=-created&limit=5");
    return APIData.count;

}


//New generated jewels
async function RequestJewelsDataUnclaimed()
{
     Output('Loading unclaimed jewels.....');

    var APIData = await GetAPIData("my/jewels/?expires__isnull=false&limit=5");
    return APIData.count;
}


//Slotted jewels
async function RequestJewelsDataSlotted()
{
     Output('Loading slotted jewels.....');

    var TotalSlottedJewels = 0;


var j = 0;
do
{

     var APIData = await GetAPIData("my/mentars/?limit=100&offset=" + (j*100));
     //Output((j*100));




    //Load every mentar
    for(var i = 0; i<Object.keys(APIData.results).length; i++)
    {
        //console.log(Object.keys(APIData.results[i].slotted_jewel_set).length);
         ClearOutput();
        Output((j*100)+(i+1) + '. propery searched for slotted jewels');



        //Count jewel of mentar
        if (Object.keys(APIData.results[i].slotted_jewel_set).length != 0)
        {
            TotalSlottedJewels = TotalSlottedJewels + Object.keys(APIData.results[i].slotted_jewel_set).length ;
        }
    }

    j++;
}while(APIData.next != null)


    return TotalSlottedJewels;
}


async function DownloadDataAsCSV(Data)
{
    var d = new Date();

    var FileData = "";
    var FileName = "data_E2_" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + ".csv";


    if (Data == "jewels") //Get data for jewels
    {
        //Filename
        FileName = "Jewels" + FileName;

        //Fieldnames
        FileData += "ID,NAME,COLOR,TIER,DATE_GENERATED,LOCATION,LOCATION_ID,LOCATION_LINK\n";


    }

    if (Data == "properties") //Get data for properties
    {
        FileName = "Properties" + FileName;


    }


    if (Data == "transactions") //Get data for transactions
    {
        FileName = "Transactions" + FileName;

    }




    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(FileData);
    hiddenElement.target = '_blank';

    hiddenElement.download = FileName;
    hiddenElement.click();



}


async function FeatureJewelData()
    {
        ClearOutput(); //Clear Text Output

        var JewelsTotal = 0;
        var JewelsTotalClaimed = 0;
        var JewelsTotalUnclaimed = 0;
        var JewelsTotalInventory = 0;
        //var JewelsTotalBazar = 0;
        var JewelsTotalSlotted = 0;
        var JewelsT1 = 0;
        var JewelsT2 = 0;


        //Count Jewels in Inventory
        JewelsTotalInventory = await RequestJewelsDataInventory();
        //console.log(JewelsTotalInventory);

        //Count Jewels in Bazar
       // JewelsTotalBazar = await RequestJewelsDataBazar();
        //console.log(JewelsTotalBazar);

        //Count Jewels unclaimed
        JewelsTotalUnclaimed = await RequestJewelsDataUnclaimed();

        //Count Jewels slotted
        JewelsTotalSlotted = await RequestJewelsDataSlotted();

       // JewelsTotalClaimed = JewelsTotalInventory + JewelsTotalBazar + JewelsTotalSlotted;
        JewelsTotalClaimed = JewelsTotalInventory + JewelsTotalSlotted;
        JewelsTotal = JewelsTotalClaimed + JewelsTotalUnclaimed ;



        document.getElementById('ScriptTextOutput').innerHTML =
        `


                         <b>Jewel counter:</b><br>
                         Jewels in inventory:  ` + JewelsTotalInventory + `<br>` +
                         //Jewels on bazar:  ` + JewelsTotalBazar + `<br>
                         `Jewels slotted: ` + JewelsTotalSlotted + `<br>
                         ---------------------------<br>
                         Claimed jewels total: ` + JewelsTotalClaimed + ` <br><br>



                         Unclaimed (new generated) jewels: ` + JewelsTotalUnclaimed + ` <br>

                        ---------------------------<br>
                        Jewels total: ` + JewelsTotal + `<br>`;

ScriptIsWorking(0);
 }


function FeatureJewelDataHelp()
{
    ClearOutput();
   // Output("Counts jewels in inventory and bazar, slotted and unclaimed");
    Output("Counts jewels in inventory, slotted and unclaimed");
}


async function FeatureJewelDataPlus()
    {

        var JewelsList = [];
        var JewelsListTotal = [];

        var JewelsTotalInInventory = 0;
        var JewelsTotalSlotted = 0;
        //var JewelsTotalOnBazar = 0;


        // ----------- Ceck Inventory -----------


        var APIData = await GetAPIData("my/jewels/?stacked=true");
        //Output((j*100));


        //Load every jewel from inventory
        for(var i = 0; i<APIData.length; i++)
        {
            JewelsList.push({Name: "T" + APIData[i].tier + " " + APIData[i].color_name + " (" + APIData[i].quality_level + ")", Count: APIData[i].count});
            JewelsTotalInInventory += APIData[i].count;
        }

        ClearOutput();
        Output("<b>Jewels counter + list</b><br>");
        Output("<b>Inventory:</b>");


       // Output(JewelsList.join(""));
        JewelsList.forEach(function(element) {
            // check code for this type of jewel
           Output(element.Name + ": " + element.Count + "x");
        });


        Output("---------------------------------");
        Output("Jewels total in inventory: " + JewelsTotalInInventory);
        Output("<br>");
        ScrollOutput();

        JewelsListTotal = JewelsList;
        JewelsList = [];


        // ----------- Check slotted jewels -----------


        var j = 0;
        do
        {

            APIData = await GetAPIData("my/mentars/?limit=100&offset=" + (j*100));
            //Output((j*100));


            //Load every mentar
            for(var k = 0; k<Object.keys(APIData.results).length; k++)
            {



                //Get jewels of mentar
                if (Object.keys(APIData.results[k].slotted_jewel_set).length != 0)
                {
                    //Load every jewel from property
                    for(var l = 0; l<Object.keys(APIData.results[k].slotted_jewel_set).length; l++)
                    {
                        var FoundIt = 0;
                        JewelsList.forEach(function(element) {
                            // check code for this type of jewel
                            if(element.Name == "T" + APIData.results[k].slotted_jewel_set[l].tier + " " + APIData.results[k].slotted_jewel_set[l].color_name + " (" + APIData.results[k].slotted_jewel_set[l].quality_level + ")")
                            {
                                FoundIt = 1;
                                element.Count++;
                                JewelsTotalSlotted++;
                            }
                        });

                        if(FoundIt == 0)
                        {
                            JewelsList.push({Name: "T" + APIData.results[k].slotted_jewel_set[l].tier + " " + APIData.results[k].slotted_jewel_set[l].color_name + " (" + APIData.results[k].slotted_jewel_set[l].quality_level + ")", Count: 1});
                            JewelsTotalSlotted++;
                        }
                    }
                }
            }

            j++;
        }while(APIData.next != null)


        Output("<b>Slotted:</b>");
        //Output(JewelsList.join(""));
        JewelsList.forEach(function(element) {
            // check code for this type of jewel
           Output(element.Name + ": " + element.Count + "x");
        });
        Output("---------------------------------");
        Output("Jewels total slotted: " + JewelsTotalSlotted);
        Output("<br>");
        ScrollOutput();


        JewelsList.forEach(function (element2) {
            FoundIt = 0;
            ScriptIsWorking(1);
             JewelsListTotal.forEach(function(element) {
                 // check code for this type of jewel
                 if(element.Name == element2.Name)
                 {
                     element.Count += element2.Count;
                     FoundIt = 1;
                 }
             });

            if(FoundIt == 0)
            {
                JewelsListTotal.push({Name: element2.Name , Count: element2.Count});
            }
        });
        JewelsList = [];




        // ----------- Check jewels on bazar-----------
        /*


        j = 0;
        do
        {

            APIData = await GetAPIData("my/offers/?offset=0&ordering=-created&limit=100&offset=" + (j*100));
            //Output((j*100));



            //Load every jewel
            for(l = 0; l<Object.keys(APIData.results).length; l++)
            {
                FoundIt = 0;
                JewelsList.forEach(function(element) {
                    // check code for this type of jewel
                    if(element.Name == "T" + APIData.results[l].jewel.tier + " " + APIData.results[l].jewel.color_name + " (" + APIData.results[l].jewel.quality_level + ")")
                    {
                        FoundIt = 1;
                        element.Count++;
                        JewelsTotalOnBazar++;
                    }
                });

                if(FoundIt == 0)
                {
                    JewelsList.push({Name: "T" + APIData.results[l].jewel.tier + " " + APIData.results[l].jewel.color_name + " (" + APIData.results[l].jewel.quality_level + ")", Count: 1});
                    JewelsTotalOnBazar++;
                }
            }


            j++;
        }while(APIData.next != null)



        Output("<b>On Bazar:</b>");
        //Output(JewelsList.join(""));
        JewelsList.forEach(function(element) {
            // check code for this type of jewel
           Output(element.Name + ": " + element.Count + "x");
        });
        Output("---------------------------------");
        Output("Jewels total on bazar: " + JewelsTotalOnBazar);
        Output("<br>");
        ScrollOutput();


        JewelsList.forEach(function (element2) {
            FoundIt = 0;
            ScriptIsWorking(1);
            JewelsListTotal.forEach(function(element) {
                // check code for this type of jewel
                if(element.Name == element2.Name)
                {
                    element.Count += element2.Count;
                    FoundIt = 1;
                }
            });

            if(FoundIt == 0)
            {
                JewelsListTotal.push({Name: element2.Name , Count: element2.Count});
            }
        });
        JewelsList = [];



*/



        //Output("<b>Total Inventory + Slotted + Bazar:</b>");
        Output("<b>Total Inventory + Slotted:</b>");
        //Output(JewelsListTotal.join(""));
        JewelsListTotal.forEach(function(element) {
            // check code for this type of jewel
           Output(element.Name + ": " + element.Count + "x");
        });
        Output("---------------------------------");
        //Output("Jewels total: " + (JewelsTotalInInventory + JewelsTotalSlotted + JewelsTotalOnBazar));
        Output("Jewels total: " + (JewelsTotalInInventory + JewelsTotalSlotted));

        ScrollOutput();
        ScriptIsWorking(0); 
    }


function FeatureJewelDataPlusHelp()
{
    ClearOutput();
    //Output("br><br>Counts jewels in inventory, bazar, slotted and shows a list of jewels");
    Output("br><br>Counts jewels in inventory and slotted and shows a list of jewels");
}



//To do: Rewrite jewel price functions with a shorter function

async function FeatureJewelPricesT1()
    {
        ClearOutput(); //Clear Text Output

        var OutputString = "";

        //T1 Black
        Output('Find price data for T1 black jewels.....');
        var APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=BLACK&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Black:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;" ;

        //T1 Ochre
        Output('Find price data for T1 ochre jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=OCHRE&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Ochre:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

         //T1 Grey
        Output('Find price data for T1 grey jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=GREY&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Grey:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T1 Blue
        Output('Find price data for T1 blue jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=BLUE&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Blue:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T1 Green
        Output('Find price data for T1 green jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=GREEN&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Green:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T1 Sandy
        Output('Find price data for T1 sandy jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SANDY&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Sandy:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T1 Yellow
        Output('Find price data for T1 yellow jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=YELLOW&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Yellow:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T1 Anthracite
        Output('Find price data for T1 anthracite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=ANTHRACITE&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Anthracite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price;

        ClearOutput();
        Output(OutputString);
        ScriptIsWorking(0);
    }

function FeatureJewelPricesT1Help()
{
    ClearOutput();
    Output("Shows the price,fee and the full price (price+fee) of the cheapest jewels on the bazar (Only T1 jewels)");
}



async function FeatureJewelPricesT2()
    {
        ClearOutput(); //Clear Text Output

        var OutputString = "";

        //T2 Black
        Output('Find price data for T2 black jewels.....');
        var APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=BLACK&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Black:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;" ;

        //T2 Ochre
        Output('Find price data for T2 ochre jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=OCHRE&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Ochre:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

         //T2 Grey
        Output('Find price data for T2 grey jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=GREY&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Grey:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T2 Blue
        Output('Find price data for T2 blue jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=BLUE&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Blue:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T2 Green
        Output('Find price data for T2 green jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=GREEN&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Green:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T2 Sandy
        Output('Find price data for T2 sandy jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SANDY&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Sandy:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T2 Yellow
        Output('Find price data for T2 yellow jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=YELLOW&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Yellow:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T2 Anthracite
        Output('Find price data for T2 anthracite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=ANTHRACITE&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Anthracite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br><br>";


        //T2 Jamaica
        Output('Find price data for T2 jamaica jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=JAMAICA&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Jamaica:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T2 Sunrise
        Output('Find price data for T2 sunrise jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SUNRISE&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Sunrise:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T2 Sunset
        Output('Find price data for T2 sunset jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SUNSET&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Sunset:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T2 Purple
        Output('Find price data for T2 sunrise jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=PURPLE&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Purple:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T2 Orange
        Output('Find price data for T2 orange jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=ORANGE&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Orange:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        ClearOutput();
        Output(OutputString);
        ScriptIsWorking(0);
    }

function FeatureJewelPricesT2Help()
{
    ClearOutput();
    Output("Shows the price,fee and the full price (price+fee) of the cheapest jewels on the bazar (Only T2 jewels)");
}


async function FeatureJewelPricesT3()
    {
        ClearOutput(); //Clear Text Output

        var OutputString = "";

        //T3 Black
        Output('Find price data for T3 black jewels.....');
        var APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=BLACK&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Black:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;" ;

        //T3 Ochre
        Output('Find price data for T3 ochre jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=OCHRE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Ochre:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

         //T3 Grey
        Output('Find price data for T3 grey jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=GREY&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Grey:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Blue
        Output('Find price data for T3 blue jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=BLUE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Blue:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T3 Green
        Output('Find price data for T3 green jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=GREEN&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Green:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Sandy
        Output('Find price data for T3 sandy jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SANDY&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Sandy:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T3 Yellow
        Output('Find price data for T3 yellow jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=YELLOW&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Yellow:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Anthracite
        Output('Find price data for T3 anthracite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=ANTHRACITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Anthracite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br><br>";


        //T3 Purple
        Output('Find price data for T3 purple jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=PURPLE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Purple:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Orange
        Output('Find price data for T3 orange jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=ORANGE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Orange:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";



        //T3 Amber
        Output('Find price data for T3 jamaica jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=AMBER&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Amber:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Andalusite
        Output('Find price data for T3 andalusite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=ANDALUSITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Andalusite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Aquamarine
        Output('Find price data for T3 Aquamarine jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=AQUAMARINE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Aquamarine:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Azurite
        Output('Find price data for T3 azurite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=AZURITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Azurite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Bloodstone
        Output('Find price data for T3 bloodstone jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=BLOODSTONE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Bloodstone:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Catseye
        Output('Find price data for T3 catseye jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=CATSEYE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Catseye:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Chrysocolla
        Output('Find price data for T3 chrysocolla jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=CHRYSOCOLLA&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Chrysocolla:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Emerald
        Output('Find price data for T3 emerald jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=EMERALD&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Emerald:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Garnet
        Output('Find price data for T3 garnet jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=GARNET&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Garnet:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Jade
        Output('Find price data for T3 jade jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=JADE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Jade:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Malachite
        Output('Find price data for T3 malachite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=MALACHITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Malachite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Obsidian
        Output('Find price data for T3 obsidian jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=OBSIDIAN&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Obsidian:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Opal
        Output('Find price data for T3 opal jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=OPAL&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Opal:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Prehnite
        Output('Find price data for T3 prehnite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=PREHNITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Prehnite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Peridot
        Output('Find price data for T3 peridot jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=PERIDOT&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Peridot:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Pyrite
        Output('Find price data for T3 pyrite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=PYRITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Pyrite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Ruby
        Output('Find price data for T3 ruby jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=RUBY&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Ruby:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Serpentine
        Output('Find price data for T3 serpentine jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SERPENTINE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Serpentine:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Slate
        Output('Find price data for T3 slate jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SLATE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Slate:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Sodalite
        Output('Find price data for T3 sodalite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SODALITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Sodalite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Spinel
        Output('Find price data for T3 spinel jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SPINEL&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Spinel:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Sunstone
        Output('Find price data for T3 sunstone jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SUNSTONE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Sunstone:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Tigereye
        Output('Find price data for T3 tigereye jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=TIGEREYE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Tigereye:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Topaz
        Output('Find price data for T3 topaz jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=TOPAZ&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Topaz:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Turquoise
        Output('Find price data for T3 turquoise jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=TURQUOISE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Turquoise:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Titanite
        Output('Find price data for T3 titanite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=TITANITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Titanite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Tanzanite
        Output('Find price data for T3 tanzanite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=TANZANITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Tanzanite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Zircon
        Output('Find price data for T3 zircon jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=ZIRCON&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Zircon:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price;

        ClearOutput();
        Output(OutputString);
        ScriptIsWorking(0);
    }

function FeatureJewelPricesT3Help()
{
    ClearOutput();
    Output("Shows the price,fee and the full price (price+fee) of the cheapest jewels on the bazar (Only T3 jewels)");
}




async function FeatureJewelPricesAll()
    {
        ClearOutput(); //Clear Text Output

        var OutputString = "";


         //T1 Black
        Output('Find price data for T1 black jewels.....');
        var APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=BLACK&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Black:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;" ;

        //T1 Ochre
        Output('Find price data for T1 ochre jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=OCHRE&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Ochre:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

         //T1 Grey
        Output('Find price data for T1 grey jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=GREY&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Grey:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T1 Blue
        Output('Find price data for T1 blue jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=BLUE&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Blue:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T1 Green
        Output('Find price data for T1 green jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=GREEN&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Green:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T1 Sandy
        Output('Find price data for T1 sandy jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SANDY&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Sandy:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T1 Yellow
        Output('Find price data for T1 yellow jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=YELLOW&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Yellow:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T1 Anthracite
        Output('Find price data for T1 anthracite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=ANTHRACITE&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Anthracite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br><br>";



        //T2 Black
        Output('Find price data for T2 black jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=BLACK&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Black:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;" ;

        //T2 Ochre
        Output('Find price data for T2 ochre jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=OCHRE&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Ochre:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

         //T2 Grey
        Output('Find price data for T2 grey jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=GREY&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Grey:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T2 Blue
        Output('Find price data for T2 blue jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=BLUE&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Blue:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T2 Green
        Output('Find price data for T2 green jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=GREEN&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Green:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T2 Sandy
        Output('Find price data for T2 sandy jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SANDY&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Sandy:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T2 Yellow
        Output('Find price data for T2 yellow jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=YELLOW&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Yellow:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T2 Anthracite
        Output('Find price data for T2 anthracite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=ANTHRACITE&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Anthracite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";


        //T2 Jamaica
        Output('Find price data for T2 jamaica jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=JAMAICA&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Jamaica:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T2 Sunrise
        Output('Find price data for T2 sunrise jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SUNRISE&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Sunrise:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T2 Sunset
        Output('Find price data for T2 sunset jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SUNSET&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Sunset:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T2 Purple
        Output('Find price data for T2 sunrise jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=PURPLE&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Purple:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T2 Orange
        Output('Find price data for T2 orange jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=ORANGE&jewel__tier=2&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T2 Orange:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br><br>";




        //T3 Black
        Output('Find price data for T3 black jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=BLACK&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Black:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;" ;

        //T3 Ochre
        Output('Find price data for T3 ochre jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=OCHRE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Ochre:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

         //T3 Grey
        Output('Find price data for T3 grey jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=GREY&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Grey:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Blue
        Output('Find price data for T3 blue jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=BLUE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Blue:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T3 Green
        Output('Find price data for T3 green jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=GREEN&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Green:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Sandy
        Output('Find price data for T3 sandy jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SANDY&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Sandy:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T3 Yellow
        Output('Find price data for T3 yellow jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=YELLOW&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Yellow:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Anthracite
        Output('Find price data for T3 anthracite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=ANTHRACITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Anthracite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";


        //T3 Purple
        Output('Find price data for T3 purple jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=PURPLE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Purple:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Orange
        Output('Find price data for T3 orange jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=ORANGE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Orange:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";



        //T3 Amber
        Output('Find price data for T3 jamaica jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=AMBER&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Amber:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Andalusite
        Output('Find price data for T3 andalusite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=ANDALUSITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Andalusite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Aquamarine
        Output('Find price data for T3 Aquamarine jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=AQUAMARINE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Aquamarine:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Azurite
        Output('Find price data for T3 azurite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=AZURITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Azurite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Bloodstone
        Output('Find price data for T3 bloodstone jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=BLOODSTONE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Bloodstone:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Catseye
        Output('Find price data for T3 catseye jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=CATSEYE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Catseye:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Chrysocolla
        Output('Find price data for T3 chrysocolla jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=CHRYSOCOLLA&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Chrysocolla:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Emerald
        Output('Find price data for T3 emerald jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=EMERALD&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Emerald:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Garnet
        Output('Find price data for T3 garnet jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=GARNET&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Garnet:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Jade
        Output('Find price data for T3 jade jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=JADE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Jade:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Malachite
        Output('Find price data for T3 malachite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=MALACHITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Malachite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Obsidian
        Output('Find price data for T3 obsidian jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=OBSIDIAN&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Obsidian:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Opal
        Output('Find price data for T3 opal jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=OPAL&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Opal:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Prehnite
        Output('Find price data for T3 prehnite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=PREHNITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Prehnite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Peridot
        Output('Find price data for T3 peridot jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=PERIDOT&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Peridot:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Pyrite
        console.log('Find price data for T3 pyrite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=PYRITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Pyrite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Ruby
        Output('Find price data for T3 ruby jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=RUBY&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Ruby:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Serpentine
        Output('Find price data for T3 serpentine jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SERPENTINE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Serpentine:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Slate
        Output('Find price data for T3 slate jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SLATE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Slate:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Sodalite
        Output('Find price data for T3 sodalite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SODALITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Sodalite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Spinel
        Output('Find price data for T3 spinel jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SPINEL&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Spinel:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Sunstone
        Output('Find price data for T3 sunstone jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=SUNSTONE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Sunstone:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Tigereye
        Output('Find price data for T3 tigereye jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=TIGEREYE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Tigereye:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Topaz
        Output('Find price data for T3 topaz jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=TOPAZ&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Topaz:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Turquoise
        Output('Find price data for T3 turquoise jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=TURQUOISE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Turquoise:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Titanite
        Output('Find price data for T3 titanite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=TITANITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Titanite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price+ "<br>";

        //T3 Tanzanite
        Output('Find price data for T3 tanzanite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=TANZANITE&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Tanzanite:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T3 Zircon
        Output('Find price data for T3 zircon jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__color_name=ZIRCON&jewel__tier=3&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T3 Zircon:</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price;

        ClearOutput();
        Output(OutputString);
        ScriptIsWorking(0);
    }

function FeatureJewelPricesAllHelp()
{
    ClearOutput();
    Output("Shows the price,fee and the full price (price+fee) of the cheapest jewels on the bazar (All jewels T1-T3)");
}





async function FeatureJewelHarvestHelper()
{


var JuwelenGesamt = 0;
var JuwelenT1 = 0;
var JuwelenT2 = 0;

var JewelsFromT1Single = 0;
var JewelsFromT2Single = 0;

ClearOutput();


//Get all jewels

var j = 0;
do
{

     var APIData = await GetAPIData("my/jewels/?expires__isnull=false&limit=10&ordering=created&offset=" + (j*10));
     //Output((j*100));

    JuwelenGesamt = JuwelenGesamt + (Object.keys(APIData.results).length);


    //Load every jewel of page
    for(var i = 0; i<Object.keys(APIData.results).length; i++)
    {
        //console.log(Object.keys(APIData.results[i].slotted_jewel_set).length);
        // ClearOutput();
        Output((j*10)+(i+1) + '. jewel analyzed');
        ScrollOutput();

        var APIData2 = await GetAPIData("my/landfields/" + APIData.results[i].landfield.id);

        //Check if T1 or T2
        if(APIData2.landfield_tier == 2)
        {
            JuwelenT2++;
            Output('Jewel from T2 property recognized');


            if(Object.keys(APIData2.tile_indexes).length == "1")
            {
                JewelsFromT2Single++;
                Output('T2 single tile recognized');
            }
        }
        else
        {
            JuwelenT1++;
            Output('Jewel from T1 property recognized');


            if(Object.keys(APIData2.tile_indexes).length == "1")
            {
                JewelsFromT1Single++;
                Output('T1 single tile recognized');
            }
        }

    }

    j++;
}while(APIData.next != null)


ClearOutput();
Output(`
                        <b>Jewel harvest helper:</b><br>
                        Jewels from T1: ` + JuwelenT1 + ` (` + JewelsFromT1Single + ` from single tiles) <br>
                        Jewels from T2: ` + JuwelenT2 + ` (` + JewelsFromT2Single + ` from single tiles) <br>
                        ---------------------------<br>
                        Jewels total: ` + JuwelenGesamt);

    ScriptIsWorking(0);
}



function FeatureJewelHarvestHelperHelp()
{
    ClearOutput();
    Output("Counts the amount of jewels generated from T1 and T2 properties and how many came from a single tile property.");
}



async function FeatureGetHolobuildingsData()
{


var VolumeTotal = 0;
var VertexTotal = 0;
var HolosTotal = 0;
var HoloOnT1 = 0;
var HoloOnT2 = 0;





var j = 0;
do
{
     var APIData = await GetAPIData("my/holobuildings/?limit=20&offset=" + (j*20));
     //Output((j*100));

    //Count Holobuildings
    HolosTotal = HolosTotal + (Object.keys(APIData.results).length);


    //Load every holo of page
    for(var i = 0; i<Object.keys(APIData.results).length; i++)
    {
        //console.log(Object.keys(APIData.results[i].slotted_jewel_set).length);
         ClearOutput();
        Output((j*20)+(i+1) + '. holobuilding analyzed');

        var APIData2 = await GetAPIData("my/landfields/" + APIData.results[i].landfield_id);

        //Check if T1 or T2
        if(APIData2.landfield_tier == 2)
        {
            HoloOnT2++;
            Output('Holobuilding on T2 property recognized');
        }
        else
        {
            HoloOnT1++;
            Output('Holobuilding on T1 property recognized');
        }


        //Get Volume/Holospace
        VolumeTotal = VolumeTotal + parseFloat(APIData.results[i].total_volume);

        //Get Vertex Count
        VertexTotal = VertexTotal + APIData.results[i].total_vertex_count ;
    }

    j++;

}while(APIData.next != null)


ClearOutput();
Output(`
                        <b>Holobuildings data:</b><br>
                        Holobuildings on T1: ` + HoloOnT1 + ` <br>
                        Holobuildings on T2: ` + HoloOnT2 + ` <br>
                        ---------------------------<br>
                        Holobuildings total: ` + HolosTotal + ` <br>
                        <br>
                        <br>
                        Holobuildings total space/volume: ` + VolumeTotal.toFixed(2) + `m3 <br>
                        Holobuildings total vertex count: ` + VertexTotal);

    ScriptIsWorking(0);
}




function FeatureGetHolobuildingsDataHelp()
{
    ClearOutput();
    Output("Counts the amount of holobuildings, the amount of holobuildings on T1 or T2 properties, the amount of holospace(volume in m3) and the total vertex count");
}


async function FeatureHolobuildingsList()
{

ClearOutput();
var HolosTotal = 0;

    Output(' <b>Holobuildings data:</b>');

var j = 0;
do
{
     var APIData = await GetAPIData("my/holobuildings/?limit=20&offset=" + (j*20));
     //Output((j*100));



    //Load every holo of page
    for(var i = 0; i<Object.keys(APIData.results).length; i++)
    {

        HolosTotal++;
        var APIData2 = await GetAPIData("my/landfields/" + APIData.results[i].landfield_id);



        Output('<span style="display: inline-block; width: 20%;">' + HolosTotal + '. HB "' + APIData.results[i].name + '" on: </span><span style="display: inline-block; width: 50%;"> <a style="color: darkblue" href="https://app.earth2.io/#propertyInfo/' + APIData2.id + '">' + APIData2.description + '</a> (T' + APIData2.landfield_tier + ';C' + APIData2.tile_class + ';' + APIData2.tile_indexes.length +' tiles) </span> &nbsp; &nbsp; &nbsp;' + APIData.results[i].total_volume + ' m3');


    }

    j++;

}while(APIData.next != null)


    ScriptIsWorking(0);
}




function FeatureHolobuildingsListHelp()
{
    ClearOutput();
    Output("Shows a list of Holobuildings");
}




async function FeaturePropertiesCounter()
{


var PropertiesTotal = 0;
var PropertiesTotalT1 = 0;
var PropertiesTotalT1C1 = 0;
var PropertiesTotalT1C2 = 0;
var PropertiesTotalT1C3 = 0;

var PropertiesTotalT2 = 0;


var TilesTotal = 0;
var TilesTotalT1 = 0;
var TilesTotalT1C1 = 0;
var TilesTotalT1C2 = 0;
var TilesTotalT1C3 = 0;

var TilesTotalT2 = 0;



//Get all jewels

var j = 0;
do
{

     var APIData = await GetAPIData("my/landfields/?limit=20&offset=" + (j*20));


    //Count total properties
    PropertiesTotal = PropertiesTotal + (Object.keys(APIData.results).length);

    //Load every property of page
    for(var i = 0; i<Object.keys(APIData.results).length; i++)
    {

         ClearOutput();
        Output((j*20)+(i+1) + '. property analyzed');

       //Count total tiles
        TilesTotal = TilesTotal + Object.keys(APIData.results[i].tile_indexes).length;

        //Check if T1 or T2
        if(APIData.results[i].landfield_tier == 2)
        {
            //T2 property
            PropertiesTotalT2++;
            TilesTotalT2 = TilesTotalT2 + Object.keys(APIData.results[i].tile_indexes).length;
            Output('T2 property recognized');



        }
        else
        {
            //T1 property
            PropertiesTotalT1++;
            TilesTotalT1 = TilesTotalT1 + Object.keys(APIData.results[i].tile_indexes).length;
            Output('T1 property recognized');


             if(APIData.results[i].tile_class == 1)
            {
                //class 1 property
                PropertiesTotalT1C1++;
                TilesTotalT1C1 = TilesTotalT1C1 + Object.keys(APIData.results[i].tile_indexes).length;
            }

             if(APIData.results[i].tile_class == 2)
            {
                //class 2 property
                PropertiesTotalT1C2++;
                TilesTotalT1C2 = TilesTotalT1C2 + Object.keys(APIData.results[i].tile_indexes).length;
            }
            if(APIData.results[i].tile_class == 3)
            {
                //class 3 property
                PropertiesTotalT1C3++;
                TilesTotalT1C3 = TilesTotalT1C3 + Object.keys(APIData.results[i].tile_indexes).length;
            }


        }

    }

    j++;
}while(APIData.next != null)


ClearOutput();
Output(`
                        <b>Properties counter:</b><br>
                        T1 Properties: C1: ` + PropertiesTotalT1C1 + ` <br>
                        T1 Properties: C2: ` + PropertiesTotalT1C2 + ` <br>
                        T1 Properties: C3: ` + PropertiesTotalT1C3 + ` <br>
                        ---------------------------<br>
                        T1 Properties total: ` + PropertiesTotalT1 + ` <br>
                        T2 Properties total: ` + PropertiesTotalT2 + ` <br>
                        <br>
                        T1 Tiles: C1: ` + TilesTotalT1C1 + ` <br>
                        T1 Tiles: C2: ` + TilesTotalT1C2 + ` <br>
                        T1 Tiles: C3: ` + TilesTotalT1C3 + ` <br>
                        ---------------------------<br>
                        T1 Tiles total: ` + TilesTotalT1 + ` <br>
                        T2 Tiles total: ` + TilesTotalT2 + ` <br>`);

    ScriptIsWorking(0);
}




function FeaturePropertiesCounterHelp()
{
    ClearOutput();
    Output("Counts the amount of: <br> - T1 class 1 properties <br> - T1 class 2 properties <br> - T1 class 3 properties <br> - T1 total properties <br> - T2 total properties <br> <br> - T1 class 1 tiles <br> - T1 class 2 tiles <br> - T1 class 3 tiles <br> - T1 total tiles <br> - T2 total tiles <br>");
}


async function FeaturePropertiesList()
{


var ListofTileSizesT1 = [];
var ListofTileSizesT1Count = [];
var ListofTileSizesT2 = [];
var ListofTileSizesT2Count = [];
var FountIt = 0;


var j = 0;
do
{

 var APIData = await GetAPIData("my/landfields/?limit=20&sort=size&offset=" + (j*20));


    //Load every property of page
    for(var i = 0; i<Object.keys(APIData.results).length; i++)
    {
         ClearOutput();
        Output((j*20)+(i+1) + '. property analyzed');


        //Check if T1 or T2
        if(APIData.results[i].landfield_tier == 2)
        {
            //T2 property
            //Check if already in list
            for(var n = 0;n < ListofTileSizesT2.length;n++)
            {
                if(ListofTileSizesT2[n] == Object.keys(APIData.results[i].tile_indexes).length)
                   {
                       //Found it in list
                       FountIt = 1;
                       ListofTileSizesT2Count[n]++;
                   }
            }

            if(FountIt == 0)
            {
                ListofTileSizesT2[ListofTileSizesT2.length] = Object.keys(APIData.results[i].tile_indexes).length;
                ListofTileSizesT2Count[(ListofTileSizesT2.length-1)]  = 1;
            }
            else
            {
                FountIt = 0;
            }

        }
        else
        {
            //T1 property
            //Check if already in list
            for(var k = 0;k < ListofTileSizesT1.length;k++)
            {
                if(ListofTileSizesT1[k] == Object.keys(APIData.results[i].tile_indexes).length)
                   {
                       //Found it in list
                       FountIt = 1;
                       ListofTileSizesT1Count[k]++;
                   }
            }

            if(FountIt == 0)
            {
                ListofTileSizesT1[ListofTileSizesT1.length] = Object.keys(APIData.results[i].tile_indexes).length;
                ListofTileSizesT1Count[(ListofTileSizesT1.length-1)]  = 1;
            }
            else
            {
                FountIt = 0;
            }

       }

    }

    j++;
}while(APIData.next != null)


     // map to dict
    var listOfT1Props = ListofTileSizesT1.map((x, i) => ({ x, count: ListofTileSizesT1Count[i] }));
    var listOfT2Props = ListofTileSizesT2.map((x, i) => ({ x, count: ListofTileSizesT2Count[i] }));

    // order dict
    listOfT1Props = listOfT1Props.sort((a, b) => a.x > b.x ? 1 : -1);
    listOfT2Props = listOfT2Props.sort((a, b) => a.x > b.x ? 1 : -1);


    //Output T1
    ClearOutput();
    Output(`
                        <b>Properties sizes counter:</b><br>
            `);

    for(var l = 0;l < listOfT1Props.length;l++)
    {
         Output(listOfT1Props[l].x + "-tile T1 properties: " + listOfT1Props[l].count + "x");
    }

    Output("<br>");

    for(var m = 0;m < listOfT2Props.length;m++)
    {
             Output(listOfT2Props[m].x + "-tile T2 properties: " + listOfT2Props[m].count + "x");
    }

ScriptIsWorking(0);
}


function FeaturePropertiesListHelp()
{
    ClearOutput();
    Output("Creates a list of (T1 and T2) properties sizes");
}


async function FeatureProfitCalc()
{


var TotalProfit = 0;
var SalesTotal = 0;
var CountProfitCalcSuccessful = 0;
var ErrorTransactionsList = "";
var ErrorCount = 0;

ClearOutput();



        var k = 0;
        do
        {
            //Get every purchase ; 100
            var APIData2 = await GetAPIData("my/balance_changes/?balance_change_type=PURCHASE&limit=100&offset=" + (k*100));


            var j = 0;
            do
            {

                //Get every sale; 100
                var APIData = await GetAPIData("my/balance_changes/?balance_change_type=SALE&limit=100&offset=" + (j*100));

                //Load every property of purchase page
                for(var l = 0; l<Object.keys(APIData2.results).length; l++)
                {
                    //console.log(l);
                    //Output((j*11)+(i+1) + '. property sale analyzed');

                    //Load every property of sale page
                    for(var i = 0; i<Object.keys(APIData.results).length; i++)
                    {

                        //Bugfix:
                        if(APIData.results[i].linked_object == null || APIData2.results[l].linked_object == null )
                        {
                            if(APIData.results[i].linked_object == null)
                            {
                                Output("Error 1: Property #" +(i+1));
                                ErrorCount++;
                                ErrorTransactionsList += '<span style="display: inline-block; color: darkred; font-weight: bold">Error 1: Page: #' + (i+j) + ' Property #' + (j*100+(i+1)) + '</span><br>';

                            }

                            if(APIData2.results[l].linked_object == null)
                            {
                                Output("Error 2: Property #" +(i+1));
                                ErrorCount++;
                                ErrorTransactionsList += '<span style="display: inline-block; color: darkred; font-weight: bold">Error 2: Page: #' + (i+j) + ' Property #' + (j*100+(i+1)) + '</span><br>';

                            }
                        }// Ende Bugfix
                        else
                        {
                            if(APIData.results[i].linked_object.id == APIData2.results[l].linked_object.id)
                            {

                                CountProfitCalcSuccessful++;
                                Output('Property: <b>' + APIData2.results[l].linked_object.description + '</b> <a style="color: darkblue" href=https://app.earth2.io/#propertyInfo/' + APIData2.results[l].linked_object.id + '>LINK</a> <br>Purchase ' + APIData2.results[l].amount + 'E$ <b>--></b> +' + APIData.results[i].amount + 'E$ Sold <br>Profit: ' + ((APIData.results[i].amount)+(APIData2.results[l].amount)).toFixed(2) + 'E$<br>');
                                //Count total profit
                                TotalProfit = TotalProfit + (APIData.results[i].amount+APIData2.results[l].amount);

                                //l = Object.keys(APIData2.results).length; //Stop for loop
                            }
                        }

                    }
                }

               j++;
            }while(APIData.next != null)


            k++;
        }while(APIData2.next != null)

SalesTotal = APIData.count;
Output("------------------------------- <br>Total profit: " + TotalProfit.toFixed(2) + "E$<br><br>Total sales: " + SalesTotal + " properties <br>Successful calculated sales: " + CountProfitCalcSuccessful + " properties <br><br>Can't calculate profit for <b>" + (SalesTotal-CountProfitCalcSuccessful) + " </b>properties<br> (Properties bought through accepted bids can't be calculated atm.)");

if(ErrorCount > 0)
{
    Output("<br>Got errors from <b>" + ErrorCount + "</b> transactions.<br>This transactions are not listed above and are NOT included in the calculation above!");
    Output("List of transactions with errors: <br>" + ErrorTransactionsList);
}

ScriptIsWorking(0);
}




function FeatureProfitCalcHelp()
{
    ClearOutput();
    Output("Show how much profit is made with sold properties");
}




async function FeatureJewelPricesT1Cracked()
    {
        ClearOutput(); //Clear Text Output

        var OutputString = "";

        //T1 Black
        Output('Find price data for T1 cracked black jewels.....');
        var APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=CRACKED&jewel__color_name=BLACK&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Black(Cracked):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;" ;

        //T1 Ochre
        Output('Find price data for T1 cracked ochre jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=CRACKED&jewel__color_name=OCHRE&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Ochre(Cracked):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

         //T1 Grey
        Output('Find price data for T1 cracked grey jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=CRACKED&jewel__color_name=GREY&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Grey(Cracked):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T1 Blue
        Output('Find price data for T1 cracked blue jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=CRACKED&jewel__color_name=BLUE&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Blue(Cracked):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T1 Green
        Output('Find price data for T1 cracked green jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=CRACKED&jewel__color_name=GREEN&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Green(Cracked):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T1 Sandy
        Output('Find price data for T1 cracked sandy jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=CRACKED&jewel__color_name=SANDY&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Sandy(Cracked):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T1 Yellow
        Output('Find price data for T1 cracked yellow jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=CRACKED&jewel__color_name=YELLOW&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Yellow(Cracked):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T1 Anthracite
        Output('Find price data for T1 cracked anthracite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=CRACKED&jewel__color_name=ANTHRACITE&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Anthracite(Cracked):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price;

        ClearOutput();
        Output(OutputString);

        ScriptIsWorking(0);
    }

function FeatureJewelPricesT1CrackedHelp()
{
    ClearOutput();
    Output("Shows the price,fee and the full price (price+fee) of the cheapest jewels on the bazar (Only T1 cracked jewels)");
}


async function FeatureJewelPricesT1Common()
    {
        ClearOutput(); //Clear Text Output

        var OutputString = "";

        //T1 Black
        Output('Find price data for T1 common black jewels.....');
        var APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=COMMON&jewel__color_name=BLACK&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Black(Common):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;" ;

        //T1 Ochre
        Output('Find price data for T1 common ochre jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=COMMON&jewel__color_name=OCHRE&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Ochre(Common):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

         //T1 Grey
        Output('Find price data for T1 common grey jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=COMMON&jewel__color_name=GREY&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Grey(Common):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T1 Blue
        Output('Find price data for T1 common blue jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=COMMON&jewel__color_name=BLUE&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Blue(Common):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T1 Green
        Output('Find price data for T1 common green jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=COMMON&jewel__color_name=GREEN&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Green(Common):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T1 Sandy
        Output('Find price data for T1 common sandy jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=COMMON&jewel__color_name=SANDY&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Sandy(Common):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "<br>";

        //T1 Yellow
        Output('Find price data for T1 common yellow jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=COMMON&jewel__color_name=YELLOW&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Yellow(Common):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price + "&nbsp; &nbsp; &nbsp; &nbsp;";

        //T1 Anthracite
        Output('Find price data for T1 common anthracite jewels.....');
        APIData = await GetAPIData("bazaar/jewel_offers/?jewel__quality_level=COMMON&jewel__color_name=ANTHRACITE&jewel__tier=1&limit=5&offset=0&ordering=full_price");
        OutputString = OutputString + "<b>T1 Anthracite(Common):</b> Price:  " + APIData.results[0].price + "; Fee: " + APIData.results[0].fee + "; Full price: " + APIData.results[0].full_price;

        ClearOutput();
        Output(OutputString);

        ScriptIsWorking(0);
    }

function FeatureJewelPricesT1CommonHelp()
{
    ClearOutput();
    Output("Shows the price,fee and the full price (price+fee) of the cheapest jewels on the bazar (Only T1 common jewels)");
}


async function FeatureOpenBids()
{
    ClearOutput();

    //Todo: get user id
    var UserID = await GetAPIData("my/landfields/?limit=1&offset=0");
    UserID = UserID.results[0].owner;
    // Output(UserID);

    var TotalOpenBids = 0;
    var TotalOpenBidsAmount = 0;

        var i = 0;
        do
        {
            //Get every bid made ; 100
            var APIData = await GetAPIData("my/balance_changes/?balance_change_type=BID_MADE&limit=100&offset=" + (i*100));


            //Load every bid
            for(var j = 0; j<Object.keys(APIData.results).length; j++)
            {


                TotalApiRequests++;

                if(TotalApiRequests == 50 || TotalApiRequests == 100)
                {
                    TimetoWait = TimetoWait+500; //+500 ms
                }

                var IsSuccessful = 0;
                var APIData2 = null;

                while(IsSuccessful == 0)
                {
                    ScriptIsWorking(1);
                    try{
                        APIData2 = await $.getJSON('https://app.earth2.io/graphql?query={getOngoingBids(landfieldId:"' + APIData.results[j].linked_object.id + '"){result,buyer{id},offerSet{createdStr,value}}}', {_: new Date().getTime()})
                        .done(function() {
                            IsSuccessful = 1;
                        });
                    }catch(error){
                        //console.log(error);
                        Output('<span style="display: inline-block; color: darkred; font-weight: bold">Error: ' + error.status + ' - Script waits now 2 minutes and then tries again!</span>');
                        ScrollOutput();
                        await timeout(120000);
                    }

                }

                ScriptIsWorking(1);

                 //Speed throttling
                if(localStorage.getItem('E2MultiTool_IsSpeedThrottlingActive') == 1)
                {
                    console.log("Speed throttling: Wait " + TimetoWait + "ms");
                    await timeout(TimetoWait);
                }

                //check every bid of property
                for(var k = 0; k<Object.keys(APIData2.data.getOngoingBids).length; k++)
                {
                    //Output("k:" +k);
                   if(APIData2.data.getOngoingBids[k].buyer.id == UserID)
                   {
                       //Open Bid found:
                       TotalOpenBids++;
                       TotalOpenBidsAmount = TotalOpenBidsAmount + APIData.results[j].amount;
                       Output(TotalOpenBids + '. open bid: <b>' + APIData.results[j].linked_object.description + '</b> <a style="color: darkblue" href=https://app.earth2.io/#thegrid/' + APIData.results[j].linked_object.id + '>LINK</a> Date: ' + APIData2.data.getOngoingBids[k].offerSet[0].createdStr + '; Amount: ' + APIData.results[j].amount + 'E$');
                       ScrollOutput();
                   }
                }

            }
         i++;
        }while(APIData.next != null)


        Output("------------------------------ <br> Total open bids: " + TotalOpenBids);
        Output("Total amount: " + TotalOpenBidsAmount);
        ScriptIsWorking(0);
}


async function FeatureOpenBidsHelp()
{
ClearOutput();
    Output("Shows open bids (with link to property and amount of the bid), total open bids and total value of open bids ");
}



async function FeatureEssenceData()
{
    ClearOutput();

    Output(`
    1. <button id="Button_FeatureEssenceDataBeforeClaimAndTransform" style="width:10%; border: 1px solid black; background:lightgrey">Click here</button> to get data <b>before</b> claim & transformation<br>
    2. Claim and transform ether <br>
    3. <button id="Button_FeatureEssenceDataAfterClaimAndTransform" style="width:10%; border: 1px solid black; background:lightgrey">Click here</button> to get data <b>after</b> claim & transformation<br>
    4. Now you see data like EDC and OEDC below<br>
    <br>`);

   // <b>Method 2: Automatically (This will claim and transform your ether to essence!)</b><br>
    //<button id="Button_FeatureEssenceDataAutomatically" style="width:10%; border: 1px solid black; background:lightgrey">Click here</button>


    $("#Button_FeatureEssenceDataBeforeClaimAndTransform").click (FeatureEssenceData_BeforeClaimAndTransform);
    $("#Button_FeatureEssenceDataAutomatically").click (FeatureEssenceData_Automatically);


    ScriptIsWorking(0);
}

async function FeatureEssenceData_BeforeClaimAndTransform()
{

    ScriptIsWorking(1);
    var APIData = await GetAPIData("my/mentars/claimable_ether_amount/");
    ScriptIsWorking(1);
    var APIData2 = await GetAPIData("my/resources/balance/");
    //Output(APIData);
    Output(`
    Data before claim & transformation: ` + APIData2.ESNC + ` Essence; ` + APIData2.PESNC + ` EDC; ` + APIData.amount + ` Ether`);


    Ether = APIData.amount;
    EssenceBeforeClaimAndTransform = APIData2.ESNC;
    PromisedEssenceBeforeClaimAndTransform = APIData2.PESNC;
    $("#Button_FeatureEssenceDataAfterClaimAndTransform").click (FeatureEssenceData_AfterClaimAndTransform);
    ScriptIsWorking(0);
}


async function FeatureEssenceData_AfterClaimAndTransform()
{
    ScriptIsWorking(1);
    var APIData = await GetAPIData("my/mentars/claimable_ether_amount/");
    ScriptIsWorking(1);
    var APIData2 = await GetAPIData("my/resources/balance/");
    //Output(APIData);

    Output(`
    Data after claim and transformation: ` + APIData2.ESNC + ` Essence; ` + APIData2.PESNC + ` EDC; ` + APIData.amount + ` Ether<br>
    -----------------------------------------------<br>`+ Ether +
    ` Ether ---> ` + (APIData2.ESNC-EssenceBeforeClaimAndTransform) + ` Essence (` + (PromisedEssenceBeforeClaimAndTransform-APIData2.PESNC) + ` EDC; ` + ((APIData2.ESNC-EssenceBeforeClaimAndTransform)-(PromisedEssenceBeforeClaimAndTransform-APIData2.PESNC)) + ` OEDC) <br>
    <br>
    <button id="Button_FeatureEssenceDataSaveData" style="width:10%; border: 1px solid black; background:lightgrey">Save data local</button> &nbsp; &nbsp; <button id="Button_FeatureEssenceDataGetData" style="width:10%; border: 1px solid black; background:lightgrey">Get saved data</button> &nbsp; &nbsp; <button id="Button_FeatureEssenceDataDeleteData" style="width:15%; border: 1px solid black; background:lightgrey">Delete saved data</button><br>
    `);

    tmp =  Ether + ` Ether ---> ` + (APIData2.ESNC-EssenceBeforeClaimAndTransform) + ` Essence (` + (PromisedEssenceBeforeClaimAndTransform-APIData2.PESNC) + ` EDC; ` + ((APIData2.ESNC-EssenceBeforeClaimAndTransform)-(PromisedEssenceBeforeClaimAndTransform-APIData2.PESNC)) + ` OEDC)`;

    $("#Button_FeatureEssenceDataSaveData").click (FeatureEssenceData_SaveData);
    $("#Button_FeatureEssenceDataGetData").click (FeatureEssenceData_GetData);
    $("#Button_FeatureEssenceDataDeleteData").click (FeatureEssenceData_DeleteData);

    Ether = 0;
    EssenceBeforeClaimAndTransform = 0;
    PromisedEssenceBeforeClaimAndTransform = 0;
    ScriptIsWorking(0);
}

async function FeatureEssenceData_Automatically()
{
   // document.getElementsByClassName("material-icons ml-2.5 select-none").click();
   // $(".material-icons ml-2.5 select-none").trigger("click");
}

async function FeatureEssenceData_SaveData()
{
    ScriptIsWorking(1);
    const DateAndTime = new Date();

    if(localStorage.getItem('E2MultiTool_Essencedata') == null)
    {
        localStorage.setItem('E2MultiTool_Essencedata','');
    }

    localStorage.setItem('E2MultiTool_Essencedata', localStorage.getItem('E2MultiTool_Essencedata') + "<br>" + DateAndTime.getFullYear() + "-" + (DateAndTime.getMonth()+1) + "-" + DateAndTime.getDate() + " " + DateAndTime.getHours() + ":" + DateAndTime.getMinutes() + ": " + tmp);
    Output("<b>Saved todays essence data</b>");
    ScriptIsWorking(0);

    $("#Button_FeatureEssenceDataSaveData").click (FeatureEssenceData_SaveData);
    $("#Button_FeatureEssenceDataGetData").click (FeatureEssenceData_GetData);
    $("#Button_FeatureEssenceDataDeleteData").click (FeatureEssenceData_DeleteData);
}

async function FeatureEssenceData_GetData()
{
    ScriptIsWorking(1);
    Output("<b>Saved Essence data:</b>" + localStorage.getItem('E2MultiTool_Essencedata'));
    ScriptIsWorking(0);

    $("#Button_FeatureEssenceDataSaveData").click (FeatureEssenceData_SaveData);
    $("#Button_FeatureEssenceDataGetData").click (FeatureEssenceData_GetData);
    $("#Button_FeatureEssenceDataDeleteData").click (FeatureEssenceData_DeleteData);
}

async function FeatureEssenceData_DeleteData()
{
    ScriptIsWorking(1);
    localStorage.removeItem('E2MultiTool_Essencedata');
    Output("<b>Saved essence data is deleted</b>");
    ScriptIsWorking(0);

    $("#Button_FeatureEssenceDataSaveData").click (FeatureEssenceData_SaveData);
    $("#Button_FeatureEssenceDataGetData").click (FeatureEssenceData_GetData);
    $("#Button_FeatureEssenceDataDeleteData").click (FeatureEssenceData_DeleteData);
}


async function FeatureEssenceDataHelp()
{
ClearOutput();
    Output("Shows data like essence, ether available to claim and how much essence comes from EDC and OEDC(after claiming and transforming)");
}




async function FeatureLITData()
{
    var Properties = [];
    var TotalLIT = 0;
    var TotalLITProperties = 0;
    var i = 0;

    do
    {
        //Get every lit income ; 100
        var APIData = await GetAPIData("my/balance_changes/?balance_change_type=INCOME_LAND_CLASS&limit=11&offset=" + (i*11));



         //Load every lit income
            for(var j = 0; j<Object.keys(APIData.results).length; j++)
            {

                var IndexOfProperty = Properties.findIndex(p => p.id == APIData.results[j].linked_object.id);

               if(IndexOfProperty != -1)
               {
                   //Property is in list
                   // Output ("Is in list");


                   //Output("Index: " + IndexOfProperty);
                   Properties[IndexOfProperty].litamount += APIData.results[j].amount;
                   Properties[IndexOfProperty].litcount++;
               }
               else
               {
                   //Property not in list: add
                   //Output ("Add to list");

                   var NewProperty = new Object();
                   NewProperty.id = APIData.results[j].linked_object.id;
                   NewProperty.litamount = APIData.results[j].amount;
                   NewProperty.litcount = 1 ;
                   NewProperty.description = APIData.results[j].linked_object.description;
                   NewProperty.tiles_count = APIData.results[j].linked_object.tiles_count;

                  Properties.push(NewProperty); //Add property to list
               }
            }
        i++;
    }while(APIData.next != null)

    ClearOutput();
    Properties.forEach((p, index ) => { TotalLIT += Properties[index].litamount; TotalLITProperties++; Output('<b>' + Properties[index].description + '<b> (Tiles: ' + Properties[index].tiles_count + ') <a style="color: darkblue" href="https://app.earth2.io/#propertyInfo/' + Properties[index].id + '">LINK</a><br>LIT amount: '+ Properties[index].litamount.toFixed(2) + '<br>LIT received: ' + Properties[index].litcount + '<br>')});

    Output(`
                     ----------------------------------<br>
                     Total properties with LIT: `+ TotalLITProperties + `<br>
                     Total LIT amount: ` + TotalLIT.toFixed(2) );


    ScrollOutput();
    ScriptIsWorking(0);
}




function FeatureLITDataHelp()
{
    ClearOutput();
    Output("Show how much LIT comes from properties");
}


async function FeatureDepositsAndWithdrawalData()
{
    var DepositsList = "";
    var WithdrawalsList = "";
    var TotalDepositsAmount = 0;
    var TotalWithdrawalsAmount = 0;
    var TotalWithdrawalsAmountFee = 0;

    var WithdrawalsWithoutAmount = 0;


    ClearOutput();

    //Get data for deposits
    var k = 0;
    do
    {
        //Get every deposit ; 100
        var APIData = await GetAPIData("my/balance_changes/?balance_change_type=CREDIT&limit=100&offset=" + (k*100));

        Output("Load deposits: Page " + (k+1));

        //Load every deposit
        for(var j = 0; j<Object.keys(APIData.results).length; j++)
        {
            TotalDepositsAmount += APIData.results[j].amount;
            DepositsList = DepositsList + APIData.results[j].created_display + ":&nbsp; &nbsp;" + APIData.results[j].amount + "<br>";
        }

        k++;
    }while(APIData.next != null)



    //Get data for withdrawls
    var i = 0;

    do
    {
        //Get every withdrawl ; 100
        var APIData2 = await GetAPIData("my/balance_changes/?balance_change_type=PAYOUT_REQUESTED_FEE&limit=100&offset=" + (i*100));

        Output("Load withdrawals: Page " + (i+1));

        //Load every withdrawl
        for(var m = 0; m<Object.keys(APIData2.results).length; m++)
        {
            //Output("Test auszahlung #" + m + ": Status: " + APIData2.results[m].linked_object.status + "; Amount: " + APIData2.results[m].linked_object.amount);

            if(APIData2.results[m].linked_object != null)
            {
                if(APIData2.results[m].linked_object.status == "COMPLETE")
                {
                    //Output("Auszahlung #" + m + " complete");
                    TotalWithdrawalsAmount += parseFloat(APIData2.results[m].linked_object.amount);
                    TotalWithdrawalsAmountFee += APIData2.results[m].amount;
                    WithdrawalsList = WithdrawalsList + APIData2.results[m].created_display + ":&nbsp; &nbsp;Amount(incl. fee): " + APIData2.results[m].linked_object.amount + '&nbsp; &nbsp;Fee: ' + APIData2.results[m].amount + '<br>';
                }
            }
            else
            {
                Output("Cant load payout amount, only fee: " + APIData2.results[m].amount);
                Output("This payout is ignored in total withdrawals amount and in withdrawals fees amount!");
                WithdrawalsWithoutAmount++;
            }
        }


        i++;
    }while(APIData2.next != null)

            ClearOutput();
            Output("<b>Deposits:</b><br>" + DepositsList + "<br><b>Withdrawals:</b><br>" + WithdrawalsList);
            Output("------------------------------------------------<br>Total deposits amount: " + TotalDepositsAmount.toFixed(2) + "<br>Total withdrawals amount: " + TotalWithdrawalsAmount.toFixed(2));
            Output("Total withdrawals fees amount: " + TotalWithdrawalsAmountFee.toFixed(2) + "<br>Total withdrawals amount without fees: " + (TotalWithdrawalsAmount - Math.abs(TotalWithdrawalsAmountFee)).toFixed(2));
            Output("Cant get data for <b>" + WithdrawalsWithoutAmount + "</b> withdrawals. This withdrawals are ignored in the calculation above!");
            ScrollOutput();
            ScriptIsWorking(0);
}


function FeatureDepositsAndWithdrawalDataHelp()
{
    ClearOutput();
    Output("Show a list of deposits and withdrawals and the total amounts of it.");
}


async function FeatureRefIncomeCalc()
{
        var RefCodeIncomeList = [];
        var TotalRefCodeIncomeAmount = 0;
        var TotalRefCodeIncomeAmountOtherUsers = 0;
        var ErrorCount = 0;
        var ErrorTransactionsList = "";

        ClearOutput();

        //Get data for ref code income
        var i = 0;
        do
        {

            Output("Load referral code income: Page " + (i+1));

            //Get every income ; 100
            var APIData = await GetAPIData("my/balance_changes/?balance_change_type=INCOME_REFERRAL_CODE&limit=100&offset=" + (i*100));

             //Load every ref code purchase
            for(var j = 0; j<Object.keys(APIData.results).length; j++)
            {

                //has linked property?
                if(APIData.results[j].linked_object == null || APIData.results[j].linked_object == undefined)
                {
                    //Cant load linked property
                    Output('<span style="display: inline-block; color: darkred; font-weight: bold"> Error: Cant get linked property:Referral income: Page: #' + (i+1) + ' Property #' + (i*100+(j+1)) + 'Amount: ' + APIData.results[j].amount + '</span>');
                   ErrorCount++;
                    ErrorTransactionsList += '<span style="display: inline-block; color: darkred; font-weight: bold">Page: #' + (i+1) + 'Referral income: Property #' + (i*100+(j+1)) + ' Amount: ' + APIData.results[j].amount + '</span><br>';
                }
                else
                {
                    //Got linked property
                    TotalRefCodeIncomeAmount += APIData.results[j].amount;
                     RefCodeIncomeList.push(APIData.results[j].created_display + ":&nbsp; &nbsp;&nbsp; &nbsp;" + APIData.results[j].amount.toFixed(2) + '&nbsp; &nbsp;<span style="display: inline-block; width: 30%;"> Property: ' + APIData.results[j].linked_object.description + '</span>&nbsp; &nbsp;<a style="color: darkblue" href="https://app.earth2.io/#propertyInfo/' + APIData.results[j].linked_object.id + '">LINK to property</a><br>');
                }

           }

            i++;
        }while(APIData.next != null)


         //Filter own purchases, remove them

            var k = 0;
        do
        {
            //Get every purchase ; 100
            var APIData2 = await GetAPIData("my/balance_changes/?balance_change_type=PURCHASE&limit=100&offset=" + (k*100));



            //Load every property of purchase page
            for(var l = 0; l<Object.keys(APIData2.results).length; l++)
            {
                if(APIData2.results[l].linked_object == null || APIData2.results[l].linked_object == undefined)
                {
                   Output('<span style="display: inline-block; color: darkred; font-weight: bold"> Error: Cant get linked property: Purchases: Page: #' + (k+1) + ' Property #' + (k*100+(l+1)) + '</span>');
                   ErrorCount++;
                   ErrorTransactionsList += '<span style="display: inline-block; color: darkred; font-weight: bold">Purchases: Page: #' + (k+1) + ' Property #' + (k*100+(l+1)) + '</span><br>';
                }
                else
                {
                    //Ceck every transaction
                    RefCodeIncomeList = RefCodeIncomeList.filter(function(e) { return !e.includes(APIData2.results[l].linked_object.id) });
                }
            }




            k++;
        }while(APIData2.next != null)


            RefCodeIncomeList.forEach(element => {
                TotalRefCodeIncomeAmountOtherUsers += parseFloat(element.substring(element.indexOf(":&nbsp; &nbsp;&nbsp; &nbsp;") + 27, element.indexOf("&nbsp; &nbsp;<span style")));
            });







        ClearOutput();
        Output("<b>Referral code income:</b><br>" + RefCodeIncomeList.join(""));
        Output("------------------------------------------------ <br> Total income from other users: " + TotalRefCodeIncomeAmountOtherUsers.toFixed(2));
        Output("Total income from own purchases: " + (TotalRefCodeIncomeAmount-TotalRefCodeIncomeAmountOtherUsers).toFixed(2));
        Output("------------------------------------------------ <br> Total income (own + other users purchase): " + TotalRefCodeIncomeAmount.toFixed(2));

    if(ErrorCount > 0)
    {
        Output("<br>Cant get linked property from <b>" + ErrorCount + "</b> transactions.<br>This transactions are not listed above and the amount is NOT included in the calculation above!");
        Output("List of transactions without linked property: <br>" + ErrorTransactionsList);
    }

        ScrollOutput();
        ScriptIsWorking(0);

}


function FeatureRefIncomeCalcHelp()
{
    ClearOutput();
    Output("Show how money comes from purchases with referral code");
}

function FeatureSpeedThrottlingHelp()
{
    ClearOutput();
    Output("<br><br>If activated, it throttles the speed of the script by making breaks between the requests to Earth2. <br><b>It is recommended to have it activated. </b>");
}


async function FeaturePropertiesMap()
{
    ClearOutput();

     var attribution = new ol.control.Attribution({
     collapsible: false
     });

    var map = new ol.Map({
        controls: ol.control.defaults({attribution: false}).extend([attribution]),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM({
                    url: 'https://tile.openstreetmap.be/osmbe/{z}/{x}/{y}.png',
                                      attributions: [ ol.source.OSM.ATTRIBUTION, 'Tiles courtesy of <a href="https://geo6.be/">GEO-6</a>' ],
                    maxZoom: 18
                })
            })
        ],
        target: 'ScriptTextOutput',
        view: new ol.View({
            center: ol.proj.fromLonLat([4.35247, 50.84673]),
            maxZoom: 18,
            zoom: 12
        })
    });



var j = 0;
do
{

var APIData = await GetAPIData("my/landfields/?limit=20&sort=size&offset=" + (j*20));



    //Load every property of page
    for(var i = 0; i<Object.keys(APIData.results).length; i++)
    {



        //Check if T1 or T2
        if(APIData.results[i].landfield_tier == 2)
        {
            //T2 property

        }
        else
        {
            //T1 property
       }

        var tmp1 = APIData.results[i].center.substring(
    APIData.results[i].center.indexOf("(") + 1,
    APIData.results[i].center.lastIndexOf(",")
);
        var tmp2 =APIData.results[i].center.substring(
    APIData.results[i].center.indexOf(",") + 1,
    APIData.results[i].center.lastIndexOf(")")
);



        //Output(tmpLocation);
         var Feature = new ol.Feature({
             geometry:  new ol.geom.Point(ol.proj.fromLonLat([tmp2,tmp1]))
         });

        var layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                    Feature
                ]
            })
        });

        map.addLayer(layer);
        await timeout(500);

    }


    j++;

}while(APIData.next != null)
ScriptIsWorking(0);





}


function FeaturePropertiesMapHelp()
{

}



async function FeaturePropertiesMap3D()
{
    ClearOutput();

     var earth;
      function initialize() {
        earth = new WE.map('ScriptTextOutput');
        earth.setView([46.8011, 8.2266], 3);
        WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
          attribution: '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>'
        }).addTo(earth);





        // Start a simple rotation animation
        /*var before = null;
        requestAnimationFrame(function animate(now) {
            var c = earth.getPosition();
            var elapsed = before? now - before: 0;
            before = now;
            earth.setCenter([c[0], c[1] + 0.1*(elapsed/30)]);
            requestAnimationFrame(animate);
        });*/
      }
    initialize();



var j = 0;
do
{

var APIData = await GetAPIData("my/landfields/?limit=20&sort=size&offset=" + (j*20));



    //Load every property of page
    for(var i = 0; i<Object.keys(APIData.results).length; i++)
    {



        //Check if T1 or T2
        if(APIData.results[i].landfield_tier == 2)
        {
            //T2 property

        }
        else
        {
            //T1 property
       }

        var tmp1 = APIData.results[i].center.substring(
    APIData.results[i].center.indexOf("(") + 1,
    APIData.results[i].center.lastIndexOf(",")
);
        var tmp2 =APIData.results[i].center.substring(
    APIData.results[i].center.indexOf(",") + 1,
    APIData.results[i].center.lastIndexOf(")")
);



        //Add marker
         var marker = [];
         marker[j+i] = WE.marker([tmp2,tmp1],'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB2SURBVChTjZC9FYAgDIQvWUE7LVnCQXQPJ3EQBmEJSu10BZHjp+Th15BL7iW8ExSeyaxBsMdyoQ6A1QA7XN5SJ+M9m9hvM55elJuKbkKPvoKukV+S3tmKlrcLjS6XbVICEnAU3YQx/Y+nFnHzxhNpknHscQYAH98JJ3YHBubHAAAAAElFTkSuQmCC',10,10).addTo(earth);
        marker[j+i].bindPopup("<b>" + APIData.results[i].description +"</b><br>" + APIData.results[i].location + "<br>(" + tmp2 + "," + tmp1 + ")<br><br>" + APIData.results[i].tile_indexes.length + " Tiles - T"+ APIData.results[i].landfield_tier +"  C" + APIData.results[i].tile_class + "<br>For Sale: " + APIData.results[i].for_sale + "<br><br><a style='color: blue' href='https://app.earth2.io/#thegrid/" + APIData.results[i].id + "'>Link to map</a><br><a style='color: blue' href='https://app.earth2.io/#propertyInfo/" + APIData.results[i].id + "'>Link to propertyinfo</a>", {maxWidth: 250, closeButton: true});



       // await timeout(500);

    }


    j++;

}while(APIData.next != null)
ScriptIsWorking(0);





}


function FeaturePropertiesMap3DHelp()
{

}


function MinimizeMaximize()
    {
        var MinimizeMaximizeMenu = document.getElementById("MaximizeMenu");
        var E2Multitool = document.getElementById("E2Multitool");

        if (MinimizeMaximizeMenu.style.display == "none")
        {
            MinimizeMaximizeMenu.style.display = "block";
            E2Multitool.style.display = "none";
            localStorage.setItem('E2MultiTool_IsMinmized','1');
        } else
        {
            MinimizeMaximizeMenu.style.display = "none";
            E2Multitool.style.display = "block";
            localStorage.setItem('E2MultiTool_IsMinmized','0');
        }

    }




async function MainFunction()
{



    //Show loading
    var LoadingDIV = document.createElement ('div');
    LoadingDIV.innerHTML ='<div id="loading" style="width:100%; border: 5px solid red; text-align:center">LOADING...</div>'
    document.body.prepend(LoadingDIV);




    var ScriptHTML = document.createElement ('div');
    ScriptHTML.innerHTML =
        `<div id="E2Multitool" style="border: 8px ridge green; background-color: rgba(51, 170, 51, .3)">
              <div style="width:100%; text-align:center "> <u><b>E2 Multitool by ExKcir</b></u><br><br> </div>

              <div  style="width:100%;display: block; align-items: stretch; text-align:center; margin-top: -20px;">
                        
                  <div  style="width:25%; text-align:center; float: left">
 
                       <button id="Button_JewelHarvestHelper" style="width:40%; border: 1px solid black; background:lightgrey">Jewel harvest helper </button>
                       <button id="Button_JewelHarvestHelperHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_HoloBuildingsList" style="width:40%; border: 1px solid black; background:lightgrey">Holobuildings list</button>
                       <button id="Button_HoloBuildingsListHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <button id="Button_JewelCounter" style="width:40%; border: 1px solid black; background:lightgrey">Jewel counter</button>
                       <button id="Button_JewelCounterHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_JewelCounterPlus" style="width:40%; border: 1px solid black; background:lightgrey">Jewel counter + list</button>
                       <button id="Button_JewelCounterPlusHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <button id="Button_JewelPricesT1" style="width:40%; border: 1px solid black; background:lightgrey">Jewel prices (T1)</button>
                       <button id="Button_JewelPricesT1Help" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_JewelPricesT1Cracked" style="width:40%; border: 1px solid black; background:lightgrey">Jewel prices (T1 Cracked)</button>
                       <button id="Button_JewelPricesT1CrackedHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <button id="Button_JewelPricesT1Common" style="width:40%; border: 1px solid black; background:lightgrey">Jewel prices (T1 Common)</button>
                       <button id="Button_JewelPricesT1CommonHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_JewelPricesT2" style="width:40%; border: 1px solid black; background:lightgrey">Jewel prices (T2)</button>
                       <button id="Button_JewelPricesT2Help" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <button id="Button_JewelPricesT3" style="width:40%; border: 1px solid black; background:lightgrey">Jewel prices (T3)</button>
                       <button id="Button_JewelPricesT3Help" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_JewelPricesAll" style="width:40%; border: 1px solid black; background:lightgrey">Jewel prices (All)</button>
                       <button id="Button_JewelPricesAllHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <button id="Button_HolobuildingData" style="width:40%; border: 1px solid black; background:lightgrey">Holobuilding data </button>
                       <button id="Button_HolobuildingDataHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_PropertiesCounter" style="width:40%; border: 1px solid black; background:lightgrey">Properties/tiles counter</button>
                       <button id="Button_PropertiesCounterHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <button id="Button_PropertiesSizeList" style="width:40%; border: 1px solid black; background:lightgrey">Properties sizes list</button>
                       <button id="Button_PropertiesSizeListHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_ProfitCalc" style="width:40%; border: 1px solid black; background:lightgrey">Profit calculator (Properties)</button>
                       <button id="Button_ProfitCalcHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <!-- <button id="Button_ProfitCalcCredits" style="width:40%; border: 1px solid black; background:lightgrey">Profit calculator (Credits)</button>
                       <button id="Button_ProfitCalcCreditsHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br> -->

                       <button id="Button_OpenBids" style="width:24%; border: 1px solid black; background:lightgrey">Open Bids</button>
                       <button id="Button_OpenBidsHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_EssenceData" style="width:24%; border: 1px solid black; background:lightgrey">Essence data</button>
                       <button id="Button_EssenceDataHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_LITData" style="width:24%; border: 1px solid black; background:lightgrey">LIT data</button>
                       <button id="Button_LITDataHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <button id="Button_RefIncomeCalc" style="width:40%; border: 1px solid black; background:lightgrey">(Ref-Code)Income calculator</button>
                       <button id="Button_RefIncomeCalcHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_DepositsAndWithdrawalData" style="width:40%; border: 1px solid black; background:lightgrey">Deposit/withdrawal data</button>
                       <button id="Button_DepositsAndWithdrawalDataHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <button id="Button_PropertiesMap" style="width:40%; border: 1px solid black; background:lightgrey">Properties map</button>
                       <button id="Button_PropertiesMaphelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <!--<button id="Button_ListEPLS" style="width:40%; border: 1px solid black; background:lightgrey">List my EPL's</button>
                       <button id="Button_ListEPLSHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br> -->

                       <!--<button id="Button_DepositsAndWithdrawalData" style="width:40%; border: 1px solid black; background:lightgrey">Download data as .csv</button>
                       <button id="Button_DepositsAndWithdrawalDataHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br> -->

                       <br>

                       <label style="position: relative; display: inline-block; width: 35%; ">
                       <input id="checkbox_speedthrottling" style="opacity: 0; width: 0; height: 0;" type="checkbox">
                       <span style="color: black; font-size: 14px">Speed throttling</span>
                       </label>
                       <button id="Button_SpeedThrottlingHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <br>
                       <button id="Button_Minimize" style="width:40%; border: 1px solid black; background:lightgrey">Minimize E2 Multitool</button>

                  </div>

<div style="display: block; float: left; width: 50%">
                  <div id="ScriptTextOutput" style="width: 100%; height: 285px; text-align:center; background-color: rgba(100, 100, 100,0.8); border: 5px ridge black; overflow: auto; float:left">
                  <br><br><br>
                  <b>
                      Script was started successfully <br>
                      <br>
                      To start a function click the grey button left. <br>
                      To get the description of a function click the "?"-Button next to it.
                      </b>
                  </div>

                  <div id="LoadingBox" style="font-weight: bold ; width: 100%; height: 30px;  text-align:center; background-color: green; border: 5px ridge black; clear: both; margin-top: 5px; display:inline-block; margin-bottom: 5px">Script is ready</div>
</div>

                  <div  style="width:25%;  text-align:center; float: right; font-size: 14px">

I hope you enjoy the script :)
<br>
<br>
<br>
For questions, suggestions and bug report you can contact me on discord: <br>
ExKcir#1454
<br>
<br>
<br>
To support my work you can use my E2 referral code (7,5%): <br>
E2Multitool <!-- &nbsp;
<button id="Button_CopyRef" style="padding: 3 px; width:33px; border: 1px solid black; background:lightgrey; font-size: 12px">COPY</button> -->
<br>
<br>
<br>
<br>
Version: ` + version + `<br>Latest version: ` + LatestVersion + `<br>You can download the latest version here: <a style="color: darkblue" href="https://github.com/ExKcir/Earth2Scripts/tree/main/English/E2Multitool">Github E2Multitool</a>
                  </div>

                  <div  style="width:1%; text-align:center; clear: left;">

                  </div>


               </div>
          </div>`;




        document.getElementById("loading").style.display = "none"; //Remove loading DIV
        document.body.prepend(ScriptHTML); //Show Output



    //maximize menu
     var MaximizeMenu = document.createElement ('div');
    MaximizeMenu.innerHTML =
        `<button id="MaximizeMenu" style="border: 5px solid green; position: fixed; left: 0; right: 0; width: 10%; margin-left: auto; margin-right: auto; text-align: center;  background-color: lightgrey; font-weight: bold;z-index: 10000;">Open E2 Multitool</button>`;
     document.body.prepend(MaximizeMenu); //Show maximize button
    document.getElementById("MaximizeMenu").style.display = "none";

    if(localStorage.getItem('E2MultiTool_IsMinmized') == 1)
       {
             document.getElementById("MaximizeMenu").style.display = "block";
             document.getElementById("E2Multitool").style.display = "none";
       }

     if (localStorage.getItem('E2MultiTool_IsSpeedThrottlingActive') == null) {
            localStorage.setItem('E2MultiTool_IsSpeedThrottlingActive','1');
        }

    if(localStorage.getItem('E2MultiTool_IsSpeedThrottlingActive') == 1)
       {
            document.getElementById("checkbox_speedthrottling").checked = true;
       }



       //Buttons
    $("#Button_JewelHarvestHelper").click (FeatureJewelHarvestHelper);
    $("#Button_JewelHarvestHelperHelp").click (FeatureJewelHarvestHelperHelp);

    $("#Button_JewelCounter").click (FeatureJewelData);
    $("#Button_JewelCounterHelp").click (FeatureJewelDataHelp);

    $("#Button_JewelCounterPlus").click (FeatureJewelDataPlus);
    $("#Button_JewelCounterPlusHelp").click (FeatureJewelDataPlusHelp);

    $("#Button_JewelPricesT1").click (FeatureJewelPricesT1);
    $("#Button_JewelPricesT1Help").click (FeatureJewelPricesT1Help);

    $("#Button_JewelPricesT1Cracked").click (FeatureJewelPricesT1Cracked);
    $("#Button_JewelPricesT1CrackedHelp").click (FeatureJewelPricesT1CrackedHelp);

    $("#Button_JewelPricesT1Common").click (FeatureJewelPricesT1Common);
    $("#Button_JewelPricesT1CommonHelp").click (FeatureJewelPricesT1CommonHelp);

    $("#Button_JewelPricesT2").click (FeatureJewelPricesT2);
    $("#Button_JewelPricesT2Help").click (FeatureJewelPricesT2Help);

    $("#Button_JewelPricesT3").click (FeatureJewelPricesT3);
    $("#Button_JewelPricesT3Help").click (FeatureJewelPricesT3Help);

    $("#Button_JewelPricesAll").click (FeatureJewelPricesAll);
    $("#Button_JewelPricesAllHelp").click (FeatureJewelPricesAllHelp);

    $("#Button_HolobuildingData").click (FeatureGetHolobuildingsData);
    $("#Button_HolobuildingDataHelp").click (FeatureGetHolobuildingsDataHelp);

    $("#Button_HoloBuildingsList").click (FeatureHolobuildingsList);
    $("#Button_HoloBuildingsListHelp").click (FeatureHolobuildingsListHelp);

    $("#Button_PropertiesCounter").click (FeaturePropertiesCounter);
    $("#Button_PropertiesCounterHelp").click (FeaturePropertiesCounterHelp);

    $("#Button_PropertiesSizeList").click (FeaturePropertiesList);
    $("#Button_PropertiesSizeListHelp").click (FeaturePropertiesListHelp);

    $("#Button_ProfitCalc").click (FeatureProfitCalc);
    $("#Button_ProfitCalcHelp").click (FeatureProfitCalcHelp);

    $("#Button_OpenBids").click (FeatureOpenBids);
    $("#Button_OpenBidsHelp").click (FeatureOpenBidsHelp);

    $("#Button_Minimize").click (MinimizeMaximize);
    $("#MaximizeMenu").click (MinimizeMaximize);

    $("#Button_EssenceData").click (FeatureEssenceData);
    $("#Button_EssenceDataHelp").click (FeatureEssenceDataHelp);

    $("#Button_LITData").click (FeatureLITData);
    $("#Button_LITDataHelp").click (FeatureLITDataHelp);

    $("#Button_RefIncomeCalc").click (FeatureRefIncomeCalc);
    $("#Button_RefIncomeCalcHelp").click (FeatureRefIncomeCalcHelp);

    $("#Button_DepositsAndWithdrawalData").click (FeatureDepositsAndWithdrawalData);
    $("#Button_DepositsAndWithdrawalDataHelp").click (FeatureDepositsAndWithdrawalDataHelp);

     $("#Button_PropertiesMap").click (FeaturePropertiesMap3D);
    $("#Button_PropertiesMapHelp").click (FeaturePropertiesMapHelp);

    $("#Button_SpeedThrottlingHelp").click (FeatureSpeedThrottlingHelp);

    //OutputStorageAll(); //Test

    //Checkboxes
     $('#checkbox_speedthrottling').change(function()
     {
        if(this.checked)
        {
            localStorage.setItem('E2MultiTool_IsSpeedThrottlingActive','1');
        }
        else
        {
            localStorage.setItem('E2MultiTool_IsSpeedThrottlingActive','0');
        }
        $('#textbox1').val(this.checked);
    });



}

MainFunction();



