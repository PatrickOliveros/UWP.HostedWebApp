
function getUserList() {

    var jsonOption;

    var apiPath = getApiPath("DemoApplication");

    var getJson = $.getJSON(apiPath,
        function(data) {
            var myobj = JSON.parse(data);

            $.each(myobj,
                function(index, element) {
                    jsonOption += "<selection id='" +
                        element.Id +
                        "' content=' " +
                        element.LastName +
                        ", " +
                        element.FirstName +
                        "' />";
                });

            showCustomToastDropDownJson(jsonOption);
        });
}

function jsonDataXml(toastLabel, userText, toastObjId, lstUsers) {
    var toastDocument = "<toast launch='selectionJsonToast'>" +
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

function getCustomXml(requestNumber) {
    return "<toast launch='selectionToast'>" +
        "<visual>" +
        "<binding template='ToastGeneric'>" +
        "  <text>Kaptan (Fictional Company)</text>" +
        "  <text>Please act on the status of the request (" +
        requestNumber +
        ").</text>" +
        "  <image></image>" +
        "</binding>" +
        "</visual>" +
        "<actions>" +
        "<input id='time' type='selection' defaultInput='1' >" +
        "  <selection id='1' content='For Review' />" +
        "  <selection id='2' content='Approve' />" +
        "  <selection id='3' content='Reject' />" +
        "</input>" +
        "<action activationType='foreground' content='Send Reply' arguments='selection-reply' imageUri='" +
        getImagePath("statusreply.png") +
        "' />" +
        "</actions>" +
        "</toast>";
}

function photoToastXml(caller, imageUrl) {
    return "<toast launch='photoToast'>" +
        "<visual>" +
        "<binding template='ToastGeneric'>" +
        "<text>Photo Share</text>" +
        "<text>" +
        caller +
        " sent you a picture</text>" +
        "<text>See it in full size!</text>" +
        "<image src='" +
        imageUrl +
        "' />" +
        "<image placement='appLogoOverride' src='" +
        imageUrl +
        "' hint-crop='circle' />" +
        "</binding>" +
        "</visual>" +
        "</toast>";
}