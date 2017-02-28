debugger;

$(function () {
    // Declare a proxy to reference the hub.
    var chat = $.connection.signalrwin10,
        $myShape = $(".notification");


    // Create a function that the hub can call to broadcast messages.
    chat.client.broadcastMessage = function (name, message) {
        // Html encode display name and message.
        var encodedName = $("<div />").text(name).html();
        var encodedMsg = $("<div />").text(message).html();

        //var clientMessage = "<li><strong>" + encodedName + "</span></strong>:&nbsp;&nbsp;" + encodedMsg + "</li>";
        sendToClients(encodedMessage(encodedName, encodedMsg));
        //$("#discussion").append("<li><strong>" + encodedName + "</span></strong>:&nbsp;&nbsp;" + encodedMsg + "</li>");
    };

    chat.client.broadcastPlainMessage = function (message) {
        var encodedMsg = $("<div />").text(message).html();

        sendToClients(plainMessage(encodedMsg));

        //$("#discussion").append("<li>" + encodedMsg + "</li>");
    };

    chat.client.toastMessage = function (name, message) {
        showToast(name, message);
    };

    chat.client.showAllUsers = function (userCount, strList) {

        var showAllUserMsg = "<strong>" +
            userCount +
            "</strong> active " +
            checkPlural(userCount, "user") +
            " right now. " +
            strList;

        sendToClients(plainMessage(showAllUserMsg));

        //$("#discussion")
        //    .append("<li><strong>" + userCount + "</strong> active " + checkPlural(userCount, "user") + " right now. " + strList + "</li>");
    };

    chat.client.joinMessage = function (user, joinDate) {
        var encodedName = $("<div />").text(user).html();
        var encodedMsg = $("<div />").text(" has joined the room on " + joinDate).html();


        sendToClients(plainMessage(userNotification(0, encodedName, encodedMsg)));



        //$("#discussion")
        //    .append('<li><strong><span style="color:#007f00;">' +
        //        encodedName +
        //        "</span></strong>" +
        //        encodedMsg +
        //        "</li>");
    };

    chat.client.leftMessage = function (user, joinDate) {
        var encodedName = $("<div />").text(user).html();
        var encodedMsg = $("<div />").text(" has left the room on " + joinDate).html();
        //$("#discussion")
        //    .append('<li><strong><span style="color:#ff0000;">' +
        //        encodedName +
        //        "</span></strong>" +
        //        encodedMsg +
        //        "</li>");

        sendToClients(plainMessage(userNotification(-1, encodedName, encodedMsg)));

    };

    chat.client.joinOwnMessage = function () {

        
        //$("#discussion")
        //    .append('<li><strong><span style="color:#007f00;">' + "You have joined the room" + "</span></strong></li>");

        sendToClients(plainMessage(userNotification(0, "", "You have joined the room")));
    };

    chat.client.joinExistingConnections = function (connectionCount) {

        sendToClients(plainMessage(userNotification(-1, "", "You have " + connectionCount + checkPlural(connectionCount, " connection") + " in the room")));

        //$("#discussion")
        //    .append('<li><strong><span style="color:#ff0000;">' + "You have " + connectionCount + checkPlural(connectionCount, " connection") + " in the room" + "</span></strong></li>");
    };

    chat.client.displayDefaultMessage = function (customMessage) {
        adhocNotification(customMessage);
    };

    chat.client.broadcastToasts = function (var1, var2, var3) {
        if (isWindows10()) {
            showApplicationToast(var1, var2, var3);
        } else {
            adhocNotification(var1);
        }
    }

    chat.client.broadcastPhoto = function (photoUrl, userName) {

        sendToClients(plainMessage("<strong>" + userName + "<strong> has shared a photo."));
        sendToClients(plainMessage("<img src=" + photoUrl + " />"));

        //$("#discussion").append("<li><strong>" + userName + "<strong> has shared a photo.</li>");
        //$('#discussion').append("<li><img src=" + photoUrl + " /></li>");
        //$('#discussion').append($('<img>', { id: 'theImg', src: photoUrl }));
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
    }

    function showDialogs() {
        if (isWindows10()) {
            $("#spSupported").show();
            $("#spUnsupported").hide();
        } else {
            $("#spSupported").hide();
            $("#spUnsupported").show();

            // Also, we hide buttons that aren't supported
            $('#gDefaultToast').hide();
            $('#gCustomToast').hide();
            $('#gCamera').hide();
            //$('#gAppToast').hide();
        }
    }

    function adhocNotification(customMessage) {
        $myShape.html("The value from the config file is : " + customMessage);

        $myShape.show().fadeOut(5000);
        $myShape.click(function () {
            $myShape.fadeOut(300);
        })
            .fadeOut(500);
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

        // Set initial focus to message input box.
        $("#message").focus();

        startSignalR();
    }

    function startSignalR() {
        // Start the connection.

        $.connection.hub.start()
            .done(function () {
                $("#displayname").val($("#tbChat").val());

                $("#sendmessage")
                    .click(function () {
                        // Call the Send method on the hub.
                        chat.server.send($("#displayname").val(), $("#message").val());
                        // Clear text box and reset focus for next comment.
                        $("#message").val("").focus();
                    });

                $("#gWebNotification")
                    .click(function () {
                        chat.server.someMethod();
                    });

                $("#gAppToast")
                    .click(function () {
                        chat.server.broadcastAllToasts();
                    });

                $("#btnDefaultMsg")
                    .click(function () {
                        chat.server.displayDownTime();
                    });

                $("#btnConfigMsg")
                    .click(function () {
                        chat.server.displayConfigCustomText();
                    });

                $(".notification")
                    .click(function () {
                        chat.server.registerUser($("#displayname").val());
                    });

                $("#photofilepath")
                    .click(function () {
                        chat.server.azureUpload($("#photofilepath").val(), $("#displayname").val());
                        $("#photofilepath").val("");
                    });

                $("#spUser").text($("#tbChat").val() + "!");
            },
                function () {
                    chat.server.setCurrentUser($("#tbChat").val());
                });
    }
});

function toastHandler(btnClicked, userText) {

    //document.getElementById('userButton').innerHTML = btnClicked;
    //document.getElementById('userText').innerHTML = userText;
}

function checkPlural(objCount, strWord) {

    if (objCount > 0) {
        return strWord + "s";
    }

    return strWord;
}

(function () {
    // Add the event listener to handle Windows activated event
    if (isWindows10) {

        Windows.UI.WebUI.WebUIApplication.addEventListener('activated', function (args) {
            var activation = Windows.ApplicationModel.Activation;

            // Handle applcation launch from the Windows OS
            if (args.kind === activation.ActivationKind.launch) {
                // Check if there are launch args
                if (args.arguments) {
                    var launchArgs = JSON.parse(args.arguments);

                    if (launchArgs.type === 'toast') {
                        // The app has been launched from the click of a notification
                        console.log(args);
                    }
                }
            }
                // Handle user interaction from toast notification on Windows
            else if (args.kind === activation.ActivationKind.toastNotification) {
                toastHandler(args.argument, args.userInput.textReply);
            }
        });


    }
})();