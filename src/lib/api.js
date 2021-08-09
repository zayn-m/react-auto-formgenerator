import axios from 'axios';
import { toast } from 'react-toastify';
toast.configure();

class Api {
	constructor(apiUrl, tokenKey) {
		this.apiUrl = apiUrl;
		this.tokenKey = tokenKey;
		let service = axios.create({
			headers: {
				csrf: 'token'
			}
		});

		service.interceptors.response.use(this._handleSuccess, this._handleError);
		this.service = service;
	}

	_handleSuccess(response) {
		return response;
	}

	_handleError(error) {
		switch (error.response && error.response.status) {
			case 401:
				toast.error('Unauthorized, check console for details');
				break;
			case 403:
				toast.error('Forbidden, check console for details');
				break;
			case 404:
				toast.error('Route not found, check console for details');
				break;
			default:
				// toast.error('Server/Unknown error occurred, check console for details');
				break;
		}
		return Promise.reject(error);
	};

	_redirectTo(document, path) {
		document.location = path;
	};

	/**
	 * Method to handle api requests.
	 * @param {string} type 
	 * @param {string} path
	 * @param {Object} [payload]
	 */
	request(type, path, payload) {
		type = type.toLowerCase();

		if (path.includes('http') || path.includes('https')) {
			if (path.startsWith('/')) path = path.substr(path.indexOf('/') + 1);
		} else {
			path = this.apiUrl + path;
		}

		const bearerToken = localStorage.getItem(this.tokenKey);

		if (bearerToken) {
			this.service.defaults.headers.Authorization = `Bearer ${bearerToken}`;
		}

		if (type === 'get') {
			return this.service.get(path).then(function(response) {
				return response.data;
			});
		}

		return this.service
			.request({
				method: type,
				url: path,
				responseType: 'json',
				data: payload
			})
			.then(function(response) {
				return response.data;
			});
	}
}

export default Api;