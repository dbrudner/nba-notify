import "@babel/polyfill";
import "../style/home.scss";
import * as firebase from "firebase";
import axios from "axios";

class Home {
	constructor(
		main,
		notificationsAlert,
		teams,
		enableNotificationsButton,
		loadingEl,
	) {
		this.main = main;
		this.notificationsAlert = notificationsAlert;
		this.teams = teams;
		this.enableNotificationsButton = enableNotificationsButton;
		this.loadingEl = loadingEl;
	}

	async initialize() {
		this.initializeFirebase();
		this.createEnableNotificationsButtonClickListener();
		this.createTeamClickListener();

		const teams = await this.fetchTeams();
		const subscription = await this.fetchSubscription();

		this.loadingEl.classList.add("hidden");
		this.displayTeams(teams, subscription);
	}

	initializeFirebase() {
		firebase.initializeApp({
			authDomain: "nba-notify.firebaseapp.com",
			databaseURL: "https://nba-notify.firebaseio.com",
			projectId: "nba-notify",
			storageBucket: "nba-notify.appspot.com",
			messagingSenderId: "852852054770",
		});
	}

	createEnableNotificationsButtonClickListener() {
		this.enableNotificationsButton.addEventListener("click", async () => {
			try {
				const messaging = firebase.messaging();
				await messaging.requestPermission();
				const token = await messaging.getToken();

				return token;
			} catch (error) {
				console.error(error);
			}
		});
	}

	createTeamClickListener() {
		document.addEventListener("click", e => {
			const action = e.target.classList.contains("js-subscribe-team")
				? "subscribe"
				: "unsubscribe";
			this.setSubscription(e.target, action);
		});
	}

	registerServiceWorker() {
		if ("serviceWorker" in navigator) {
			window.addEventListener("load", function() {
				navigator.serviceWorker.register("/firebase-messaging-sw.js");
			});
		} else {
			alert("Please use a modern browser (chrome or firefox).");
		}
	}

	async fetchTeams() {
		const fetchURL = "https://infinite-cove-44078.herokuapp.com/teams";
		const res = await fetch(fetchURL);
		const data = await res.json();
		return data.Teams;
	}

	async fetchSubscription() {
		const messaging = firebase.messaging();
		await messaging.requestPermission();
		const userToken = await messaging.getToken();

		const fetchURL = `https://nba-notify-api.herokuapp.com/user?userToken=${userToken}`;
		const res = await fetch(fetchURL);
		const data = await res.json();
		return data;
	}

	checkNotificationPermission() {
		const hiddenEl =
			Notification.permission === "granted"
				? this.notificationsAlert
				: this.main;

		hiddenEl.classList.add("hidden");
	}

	alreadySubscribed(subscription) {
		return subscription
			? subscription.subscriptions.includes(team.tricode)
			: false;
	}

	createSubscribeButton(fullName, tricode, subscription) {
		const alreadySubscribed = this.alreadySubscribed(subscription);
		const subscribeButtonText = this.createSubscribeButtonText(
			alreadySubscribed,
		);
		const subscribeButton = document.createElement("button");

		subscribeButton.setAttribute("data-team", fullName);
		subscribeButton.setAttribute("data-tricode", tricode);
		subscribeButton.appendChild(subscribeButtonText);
		subscribeButton.classList.add(
			"btn",
			"center-block",
			alreadySubscribed ? "js-unsubscribe-team" : "js-subscribe-team",
			alreadySubscribed && "btn-warning",
		);

		return subscribeButton;
	}

	createSubscribeButtonText(alreadySubscribed) {
		return document.createTextNode(
			alreadySubscribed ? "Unsubscribe" : "Subscribe",
		);
	}

	createTeamName(fullName) {
		const teamName = document.createElement("h3");
		const teamNameText = document.createTextNode(fullName);
		teamName.appendChild(teamNameText);

		return teamName;
	}

	createLogo(tricode, fullName) {
		const logo = document.createElement("img");
		logo.src = `//cdn.nba.net/assets/logos/teams/secondary/web/${tricode}.svg`;
		logo.alt = fullName;

		return logo;
	}

	buildTeamDiv({ fullName, tricode }, subscription) {
		const teamDiv = this.createTeamDiv();
		const teamName = this.createTeamName(fullName);
		const logo = this.createLogo(tricode, fullName);
		const subscribeButton = this.createSubscribeButton(
			fullName,
			tricode,
			subscription,
		);

		teamDiv.appendChild(teamName);
		teamDiv.appendChild(logo);
		teamDiv.appendChild(subscribeButton);

		return teamDiv;
	}

	createTeamDiv() {
		const teamDiv = document.createElement("div");
		teamDiv.classList.add("team");

		return teamDiv;
	}

	displayTeams(teams, subscription) {
		teams.forEach(team => {
			const teamDiv = this.buildTeamDiv(team, subscription);
			this.teams.appendChild(teamDiv);
		});
	}

	async setSubscription(el, action) {
		try {
			el.setAttribute("disabled", true);
			el.firstChild.nodeValue = "Loading...";

			const tricode = el.getAttribute("data-tricode");
			const messaging = firebase.messaging();

			const userToken = await messaging.getToken();

			const url = `https://nba-notify-api.herokuapp.com/${action}`;

			const body = {
				tricode,
				userToken,
			};

			await axios.post(url, body);

			await el.removeAttribute("disabled");
			el.classList.add("btn-warning");
			el.firstChild.nodeValue = "Unsubscribe";
		} catch (error) {}
	}
}

const main = document.querySelector(".main");
const notificationsAlert = document.querySelector(".alert");
const teams = document.querySelector(".teams");
const enableNotificationsButton = document.querySelector(
	".js-enable-notifications",
);
const loadingEl = document.querySelector(".js-loading-spinner");

const home = new Home(
	main,
	notificationsAlert,
	teams,
	enableNotificationsButton,
	loadingEl,
);

home.initialize();
