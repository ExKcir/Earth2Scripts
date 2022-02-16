// ==UserScript==
// @name         E2 Multitool for earth2.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  E2 Multitool for earth2.io
// @author       FreeX (0QWUS0HCNP)
// @include      https://*app.earth2.io/
// @icon         https://www.google.com/s2/favicons?domain=earth2.io
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==


console.log('E2 Multitool by FreeX(0QWUS0HCNP) added');


function Output (Data)
{
    console.log(Data); //Output to Console
     document.getElementById('ScriptTextOutput').innerHTML = document.getElementById('ScriptTextOutput').innerHTML + Data + "<br>"; //Output to Script
}


function ClearOutput ()
{
     document.getElementById('ScriptTextOutput').innerHTML = "";
}

async function GetAPIData(URL)
{

    //console.log(URL);

    const APIData = await $.getJSON('https://app.earth2.io/api/v2/' + URL);

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


                         <b>Claimed jewels:</b><br>
                         Jewels in inventory:  ` + JewelsTotalInventory + `<br>
                         Jewels on bazar:  ` + JewelsTotalBazar + `<br>
                         Jewels slotted: ` + JewelsTotalSlotted + `<br>
                         ---------------------------<br>
                         Claimed jewels total: ` + JewelsTotalClaimed + ` <br><br>



                         Unclaimed (new generated) jewels: ` + JewelsTotalUnclaimed + ` <br>

                        ---------------------------<br>
                        Jewels total: ` + JewelsTotal + `<br>`;


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

}



function FeatureJewelHarvestHelperHelp()
{
    ClearOutput();
    Output("Counts the amount of jewels generated from T1 and T2 properties and how many came from a single tile property.");
}






async function MainFunction()
{



    //Show loading
    var LoadingDIV = document.createElement ('div');
    LoadingDIV.innerHTML ='<div id="loading" style="width:100%; border: 5px solid red; text-align:center">LOADING...</div>'
    document.body.prepend(LoadingDIV);





    var ScriptHTML = document.createElement ('div');
    ScriptHTML.innerHTML =
        `<div style="border: 5px solid red;">
              <div style="width:100%; text-align:center "> <u><b>E2 Multitool by FreeX</b></u><br><br> </div>

              <div  style="width:100%;display: flex; align-items: stretch;  text-align:center; ">
                        
                  <div  style="width:25%; text-align:center; float: left">
                       <b>Functions:</b><br>

                       <button id="Button_JewelHarvestHelper" style="width:30%; border: 1px solid black; background:lightgrey">Start jewel harvest helper </button>
                       <button id="Button_JewelHarvestHelperHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_JewelCounter" style="width:30%; border: 1px solid black; background:lightgrey">Start jewel counter </button>
                       <button id="Button_JewelCounterHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <button id="Button_JewelPricesT1" style="width:30%; border: 1px solid black; background:lightgrey">Start jewel prices (T1)</button>
                       <button id="Button_JewelPricesT1Help" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_JewelPricesT2" style="width:30%; border: 1px solid black; background:lightgrey">Start jewel prices (T2)</button>
                       <button id="Button_JewelPricesT2Help" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <button id="Button_JewelPricesT3" style="width:30%; border: 1px solid black; background:lightgrey">Start jewel prices (T3)</button>
                       <button id="Button_JewelPricesT3Help" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_JewelPricesAll" style="width:30%; border: 1px solid black; background:lightgrey">Start jewel prices (All)</button>
                       <button id="Button_JewelPricesAllHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>





<!--

                       <button id="Button_HolobuildingCounter" style="width:30%; border: 1px solid black; background:lightgrey">Start holobuilding counter (+m3) </button>
                       <button id="Button_HolobuildingCounterHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_PropertiesSizeList" style="width:30%; border: 1px solid black; background:lightgrey">Start properties size list </button>
                       <button id="Button_PropertiesSizeListHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br>

                       <button id="Button_TileCounter" style="width:30%; border: 1px solid black; background:lightgrey">Start tile counter (T1/T2) </button>
                       <button id="Button_TileCounterHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> &nbsp; &nbsp;

                       <button id="Button_SingleTileCounter" style="width:30%; border: 1px solid black; background:lightgrey">Start single tile counter (T1/T2) </button>
                       <button id="Button_SingleTileCounter" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button>

                       <button id="Button_JewelCounterColours" style="width:30%; border: 1px solid black; background:lightgrey">Start jewel counter (Colours)</button>
                       <button id="Button_JewelCounterColoursHelp" style="width:5%; border: 1px solid black; background:lightgrey"> ? </button> <br> -->

                  </div>


                  <div id="ScriptTextOutput" style="width: 50%; text-align:center; background:grey; border: 2px solid blue;">
                      Script was started successfully
                  </div>


                  <div  style="width:25%;  text-align:center; float: left;">
I hope you enjoy the script :)
<br>
<br>
For questions, suggestions and bug report you can contact me on discord: <br>
FreeU#1454
<br>
<br>
To support my work you can use my E2 Referral Code: <br>
0QWUS0HCNP (7,5%)
<br>
<br>
                  </div>

                  <div  style="width:1%; text-align:center; clear: left;">

                  </div>


               </div>
          </div>`;




        document.getElementById("loading").style.display = "none"; //Remove loading DIV
        document.body.prepend(ScriptHTML); //Show Output

       //Buttons
    $("#Button_JewelHarvestHelper").click (FeatureJewelHarvestHelper);
    $("#Button_JewelHarvestHelperHelp").click (FeatureJewelHarvestHelperHelp);

    $("#Button_JewelCounter").click (FeatureJewelData);
    $("#Button_JewelCounterHelp").click (FeatureJewelDataHelp);

    $("#Button_JewelPricesT1").click (FeatureJewelPricesT1);
    $("#Button_JewelPricesT1Help").click (FeatureJewelPricesT1Help);

    $("#Button_JewelPricesT2").click (FeatureJewelPricesT2);
    $("#Button_JewelPricesT2Help").click (FeatureJewelPricesT2Help);

    $("#Button_JewelPricesT3").click (FeatureJewelPricesT3);
    $("#Button_JewelPricesT3Help").click (FeatureJewelPricesT3Help);

    $("#Button_JewelPricesAll").click (FeatureJewelPricesAll);
    $("#Button_JewelPricesAllHelp").click (FeatureJewelPricesAllHelp);

}




MainFunction();



