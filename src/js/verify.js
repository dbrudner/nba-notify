import "@babel/polyfill";
import "../style/verify.scss";
import axios from "axios";

(() => {
	const verifyKey = async (name, key) => {
		const res = await axios.get(`/verify?name${name}&key=${key}`);
		const data = await res.data;
		console.log(data);
	};

	document.querySelector("#api-key-form").addEventListener("submit", e => {
		e.preventDefault();
		const name = document.querySelector("#api-key-name").value;
		const key = document.querySelector("#api-key-key").value;
		console.log({ name, key });
		verifyKey(name, key);
	});
})();
