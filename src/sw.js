var deferredPrompt;
var enableNotificationsButtons = document.querySelector(
	".enable-notifications",
);

if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("/sw.js")
		.then(function() {
			console.log("Service worker registered!");
			var options = {
				body:
					"You successfully subscribed to our Notification service!",
				icon: "/src/images/icons/app-icon-96x96.png",
				image: "/src/images/sf-boat.jpg",
				dir: "ltr",
				lang: "en-US", // BCP 47,
				vibrate: [100, 50, 200],
				badge: "/src/images/icons/app-icon-96x96.png",
				tag: "confirm-notification",
				renotify: true,
				actions: [
					{
						action: "confirm",
						title: "Okay",
						icon: "/src/images/icons/app-icon-96x96.png",
					},
					{
						action: "cancel",
						title: "Cancel",
						icon: "/src/images/icons/app-icon-96x96.png",
					},
				],
			};

			navigator.serviceWorker.ready.then(function(swreg) {
				swreg.showNotification(
					"Successfully subscribed (from SW)!",
					options,
				);
			});
		})
		.catch(function(err) {
			console.log(err);
		});
}

// window.addEventListener("beforeinstallprompt", function(event) {
// 	console.log("beforeinstallprompt fired");
// 	event.preventDefault();
// 	deferredPrompt = event;
// 	return false;
// });

// function displayConfirmNotification() {
// 	if ("serviceWorker" in navigator) {
var options = {
	body: "You successfully subscribed to our Notification service!",
	icon: "/src/images/icons/app-icon-96x96.png",
	image: "/src/images/sf-boat.jpg",
	dir: "ltr",
	lang: "en-US", // BCP 47,
	vibrate: [100, 50, 200],
	badge: "/src/images/icons/app-icon-96x96.png",
	tag: "confirm-notification",
	renotify: true,
	actions: [
		{
			action: "confirm",
			title: "Okay",
			icon: "/src/images/icons/app-icon-96x96.png",
		},
		{
			action: "cancel",
			title: "Cancel",
			icon: "/src/images/icons/app-icon-96x96.png",
		},
	],
};

navigator.serviceWorker.ready.then(function(swreg) {
	swreg.showNotification("Successfully subscribed (from SW)!", options);
});
// 	}
// }

// function askForNotificationPermission() {
// 	Notification.requestPermission(function(result) {
// 		console.log("User Choice", result);
// 		if (result !== "granted") {
// 			console.log("No notification permission granted!");
// 		} else {
// 			displayConfirmNotification();
// 		}
// 	});
// }

// const y = document.querySelector(".notify");

// y.addEventListener("click", () => {
// 	var options = {
// 		body: "You successfully subscribed to our Notification service!",
// 		icon: "/src/images/icons/app-icon-96x96.png",
// 		image: "/src/images/sf-boat.jpg",
// 		dir: "ltr",
// 		lang: "en-US", // BCP 47,
// 		vibrate: [100, 50, 200],
// 		badge: "/src/images/icons/app-icon-96x96.png",
// 		tag: "confirm-notification",
// 		renotify: true,
// 		actions: [
// 			{
// 				action: "confirm",
// 				title: "Okay",
// 				icon: "/src/images/icons/app-icon-96x96.png",
// 			},
// 			{
// 				action: "cancel",
// 				title: "Cancel",
// 				icon: "/src/images/icons/app-icon-96x96.png",
// 			},
// 		],
// 	};

// 	navigator.serviceWorker.ready.then(function(swreg) {
// 		swreg.showNotification("Successfully subscribed (from SW)!", options);
// 	});
// });

// if ("Notification" in window) {
// 	for (var i = 0; i < enableNotificationsButtons.length; i++) {
// 		enableNotificationsButtons[i].style.display = "inline-block";
// 		enableNotificationsButtons[i].addEventListener(
// 			"click",
// 			askForNotificationPermission,
// 		);
// 	}
// }
