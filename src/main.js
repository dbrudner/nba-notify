import "@babel/polyfill";
import "./style/style.scss";
import * as firebase from "firebase";

(() => {
	// Register service worker
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", function() {
			navigator.serviceWorker.register("/firebase-messaging-sw.js");
		});
	}

	// Initialize firebase
	firebase.initializeApp({
		authDomain: "nba-notify.firebaseapp.com",
		databaseURL: "https://nba-notify.firebaseio.com",
		projectId: "nba-notify",
		storageBucket: "nba-notify.appspot.com",
		messagingSenderId: "852852054770",
	});

	// Fetches array of NBA teams info
	const fetchTeams = async () => {
		const fetchURL = "https://infinite-cove-44078.herokuapp.com/teams";
		const res = await fetch(fetchURL);
		const data = await res.json();
		return data.Teams;
	};

	const checkNotificationPermission = () => {
		debugger;
		if (Notification.permission === "granted") {
			const el = document.querySelector(".js-notifications-alert");

			el.classList.add("hidden");
		}
	};

	const displayTeams = teams => {
		teams.forEach(team => {
			// Getting target container
			const target = document.querySelector(".teams");

			// Creating elements:
			// 	teamDiv: Main div (<div />)
			// 	teamName: Team name (<h3 />)
			// 	logo: Team logo (<img />)
			// 	subscribeButton: button when clicked subscribes to team (<button />)
			const teamDiv = document.createElement("div");
			const teamName = document.createElement("h3");
			const logo = document.createElement("img");
			const subscribeButton = document.createElement("button");

			// Creating text node for team name <h3 />
			const teamNameText = document.createTextNode(team.fullName);

			// Creating subscribe text
			const subscribeText = document.createTextNode("Subscribe");

			// Adding data attributes to main <div />
			teamDiv.setAttribute("data-team", team.fullName);
			teamDiv.setAttribute("data-tricode", team.tricode);

			// Adding .team class to main <div />
			teamDiv.classList.add("team");

			// Adding team name to header
			teamName.appendChild(teamNameText);

			// Setting src on <img />
			logo.src = `//cdn.nba.net/assets/logos/teams/secondary/web/${
				team.tricode
			}.svg`;

			// Setting alt on <img />
			logo.alt = team.fullName;

			// Adding text and class to <button />
			subscribeButton.appendChild(subscribeText);
			subscribeButton.classList.add(
				"btn",
				"center-block",
				"js-subscribe-team",
			);

			// Adding teamname text to teamName <div />
			teamName.appendChild(teamNameText);

			// Appending nodes
			teamDiv.appendChild(logo);
			teamDiv.appendChild(teamName);
			teamDiv.appendChild(subscribeButton);

			// Adding el to target container
			target.appendChild(teamDiv);
		});
	};

	// Fetches and displays teams
	(async () => {
		const x = await fetchTeams();
		displayTeams(x);
	})();

	// Adds event listener to enable notifications on enable notifications button
	const enableNotificationsButton = document.querySelector(
		".js-enable-notifications",
	);

	enableNotificationsButton.addEventListener("click", async () => {
		try {
			const messaging = firebase.messaging();

			await messaging.requestPermission();
			const token = await messaging.getToken();
			console.log("user token: ", token);

			return token;
		} catch (error) {
			console.error(error);
		}
	});

	checkNotificationPermission();
})();
