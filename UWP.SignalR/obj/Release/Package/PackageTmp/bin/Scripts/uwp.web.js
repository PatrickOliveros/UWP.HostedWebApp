debugger;

$(function () {
    // Declare a proxy to reference the hub.
    var chat = $.connection.signalrwin10,
        $myShape = $(".notification");

    // Hub functions
    chat.client.broadcastMessage = function (name, message) {
        var encodedName = $("<div />").text(name).html();
        var encodedMsg = $("<div />").text(message).html();

        sendToClients(encodedMessage(encodedName, encodedMsg));
    };

    chat.client.broadcastPlainMessage = function (message) {
        var encodedMsg = $("<div />").text(message).html();

        sendToClients(plainMessage(encodedMsg));
    };

    chat.client.showAllUsers = function (userCount, strList) {
        var showAllUserMsg = "<strong>" +
            userCount +
            "</strong> active " +
            checkPlural(userCount, "user") +
            " right now. " +
            strList;

        sendToClients(plainMessage(showAllUserMsg));
    };


    // User Join/Disconnect Messages
    chat.client.joinMessage = function (user, joinDate) {
        var encodedName = $("<div />").text(user).html();
        var encodedMsg = $("<div />").text(" has joined the room on " + joinDate).html();

        sendToClients(plainMessage(userNotification(0, encodedName, encodedMsg)));
    };

    chat.client.leftMessage = function (user, joinDate) {
        var encodedName = $("<div />").text(user).html();
        var encodedMsg = $("<div />").text(" has left the room on " + joinDate).html();

        sendToClients(plainMessage(userNotification(-1, encodedName, encodedMsg)));
    };

    chat.client.joinOwnMessage = function () {
        sendToClients(plainMessage(userNotification(0, "", "You have joined the room")));
    };

    chat.client.joinExistingConnections = function (connectionCount) {
        sendToClients(plainMessage(userNotification(-1, "", "You have " + connectionCount + checkPlural(connectionCount, " connection") + " in the room")));
    };
    // End User Join/Disconnect Messages

    chat.client.displayCustomMessage = function (customMessage) {
        adhocNotification(getCustomMessages(customMessage));
    };

    chat.client.broadcastToasts = function (var1, var2, var3) {

        var broadcastMessage = var1 + " - " + getCustomMessages(var3);

        if (isWindows10()) {
            showApplicationToast(var1, var2, var3);
        } else {
            sendToClients(plainMessage(broadcastMessage));
        }

        gotoTopPage();
    }

    chat.client.broadcastDefault = function () {

        if (isWindows10()) {
            showDefaultToast();
        } else {
            // Todo: Do something, if needed
        }
    }

    chat.client.broadcastTextYesNo = function() {
        if (isWindows10()) {
            showCustomToastTextYesNo();
        } else {
            // Todo: Do something, if needed
        }
    }

    chat.client.broadcastSelection = function() {
        if (isWindows10()) {
            showCustomToastDropDown();
        } else {
            // Todo: Do something, if needed
        }
    }

    chat.client.broadcastSelectionJson = function() {
        if (isWindows10()) {
            getUserList();
        } else {
            // Todo: Do something, if needed
        }
    }

    chat.client.broadcastContactInformation = function (contactSharer, contactName, contactType, contactInfo) {      
        if (isWindows10()) {
            showContactToast(contactSharer, contactName, contactInfo, contactType);
        } else {
            var message = contactSharer.capitalizeWord() +  " has shared contact information of [" + contactName + "] - [" +  contactInfo + "]";
            sendToClients(plainMessage(message));
        }
    }

    chat.client.broadcastPhotoT = function(sharer) {
        if (isWindows10()) {
            showCustomToastPhoto(sharer, "empty");
        } 
    }

    // Share Photo
    chat.client.broadcastPhoto = function (photoUrl, userName) {
        sendToClients(plainMessage("<strong>" + userName + "<strong> has shared a photo."));
        sendToClients(plainMessage("<img src=" + photoUrl + " />"));

        if (isWindows10()) {
            showCustomToastPhoto(userName.capitalizeWord(), photoUrl);
        }
    }

    initApp();

    function sendToClients(strObject) {
        $("#discussion").append(strObject);
    }

    function encodedMessage(sender, objmessage) {
        return "<li><strong>" + sender + "</span></strong>:&nbsp;&nbsp;" + objmessage + "</li>";
    }

    function plainMessage(objmessage) {
        return "<li>" + objmessage + "</li>";
    }

    function userNotification(objColor, objUser, objMessage) {

        // Green
        var userColor = "#007f00;";

        if (objColor < 0) {
            // Red
            userColor = "#ff0000;";
        }

        var userContent = "<strong><span style='color:" +
            userColor +
            "'>";

        if (objUser == "") {
            return userContent + 
            objMessage +
            "</span></strong>";
        }

        return userContent +
            objUser +
            "</span></strong>" +
            objMessage;
    }

    function initApp() {
        // Hide the shape first
        $("#chatContent").hide();

        $myShape.hide();

        $("#btnGetStarted")
            .click(function () {
                toggleSession();
            });

        $("#blkOptions").hide();
        $(".containerx").hide();
        $("#spSupported").hide();
        $("#spUnsupported").hide();
        $('#hostedSections').hide();
        $('#applicationToast').hide();
    }

    function showDialogs() {
        $('#applicationToast').show();

        if (isWindows10()) {
            $("#spSupported").show();
            $("#spUnsupported").hide();
            $('#hostedSections').show();

        } else {
            $("#spSupported").hide();
            $("#spUnsupported").show();

            // Also, we hide buttons that aren't supported
            $('#phdefaultToast').hide();
            $('#phcameraToast').hide();
            $('#phjsonToast').hide();
            $('#phtextyesnoToast').hide();
            $('#phselectionToast').hide();
            $('#phphotoToast').hide();
            $('#phcontactToast').hide();
        }
    }

    function adhocNotification(customMessage) {
        $myShape.html(customMessage);

        $myShape.show().fadeOut(5000);
        $myShape.click(function () {
            $myShape.fadeOut(5000);
        })
            .fadeOut(5000);
    }

    function toggleSession() {
        if (jQuery.trim($("#tbChat").val()).length > 0) {
            $("#initializeSession").hide();

            enableSession();
            showDialogs();

            $("#blkOptions").show();
            $(".containerx").show();
        } else {
            alert("Please input a name!");
        }
    }

    function enableSession() {
        // Get the user name and store it to prepend to messages.			
        $("#displayname").val($("#tbChat").val());
        $('.brand-heading').html("Hello, " + $("#tbChat").val().capitalizeWord() + "!");
        $('.intro-text').hide();

        startSignalR();
    }

    function startSignalR() {
        // Start the connection.

        $.connection.hub.start()
            .done(function () {
                $("#displayname").val($("#tbChat").val());

                $("#gWebNotification")
                    .click(function () {
                        chat.server.showDefaultMessage(3);
                    });

                // --------------------------------------------------------------------------
                // Begin Toasts
                // --------------------------------------------------------------------------

                $("#gAppToast")
                    .click(function () {
                        chat.server.broadcastAllToasts();
                    });

                // Default Toast
                $("#gDefaultToast")
                    .click(function () {
                        chat.server.broadcastDefaultToast();
                    });

                $("#gCustomToastTextYesNo")
                    .click(function () {
                        chat.server.broadcastTextYesNoToast();
                    });

                // Custom Toast - Dropdown
                $("#gCustomToastDropDown")
                    .click(function () {
                        chat.server.broadcastSelectionToast();
                    });

                // Custom Toast - Json Dropdown
                $("#gCustomToastDropDownJson")
                    .click(function () {
                        chat.server.broadcastSelectionJsonToast();
                    });

                $("#conTrigger")
                    .click(function () {
                        chat.server.broadcastContactToast($("#conSharer").val(), $("#conName").val(), $("#conInfo").val(), $("#conType").val());
                    });

                // Photo Toast
                $("#gPhotoToast")
                    .click(function () {
                        chat.server.broadcastPhotoToast($("#displayname").val());
                    });
                // --------------------------------------------------------------------------
                // End Toasts
                // --------------------------------------------------------------------------

                $(".notification")
                    .click(function () {
                        chat.server.clickedUser($("#displayname").val());
                    });

                // --------------------------------------------------------------------------
                // Begin Hidden Fields
                // --------------------------------------------------------------------------

                $("#photofilepath")
                    .click(function () {
                        chat.server.azureUpload($("#photofilepath").val(), $("#displayname").val());
                        $("#photofilepath").val("");
                    });

                // --------------------------------------------------------------------------
                // End Hidden Fields
                // --------------------------------------------------------------------------


                $("#spUser").text($("#tbChat").val() + "!");
            },
                function () {
                    chat.server.setCurrentUser($("#tbChat").val());
                });
    }
}).ready( function() {
    
});


