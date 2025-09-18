import axios from 'axios';
import {app_local_storage_key} from './constants';
import {IBulkValidation, IConfig, IUser, validatorRules} from './interfaces';
import Swal from 'sweetalert2';

let options: IConfig;
//export const setBaseApi = (v: string) => options = { apiBaseUrl: v };
export const setChurchId = (c: number) => (options = {churchId: c});
export const getConfig = (): IConfig => options;

export const uuid = () => {
	return 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx'.replace(/x/g, (c) => {
		const crypto = window.crypto;
		const array = new Uint32Array(1);
		return Number(crypto.getRandomValues(array)[0]).toString(16).charAt(0);
	});
};

export const localStorage = {
	get: (key: string) => window.localStorage.getItem(app_local_storage_key + ':' + key),
	remove: (key: string) => window.localStorage.removeItem(app_local_storage_key + ':' + key),
	set: (key: string, data: string) => window.localStorage.setItem(app_local_storage_key + ':' + key, data),
};

export const getUserSession = () => {
	try {
		let user = localStorage.get('user');
		if (user === '' || user === null) return undefined;
		// return JSON.parse(user) as IUser;
		return JSON.parse(user);
	} catch (error) {
		return undefined;
	}
};

export const setToken = (token: string, expiry: string) => {
	localStorage.set('u_token', token);
	localStorage.set('u_token_expiry', expiry);
};

export const cacheUserData = (userInfo: string, token: string, expiry: string) => {
	localStorage.set('u_user_info', userInfo);
	localStorage.set('u_token', token);
	localStorage.set('u_token_expiry', expiry);
};

export const clearUserData = () => {
	localStorage.remove('u_user_info');
	localStorage.remove('u_token');
	localStorage.remove('u_token_expiry');
};

export const getAxios = (baseURL: string = '') => {
	const instance = axios.create({baseURL});
	let token = localStorage.get('u_token');
	if (token != null && token !== '') {
		instance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
	}

	instance.interceptors.response.use(
		(response) => {
			if (response.status === 200 && response.data.data == 401) {
				clearUserData();
				window.location.reload();
			}
			return response;
		},
		(error) => {
			if (error.response.status === 401) {
				clearUserData();
				window.location.reload();
			}
			if (error.response.status === 429) {
				return Promise.resolve(error);
			}
			return Promise.reject(error);
		},
	);
	return instance;
};

export function validator(
	rules: {rule: validatorRules; message: string; data?: any}[],
	value: any,
	formCollection?: HTMLFormControlsCollection,
) {
	for (const rule of rules) {
		const ruleKey = rule.rule;
		const message = rule.message;
		const data = rule.data;

		if (ruleKey === 'empty' && (value === null || value === '')) return message;

		if (ruleKey === 'min-len' && data && value.length < Number(data)) return message;

		if (ruleKey === 'compare' && formCollection && value != (formCollection[data] as HTMLFormElement)?.value)
			return message;

		if (ruleKey === 'max-len' && data && value.length > Number(data)) return message;

		if (ruleKey === 'msisdn' && !new RegExp('^(' + data + '|0)?(\\d{9})$', 'i').test(value)) return message;

		if (ruleKey === 'url' && !/^(ftp|http|https):\/\/[^ "]+$/.test(value)) return message;

		if (ruleKey === 'regex' && !new RegExp(data).test(value)) return message;

		if (ruleKey === 'email' && !/^(\w)+@(\w)+\.([A-Za-z]{2,4})$/.test(value)) return message;

		if (ruleKey === 'stringonly' && /\d/.test(value)) return message;

		if (ruleKey === 'alphanumeric' && !/\W*$/.test(value)) return message;

		if (ruleKey === 'numberonly' && !/\d/.test(value)) return message;

		if (ruleKey === 'date' && !/^\d{4}(-)\d{2}\1\d{2}$/.test(value)) return message;
	}
}

export const isFormValid = (
	formId: string,
	validations: IBulkValidation,
	callback?: (type: string, data: any) => void,
): boolean => {
	let form = document.getElementById(formId) as HTMLFormElement;
	let error = 0;

	if (form == null) {
		console.error('Unable to get form with id: ' + formId + ' for validation');
		return false;
	}

	document.querySelectorAll('.form-error-message').forEach((e) => e.remove());
	for (let validate of validations) {
		let el = form.elements[validate.id];

		const value = el ? (el as HTMLFormElement)?.value ?? validate.value : validate.value ?? validate.id;

		let required = validator(validate.rules, value, form.elements);
		let callbackOptions = {rule: validate, el, message: required, identifier: validate.id};
		if (required) {
			error += 1;
			if (el && callback) callback('error', callbackOptions);
		} else {
			if (el && callback) callback('clear', callbackOptions);
		}
	}
	if (error > 0) {
		return false;
	}
	return true;
};

export const noAccessPrompt = () => {
	Swal.fire({
		icon: 'error',
		title: 'Sorry...',
		text: "You don't have permission to access this page!",
		focusCancel: false,
		focusConfirm: false,
		focusDeny: false
	});
};
