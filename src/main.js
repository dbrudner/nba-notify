import "@babel/polyfill";
import "./style/style.scss";
import firebase from "firebase";

(() => {
	firebase.initializeApp({
		apiKey: "AIzaSyDf6VNL53mhdNqrV0ay5Ndru4GzwuCmizU",
		authDomain: "nba-notify.firebaseapp.com",
		databaseURL: "https://nba-notify.firebaseio.com",
		projectId: "nba-notify",
		storageBucket: "nba-notify.appspot.com",
		messagingSenderId: "852852054770",
	});

	const messaging = firebase.messaging();
	messaging.usePublicVapidKey(
		"BBHsRUDv4YcY1VCtNiH8quGDY5tLtxT8XJYR4jA-TqCx9pShsDLlkz0-6kz8XxkKVoubVyo5UNmlKoEhpBSuRMw",
	);

	messaging.onTokenRefresh(function() {
		messaging
			.getToken()
			.then(function(refreshedToken) {
				console.log("Token refreshed.");
				// Indicate that the new Instance ID token has not yet been sent to the
				// app server.
				setTokenSentToServer(false);
				// Send Instance ID token to app server.
				sendTokenToServer(refreshedToken);
				// [START_EXCLUDE]
				// Display new Instance ID token and clear UI of all previous messages.
				resetUI();
				// [END_EXCLUDE]
			})
			.catch(function(err) {
				console.log("Unable to retrieve refreshed token ", err);
				showToken("Unable to retrieve refreshed token ", err);
			});
	});

	// messaging
	// 	.requestPermission()
	// 	.then(res => {
	// 		console.log(res);
	// 	})
	// 	.catch(err => {
	// 		throw new Error(err);
	// 	});

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

	(async () => {
		const x = await fetchTeams();
		displayTeams(x);
	})();
})();
