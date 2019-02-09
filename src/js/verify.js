import "../style/verify.scss";

console.log("HI");
(() => {
	document.querySelector(".api-key-form").addEventListener("submit", e => {
		console.log("HI");
		e.preventDefault();
		const input = document.querySelector(".api-key-input").value;
		console.log(input);
	});
})();
