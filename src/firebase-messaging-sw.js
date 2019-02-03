importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

firebase.initializeApp({
	messagingSenderId: "852852054770",
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
	const notificationTitle = "Background Message Title";
	const notificationOptions = {
		body: "Background Message body.",
	};

	return self.registration.showNotification(
		notificationTitle,
		notificationOptions,
	);
});
