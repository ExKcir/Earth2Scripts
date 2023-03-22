// ==UserScript==
// @name         Earth2: Hide activity feed
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  First version
// @author       ExKcir (Referral-Code: E2Multitool)
// @match        https://app.earth2.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=earth2.io
// @grant        none
// ==/UserScript==

 function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

    var ActivityFeed = document.getElementsByClassName("ActivityWidget_widget__2jA0a");

    while(ActivityFeed[0] == undefined)
    {
        await timeout(1000);
        console.log("Wait 1000 ms");
        ActivityFeed = document.getElementsByClassName("ActivityWidget_widget__2jA0a");
    }

    ActivityFeed[0].style = "display: none;"; // hide Activityfeed