class Fetch {

	static get(url, params = {}) {
		return this.request('GET', url, params)
	}

	static post(url, params = {}) {
		return this.request('POST', url, params)
	}

	static put(url, params = {}) {
		return this.request('PUT', url, params)
	}

	static delete(url, params = {}) {
		return this.request('DELETE', url, params)
	}

  static request(method, url, params = {}) {
    return new Promise((resolve, reject) => {

			let request;

			switch(method.toLowerCase()) {
				case 'get':
					request=url;
					break;
					default:
					request = new Request(url,{
						method,
						body: JSON.stringify(params),
						headers: new Headers({
							"Content-Type": "application/json"
						})
					})
			}

			fetch(request).then((response) => {
				response.json().then((data) => {
					resolve(data)
				}).catch((error) => {
					reject(error)
				})
			}).catch((error) => {
				reject(error)
			})

    });
  }
}
