// For a more detailed information on the scripts used for this application, you may want to visit the site:
// https://blogs.msdn.microsoft.com/tiles_and_toasts/2015/07/02/adaptive-and-interactive-toast-notifications-for-windows-10/

// This application requires at least 4 js scripts file to work:
// a) uwp.core.js (this file) - this includes some of the common functions used
// b) uwp.web.js - scripts used for the web part of the application, as well as signalr functions
// c) uwp.winapi.js - scripts used for interfacing with Windows 10 APIs
// d) uwp.xml.js - xml files for custom toasts

// -----------------------------------
// Begin - Helper Functions
// -----------------------------------

function isWindows10() {
    try {
        return (typeof Windows !== "undefined" &&
            typeof Windows.UI !== "undefined" &&
            typeof Windows.UI.Notifications !== "undefined");
    } catch (e) {
        return false;
    }
}

function displayAPIError(objToast) {
    alert("This is not available in this context.");

    var errorMessage = "The " + objToast + " functionality can't be run in the current context";
    notifyStatusBox(errorMessage);
}

function checkPlural(objCount, strWord) {

    if (objCount > 0) {
        return strWord + "s";
    }

    return strWord;
}

function getCustomMessages(messageType) {
    var customMessage;

    switch (messageType) {

    case "0":
        customMessage = "This request has been rejected. Please contact your manager.";
        break;
    case "1":
        customMessage = "This request has been approved. See e-mail for confirmation.";
        break;
    case "2":
        customMessage = "This request has under review. Contact approver for additional instructions in your e-mail.";
        break;
    case "3":
        // default message - web notification
        customMessage = "Web notification has been clicked";
        break;
    default:
        customMessage = "This is a generic message";
        break;
    }

    return customMessage;
}

function getImagePath(imageName) {
    return getApplicationRoot() + relativeImagePath + imageName;
}

// This returns without trailing slash, append slash if needed
function getApplicationRoot() {
    return window.location.protocol + "//" + window.location.host;
}

function getApiPath(controller) {
    return getApplicationRoot() + "/api/" + controller;
}

function getCurrentUser() {
    return $("#displayname").val();
}

function notifyStatusBox(objmessage) {
    $("#discussion").append("<li>" + objmessage + "</li>");
}

function notifyToastStatusBox(toastName, objAction, objValue) {
    $("#discussion")
        .append("<li><b>" +
            toastName +
            "</b> toast was fired. Action selected is <b>'" +
            objAction +
            "'</b> and with value of <b>'" +
            objValue +
            "'</b></li>");
}

function gotoTopPage() {
    $("#topnav").trigger("click");
}

String.prototype.capitalizeWord = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};


// End - Helper Functions
// -----------------------------------


// Application Images
// -----------------------------------

var imgAnonymous = "round_whois.png";
var imgMale = "male.png";
var imgFemale = "female.png";
var bioUser = "biouser.png";
var foodstore = "foodstore.png";
var cphone = "imgphone.png";
var cemail = "imgemail.png";
var docApproved = "docapproved.png";
var docRejected = "docrejected.png";
var docReview = "docreview.png";
var docCheck = "doccheck.png";
var googleSearch = "http://www.google.com/?q=";


// Application Paths
// -----------------------------------

var relativeImagePath = "/Assets/Images/";
var randomImageUrl = "https://unsplash.it/200/300/?random";