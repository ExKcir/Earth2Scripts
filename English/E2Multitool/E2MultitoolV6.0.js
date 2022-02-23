// ==UserScript==
// @name         E2 Multitool for earth2.io
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  E2 Multitool for earth2.io
// @author       ExKcir (Referral-Code: E2Multitool)
// @include      https://*app.earth2.io/
// @icon         https://www.google.com/s2/favicons?domain=earth2.io
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==


var TimetoWait = 500; //500 ms
var TotalApiRequests = 0 ;
var tmp = "";


var EssenceBeforeClaimAndTransform = 0;
var PromisedEssenceBeforeClaimAndTransform = 0;
var Ether = 0;


console.log('E2 Multitool by ExKcir added');


function Output (Data)
{
    console.log(Data); //Output to Console
     document.getElementById('ScriptTextOutput').innerHTML = document.getElementById('ScriptTextOutput').innerHTML + Data + "<br>"; //Output to Script
}

function ScriptIsWorking (IsWorking)
{
    if(IsWorking == 0)
    {
        TimetoWait = 500;
        TotalApiRequests = 0;

        document.getElementById('LoadingBox').style.backgroundColor = "green";
        document.getElementById('LoadingBox').innerHTML = "script has finished";
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

                case "script has finished":
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


    ScriptIsWorking(1);
    console.log("Wait " + TimetoWait + "ms");


    const APIData = $.getJSON('https://app.earth2.io/api/v2/' + URL);


   await timeout(TimetoWait);





    //console.log(APIData);

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




async function FeatureJewelData()
    {
        ClearOutput(); //Clear Text Output

        var JewelsTotal = 0;
        var JewelsTotalClaimed = 0;
        var JewelsTotalUnclaimed = 0;
        var JewelsTotalInventory = 0;
        var JewelsTotalBazar = 0;
        var JewelsTotalSlotted = 0;
        var JewelsT1 = 0;
        var JewelsT2 = 0;


        //Count Jewels in Inventory
        JewelsTotalInventory = await RequestJewelsDataInventory();
        //console.log(JewelsTotalInventory);

        //Count Jewels in Bazar
        JewelsTotalBazar = await RequestJewelsDataBazar();
        //console.log(JewelsTotalBazar);

        //Count Jewels unclaimed
        JewelsTotalUnclaimed = await RequestJewelsDataUnclaimed();

        //Count Jewels slotted
        JewelsTotalSlotted = await RequestJewelsDataSlotted();

        JewelsTotalClaimed = JewelsTotalInventory + JewelsTotalBazar + JewelsTotalSlotted;
        JewelsTotal = JewelsTotalClaimed + JewelsTotalUnclaimed ;



        document.getElementById('ScriptTextOutput').innerHTML =
        `


                         <b>Jewel counter:</b><br>
                         Jewels in inventory:  ` + JewelsTotalInventory + `<br>
                         Jewels on bazar:  ` + JewelsTotalBazar + `<br>
                         Jewels slotted: ` + JewelsTotalSlotted + `<br>
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
    Output("Counts jewels in inventory and bazar, slotted and unclaimed");
}


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
         ClearOutput();
        Output((j*10)+(i+1) + '. jewel analyzed');

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
        Output(listOfT1Props[l].x + "-tile T1 Properties: " + listOfT1Props[l].count + "x");
    }

    Output("<br>");

    for(var m = 0;m < listOfT2Props.length;m++)
    {
        Output(listOfT2Props[m].x + "-tile T2 Properties: " + listOfT2Props[m].count + "x");
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
var CountProfitCalcSuccessful  = 0;

ClearOutput();
//Get all jewels

/*
var j = 0;
do
{
    //Get every sale
     var APIData = await GetAPIData("my/balance_changes/?balance_change_type=SALE&limit=11&offset=" + (j*11));




    //Load every property of page
    for(var i = 0; i<Object.keys(APIData.results).length; i++)
    {

        //Output((j*11)+(i+1) + '. property sale analyzed');





        //Check every sale
        var k = 0;
        do
        {
            //Get every sale ; 100
            var APIData2 = await GetAPIData("my/balance_changes/?balance_change_type=PURCHASE&limit=100&offset=" + (k*100));




            //Load every property of page
            for(var l = 0; l<Object.keys(APIData2.results).length; l++)
            {
                //console.log(l);
               //Output((j*11)+(i+1) + '. property sale analyzed');
                if(APIData.results[i].linked_object.id == APIData2.results[l].linked_object.id)
                {

                   Output('Property: <b>' + APIData2.results[l].linked_object.description + '</b> <a style="color: darkblue" href=https://app.earth2.io/#propertyInfo/' + APIData2.results[l].linked_object.id + '>LINK</a> <br>Purchase ' + APIData2.results[l].amount + 'E$ -> +' + APIData.results[i].amount + 'E$ Sold <br>Profit: ' + ((APIData.results[i].amount)+(APIData2.results[l].amount)) + 'E$<br>');
                    //Count total profit
                    TotalProfit = TotalProfit + (APIData.results[i].amount+APIData2.results[l].amount);

                    l = Object.keys(APIData2.results).length; //Stop for loop
                }

            }


            k++;
        }while(APIData2.next != null)





    }


    j++;
}while(APIData.next != null)

   */


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

               j++;
            }while(APIData.next != null)


            k++;
        }while(APIData2.next != null)

SalesTotal = APIData.count;
Output("------------------------------- <br>Total profit: " + TotalProfit.toFixed(2) + "E$<br><br>Total sales: " + SalesTotal + " properties <br>Successful calculated sales: " + CountProfitCalcSuccessful + " properties <br><br>Can't calculate profit for <b>" + (SalesTotal-CountProfitCalcSuccessful) + " </b>properties<br> (Properties bought through accepted bids can't be calculated atm.)");

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
                ScriptIsWorking(1);
                console.log("Wait " + TimetoWait + "ms");




                //load bids of property
                var APIData2 = await $.getJSON('https://app.earth2.io/graphql?query={getOngoingBids(landfieldId:"' + APIData.results[j].linked_object.id + '"){result,buyer{id},offerSet{createdStr,value}}}');
                await timeout(TimetoWait);

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







function MinimizeMaximize()
    {
        var MinimizeMaximizeMenu = document.getElementById("MaximizeMenu");
        var E2Multitool = document.getElementById("E2Multitool");

        if (MinimizeMaximizeMenu.style.display == "none")
        {
            MinimizeMaximizeMenu.style.display = "block";
            E2Multitool.style.display = "none";
        } else
        {
            MinimizeMaximizeMenu.style.display = "none";
            E2Multitool.style.display = "block";
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

              <div  style="width:100%;display: block; align-items: stretch;  text-align:center; ">

                  <div  style="width:25%; text-align:center; float: left">
                       <b>Functions:</b><br>

                       <button id="Button_JewelHarvestHelper" style="width:40%; border: 1px solid black; background:lightgrey">Jewel harvest helper </button>
                       <button id="Button_JewelHarvestHelperHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_JewelCounter" style="width:40%; border: 1px solid black; background:lightgrey">Jewel counter </button>
                       <button id="Button_JewelCounterHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <button id="Button_JewelPricesT1" style="width:40%; border: 1px solid black; background:lightgrey">Jewel prices (T1)</button>
                       <button id="Button_JewelPricesT1Help" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_JewelPricesT1Cracked" style="width:40%; border: 1px solid black; background:lightgrey">Jewel prices (T1 Cracked)</button>
                       <button id="Button_JewelPricesT1CrackedHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <button id="Button_JewelPricesT2" style="width:40%; border: 1px solid black; background:lightgrey">Jewel prices (T2)</button>
                       <button id="Button_JewelPricesT2Help" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_JewelPricesT3" style="width:40%; border: 1px solid black; background:lightgrey">Jewel prices (T3)</button>
                       <button id="Button_JewelPricesT3Help" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button><br>

                       <button id="Button_JewelPricesAll" style="width:40%; border: 1px solid black; background:lightgrey">Jewel prices (All)</button>
                       <button id="Button_JewelPricesAllHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_HolobuildingData" style="width:40%; border: 1px solid black; background:lightgrey">Holobuilding data </button>
                       <button id="Button_HolobuildingDataHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button><br>

                       <button id="Button_PropertiesCounter" style="width:40%; border: 1px solid black; background:lightgrey">Properties/tiles counter</button>
                       <button id="Button_PropertiesCounterHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_PropertiesSizeList" style="width:40%; border: 1px solid black; background:lightgrey">Properties sizes list</button>
                       <button id="Button_PropertiesSizeListHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <button id="Button_ProfitCalc" style="width:40%; border: 1px solid black; background:lightgrey">Profit calculator (Properties)</button>
                       <button id="Button_ProfitCalcHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <!-- <button id="Button_ProfitCalcCredits" style="width:40%; border: 1px solid black; background:lightgrey">Profit calculator (Credits)</button>
                       <button id="Button_ProfitCalcCreditsHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br> -->

                       <button id="Button_OpenBids" style="width:40%; border: 1px solid black; background:lightgrey">Open Bids</button>
                       <button id="Button_OpenBidsHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <button id="Button_EssenceData" style="width:40%; border: 1px solid black; background:lightgrey">Essence data</button>
                       <button id="Button_EssenceDataHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <!--<button id="Button_ListEPLS" style="width:40%; border: 1px solid black; background:lightgrey">List my EPL's</button>
                       <button id="Button_ListEPLSHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br> -->


                       <br>
                       <button id="Button_Minimize" style="width:40%; border: 1px solid black; background:lightgrey">Minimize E2 Multitool</button>

                  </div>

<div style="display: block; float: left; width: 50%">
                  <div id="ScriptTextOutput" style="width: 100%; height: 200px; text-align:center; background-color: rgba(100, 100, 100,0.8); border: 5px ridge black; overflow: auto; float:left">
                  <br>
                      Script was started successfully <br>
                      <br>
                      To start a function click the grey button left. <br>
                      To get the description of a function click the "?"-Button next to it.
                  </div>

                  <div id="LoadingBox" style="font-weight: bold ; width: 100%; height: 30px;  text-align:center; background-color: green; border: 5px ridge black; clear: both; margin-top: 5px; display:inline-block;">Script is ready</div>
</div>

                  <div  style="width:25%;  text-align:center; float: right;">
I hope you enjoy the script :)
<br>
<br>
For questions, suggestions and bug report you can contact me on discord: <br>
ExKcir#1454
<br>
<br>
To support my work you can use my E2 Referral Code: <br>
E2Multitool (7,5%)
<br>
<br>
V6.0
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



       //Buttons
    $("#Button_JewelHarvestHelper").click (FeatureJewelHarvestHelper);
    $("#Button_JewelHarvestHelperHelp").click (FeatureJewelHarvestHelperHelp);

    $("#Button_JewelCounter").click (FeatureJewelData);
    $("#Button_JewelCounterHelp").click (FeatureJewelDataHelp);

    $("#Button_JewelPricesT1").click (FeatureJewelPricesT1);
    $("#Button_JewelPricesT1Help").click (FeatureJewelPricesT1Help);

    $("#Button_JewelPricesT1Cracked").click (FeatureJewelPricesT1Cracked);
    $("#Button_JewelPricesT1CrackedHelp").click (FeatureJewelPricesT1CrackedHelp);

    $("#Button_JewelPricesT2").click (FeatureJewelPricesT2);
    $("#Button_JewelPricesT2Help").click (FeatureJewelPricesT2Help);

    $("#Button_JewelPricesT3").click (FeatureJewelPricesT3);
    $("#Button_JewelPricesT3Help").click (FeatureJewelPricesT3Help);

    $("#Button_JewelPricesAll").click (FeatureJewelPricesAll);
    $("#Button_JewelPricesAllHelp").click (FeatureJewelPricesAllHelp);

    $("#Button_HolobuildingData").click (FeatureGetHolobuildingsData);
    $("#Button_HolobuildingDataHelp").click (FeatureGetHolobuildingsDataHelp);

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




}




MainFunction();


