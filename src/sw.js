var swRegistration;

if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("./sw.bundle.js")
		.then(function(swReg) {
			console.log("Service worker registered!");
			swRegistration = swReg;
		})
		.catch(function(err) {
			console.log(err);
		});
}

self.addEventListener("message", function(event) {
	console.log("SW Received Message: " + event.data);

	var options = {
		body: `Receiving notifications for the team that you just clicked on lol`,
		// icon: "/src/images/icons/app-icon-96x96.png",
		// image: "/src/images/sf-boat.jpg",
		dir: "ltr",
		lang: "en-US", // BCP 47,
		// badge: "/src/images/icons/app-icon-96x96.png",
		tag: "confirm-notification",
		renotify: true,
		actions: [
			{
				action: "confirm",
				title: "Okay",
				// icon: "/src/images/icons/app-icon-96x96.png",
			},
			{
				action: "cancel",
				title: "Cancel",
				// icon: "/src/images/icons/app-icon-96x96.png",
			},
		],
	};

	swRegistration.showNotification(
		"Successfully subscribed to NBA notifications service!",
		options,
	);
});

// if (window) {
// 	window.addEventListener("click", e => {
// 		const el = e.target.closest(".team");
// 		if (el) {
// 			var options = {
// 				body: `Receiving notifications for the ${el.getAttribute(
// 					"data-team",
// 				)}`,
// 				// icon: "/src/images/icons/app-icon-96x96.png",
// 				// image: "/src/images/sf-boat.jpg",
// 				dir: "ltr",
// 				lang: "en-US", // BCP 47,
// 				// badge: "/src/images/icons/app-icon-96x96.png",
// 				tag: "confirm-notification",
// 				renotify: true,
// 				actions: [
// 					{
// 						action: "confirm",
// 						title: "Okay",
// 						// icon: "/src/images/icons/app-icon-96x96.png",
// 					},
// 					{
// 						action: "cancel",
// 						title: "Cancel",
// 						// icon: "/src/images/icons/app-icon-96x96.png",
// 					},
// 				],
// 			};

// 			navigator.serviceWorker.ready.then(function(swreg) {
// 				swreg.showNotification(
// 					"Successfully subscribed to NBA notifications service!",
// 					options,
// 				);
// 			});
// 		}
// 	});
// }
