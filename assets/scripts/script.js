let colaboradores = JSON.parse(localStorage.getItem("colaboradores")) ||
  [
    {
      id: 1,
      nome: "jorginho",
      senha: "jorginho",
      telefone: "00000000000",
      endereco: "morro toramento",
      cargo: "imunda",
      bdate: "12/01/2000",
    }
  ];

function funcao() {
  console.log(colaboradores);
}
funcao()

function login() {
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("senha").value;

  // Login do gerente continua igual
  if (user === "gerente" && pass === "123") {
    localStorage.setItem("tipoUsuario", "gerente");
    window.location.href = "pages/gerente.html";
    return;
  }

  //  Verifica colaboradores cadastrados no localStorage
  let colaborador = colaboradores.find(c => c.nome === user && c.senha === pass);

  if (colaborador) {
    localStorage.setItem("tipoUsuario", "funcionario");
    localStorage.setItem("usuarioAtual", colaborador.nome);

    window.location.href = "pages/funcionario.html";
    return;
  }

  alert("Usuário ou senha inválidos!");
}

function exibirNome() {
  let nome = localStorage.getItem("usuarioAtual");
  document.getElementById("nomeAtual").innerText = "Painel do Funcionário " + nome || "Usuário";
}

function mostrarCadastroColaborador() {
  document.getElementById("formColaborador").style.display = "block";
  document.getElementById("relatorio").style.display = "none"
}

function cadastrarColaborador() {
  var nome = document.getElementById("nomeColaborador").value;
  var senha = document.getElementById("senhaColaborador").value;
  var telefone = document.getElementById("telefoneColaborador").value;
  var endereco = document.getElementById("enderecoColaborador").value;
  var cargo = document.getElementById("cargoColaborador").value;
  var bdate = document.getElementById("nascimentoColaborador").value;

  if (nome === "") {
    alert("Digite o nome do colaborador!");
    return;
  }
  if (senha === "") {
    alert("Digite a senha do colaborador!");
    return;
  }
  if (telefone === "") {
    alert("Digite o telefone do colaborador!");
    return;
  }
  if (endereco === "") {
    alert("Digite o endereço do colaborador!");
    return;
  }
  if (cargo === "") {
    alert("Digite o cargo do colaborador!");
    return;
  }
  if (bdate === "") {
    alert("Digite a data de nascimento do colaborador!");
    return;
  }

  var novoColaborador = {
    id: colaboradores.length + 1,
    nome: nome,
    senha: senha,
    telefone: telefone,
    endereco: endereco,
    cargo: cargo,
    bdate: bdate
  };

  colaboradores.push(novoColaborador);


  localStorage.setItem("colaboradores", JSON.stringify(colaboradores));

  alert("Colaborador cadastrado: " + nome);
}

//Holerite
function mostrarFormularioHolerite() {
  document.getElementById("formHolerite").style.display = "block";
  document.getElementById("formColaborador").style.display = "none";
  document.getElementById("resultadoHolerite").style.display = "none";
}

function gerarHolerite() {
  let nome = document.getElementById("nomeFuncionario").value;
  let salario = Number(document.getElementById("salarioFuncionario").value);
  let horasExtras = Number(document.getElementById("horasExtras").value);
  let descontos = Number(document.getElementById("descontosGerais").value);

  if (!nome || !salario) {
    alert("Preencha o nome e o salário!");
    return;
  }

  // Cálculos
  let inss = salario * 0.08;
  let irrf = salario * 0.075;
  let salarioLiquido = salario + horasExtras - inss - irrf - descontos;

  // Preenchendo os spans
  document.getElementById("r_nome").innerText = nome;
  document.getElementById("r_salario").innerText = "R$ " + salario.toFixed(2);
  document.getElementById("r_extras").innerText = "R$ " + horasExtras.toFixed(2);
  document.getElementById("r_inss").innerText = "R$ " + inss.toFixed(2);
  document.getElementById("r_irrf").innerText = "R$ " + irrf.toFixed(2);
  document.getElementById("r_desc").innerText = "R$ " + descontos.toFixed(2);
  document.getElementById("r_liquido").innerText = "R$ " + salarioLiquido.toFixed(2);


  document.getElementById("resultadoHolerite").style.display = "block";
}
//Holerite

const telefone = document.getElementById("telefone");

telefone.addEventListener("input", function () {
  let valor = telefone.value;

  // Remove tudo que não for número
  valor = valor.replace(/\D/g, "");

  // Aplica máscara (xx) xxxxx-xxxx
  if (valor.length > 10) {
    valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else {
    valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  }

  telefone.value = valor;
});