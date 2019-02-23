import "@babel/polyfill";
import axios from "axios";
import * as firebase from "firebase";
import "../style/home.scss";
import Team from "../components/team";

class Home {
	constructor(
		main,
		notificationsAlert,
		teams,
		enableNotificationsButton,
		loadingEl,
	) {
		this.main = document.querySelector(".main");
		this.notificationsAlert = document.querySelector(".alert");
		this.teams = document.querySelector(".teams");
		this.enableNotificationsButton = enableNotificationsButton = document.querySelector(
			".js-enable-notifications",
		);
		this.loadingEl = document.querySelector(".js-loading-spinner");
	}

	async initialize() {
		this.initializeFirebase();
		this.initializeHandleTokenRefresh();
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

	async initializeHandleTokenRefresh() {
		const messaging = firebase.messaging();
		const oldToken = await messaging.getToken();

		// Send to db to replace old token with new token for subscriptions
		messaging.onTokenRefresh(() => {
			messaging.getToken().then(async newToken => {
				const response = fetch(
					`/api/refresh-token?oldToken=${oldToken}&newToken=${newToken}`,
				);
				const data = response.json();
				console.log(data);
			});
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
			if (e.target.classList.contains("js-subscribe-team")) {
				this.setSubscription(e.target, "subscribe");
			}
			if (e.target.classList.contains("js-unsubscribe-team")) {
				this.setSubscription(e.target, "unsubscribe");
			}
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

	displayTeams(teams, subscription) {
		teams.forEach(({ fullName, tricode }) => {
			const newTeam = new Team(subscription, fullName, tricode);
			const newTeamDiv = newTeam.buildTeamDiv();
			this.teams.appendChild(newTeamDiv);
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

const home = new Home();

home.initialize();
