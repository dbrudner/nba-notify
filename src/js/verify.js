import "@babel/polyfill";
import "../style/verify.scss";
import axios from "axios";

(() => {
	const verifyKey = async (name, key) => {
		try {
			const res = await fetch(`/api/verify?name=${name}&key=${key}`);
			if (res.ok) {
				window.location.href = "/";
			} else {
				const data = await res.json();
				const errorMessage = document.createElement("p");
				const errorText = document.createTextNode(data.message);
				errorMessage.appendChild(errorText);
				document.querySelector(".js-error").appendChild(errorMessage);
				document.querySelector(".alert").classList.remove("hidden");
			}
		} catch (err) {
			const errorMessage = document.createElement("p");
			const errorText = document.createTextNode("Server error");
			errorMessage.appendChild(errorText);
			document.querySelector(".js-error").appendChild(errorMessage);
			document.querySelector(".alert").classList.remove("hidden");
		}
	};

	document.querySelector("#beta-key-form").addEventListener("submit", e => {
		e.preventDefault();
		const name = document.querySelector("#beta-key-name").value;
		const key = document.querySelector("#beta-key-key").value;
		verifyKey(name, key);
	});
})();
