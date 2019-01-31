import "@babel/polyfill";
import "./style/style.scss";

(() => {
	const playerForm = document.querySelector("#player-name-form");
	const fetchURL =
		"https://infinite-cove-44078.herokuapp.com/stats?name=Kevin+Durant";

	(async () => {
		const response = await fetch(fetchURL);
		const data = await response.json();
		console.log(await data);
	})();

	playerForm.addEventListener("submit", e => {
		e.preventDefault();
		console.log(e);
		fetchPlayer("Kevin Durant");
	});
})();
