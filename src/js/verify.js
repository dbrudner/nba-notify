import "@babel/polyfill";
import "../style/verify.scss";
import axios from "axios";

(() => {
	const verifyKey = async (name, key) => {
		console.log(name, key);
		try {
			const res = await axios.get(`/api/verify?name=${name}&key=${key}`);
			const data = await res.data;
		} catch (err) {
			console.log(err);
		}
	};

	document.querySelector("#beta-key-form").addEventListener("submit", e => {
		e.preventDefault();
		const name = document.querySelector("#beta-key-name").value;
		const key = document.querySelector("#beta-key-key").value;
		console.log({ name, key });
		verifyKey(name, key);
	});
})();
