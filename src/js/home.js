import "@babel/polyfill";
import "../style/style.scss";
import * as firebase from "firebase";
import axios from "axios";

(() => {
	// Initialize firebase
	firebase.initializeApp({
		authDomain: "nba-notify.firebaseapp.com",
		databaseURL: "https://nba-notify.firebaseio.com",
		projectId: "nba-notify",
		storageBucket: "nba-notify.appspot.com",
		messagingSenderId: "852852054770",
	});

	const messaging = firebase.messaging();

	// Register service worker
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", function() {
			navigator.serviceWorker.register("/firebase-messaging-sw.js");
		});
	}

	// Fetches array of NBA teams info
	const fetchTeams = async () => {
		const fetchURL = "https://infinite-cove-44078.herokuapp.com/teams";
		const res = await fetch(fetchURL);
		const data = await res.json();
		return data.Teams;
	};

	const fetchSubscription = async () => {
		await messaging.requestPermission();
		const userToken = await messaging.getToken();

		const fetchURL = `https://nba-notify-api.herokuapp.com/user?userToken=${userToken}`;
		const res = await fetch(fetchURL);
		const data = await res.json();
		console.log(data);
		return data;
	};

	// Checks notification permission and hides either
	// 	alert if permission is granted
	// 	teams if permission is not granted
	const checkNotificationPermission = () => {
		let hiddenEl;

		if (Notification.permission === "granted") {
			hiddenEl = document.querySelector(".js-notifications-alert");
		} else {
			hiddenEl = document.querySelector(".main");
		}

		hiddenEl.classList.add("hidden");
	};

	// Iterates through `teams`, creates elements, and appends them
	const displayTeams = (teams, subscription) => {
		teams.forEach(team => {
			const alreadySubscribed = subscription
				? subscription.subscriptions.includes(team.tricode)
				: false;

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
			const subscribeText = document.createTextNode(
				alreadySubscribed ? "Unsubscribe" : "Subscribe",
			);

			// Adding data attributes to main <div />
			subscribeButton.setAttribute("data-team", team.fullName);
			subscribeButton.setAttribute("data-tricode", team.tricode);

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
				alreadySubscribed ? "js-unsubscribe-team" : "js-subscribe-team",
				alreadySubscribed && "btn-warning",
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

	// function to add event listener to enable notifications on enable notifications button
	const enableNotificationsButton = document.querySelector(
		".js-enable-notifications",
	);

	enableNotificationsButton.addEventListener("click", async () => {
		try {
			await messaging.requestPermission();
			const token = await messaging.getToken();

			return token;
		} catch (error) {
			console.error(error);
		}
	});

	const subscribeToTeam = async el => {
		try {
			el.setAttribute("disabled", true);
			el.firstChild.nodeValue = "Loading...";
			// el.innerHTML =
			// 	'<i class="fa fa-circle-o-notch fa-spin" style="font-size:24px"></i>';

			const tricode = el.getAttribute("data-tricode");
			const messaging = firebase.messaging();

			const userToken = await messaging.getToken();

			const url = "https://nba-notify-api.herokuapp.com/subscribe";

			const body = {
				tricode,
				userToken,
			};

			await axios.post(url, body);

			await el.removeAttribute("disabled");
			el.classList.add("btn-warning");
			el.firstChild.nodeValue = "Unsubscribe";
		} catch (error) {
			console.error(error);
		}
	};

	const unsubscribeToTeam = async el => {
		try {
			el.setAttribute("disabled", true);
			el.firstChild.nodeValue = "Loading...";
			// el.innerHTML =
			// 	'<i class="fa fa-circle-o-notch fa-spin" style="font-size:24px"></i>';

			const tricode = el.getAttribute("data-tricode");
			const messaging = firebase.messaging();

			const userToken = await messaging.getToken();

			const url = "https://nba-notify-api.herokuapp.com/unsubscribe";

			const body = {
				tricode,
				userToken,
			};

			await axios.post(url, body);

			await el.removeAttribute("disabled");
			el.classList.remove("btn-warning");
			el.firstChild.nodeValue = "Subscribe";
		} catch (error) {
			console.error(error);
		}
	};

	document.addEventListener("click", e => {
		if (e.target.classList.contains("js-subscribe-team")) {
			subscribeToTeam(e.target);
		}
		if (e.target.classList.contains("js-unsubscribe-team")) {
			unsubscribeToTeam(e.target);
		}
	});

	checkNotificationPermission();

	const createLoadingDiv = () => {
		const loadingDiv = document.createElement("div");
		const loadingText = document.createTextNode("Loading");
		loadingDiv.appendChild(loadingText);
		loadingDiv.classList.add("loading");
		return loadingDiv;
	};

	// Fetches and displays teams
	(async () => {
		const loadingDiv = createLoadingDiv();
		const teamsDiv = document.querySelector(".teams");
		teamsDiv.appendChild(loadingDiv);
		const teams = await fetchTeams();
		const subscription = await fetchSubscription();
		teamsDiv.removeChild(loadingDiv);
		displayTeams(teams, subscription);
	})();
})();
