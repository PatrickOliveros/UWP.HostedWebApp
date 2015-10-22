

    $('#btnToast').click(function () {
        if (typeof Windows !== undefined) {
            showDefaultToast();
        } else {
            alert('This is not available in this context.');
        }
    });


    $('#btnCamera').click(function () {
        if (typeof Windows !== undefined) {
            cameraCapture();
            //showCustomToast();
        } else {
            alert('This is not available in this context.');
        }
    });

    $('#btnContact').click(function () {
        if (typeof Windows !== undefined) {
            contactPicker();
        } else {
            alert('This is not available in this context.');
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


    function showDefaultToast() {
        if (typeof Windows !== undefined) {
            var notifications = Windows.UI.Notifications;
            var template = notifications.ToastTemplateType.toastImageAndText02;
            var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
            var toastTextElements = toastXml.getElementsByTagName("text");
            toastTextElements[0].appendChild(toastXml.createTextNode("Toast from Codepen"));
            toastTextElements[1].appendChild(toastXml.createTextNode("Toast from Codepen2. the quick brown fox "));
            toastTextElements[1].appendChild(toastXml.createTextNode("Toast from Codepen2. the quick brown fox "));

            var toastImageElements = toastXml.getElementsByTagName("image");
            toastImageElements[0].setAttribute("src", "http://assets.codepen.io/assets/social/facebook-default.png");
            toastImageElements[0].setAttribute("alt", "red graphic");
            var toast = new notifications.ToastNotification(toastXml);
            var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
            toastNotifier.show(toast);
        } else {
            alert('This operation is not supported.');
        }
    }

    function showCustomToast() {
        if (typeof Windows !== undefined) {
            var notifications = Windows.UI.Notifications;
            var toastXml = notifications.ToastNotificationManager.getTemplateContent("http://localhost:31234/Assets/testSample.xml");
            var toast = new notifications.ToastNotification(toastXml);
            var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
            toastNotifier.show(toast);
        } else {
            alert('This operation is not supported.');
        }
    }

    function showToast(name, message) {
        if (typeof Windows !== undefined) {

            if (name == undefined) {
                name = $('#displayname').val();
            }

            var notifications = Windows.UI.Notifications;
            var template = notifications.ToastTemplateType.toastImageAndText02;
            var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
            var toastTextElements = toastXml.getElementsByTagName("text");
            toastTextElements[0].appendChild(toastXml.createTextNode("Message from " + name));
            toastTextElements[1].appendChild(toastXml.createTextNode(message));

            var toastImageElements = toastXml.getElementsByTagName("image");
            toastImageElements[0].setAttribute("src", "http://localhost:31234/Assets/Images/biouser.png");
            toastImageElements[0].setAttribute("alt", "red graphic");
            var toast = new notifications.ToastNotification(toastXml);
            var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
            toastNotifier.show(toast);
        } else {
            alert('This operation is not supported.');
        }
    }

    function cameraCapture() {
        if (typeof Windows !== undefined) {
            var captureUI = new Windows.Media.Capture.CameraCaptureUI();
            //Set the format of the picture that's going to be captured (.png, .jpg, ...)
            captureUI.photoSettings.format = Windows.Media.Capture.CameraCaptureUIPhotoFormat.png;
            //Pop up the camera UI to take a picture
            captureUI.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo).then(function (capturedItem) {
                // Do something with the picture
                if (capturedItem) {
                    var localPath = Windows.Storage.ApplicationData;
                }
            });
        }
    }

    function contactPicker() {
        if (typeof Windows !== undefined) {
            // Create the picker 
            var picker = new Windows.ApplicationModel.Contacts.ContactPicker();
            picker.desiredFieldsWithContactFieldType.append(Windows.ApplicationModel.Contacts.ContactFieldType.email);
            // Open the picker for the user to select a contact 
            picker.pickContactAsync().done(function (contact) {
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
        if (typeof Windows !== undefined) {

            if (name == undefined) {
                name = $('#displayname').val();
            }

            // Create the picker 
            var picker = new Windows.ApplicationModel.Contacts.ContactPicker();
            picker.desiredFieldsWithContactFieldType.append(Windows.ApplicationModel.Contacts.ContactFieldType.email);
            // Open the picker for the user to select a contact 
            picker.pickContactAsync().done(function (contact) {
                if (contact !== null) {
                    var output = name + " has selected contact:\n" + contact.displayName;
                    showToast(name, output);
                } else {
                    // The picker was dismissed without selecting a contact 
                }
            });
        }
    }

