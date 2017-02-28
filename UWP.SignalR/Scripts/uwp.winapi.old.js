// Begin - Button functions - Gray
// -----------------------------------

var fadeDelay = 10000;

// Custom Toast - Text + Yes/No
$("#gCustomToastTextYesNo")
    .click(function () {
        if (isWindows10()) {
            showCustomToastTextYesNo();
        } else {
            displayAPIError();
        }
    });

// Custom Toast - Dropdown
$("#gCustomToastDropDown")
    .click(function () {
        if (isWindows10()) {
            showCustomToastDropDown();
        } else {
            displayAPIError();
        }
    });

// Custom Toast - Dropdown (Json)
$("#gCustomToastDropDownJson")
    .click(function () {
        if (isWindows10()) {
            getUserList();
        } else {
            displayAPIError();
        }
    });

// Default Toast
$("#gDefaultToast")
    .click(function () {
        if (isWindows10()) {
            showDefaultToast();
        } else {
            displayAPIError();
        }
    });

// Fire-up camera
$("#gCamera")
    .click(function () {
        if (isWindows10()) {
            cameraCapture();
        } else {
            displayAPIError();
        }
    });



// End - Button functions - Gray
// -----------------------------------

$("#btnContact")
    .click(function() {
        if (isWindows10()) {
            contactPicker();
        } else {
            displayAPIError();
        }
    });

//$('#btnAppointment').click(function () {
//    if (typeof Windows !== undefined) {
//        windowsAppointment();
//    } else {
//        alert('This is not available in this context.');
//    }
//});

//$('#btnPopUp').click(function () {
//    if (typeof Windows !== undefined) {
//        windowsDialog();
//    } else {
//        alert('This is not available in this context.');
//    }
//});


var generatedList;

function showDefaultToast() {
    if (isWindows10()) {
        var notifications = Windows.UI.Notifications;
        var template = notifications.ToastTemplateType.toastImageAndText02;
        var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
        var toastTextElements = toastXml.getElementsByTagName("text");
        toastTextElements[0].appendChild(toastXml.createTextNode("Default Toast"));
        toastTextElements[1].appendChild(toastXml.createTextNode("This is the default toast of the application."));

        //console.log(toastXml.content);

        //var toastElement = toastXml.getElementsByTagName("toast");
        //toastElement.SetAttribute("launch", "www.google.com");

        var toastImageElements = toastXml.getElementsByTagName("image");
        toastImageElements[0].setAttribute("src", "/Assets/Images/" + imgAnonymous);
        toastImageElements[0].setAttribute("alt", "red graphic");
        var toast = new notifications.ToastNotification(toastXml);
        var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toast);
    } else {
        displayAPIError();
    }
}

function showApplicationToast(applicationName, textLine1, textLine2) {
    if (isWindows10()) {
        var notifications = Windows.UI.Notifications;
        var template = notifications.ToastTemplateType.toastImageAndText02;
        var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
        var toastTextElements = toastXml.getElementsByTagName("text");
        toastTextElements[0].appendChild(toastXml.createTextNode(applicationName));
        toastTextElements[1].appendChild(toastXml.createTextNode(textLine1));
        toastTextElements[1].appendChild(toastXml.createTextNode(textLine2));

        console.log(toastXml.content);

        //var toastElement = toastXml.getElementsByTagName("toast");
        //toastElement.SetAttribute("launch", "www.google.com");

        var toastImageElements = toastXml.getElementsByTagName("image");
        toastImageElements[0].setAttribute("src", "/Assets/Images" + bioUser);
        toastImageElements[0].setAttribute("alt", "red graphic");
        var toast = new notifications.ToastNotification(toastXml);
        var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toast);
    } else {
        displayAPIError();
    }
}


function showCustomToast() {
    if (isWindows10()) {
        var notifications = Windows.UI.Notifications;
        var toastXml = notifications.ToastNotificationManager
            .getTemplateContent("http://localhost:31234/Assets/customTemplate.xml");
        var toast = new notifications.ToastNotification(toastXml);
        var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toast);
    } else {
        displayAPIError();
    }
}

function showCustomToastTextYesNo() {
    if (isWindows10()) {
        var title, message, imgUrl, imgAlt, tag, lang;

        title = 'Security Alert'
        message = "Would you like to update your contact number?"
        imgUrl = 'http://images.itechpost.com/data/images/full/2094/windows-phone-8.jpg';
        imgAlt = 'this is image alt'


        var notifications = Windows.UI.Notifications,
        templateType = notifications.ToastTemplateType.toastImageAndText02,
        templateContent = notifications.ToastNotificationManager.getTemplateContent(templateType),
        toastMessage = templateContent.getElementsByTagName('text'),
        toastImage = templateContent.getElementsByTagName('image'),
        toastElement = templateContent.selectSingleNode('/toast');

        //var launchParams = {
        //    type: 'toast',
        //    id: tag || 'demoToast',
        //    heading: title || 'Demo title',
        //    body: message || 'Demo message'
        //};

        //var launchString = JSON.stringify(launchParams);

        // Set message & image in toast template
        toastMessage[0].appendChild(templateContent.createTextNode(message|| 'Demo message'));
        toastImage[0].setAttribute('src', imgUrl || 'https://unsplash.it/150/?random');
        toastImage[0].setAttribute('alt', imgAlt || 'Random sample image');
        toastElement.setAttribute('duration', 'long');
        //toastElement.setAttribute('launch', 'www.google.com'); // Optional Launch Parameter

        // Set Launch
        var launchAttribute = templateContent.createAttribute("launch");
        launchAttribute.value = "{\"myContext\":\"12345\"}";
        toastElement.attributes.setNamedItem(launchAttribute);

        // Add actions
        var actions = templateContent.createElement('actions');
        templateContent.firstChild.appendChild(actions);

        // Create an input box
        var input = templateContent.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('title', 'Reply with');
        input.setAttribute('id', 'textReply');
        actions.appendChild(input);

        // Create a yes button
        var btnYes = templateContent.createElement('action');
        btnYes.setAttribute('content', 'Yes');
        btnYes.setAttribute('arguments', 'yes');
        btnYes.setAttribute('launchType', 'foreground');
        actions.appendChild(btnYes);

        //Create a no button
        var btnNo = templateContent.createElement('action');
        btnNo.setAttribute('content', 'No');
        btnNo.setAttribute('arguments', 'no');
        btnNo.setAttribute('launchType', 'foreground');
        actions.appendChild(btnNo);

        // Show the toast
        var toast = new notifications.ToastNotification(templateContent);
        var toastNotifier = new notifications.ToastNotificationManager.createToastNotifier();
        toast.tag = 'demoToast';
        //console.log(toast);
        toastNotifier.show(toast);

    } else {
        displayAPIError();
    }
}


function showCustomToastPhoto() {
    
}

function showCustomToastDropDown() {
    if (isWindows10()) {

        //getUserList();

        var title, message, imgUrl, imgAlt, tag, lang;

        //title = 'Security Alert'
        //message = "Would you like to update your contact number?"
        //imgUrl = 'http://images.itechpost.com/data/images/full/2094/windows-phone-8.jpg';
        //imgAlt = 'this is image alt'


        var notifications = Windows.UI.Notifications;
        //templateType = notifications.ToastTemplateType.toastImageAndText02,

        var toastDom = new Windows.Data.Xml.Dom.XmlDocument();
        toastDom.loadXml(getCustomXML());

        // Show the toast
        var toast = new notifications.ToastNotification(toastDom);
        var toastNotifier = new notifications.ToastNotificationManager.createToastNotifier();
        toast.tag = 'demoToast';
        //console.log(toast);
        toastNotifier.show(toast);

    } else {
        displayAPIError();
    }
}



function showCustomToastDropDownJson(userList) {
    if (isWindows10()) {

        //getUserList();

        var title, message, imgUrl, imgAlt, tag, lang;

        //title = 'Security Alert'
        //message = "Would you like to update your contact number?"
        //imgUrl = 'http://images.itechpost.com/data/images/full/2094/windows-phone-8.jpg';
        //imgAlt = 'this is image alt'


        var notifications = Windows.UI.Notifications;
        //templateType = notifications.ToastTemplateType.toastImageAndText02,

        //and in your call will listen for the custom deferred's done
        //getThumbnail().then(function (returndata) {
        //    //received data!
        //    generatedList = returndata;
        //});


        var toastDom = new Windows.Data.Xml.Dom.XmlDocument();
        toastDom.loadXml(jsonDataXml("Sample Json Data Fetch", "Select Employee", "toast-json-employee", userList));

        // Show the toast
        var toast = new notifications.ToastNotification(toastDom);
        var toastNotifier = new notifications.ToastNotificationManager.createToastNotifier();
        toast.tag = 'demoToast';
        //console.log(toast);
        toastNotifier.show(toast);

    } else {
        displayAPIError();
    }
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
        "</binding>" +
        "</visual>" +
        "<actions>" +
        "<input id='" +
        toastObjId +
        "' type='selection' >";

    

//    while (generatedList == undefined) {
//getUserList();
//    }

    toastDocument += lstUsers;

    toastDocument += "</input>" +
        "<action activationType='background' content='Reserve' arguments='reserve' />" +
        "<action activationType='foreground' content='Call Restaurant' arguments='call' />" +
        "</actions>" +
        "</toast>";

    return toastDocument;
}

function getUserList() {

    var jsonOption;

    var getJson = $.getJSON("http://localhost:31234/api/DemoApplication", function (data) {
        var myobj = JSON.parse(data);

        $.each(myobj, function (index, element) {
            jsonOption += "<selection id='" + element.Id +  "' content=' " + element.LastName + ", " + element.FirstName + "' />";
        });

        showCustomToastDropDownJson(jsonOption);
    });
}



//function getThumbnail() {
//    return $.getJSON("http://localhost:31234/api/DemoApplication").then(function (data) {
//        return data;
    
//    });
//}

//function getThumbnail() {

//    var jsonOption;

//    var getJson = $.getJSON("http://localhost:31234/api/DemoApplication", function (data) {
//        var myobj = JSON.parse(data);

//        $.each(myobj, function (index, element) {
//            jsonOption += "<selection id='" + element.Id +  "' content=' " + element.LastName + ", " + element.FirstName + "' />";
//        });

//        $.done(function() {
//            generatedList = jsonOption;
//        });
//    }).then(function (data) {
//        return data;

//    });
//}

function doAjax(callback) {
    $.ajax({
        dataType: "json",
        url: "http://localhost:31234/api/DemoApplication"
        })
      .done(function (data) {
          // Do a bunch
          // of computation
          // blah blah blah
            generatedList = JSON.parse(data);
          callback(true);
      }).fail(function () {
          callback(false);
      });
}

function doSomething() {
    doAjax(function (result) {
        if (result == true)
            console.log('success');
        else
            console.log('failed');
    });
}


// http://stackoverflow.com/questions/25520261/wait-for-ajax-to-complete-before-returning-from-function
// http://stackoverflow.com/questions/10775787/function-wait-with-return-until-getjson-is-finished


function getCustomXML() {
      
    return "<toast launch='developer-defined-string'>" +
    "<visual>" +
    "<binding template='ToastGeneric'>" +
    "  <text>Spicy Heaven</text>" +
    "  <text>When do you plan to come in tomorrow?</text>" +
    "</binding>" +
    "</visual>" +
    "<actions>" +
    "<input id='time' type='selection' defaultInput='2' >" +
    "  <selection id='1' content='Breakfast' />" +
    "  <selection id='2' content='Lunch' />" +
    "  <selection id='3' content='Dinner' />" +
    "</input>" +
    "<action activationType='background' content='Reserve' arguments='reserve' />" +
    "<action activationType='foreground' content='Call Restaurant' arguments='call' />" +
    "</actions>" +
    "</toast>";

}

function showToast(name, message) {
    if (isWindows10()) {

        if (name === undefined) {
            name = $("#displayname").val();
        }

        var notifications = Windows.UI.Notifications;
        var template = notifications.ToastTemplateType.toastImageAndText02;
        var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
        var toastTextElements = toastXml.getElementsByTagName("text");
        toastTextElements[0].appendChild(toastXml.createTextNode("Message from " + name));
        toastTextElements[1].appendChild(toastXml.createTextNode(message));

        var toastElement = toastXml.getElementsByTagName("toast");
        toastElement.SetAttribute("launch", "www.google.com");

        var toastImageElements = toastXml.getElementsByTagName("image");
        toastImageElements[0].setAttribute("src", "http://localhost:31234/Assets/Images/biouser.png");
        toastImageElements[0].setAttribute("alt", "red graphic");
        var toast = new notifications.ToastNotification(toastXml);
        var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toast);
    } else {
        displayAPIError();
    }
}


function showApplicationToast(applicationName, textLine1, textLine2) {
    if (isWindows10()) {
        var notifications = Windows.UI.Notifications;
        var template = notifications.ToastTemplateType.toastImageAndText02;
        var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
        var toastTextElements = toastXml.getElementsByTagName("text");
        toastTextElements[0].appendChild(toastXml.createTextNode(applicationName));
        toastTextElements[1].appendChild(toastXml.createTextNode(textLine1));
        toastTextElements[1].appendChild(toastXml.createTextNode(textLine2));

        console.log(toastXml.content);

        //var toastElement = toastXml.getElementsByTagName("toast");
        //toastElement.SetAttribute("launch", "www.google.com");

        var toastImageElements = toastXml.getElementsByTagName("image");
        toastImageElements[0].setAttribute("src", "https://image.freepik.com/free-icon/facebook-logo-with-rounded-corners_318-9850.jpg");
        toastImageElements[0].setAttribute("alt", "red graphic");
        var toast = new notifications.ToastNotification(toastXml);
        var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toast);
    } else {
        displayAPIError();
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
        captureUI.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo).done(function (file) {
            if (file) {
                var photoBlobUrl = URL.createObjectURL(file, { oneTimeOnly: false });

                //$('#discussion').append($('<img>', { id: 'theImg', src: photoBlobUrl }));

                //$("#photourl").val(photoBlobUrl);
                //$("#photourl").trigger("click");

                $("#photofilepath").val(file.path);
                $("#photofilepath").trigger("click");

                //chat.server.brodcastPhoto(photoBlobUrl);

                //$("#discussion").append(file.path);
                //$("#discussion").append(photoBlobUrl);
                //$("#discussion").append(photoBlobUrl);

                //uploadFile(file.path);

                //localSettings.values[photoKey] = file.path;
            } else {
                // User cancelled photo upload
                // WinJS.log && WinJS.log("No photo captured.", "sample", "status");
                return;
            }
        }, function (err) {
            WinJS.log && WinJS.log(err, "sample", "error");
        });
    }
}

function contactPicker() {
    if (isWindows10()) {
        // Create the picker 
        var picker = new Windows.ApplicationModel.Contacts.ContactPicker();
        picker.desiredFieldsWithContactFieldType.append(Windows.ApplicationModel.Contacts.ContactFieldType.email);
        // Open the picker for the user to select a contact 
        picker.pickContactAsync()
            .done(function(contact) {
                if (contact !== null) {
                    var output = "Selected contact:\n" + contact.displayName;
                    showToast("patrick", output);
                } else {
                    // The picker was dismissed without selecting a contact 
                    //console("No contact was selected");
                }
            });
    }
}

function contactPicker(name) {
    if (isWindows10()) {

        if (name === undefined) {
            name = $("#displayname").val();
        }

        // Create the picker 
        var picker = new Windows.ApplicationModel.Contacts.ContactPicker();
        picker.desiredFieldsWithContactFieldType.append(Windows.ApplicationModel.Contacts.ContactFieldType.email);
        // Open the picker for the user to select a contact 
        picker.pickContactAsync()
            .done(function(contact) {
                if (contact !== null) {
                    var output = name + " has selected contact:\n" + contact.displayName;
                    showToast(name, output);
                } else {
                    // The picker was dismissed without selecting a contact 
                }
            });
    }
}

function uploadFile(file) {
    var formData = new FormData();
    formData.append("file", file);
    $.ajax({
        url: 'http://localhost:31234/api/FileUpload',// add controller name
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            if (!data) {
                // Oops, something went wrong
                alert('Something was wrong!');
                $("#discussion").append("<li>something was wrong</li>");
                return;
            } else {
                $("#discussion").append("<li>successful</li>");
                //
            }
            //$('#file').val(''); // clear file input
            //// Add the display name
            //fileNames.append($('<div></div>').text(data.DisplayName));
            //// Add the inputs
            //var index = (new Date()).getTime(); // unique indexer
            //var clone = $('#template').clone(); // clone the template
            //clone.html($(clone).html().replace(/#/g, index)); // update the indexer
            //fileInputs.append(clone.html()); // append the inputs
            //// update the input values
            //var lastFile = fileInputs.find('.file-details').last();
            //lastFile.find('.file-path').last().val(data.Path);
            //lastFile.find('.file-name').last().val(data.DisplayName);
        },
        error: function (ts) {
            $("#discussion").append("<li>"+ ts.responseText + "</li>");
        }
    });
}