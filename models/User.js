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
          this[name] = json[name];
      }
    }
  }

  static getUsersStorage() {
    let users = [];

    if (localStorage.getItem("users")) {
      users = JSON.parse(localStorage.getItem("users"));
    }

    return users;
  }

  getNewID() {

		if (!window.id) window.id = 0;

		id++;

		return id
  }

  save() {
    let users = User.getUsersStorage();

		console.log(users)

    if (this.id > 0) {

			users.map((user) => {
				if(parseInt(user._id) === parseInt(this.id)) {
					console.log(this)
					Object.assign(user, this )
				}
				return user
			})

    } else {
      this._id = this.getNewID();

      users.push(this);

    }

		localStorage.setItem("users", JSON.stringify(users));

  }
}
