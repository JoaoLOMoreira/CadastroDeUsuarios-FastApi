const form = document.getElementById("user-form");
const submitButton = document.getElementById("submit-button");
const refreshButton = document.getElementById("refresh-button");
const messageBox = document.getElementById("form-message");
const tableBody = document.getElementById("users-table-body");
const totalUsersBadge = document.getElementById("total-users");
const apiUrlLabel = document.getElementById("api-url-label");
const API_BASE_URL = "http://127.0.0.1:8000";

apiUrlLabel.textContent = `${API_BASE_URL}/users`;

function renderIdleState() {
  updateTotalUsers(0);
  tableBody.innerHTML = `
    <tr>
      <td colspan="3" class="empty-state">API ainda nao iniciada. Clique em Atualizar tabela quando subir o backend.</td>
    </tr>
  `;
}

function showMessage(text, type = "") {
  messageBox.textContent = text;
  messageBox.className = "message";

  if (type) {
    messageBox.classList.add(type);
  }
}

function updateTotalUsers(total) {
  totalUsersBadge.textContent = `${total} usuario${total === 1 ? "" : "s"}`;
}

function renderRows(users) {
  tableBody.innerHTML = "";
  updateTotalUsers(users.length);

  if (!users.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" class="empty-state">Nenhum item cadastrado ate o momento.</td>
      </tr>
    `;
    return;
  }

  users.forEach((user) => {
    const row = document.createElement("tr");

    [user.id, user.name, user.email].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });
}

async function requestJson(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch (error) {
    throw new Error(`A API nao esta disponivel em ${API_BASE_URL}.`);
  }

  if (!response.ok) {
    let message = "Nao foi possivel concluir a operacao.";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch (error) {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  return response.json();
}

async function loadUsers({ showSuccessMessage = false } = {}) {
  tableBody.innerHTML = `
    <tr>
      <td colspan="3" class="empty-state">Carregando itens...</td>
    </tr>
  `;

  try {
    const users = await requestJson("/users");
    renderRows(users);
    if (showSuccessMessage) {
      showMessage("Tabela atualizada com sucesso.", "success");
    }
  } catch (error) {
    updateTotalUsers(0);
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" class="empty-state">API offline no momento.</td>
      </tr>
    `;
    showMessage(
      `${error.message} Assim que voce subir o backend, clique em Atualizar tabela de novo.`,
      "error"
    );
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    name: formData.get("name")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    password: formData.get("password")?.toString()
  };

  if (!payload.name || !payload.email || !payload.password) {
    showMessage("Preencha todos os campos antes de cadastrar.", "error");
    return;
  }

  submitButton.disabled = true;
  showMessage("Enviando cadastro...");

  try {
    await requestJson("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    form.reset();
    showMessage("Usuario cadastrado com sucesso.", "success");
    await loadUsers();
  } catch (error) {
    showMessage(
      `${error.message} Inicie a API e tente novamente.`,
      "error"
    );
  } finally {
    submitButton.disabled = false;
  }
});

refreshButton.addEventListener("click", () => loadUsers({ showSuccessMessage: true }));

renderIdleState();
showMessage("Voce pode testar o layout agora. Quando subir a API, use Atualizar tabela ou Cadastrar.");
