import "@babel/polyfill";
import "../style/verify.scss";
import axios from "axios";

(() => {
	const verifyKey = async key => {
		const res = await axios.get(
			`http://nba-notify-api.herokuapp.com/verify?key=${key}`,
		);
		const data = await res.data;
		console.log(data);
	};

	document.querySelector("#api-key-form").addEventListener("submit", e => {
		e.preventDefault();
		const input = document.querySelector("#api-key-input").value;
		verifyKey(input);
	});
})();
