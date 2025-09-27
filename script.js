// Dados simulados
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let doacoes = JSON.parse(localStorage.getItem('doacoes')) || [];
let familias = JSON.parse(localStorage.getItem('familias')) || [];
let valorCesta = parseFloat(localStorage.getItem('valorCesta')) || 50;

// Atualizar a barra superior
function atualizarInfoBar() {
  const totalDoacoes = doacoes.reduce((a, b) => a + b.qtd, 0);
  document.getElementById('info-geral').innerText = `Famílias necessitadas: ${familias.length} | Valor da cesta básica: R$ ${valorCesta.toFixed(2)} | Total de cestas doadas: ${totalDoacoes}`;
}

// Login
function login() {
  const usuario = document.getElementById('login-usuario').value.trim();
  const senha = document.getElementById('login-senha').value.trim();

  if (!usuario || !senha) {
    alert("Usuário e senha são obrigatórios.");
    return;
  }

  if (usuario === "ADMIN" && senha === "Admin2025") {
    localStorage.setItem('usuarioAtual', JSON.stringify({ usuario, admin: true }));
    mostrarAdmin();
  } else {
    const user = usuarios.find(u => u.usuario === usuario && u.senha === senha);
    if (user) {
      localStorage.setItem('usuarioAtual', JSON.stringify({ usuario, admin: false }));
      mostrarUsuario();
    } else {
      alert("Usuário ou senha inválidos");
    }
  }
}

// Cadastro
function cadastrar() {
  const usuario = document.getElementById('cadastro-usuario').value.trim();
  const senha = document.getElementById('cadastro-senha').value.trim();

  if (!usuario || !senha) {
    alert("Usuário e senha não podem estar em branco.");
    return;
  }

  if (usuarios.some(u => u.usuario === usuario)) {
    alert("Usuário já existe");
    return;
  }

  usuarios.push({ usuario, senha });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  alert("Cadastro realizado com sucesso!");
  mostrarLogin();
}

// Mostrar login/cadastro
function mostrarCadastro() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('cadastro-container').style.display = 'block';
}

function mostrarLogin() {
  document.getElementById('cadastro-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
}

// Painel usuário comum
function mostrarUsuario() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('cadastro-container').style.display = 'none';
  document.getElementById('painel-admin').style.display = 'none';
  document.getElementById('logout-btn').style.display = 'block';

  const totalDoacoes = doacoes.reduce((a, b) => a + b.qtd, 0);

  document.getElementById('painel-usuario').style.display = 'block';
  document.getElementById('painel-usuario').innerHTML = `
    <h2>Quero fazer uma doação</h2>
    <p>Valor da cesta: R$ ${valorCesta.toFixed(2)}</p>
    <input type="number" id="qtdCestas" placeholder="Quantidade de cestas" />
    <button onclick="doar()">Doar</button>
    <h3>Total de famílias necessitadas: ${familias.length}</h3>
    <h3>Total de doações: ${totalDoacoes}</h3>
  `;
  atualizarInfoBar();
}

// Doação
function doar() {
  const qtd = parseInt(document.getElementById('qtdCestas').value);
  if (!qtd || qtd <= 0) {
    alert("Quantidade inválida");
    return;
  }

  const usuario = JSON.parse(localStorage.getItem('usuarioAtual')).usuario;
  doacoes.push({ usuario, qtd, data: new Date().toLocaleString() });
  localStorage.setItem('doacoes', JSON.stringify(doacoes));
  alert("Deus abençoe pela sua generosidade!");
  mostrarUsuario();
}

// Painel admin
function mostrarAdmin() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('cadastro-container').style.display = 'none';
  document.getElementById('painel-usuario').style.display = 'none';
  document.getElementById('logout-btn').style.display = 'block';

  let doadoresHtml = doacoes.map(d => `<li>${d.usuario} doou ${d.qtd} cestas em ${d.data}</li>`).join("");

  document.getElementById('painel-admin').style.display = 'block';
  document.getElementById('painel-admin').innerHTML = `
    <h2>Administração</h2>

    <h3>Histórico de doadores:</h3>
    <ul>${doadoresHtml}</ul>

    <h3>Nova família necessitada:</h3>
    <input type="text" id="nomeFamilia" placeholder="Nome da família" />
    <button onclick="adicionarFamilia()">Adicionar</button>

    <h3>Remover família:</h3>
    <select id="removerFamilia">
      ${familias.map((f, i) => `<option value="${i}">${f}</option>`).join("")}
    </select>
    <button onclick="removerFamilia()">Remover</button>

    <h3>Alterar valor da cesta básica:</h3>
    <input type="number" id="novoValor" placeholder="Novo valor" />
    <button onclick="alterarValor()">Alterar</button>
  `;
  atualizarInfoBar();
}

// Adicionar família
function adicionarFamilia() {
  const nome = document.getElementById('nomeFamilia').value.trim();
  if (!nome) {
    alert("Nome inválido");
    return;
  }

  familias.push(nome);
  localStorage.setItem('familias', JSON.stringify(familias));
  alert("Família adicionada!");
  mostrarAdmin();
}

// Remover família
function removerFamilia() {
  const index = document.getElementById('removerFamilia').value;
  familias.splice(index, 1);
  localStorage.setItem('familias', JSON.stringify(familias));
  alert("Família removida!");
  mostrarAdmin();
}

// Alterar valor da cesta
function alterarValor() {
  const novoValor = parseFloat(document.getElementById('novoValor').value);
  if (!novoValor || novoValor <= 0) {
    alert("Valor inválido");
    return;
  }

  valorCesta = novoValor;
  localStorage.setItem('valorCesta', valorCesta);
  alert("Valor atualizado!");
  mostrarAdmin();
}

// Logout
function logout() {
  localStorage.removeItem('usuarioAtual');
  location.reload();
}

// Verificação inicial
window.onload = () => {
  atualizarInfoBar();

  const usuarioAtual = JSON.parse(localStorage.getItem('usuarioAtual'));
  if (usuarioAtual) {
    if (usuarioAtual.admin) {
      mostrarAdmin();
    } else {
      mostrarUsuario();
    }
  }
};
