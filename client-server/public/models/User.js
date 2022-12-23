class User {
  constructor(name, gender, country, birth, admin, photo, email, password) {
    this._id;
    this._name = name;
    this._gender = gender;
    this._country = country;
    this._birth = birth;
    this._admin = admin;
    this._photo = photo;
    this._email = email;
    this._password = password;
    this._registrationTime = new Date();
  }

  get id() {
    return this._id;
  }
  get registrationTime() {
    return this._registrationTime;
  }
  get name() {
    return this._name;
  }
  get gender() {
    return this.__gender;
  }
  get country() {
    return this._country;
  }
  get birth() {
    return this._birth;
  }
  get admin() {
    return this._admin;
  }
  get photo() {
    return this._photo;
  }
  get email() {
    return this._email;
  }
  get password() {
    return this._password;
  }

  set photo(value) {
    this._photo = value;
  }

  loadFromJSON(json) {
    for (let name in json) {
      switch (name) {
        case "_registrationTime":
          break;
        default:
          if(name.substring(0,1) === "_")this[name] = json[name];
      }
    }
  }

  static getUsersStorage() {
    return Fetch.get("/users")
  }

  toJSON() {
    let json = {};

    Object.keys(this).forEach((key) => {
      if (this[key] !== undefined) json[key] = this[key];
    });

    return json;
  }

  save() {
    return new Promise((resolve, reject) => {

      let promise;

      if (this.id) {
        promise = Fetch.put(`/users/${this.id}`, this.toJSON());
      } else {
        promise = Fetch.post(`/users`, this.toJSON());
      }

      promise.then((data) => {
        this.loadFromJSON(data);
        resolve(this)
      }).catch((error) => {
        reject(error)
      })
    });
  }

  deleteUser() {
    return Fetch.delete(`/users/${this.id}`)
  }
}
