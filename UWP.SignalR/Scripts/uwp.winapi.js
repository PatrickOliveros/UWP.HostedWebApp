
(function() {
    // Add the event listener to handle Windows activated event
    if (isWindows10) {

        Windows.UI.WebUI.WebUIApplication.addEventListener("activated",
            function(args) {
                var activation = Windows.ApplicationModel.Activation;

                // Handle toast launch from Windows (aka toast was clicked)
                if (args.kind === activation.ActivationKind.launch) {
                    // Check if there are launch args
                    if (args.arguments) {
                        var launchArgs = JSON.parse(args.arguments);
                        if (launchArgs.type === "toast") {
                            // The app has been launched from the click of a notification
                            toastActivationHandler(launchArgs.name, launchArgs.caller, args.arguments);
                        }
                    }
                }
                // Handle user input response from toast notification on Windows
                else if (args.kind === activation.ActivationKind.toastNotification) {
                    toastActionHandler(args.argument, args);
                }
            });
    }
})();

// ----------------------------------------------
// ----- Toast Handlers -----------
// ----------------------------------------------

// This function will take care of actions inside the toasts
function toastActionHandler(actionArg, objArgs) {

    var res = actionArg.split("-");
    var toastType = res[0];
    var toastAction = res[1];
    var inputResult = "empty result";
    var toastName;

    switch (toastType) {
    case "selection":
        toastName = "Custom Toast - Dropdown";
        inputResult = objArgs.userInput.time;
        break;
    case "selectionJson":
        toastName = "Custom Toast - Dropdown (Json)";
        inputResult = objArgs.userInput.toastJsonEmployee;
        break;
    case "inputYesNo":
        toastName = "Custom Toast - Text + Yes/No";
        inputResult = "empty";
        if (objArgs.userInput.textReply != "") {
            inputResult = objArgs.userInput.textReply;
        }
        break;
    }

    notifyToastStatusBox(toastName, toastAction, inputResult);
}

// This function will handle when the toast has been clicked 
function toastActivationHandler(toastType, caller, rawdata) {

    switch (toastType) {
    case "defaultToast":
        notifyStatusBox("<b>" + caller + "</b> has clicked the default toast.");
        break;
    case "tynToast":
        notifyStatusBox("<b>" + caller + "</b> has clicked the [custom text + yes/no] toast. Raw data is : " + rawdata);
        break;
    case "appToast":
        notifyStatusBox("<b>" + caller + "</b> has clicked the [application] toast. Raw data is : " + rawdata);
        break;
    }
}
// ----------------------------------------------
// ----- End Toast Handlers -----------
// ----------------------------------------------

// ----------------------------------------------
// Begin - Button functions - Gray
// ----------------------------------------------


var fadeDelay = 10000;

// Fire-up camera
$("#gCamera")
    .click(function() {
        if (isWindows10()) {
            cameraCapture();
        } else {
            displayAPIError("camera");
        }
    });

// Contact Picker
$("#gContactPicker")
    .click(function() {
        if (isWindows10()) {
            contactPicker();
        } else {
            displayAPIError("contact");
        }
    });

// ----------------------------------------------
// End - Button functions - Gray
// ----------------------------------------------

var generatedList;

function getLaunchParameters(objName, objAdditionalInfo) {

    var strLaunchParams = {
        type: "toast",
        name: objName,
        caller: getCurrentUser()
    };

    // Add additional launch parameters as needed per toast
    switch (objName) {
    case "appToast":
        strLaunchParams["requestNumber"] = objAdditionalInfo;
        break;
    case "contactToast":
        strLaunchParams["contactInfo"] = objAdditionalInfo;
        break;
    }

    return strLaunchParams;

}

function setToastActivation(templateContent, strIdentifier, objAddInfo) {
    var toastLaunchString = JSON.stringify(getLaunchParameters(strIdentifier, objAddInfo));
    var toastElement = templateContent.selectSingleNode("/toast");
    toastElement.setAttribute("duration", "long");
    toastElement.setAttribute("launch", toastLaunchString);
}

function setToastImage(toastDocument, imageType, isAppLogo, isCircle) {
    var toastImageElements = toastDocument.getElementsByTagName("image");
    toastImageElements[0].setAttribute("src", getImagePath(imageType));
    toastImageElements[0].setAttribute("alt", "Missing Graphic");

    if (isAppLogo == 0) {
        toastImageElements[0].setAttribute("placement", "appLogoOverride");
    }

    if (isCircle == 0) {
        toastImageElements[0].setAttribute("hint-crop", "circle");
    }
}

function toggleToast(objNotifications, toastDocument, keyTag) {
    var toast = new objNotifications.ToastNotification(toastDocument);
    var toastNotifier = objNotifications.ToastNotificationManager.createToastNotifier();
    toast.tag = keyTag;
    toastNotifier.show(toast);
}

function showDefaultToast() {
    if (isWindows10()) {
        var notifications = Windows.UI.Notifications;
        var template = notifications.ToastTemplateType.toastImageAndText02;
        var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
        var toastKey = "defaultToast";

        var toastTextElements = toastXml.getElementsByTagName("text");
        toastTextElements[0].appendChild(toastXml.createTextNode("Default Toast"));
        toastTextElements[1].appendChild(toastXml.createTextNode("This is the default toast of the application."));

        setToastImage(toastXml, imgAnonymous, 0, 1);
        setToastActivation(toastXml, toastKey);
        toggleToast(notifications, toastXml);

        gotoTopPage();
    } else {
        displayAPIError("default toast");
    }
}

function showApplicationToast(toastHeader, textLine1, imgType) {
    if (isWindows10()) {
        var notifications = Windows.UI.Notifications;
        var template = notifications.ToastTemplateType.toastImageAndText02;
        var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
        var toastKey = "appToast";

        var toastTextElements = toastXml.getElementsByTagName("text");
        toastTextElements[0].appendChild(toastXml.createTextNode(toastHeader));
        toastTextElements[1].appendChild(toastXml.createTextNode(getCustomMessages(imgType)));

        var imgToast = docReview;

        switch (imgType) {
        case "0":
            imgToast = docRejected;
            break;
        case "1":
            imgToast = docApproved;
            break;
        }

        setToastImage(toastXml, imgToast, 0, 1);
        setToastActivation(toastXml, toastKey, textLine1);
        toggleToast(notifications, toastXml, toastKey);

        gotoTopPage();
    } else {
        displayAPIError("application toast");
    }
}

function showCustomToastTextYesNo() {
    if (isWindows10()) {
        var message = "This is a random question.";

        var notifications = Windows.UI.Notifications,
            templateType = notifications.ToastTemplateType.toastImageAndText02,
            templateContent = notifications.ToastNotificationManager.getTemplateContent(templateType),
            toastMessage = templateContent.getElementsByTagName("text");
        var toastKey = "tynToast";

        // Set message & image in toast template
        toastMessage[0].appendChild(templateContent.createTextNode(message));

        setToastActivation(templateContent, toastKey, "");
        setToastImage(templateContent, "round_man.png", 0, 1);

        // Add actions
        var actions = templateContent.createElement("actions");
        templateContent.firstChild.appendChild(actions);

        // Create an input box
        var input = templateContent.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("title", "Reply with");
        input.setAttribute("id", "textReply");
        input.setAttribute("placeHolderContent", "Random answer goes here.");
        actions.appendChild(input);

        // Create a yes button
        var btnYes = templateContent.createElement("action");
        btnYes.setAttribute("content", "Yes");
        btnYes.setAttribute("arguments", "inputYesNo-yes");
        btnYes.setAttribute("launchType", "foreground");
        actions.appendChild(btnYes);

        //Create a no button
        var btnNo = templateContent.createElement("action");
        btnNo.setAttribute("content", "No");
        btnNo.setAttribute("arguments", "inputYesNo-no");
        btnNo.setAttribute("launchType", "foreground");
        actions.appendChild(btnNo);

        // Show the toast
        toggleToast(notifications, templateContent, toastKey);

        gotoTopPage();
    } else {
        displayAPIError("custom toast");
    }
}

function showCustomToastPhoto(userCaller, isEmpty) {
    if (isWindows10()) {
        var notifications = Windows.UI.Notifications;
        var toastDom = new Windows.Data.Xml.Dom.XmlDocument();

        var imgUrl = isEmpty;
        var imgSharer = userCaller;

        if (isEmpty == "empty") {
            imgUrl = randomImageUrl;
        }

        if (userCaller == "") {
            imgSharer = getCurrentUser();
        }

        toastDom.loadXml(photoToastXml(imgSharer, imgUrl));
        var toastKey = "photoToast";

        setToastActivation(toastDom, toastKey, "");
        toggleToast(notifications, toastDom, toastKey);

        gotoTopPage();
    } else {
        // Todo: Probably, do something to share photo here.
        displayAPIError("photo toast");
    }
}

function showCustomToastDropDown(objRequest) {
    if (isWindows10()) {
        var notifications = Windows.UI.Notifications;
        var toastDom = new Windows.Data.Xml.Dom.XmlDocument();
        toastDom.loadXml(getCustomXml(objRequest));
        var toastKey = "selectionToast";

        setToastActivation(toastDom, toastKey, "");
        setToastImage(toastDom, docCheck, 0, 1);
        toggleToast(notifications, toastDom, toastKey);

        gotoTopPage();
    } else {
        displayAPIError("custom selection toast");
    }
}

function showCustomToastDropDownJson(userList) {
    if (isWindows10()) {

        var notifications = Windows.UI.Notifications;
        var toastDom = new Windows.Data.Xml.Dom.XmlDocument();
        toastDom.loadXml(jsonDataXml("Sample Json Data Fetch", "Select Employee", "toastJsonEmployee", userList));
        var toastKey = "jsonToast";

        setToastImage(toastDom, "json.png", 0, 1);
        setToastActivation(toastDom, toastKey, "");
        toggleToast(notifications, toastDom, toastKey);

        gotoTopPage();
    } else {
        displayAPIError("custom Json-selection toast");
    }
}

function showContactToast(name, contactname, contactinfo, message, contactType) {
    if (isWindows10()) {
        var notifications = Windows.UI.Notifications;
        var template = notifications.ToastTemplateType.toastImageAndText02;
        var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
        var toastKey = "contactToast";

        var toastTextElements = toastXml.getElementsByTagName("text");
        toastTextElements[0].appendChild(toastXml.createTextNode(name.capitalizeWord() + " has shared a contact"));
        toastTextElements[1].appendChild(toastXml.createTextNode(message));

        setToastActivation(toastXml, toastKey, contactinfo);
        setToastImage(toastXml, contactType, 0, 0);
        toggleToast(notifications, toastXml, toastKey);

        gotoTopPage();
    } else {
        displayAPIError("contact");
    }
}

function cameraCapture() {
    if (isWindows10) {
        var captureUI = new Windows.Media.Capture.CameraCaptureUI();

        var aspectRatio = { width: 1, height: 1 };
        captureUI.photoSettings.croppedAspectRatio = aspectRatio;

        //Set the format of the picture that's going to be captured (.png, .jpg, ...)
        captureUI.photoSettings.format = Windows.Media.Capture.CameraCaptureUIPhotoFormat.png;

        // Set resolution - https://docs.microsoft.com/en-us/uwp/api/windows.media.capture.cameracaptureuimaxphotoresolution
        captureUI.photoSettings.maxresolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.SmallVga;

        //Pop up the camera UI to take a picture
        captureUI.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo)
            .done(function(file) {
                    if (file) {
                        var photoBlobUrl = URL.createObjectURL(file, { oneTimeOnly: false });

                        // Todo: This line of code will automatically append the photo to the screen of the photo sharer
                        //$('#discussion').append($('<img>', { id: 'theImg', src: photoBlobUrl }));

                        $("#photofilepath").val(file.path);
                        $("#photofilepath").trigger("click");

                        gotoTopPage();
                    } else {
                        // User cancelled photo upload
                        // WinJS.log && WinJS.log("No photo captured.", "sample", "status");
                        return;
                    }
                },
                function(err) {
                    WinJS.log && WinJS.log(err, "sample", "error");
                });
    } else {
        displayAPIError("camera");
    }
}

// This function will return a contact object with phone or email entries only.
function contactPicker() {
    if (isWindows10()) {
        var picker = new Windows.ApplicationModel.Contacts.ContactPicker();

        picker.desiredFieldsWithContactFieldType.append(Windows.ApplicationModel.Contacts.ContactFieldType.email);
        picker.desiredFieldsWithContactFieldType.append(Windows.ApplicationModel.Contacts.ContactFieldType.phoneNumber);

        // Open the picker for the user to select a contact 
        picker.pickContactAsync()
            .done(function(contact) {
                if (contact !== null) {
                    getContactDetails(contact);
                    gotoTopPage();
                }
            });
    } else {
        displayAPIError("contact");
    }
}

// This function will check what contact information did the user selected
function getContactDetails(objContact) {

    // let's check selected e-mail
    var contactInfo, iconType, contactText;
    var isEmail = objContact.emails.length;
    if (isEmail > 0) {
        // e-mail is selected
        contactInfo = objContact.emails[0].address;
        iconType = cemail;
        contactText = "mail";
    } else {
        // phone is selected
        contactInfo = objContact.phones[0].number;
        iconType = cphone;
        contactText = "phone";
    }

    var toastMessage = contactText + " contact of " + objContact.displayName + " has been shared. " + contactInfo;

    $("#conSharer").val(getCurrentUser());
    $("#conInfo").val(toastMessage);
    $("#conType").val(iconType);
    $("#conName").val(objContact.displayName);
    $("#conData").val(contactInfo);
    $("#conTrigger").trigger("click");

    showContactToast(getCurrentUser(), objContact.displayName, contactInfo, toastMessage, iconType);
}