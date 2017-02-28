
function getUserList() {

    var jsonOption;

    var apiPath = getApiPath("DemoApplication");

    var getJson = $.getJSON(apiPath, function (data) {
        var myobj = JSON.parse(data);

        $.each(myobj, function (index, element) {
            jsonOption += "<selection id='" + element.Id + "' content=' " + element.LastName + ", " + element.FirstName + "' />";
        });

        showCustomToastDropDownJson(jsonOption);
    });
}

function jsonDataXml(toastLabel, userText, toastObjId, lstUsers) {
    var toastDocument = "<toast launch='developer-defined-string'>" +
        "<visual>" +
        "<binding template='ToastGeneric'>" +
        "<text>" +
        toastLabel +
        "</text>" +
        "<text>" +
        userText +
        "</text>" +
        "<image></image>" +
        "</binding>" +
        "</visual>" +
        "<actions>" +
        "<input id='" +
        toastObjId +
        "' type='selection' defaultInput='1' >";

    toastDocument += lstUsers;

    toastDocument += "</input>" +
        "<action activationType='foreground' content='Do Something' arguments='selectionJson-sendemail' />" +
        "<action activationType='foreground' content='Cancel' arguments='selectionJson-cancel' />" +
        "</actions>" +
        "</toast>";

    return toastDocument;
}

function getCustomXml() {
    return "<toast launch='developer-defined-string'>" +
    "<visual>" +
    "<binding template='ToastGeneric'>" +
    "  <text>Spicy Heaven</text>" +
    "  <text>When do you plan to come in tomorrow?</text>" +
    "  <image></image>" +
    "</binding>" +
    "</visual>" +
    "<actions>" +
    "<input id='time' type='selection' defaultInput='1' >" +
    "  <selection id='1' content='Breakfast' />" +
    "  <selection id='2' content='Lunch' />" +
    "  <selection id='3' content='Dinner' />" +
    "</input>" +
    "<action activationType='foreground' content='Reserve' arguments='selection-reserve' />" +
    "<action activationType='foreground' content='Call Restaurant' arguments='selection-call' />" +
    "</actions>" +
    "</toast>";
}

function photoToastXml(caller, imageUrl) {
    return "<toast launch='developer-defined-string'>" +
        "<visual>" +
        "<binding template='ToastGeneric'>" +
        "<text>Photo Share</text>" +
        "<text>" + caller + " sent you a picture</text>" +
        "<text>See it in full size!</text>" +
        "<image src='" + imageUrl + "' />" +
        "<image placement='appLogoOverride' src='" + imageUrl + "' hint-crop='circle' />" +
        "</binding>" +
        "</visual>" +
        "</toast>";
}