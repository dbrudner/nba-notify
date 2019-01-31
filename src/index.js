import "@babel/polyfill";
import "./style/style.scss";

(() => {
	const playerForm = document.querySelector("#player-name-form");
	const fetchURL =
		"https://infinite-cove-44078.herokuapp.com/stats?name=Kevin+Durant";

	fetch(fetchURL).then(res => {
		const x = res.json();
		console.log(x);
	});

	// const fetchPlayer = async player => {
	//     const response = await fetch(`https://infinite-cove-44078.herokuapp.com/stats?name=${player}`)
	//     console.log(await response.json());
	// }

	playerForm.addEventListener("submit", e => {
		e.preventDefault();
		console.log(e);
		fetchPlayer("Kevin Durant");
	});
})();
