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
		apiKey: "AIzaSyDf6VNL53mhdNqrV0ay5Ndru4GzwuCmizU",
		authDomain: "nba-notify.firebaseapp.com",
		databaseURL: "https://nba-notify.firebaseio.com",
		projectId: "nba-notify",
		storageBucket: "nba-notify.appspot.com",
		messagingSenderId: "852852054770",
	});

	// const messaging = firebase.messaging();
	// messaging.usePublicVapidKey(
	// 	"BBHsRUDv4YcY1VCtNiH8quGDY5tLtxT8XJYR4jA-TqCx9pShsDLlkz0-6kz8XxkKVoubVyo5UNmlKoEhpBSuRMw",
	// );

	// Fetches array of NBA teams info
	const fetchTeams = async () => {
		const fetchURL = "https://infinite-cove-44078.herokuapp.com/teams";
		const res = await fetch(fetchURL);
		const data = await res.json();
		return data.Teams;
	};

	const displayTeams = teams => {
		teams.forEach(team => {
			// Getting target container
			const target = document.querySelector(".teams");

			// Creating elements:
			// 	teamDiv: Main div (<div />)
			// 	teamName: Team name (<h3 />)
			// 	logo: Team logo (<img />)
			const teamDiv = document.createElement("div");
			const teamName = document.createElement("h3");
			const logo = document.createElement("img");

			// Adding team name data attribute to main <div />
			teamDiv.setAttribute("data-team", team.fullName);

			// Creating text node for team name <h3 />
			const teamNameText = document.createTextNode(team.fullName);

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

			teamName.appendChild(teamNameText);

			// Appending nodes
			teamDiv.appendChild(logo);
			teamDiv.appendChild(teamName);

			// Adding el to target container
			target.appendChild(teamDiv);
		});
	};

	// Fetches and displays teams
	(async () => {
		const x = await fetchTeams();
		displayTeams(x);
	})();

	const messaging = firebase.messaging();

	// Adds event listener to enable notifications on enable notifications button
	(() => {
		const enableNotificationsButton = document.querySelector(
			".js-enable-notifications",
		);

		enableNotificationsButton.addEventListener("click", async () => {
			try {
				const messaging = firebase.messaging();

				await messaging.requestPermission();
				console.log("Done");
				const token = await messaging.getToken();
				console.log("user token: ", token);

				return token;
			} catch (error) {
				console.error(error);
			}
		});
	})();
})();
