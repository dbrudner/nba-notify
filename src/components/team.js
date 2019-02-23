class Team {
	constructor(subscription, fullName, tricode) {
		this.subscription = subscription;
		this.fullName = fullName;
		this.tricode = tricode;
	}

	alreadySubscribed() {
		return this.subscription
			? this.subscription.subscriptions.includes(this.tricode)
			: false;
	}

	createSubscribeButton() {
		const alreadySubscribed = this.alreadySubscribed(this.subscription);
		const subscribeButtonText = this.createSubscribeButtonText(
			alreadySubscribed,
		);
		const subscribeButton = document.createElement("button");

		subscribeButton.setAttribute("data-team", this.fullName);
		subscribeButton.setAttribute("data-tricode", this.tricode);
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

	createTeamName() {
		const teamName = document.createElement("h3");
		const teamNameText = document.createTextNode(this.fullName);
		teamName.appendChild(teamNameText);

		return teamName;
	}

	createLogo() {
		const logo = document.createElement("img");
		logo.src = `//cdn.nba.net/assets/logos/teams/secondary/web/${
			this.tricode
		}.svg`;
		logo.alt = this.fullName;

		return logo;
	}

	buildTeamDiv() {
		const teamDiv = this.createTeamDiv();
		const teamName = this.createTeamName(this.fullName);
		const logo = this.createLogo(this.tricode, this.fullName);
		const subscribeButton = this.createSubscribeButton(
			this.fullName,
			this.tricode,
			this.subscription,
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
}

module.exports = Team;
