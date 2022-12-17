class UserController {
  constructor(formId, tableEl) {
    this.formEl = document.getElementById(formId);
    this.tableEl = document.getElementById(tableEl);

		this.onSubmit();
  }

  onSubmit() {

    document
			this.formEl.addEventListener("submit", event => {
        event.preventDefault();

				this.addUser(this.getValues());
			})
  }

  getValues() {
    let user = {};

    [...this.formEl.elements].forEach(field => {
      if (field.name === "gender") {
        if (field.checked) user[field.name] = field.value;
      } else {
        user[field.name] = field.value;
      }
    });

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

	addUser(dataUser) {
		this.tableEl.innerHTML = `
			<tr>
				<td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
				<td>${dataUser.name}</td>
				<td>${dataUser.email}</td>
				<td>${dataUser.admin}</td>
				<td>${dataUser.birth}</td>
				<td>
					<button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
					<button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
				</td>
			</tr>
	`;
	}
}
