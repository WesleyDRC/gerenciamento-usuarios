class HttpRequest {

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
      let ajax = new XMLHttpRequest();

      ajax.open(method.toUpperCase(), url);

			ajax.onerror = (error) => {
				reject(error)
			}

      ajax.onload = (event) => {
        let data = {};

        try {
          data = JSON.parse(ajax.responseText);
        } catch (error) {
					reject(error)
          console.log(error);
        }

				resolve(data)
      };

			ajax.setRequestHeader('Content-Type', 'application/json')

      ajax.send(JSON.stringify(params));
    });
  }
}
