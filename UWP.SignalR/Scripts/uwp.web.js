
	$(function () {
		// Declare a proxy to reference the hub.
		var chat = $.connection.msdev,
			$myShape = $('.notification');

		// Create a function that the hub can call to broadcast messages.
		chat.client.broadcastMessage = function (name, message) {
			// Html encode display name and message.
			var encodedName = $('<div />').text(name).html();
			var encodedMsg = $('<div />').text(message).html();
			$('#discussion').append('<li><strong>' + encodedName
				+ '</span></strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');
		};

		chat.client.broadcastPlainMessage = function (message) {
		    var encodedMsg = $('<div />').text(message).html();
		    $('#discussion').append('<li>' + encodedMsg + '</li>');
		};

		chat.client.toastMessage = function (name, message) {
			showToast(name, message);
		};

		chat.client.showAllUsers = function (userCount, strList) {
		    $('#discussion').append('<li>There are <strong>' + userCount
				+ '</strong> active users right now. ' + strList + '</li>');
		};

		chat.client.joinMessage = function (user, joinDate) {
			var encodedName = $('<div />').text(user).html();
			var encodedMsg = $('<div />').text(' has joined the room on ' + joinDate).html();
			$('#discussion').append('<li><strong><span style="color:#ff0000;">' + encodedName
				+ '</span></strong>' + encodedMsg + '</li>');
		};

		chat.client.joinOwnMessage = function() {
			$('#discussion').append('<li><strong><span style="color:#ff0000;">' + 'You have joined the room'
				+ '</span></strong></li>');
		};

		chat.client.displaydowntime = function (name, message) {
			// Html encode display name and message.
			var encodedName = $('<div />').text(name).html();
			var encodedMsg = $('<div />').text(message).html();
			$('#discussion').append('<li><strong>' + encodedName
				+ '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');

		    // change the values, if needed.
			// $myShape.html(emptyText);
			$myShape.show().fadeOut(5000);
			$myShape.click(function() {
				$myShape.fadeOut(300);
			}).fadeOut(500);
		};

		chat.client.displayUserCount = function(usercount) {
			var dispuser = "Total number of users is: ";
			$('#numusers').text(dispuser + usercount).html();
		};

		chat.client.displaydowntimefromconfig = function (name, message, cvalue) {
			// Html encode display name and message.
			var encodedName = $('<div />').text(name).html();
			var encodedMsg = $('<div />').text(message).html();
			// Add the message to the page.
			$('#discussion').append('<li><strong>' + encodedName
				+ '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');

			// change the values
			$myShape.html('The value from the config file is ' + cvalue);

			$myShape.show();
			$myShape.click(function() {
				$myShape.hide();
			});
		};

		// Hide the shape first
		$('#chatContent').hide();

		$myShape.hide();

		$('#btnToast').hide();
		$('#btnCamera').hide();
		$('#btnContact').hide();

		$('#btnGetStarted').click(function() {
			toggleChat();
		});

		function enableChat() {
			// Get the user name and store it to prepend to messages.			
			$('#displayname').val($('#tbChat').val());

			// Set initial focus to message input box.
			$('#message').focus();

			// Start the connection.
			$.connection.hub.start().done(function() {			
				$('#displayname').val($('#tbChat').val());

				$('#sendmessage').click(function() {
					// Call the Send method on the hub.
					chat.server.send($('#displayname').val(), $('#message').val());
					// Clear text box and reset focus for next comment.
					$('#message').val('').focus();
				});

				$('#btnDefaultMsg').click(function () {
					chat.server.displayDownTime();
				});

				$('#btnConfigMsg').click(function () {
				    chat.server.displayConfigCustomText();
				});

				$('.notification').click(function () {
					//chat.server.registerUser();
				});

				$('#spUser').text($('#tbChat').val() + '!');
			}, function () {
			    chat.server.setCurrentUser($('#tbChat').val());
			});
		}

		function toggleChat() {
			var inp = $('#tbChat').val();
			if (jQuery.trim(inp).length > 0) {

			    try {
			        if (typeof Windows == undefined) {
			            $('#btnToast').hide();
			            $('#btnCamera').hide();
			            $('#btnContact').hide();
			        } else {
			            $('#btnToast').show();
			            $('#btnCamera').show();
			            $('#btnContact').show();
			        }
			    }
			    catch (err) {
			        $('#btnToast').hide();
			        $('#btnCamera').hide();
			        $('#btnContact').hide();
			    }

				$('#hdName').val($('#tbChat').val());
				$('#chatContent').show();
				$('#chatContent').css("visibility", "");
				$('#chatInit').hide();
				$('#btnGetStarted').hide();
				enableChat();
			} else {
				alert('Input error!');
			}
		}
	});
