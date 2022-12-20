class UserController {
  constructor(formIdCreate, formIdUpdate, tableEl) {
    this.formEl = document.getElementById(formIdCreate);
    this.formUpdateEl = document.getElementById(formIdUpdate);
    this.tableEl = document.getElementById(tableEl);

    this.onSubmit();
    this.onEdit();
    this.selectAll();
  }

  onEdit() {
    document
      .querySelector("#box-user-update .btn-cancel")
      .addEventListener("click", (e) => {
        this.showPanelCreate();
      });

    this.formUpdateEl.addEventListener("submit", (event) => {
      event.preventDefault();

      let btn = this.formUpdateEl.querySelector("[type=submit]");
      btn.disabled = true;

      let values = this.getValues(this.formUpdateEl);

      let index = this.formUpdateEl.dataset.trIndex;

      let tr = this.tableEl.rows[index];

      let userOld = JSON.parse(tr.dataset.user);

      let result = Object.assign({}, userOld, values);

      this.getPhoto(this.formUpdateEl).then(
        (content) => {
          if (!values.photo) {
            result._photo = userOld._photo;
          } else {
            result._photo = content;
          }

          let user = new User();

          user.loadFromJSON(result);

          user.save();

          this.getTr(user, tr);

          this.updateQuantity();

          this.formUpdateEl.reset();

          btn.disabled = false;

          this.showPanelCreate();
        },
        (e) => {
          console.error(e);
        }
      );
    });
  }

  onSubmit() {
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();

      let btn = this.formEl.querySelector("[type=submit]");
      btn.disabled = true;

      let values = this.getValues(this.formEl);

      if (!values) return false;

      this.getPhoto(this.formEl).then(
        (content) => {
          values.photo = content;

          values.save();

          this.addUser(values);

          this.formEl.reset();

          btn.disabled = false;
        },
        (e) => {
          console.error(e);
        }
      );
    });
  }

  getPhoto(formEl) {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();

      let elements = [...formEl.elements].filter((item) => {
        if (item.name === "photo") {
          return item;
        }
      });

      let file = elements[0].files[0];

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (e) => {
        reject(e);
      };

      if (file) {
        fileReader.readAsDataURL(file);
      } else {
        resolve("dist/img/boxed-bg.jpg");
      }
    });
  }

  getValues(formEl) {
    let user = {};
    let isValid = true;

    [...formEl.elements].forEach(function (field) {
      if (
        ["name", "email", "password"].indexOf(field.name) > -1 &&
        !field.value
      ) {
        field.parentElement.classList.add("has-error");
        isValid = false;
      }

      if (field.name === "gender") {
        if (field.checked) user[field.name] = field.value;
      } else if (field.name === "admin") {
        user[field.name] = field.checked;
      } else {
        user[field.name] = field.value;
      }
    });

    if (!isValid) return false;

    return new User(
      user.name,
      user.gender,
      user.country,
      user.birth,
      user.admin,
      user.photo,
      user.email,
      user.password
    );
  }

  getUsersStorage() {
    let users = [];

    if (localStorage.getItem("users")) {
      users = JSON.parse(localStorage.getItem("users"));
    }

    return users;
  }

  selectAll() {
    let users = this.getUsersStorage();

    users.forEach((dataUser) => {
      let user = new User();

      user.loadFromJSON(dataUser);

      this.addUser(user);
    });
  }

  addUser(dataUser) {
    let tr = this.getTr(dataUser);

    this.tableEl.appendChild(tr);

    this.updateQuantity();
  }

  getTr(dataUser, tr = null) {
    if (tr === null) tr = document.createElement("tr");

    tr.dataset.user = JSON.stringify(dataUser);

    tr.innerHTML = `
    <td><img src="${
      dataUser.photo
    }" alt="User Image" class="img-circle img-sm"></td>
    <td>${dataUser.name}</td>
    <td>${dataUser.email}</td>
    <td>${dataUser.admin ? "Sim" : "Não"}</td>
    <td>${Utils.dateFormat(dataUser.registrationTime)}</td>
    <td>
      <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
      <button type="button" class="btn btn-danger  btn-delete btn-xs btn-flat">Excluir</button>
    </td>
    `;

    this.addEventsTr(tr);
    return tr;
  }

  addEventsTr(tr) {
    tr.querySelector(".btn-delete").addEventListener("click", (e) => {
      if (confirm("Deseja realmente excluir?")) {
        tr.remove();
        this.updateQuantity();
      }
    });

    tr.querySelector(".btn-edit").addEventListener("click", (e) => {
      let data = JSON.parse(tr.dataset.user);

      this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

      for (let name in data) {
        let field = this.formUpdateEl.querySelector(
          "[name=" + name.replace("_", "") + "]"
        );

        if (field) {
          switch (field.type) {
            case "file":
              continue;
              break;

            case "radio":
              field = this.formUpdateEl.querySelector(
                "[name=" + name.replace("_", "") + "][value=" + data[name] + "]"
              );
              field.checked = true;
              break;

            case "checkbox":
              field.checked = data[name];
              break;

            default:
              field.value = data[name];
          }
        }
      }

      this.formUpdateEl.querySelector(".photo").src = data._photo;

      this.showPanelUpdate();
    });
  }

  showPanelCreate() {
    document.getElementById("box-user-create").style.display = "block";
    document.getElementById("box-user-update").style.display = "none";
  }

  showPanelUpdate() {
    document.getElementById("box-user-create").style.display = "none";
    document.getElementById("box-user-update").style.display = "block";
  }

  updateQuantity() {
    let amountUsers = 0;
    let amountAdmin = 0;

    [...this.tableEl.children].forEach((item) => {
      amountUsers++;

      let user = JSON.parse(item.dataset.user);
      if (user._admin) amountAdmin++;
    });

    document.querySelector("#amountAdmin").innerHTML = amountAdmin;
    document.querySelector("#amountUsers").innerHTML = amountUsers;
  }
}
