import "@babel/polyfill";
import "../style/verify.scss";

const removeChild = (parent, child) => parent.removeChild(child);

const removeAllChildren = parent => {
	const child = parent.firstChild;

	if (child) {
		removeChild(parent, child);
		removeAllChildren(parent);
	}
};

class Verify {
	constructor(
		errorMessageEl,
		errorAlertEl,
		betaKeyNameInput,
		betaKeyKeyInput,
		betaKeyForm,
		loadingSpinnerEl,
	) {
		this.errorMessageEl = errorMessageEl;
		this.errorAlertEl = errorAlertEl;
		this.betaKeyNameInput = betaKeyNameInput;
		this.betaKeyKeyInput = betaKeyKeyInput;
		this.betaKeyForm = betaKeyForm;
		this.loadingSpinnerEl = loadingSpinnerEl;
	}

	toggleEl(el) {
		el.classList.toggle("hidden");
	}

	removeChild(parent, child) {
		parent.removeChild(child);
	}

	removeAllChildren(parent) {
		const child = parent.firstChild;

		if (child) {
			this.removeChild(parent, child);
			this.removeAllChildren(parent);
		}
	}

	showErrorMessage(message) {
		const errorMessage = document.createElement("p");
		const errorText = document.createTextNode(message);
		errorMessage.appendChild(errorText);

		this.removeAllChildren(this.errorMessageEl);
		this.errorMessageEl.appendChild(errorMessage);
		this.toggleEl(this.errorAlertEl);
	}

	async tryVerifyKey(name, key) {
		const res = await fetch(`/api/verify?name=${name}&key=${key}`);
		if (res.ok) {
			window.location.href = "/";
		} else {
			const data = await res.json();
			this.showErrorMessage(data.message);
		}
	}

	catchVerifyKey() {
		const errorMessage = document.createElement("p");
		const errorText = document.createTextNode("Server error");

		this.errorMessage.appendChild(errorText);
		this.errorMessageEl.appendChild(errorMessage);
		this.toggleEl(this.errorMessageEl);
	}

	async verifyKey(name, key) {
		this.toggleEl(this.loadingSpinnerEl);
		try {
			this.tryVerifyKey(name, key);
		} catch (err) {
			this.catchVerifyKey();
		} finally {
			this.toggleEl(this.loadingSpinnerEl);
		}
	}

	intialize() {
		this.betaKeyForm.addEventListener("submit", e => {
			e.preventDefault();
			const name = this.betaKeyNameInput.value;
			const key = this.betaKeyKeyInput.value;
			this.verifyKey(name, key);
		});
	}
}

const errorMessageEl = document.querySelector(".js-error");
const errorAlertEl = document.querySelector(".alert");
const betaKeyNameInput = document.querySelector("#beta-key-name");
const betaKeyKeyInput = document.querySelector("#beta-key-key");
const betaKeyForm = document.querySelector("#beta-key-form");
const loadingSpinnerEl = document.querySelector(".js-loading-spinner");

const verify = new Verify(
	errorMessageEl,
	errorAlertEl,
	betaKeyNameInput,
	betaKeyKeyInput,
	betaKeyForm,
	loadingSpinnerEl,
);

verify.intialize();
