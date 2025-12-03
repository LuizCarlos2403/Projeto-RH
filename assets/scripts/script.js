// ====================== DADOS INICIAIS ======================
let colaboradores = JSON.parse(localStorage.getItem("colaboradores")) || [
  {
    id: 1,
    nome: "jorginho",
    senha: "jorginho",
    telefone: "(11) 90000-0000",
    endereco: "morro toramento",
    cargo: "Operador",
    bdate: "2000-01-12",
  }
];

// salva no localStorage sempre que muda colaboradores
function salvarColaboradores() {
  localStorage.setItem("colaboradores", JSON.stringify(colaboradores));
}

// ====================== LOGIN (opcional - caso use index.html) ======================
function login() {
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("senha").value.trim();

  // gerente
  if (user === "gerente" && pass === "123") {
    localStorage.setItem("tipoUsuario", "gerente");
    window.location.href = "pages/gerente.html";
    return;
  }

  // colaborador cadastrado
  let col = colaboradores.find(c => c.nome === user && c.senha === pass);
  if (col) {
    localStorage.setItem("tipoUsuario", "funcionario");
    localStorage.setItem("usuarioAtual", col.nome);
    window.location.href = "pages/funcionario.html";
    return;
  }

  alert("Usuário ou senha inválidos!");
}

// ====================== GERENTE: CADASTRO ======================
function mostrarCadastroColaborador() {
  document.getElementById("formColaborador").style.display = "block";
  document.getElementById("formHolerite") && (document.getElementById("formHolerite").style.display = "none");
}

function cadastrarColaborador() {
  let nome = document.getElementById("nomeColaborador").value.trim();
  let senha = document.getElementById("senhaColaborador").value.trim();
  let telefone = document.getElementById("telefoneColaborador").value.trim();
  let endereco = document.getElementById("enderecoColaborador").value.trim();
  let cargo = document.getElementById("cargoColaborador").value.trim();
  let bdate = document.getElementById("nascimentoColaborador").value;

  if (!nome || !senha || !telefone || !endereco || !cargo || !bdate) {
    alert("Preencha todos os campos!");
    return;
  }

  colaboradores.push({
    id: colaboradores.length + 1,
    nome, senha, telefone, endereco, cargo, bdate
  });

  salvarColaboradores();
  alert("Colaborador cadastrado com sucesso!");
  // limpa campos
  document.getElementById("nomeColaborador").value = "";
  document.getElementById("senhaColaborador").value = "";
  document.getElementById("telefoneColaborador").value = "";
  document.getElementById("enderecoColaborador").value = "";
  document.getElementById("cargoColaborador").value = "";
  document.getElementById("nascimentoColaborador").value = "";
}

// ====================== GERENTE: HOLERITE ======================
function mostrarFormularioHolerite() {
  document.getElementById("formHolerite").style.display = "block";
  document.getElementById("formColaborador") && (document.getElementById("formColaborador").style.display = "none");
  document.getElementById("resultadoHolerite") && (document.getElementById("resultadoHolerite").style.display = "none");
}

function gerarHolerite() {
  let nome = document.getElementById("nomeFuncionario").value.trim();
  let salario = Number(document.getElementById("salarioFuncionario").value) || 0;
  let horasExtras = Number(document.getElementById("horasExtras").value) || 0;
  let descontos = Number(document.getElementById("descontosGerais").value) || 0;

  if (!nome || !salario) {
    alert("Preencha o nome e o salário!");
    return;
  }

  let col = colaboradores.find(c => c.nome === nome);
  if (!col) {
    alert("Funcionário não encontrado. Cadastre-o antes.");
    return;
  }

  // ===== CÁLCULO DO INSS POR FAIXA =====
  let inss = 0;
  if (salario <= 1412.00) {
    inss = salario * 0.075;
  } else if (salario <= 2666.68) {
    inss = salario * 0.09;
  } else if (salario <= 4000.03) {
    inss = salario * 0.12;
  } else {
    inss = salario * 0.14;
  }

  // ===== CÁLCULO DO IRRF POR FAIXA =====
  let irrf = 0;
  let baseIR = salario - inss;

  if (baseIR <= 2259.20) {
    irrf = 0;
  } else if (baseIR <= 2826.65) {
    irrf = (baseIR * 0.075) - 169.44;
  } else if (baseIR <= 3751.05) {
    irrf = (baseIR * 0.15) - 381.44;
  } else if (baseIR <= 4664.68) {
    irrf = (baseIR * 0.225) - 662.77;
  } else {
    irrf = (baseIR * 0.275) - 896.00;
  }

  if (irrf < 0) irrf = 0; // garante que não fique negativo

  let salarioLiquido = salario + horasExtras - inss - irrf - descontos;

  const holerite = { nome, salario, horasExtras, descontos, inss, irrf, salarioLiquido, geradoEm: new Date().toISOString() };
  localStorage.setItem("holerite_" + nome, JSON.stringify(holerite));

  // exibir resultado no gerente
  document.getElementById("r_nome").innerText = holerite.nome;
  document.getElementById("r_salario").innerText = `R$ ${holerite.salario.toFixed(2)}`;
  document.getElementById("r_extras").innerText = `R$ ${holerite.horasExtras.toFixed(2)}`;
  document.getElementById("r_inss").innerText = `R$ ${holerite.inss.toFixed(2)}`;
  document.getElementById("r_irrf").innerText = `R$ ${holerite.irrf.toFixed(2)}`;
  document.getElementById("r_desc").innerText = `R$ ${holerite.descontos.toFixed(2)}`;
  document.getElementById("r_liquido").innerText = `R$ ${holerite.salarioLiquido.toFixed(2)}`;
  document.getElementById("resultadoHolerite").style.display = "block";

  alert("Holerite gerado e salvo para " + nome);
  // limpa campos
  document.getElementById("nomeFuncionario").value = "";
  document.getElementById("salarioFuncionario").value = "";
  document.getElementById("horasExtras").value = "";
  document.getElementById("descontosGerais").value = "";
}

// ====================== GERENTE: RESCISÃO ======================
function preencherSelectColaboradores() {
  const sel = document.getElementById("selectColaboradorRescisao");
  sel.innerHTML = "";
  colaboradores.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.nome;
    opt.innerText = c.nome + " — " + c.cargo;
    sel.appendChild(opt);
  });
}

function monthsBetween(d1, d2) {
  // d1 < d2
  let months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months += d2.getMonth() - d1.getMonth();
  // if day of d2 >= day of d1 count current month as full month else not
  if (d2.getDate() >= d1.getDate()) months += 1;
  return Math.max(0, months);
}

function gerarRescisao() {
  const nome = document.getElementById("selectColaboradorRescisao").value;
  const adm = document.getElementById("rescisao_admissao").value;
  const dem = document.getElementById("rescisao_demissao").value;
  const salario = Number(document.getElementById("rescisao_salario").value) || 0;
  const feriasVencidas = document.getElementById("rescisao_feriasVencidas").value === "sim";
  const aviso = document.getElementById("rescisao_aviso").value; // indenizado/trabalhado

  if (!nome || !adm || !dem || !salario) {
    alert("Preencha funcionário, datas e salário!");
    return;
  }

  const dtAdm = new Date(adm);
  const dtDem = new Date(dem);
  if (dtDem < dtAdm) { alert("Data de demissão deve ser posterior à admissão."); return; }

  // cálculo simples:
  const diasTrabalhadosNoMes = dtDem.getDate(); // assume dias no mês até data de demissão
  const saldo = (salario / 30) * diasTrabalhadosNoMes;

  // meses trabalhados no ano corrente (para 13º e férias proporcionais)
  const mesesTotais = monthsBetween(dtAdm, dtDem); // meses completos aproximados
  const mesesAno = Math.min(12, mesesTotais % 12 === 0 ? 12 : mesesTotais % 12); // aproximação

  const decimo = (salario / 12) * mesesAno;
  const feriasProp = (salario / 12) * mesesAno;
  const feriasPropTotal = feriasProp * (4 / 3); // incluindo 1/3 adicional

  const feriasVencidasValor = feriasVencidas ? salario * (4 / 3) : 0; // salário + 1/3

  // FGTS sobre as verbas (simplificado: 8% sobre salário)
  const fgtsBase = salario * 0.08;
  const multaFgts = fgtsBase * 0.4;

  // Aviso prévio: se indenizado, considera 1 salário a mais
  const avisoValor = aviso === "indenizado" ? salario : 0;

  // total (simplificado)
  const total = saldo + decimo + feriasPropTotal + feriasVencidasValor + avisoValor + multaFgts;

  const rescisao = {
    nome, adm, dem, salario,
    saldo, decimo, feriasPropTotal, feriasVencidasValor, fgtsBase, multaFgts, avisoValor, total,
    geradoEm: new Date().toISOString()
  };

  localStorage.setItem("rescisao_" + nome, JSON.stringify(rescisao));
  alert("Rescisão calculada e salva para " + nome);
  // fecha modal automaticamente se quiser: bootstrap modal will be closed manually by user
}

// ====================== FUNCIONÁRIO: CARREGAR/EDITAR DADOS ======================
function carregarDadosFuncionario() {
  const nome = localStorage.getItem("usuarioAtual");
  if (!nome) return;

  const col = colaboradores.find(c => c.nome === nome);
  document.getElementById("nomeAtual").innerText = "Painel do Funcionário - " + nome;

  if (!col) return;

  // preencher campos do modal
  const elem = document.getElementById("d_nome");
  if (elem) elem.value = col.nome;
  const ecargo = document.getElementById("d_cargo");
  if (ecargo) ecargo.value = col.cargo;
  const telefone = document.getElementById("telefone");
  if (telefone) telefone.value = col.telefone;
  const endereco = document.getElementById("endereco");
  if (endereco) endereco.value = col.endereco;
  const bdate = document.getElementById("bdate");
  if (bdate) {
    // if stored as YYYY-MM-DD or other, try to set
    bdate.value = col.bdate;
  }
}

function salvarEdicao() {
  const nome = localStorage.getItem("usuarioAtual");
  if (!nome) return;
  const col = colaboradores.find(c => c.nome === nome);
  if (!col) return;

  const telefone = document.getElementById("telefone").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const bdate = document.getElementById("bdate").value;

  col.telefone = telefone;
  col.endereco = endereco;
  col.bdate = bdate;

  salvarColaboradores();
  alert("Seus dados foram atualizados.");
}

// ====================== FUNCIONÁRIO: VER HOLERITE ======================
function mostrarHoleriteFuncionario() {
  const nome = localStorage.getItem("usuarioAtual");
  if (!nome) { alert("Usuário não identificado."); return; }
  const hol = JSON.parse(localStorage.getItem("holerite_" + nome));
  if (!hol) { alert("Nenhum holerite disponível."); return; }

  document.getElementById("h_nome").innerText = hol.nome;
  document.getElementById("h_salario").innerText = `R$ ${hol.salario.toFixed(2)}`;
  document.getElementById("h_extras").innerText = `R$ ${hol.horasExtras.toFixed(2)}`;
  document.getElementById("h_inss").innerText = `R$ ${hol.inss.toFixed(2)}`;
  document.getElementById("h_irrf").innerText = `R$ ${hol.irrf.toFixed(2)}`;
  document.getElementById("h_desc").innerText = `R$ ${hol.descontos.toFixed(2)}`;
  document.getElementById("h_liquido").innerText = `R$ ${hol.salarioLiquido.toFixed(2)}`;

  document.getElementById("holeriteFuncionario").style.display = "block";
}

// ====================== FUNCIONÁRIO: VER RESCISÃO ======================
function mostrarRescisaoFuncionario() {
  const nome = localStorage.getItem("usuarioAtual");
  if (!nome) { alert("Usuário não identificado."); return; }
  const rc = JSON.parse(localStorage.getItem("rescisao_" + nome));
  if (!rc) { alert("Nenhuma rescisão encontrada."); return; }

  document.getElementById("rc_admissao").innerText = rc.adm;
  document.getElementById("rc_demissao").innerText = rc.dem;
  document.getElementById("rc_salario").innerText = `R$ ${rc.salario.toFixed(2)}`;

  document.getElementById("rc_saldo").innerText = `R$ ${rc.saldo.toFixed(2)}`;
  document.getElementById("rc_ferias_vencidas").innerText = `R$ ${rc.feriasVencidasValor ? rc.feriasVencidasValor.toFixed(2) : (rc.feriasVencidasValor === 0 ? "R$ 0.00" : "")}` || `R$ ${rc.feriasVencidasValor ? rc.feriasVencidasValor.toFixed(2) : "0.00"}`;
  document.getElementById("rc_ferias_prop").innerText = `R$ ${rc.feriasPropTotal ? rc.feriasPropTotal.toFixed(2) : rc.feriasPropTotal}`;
  document.getElementById("rc_13").innerText = `R$ ${rc.decimo ? rc.decimo.toFixed(2) : "0.00"}`;
  document.getElementById("rc_fgts").innerText = `R$ ${rc.fgtsBase ? rc.fgtsBase.toFixed(2) : "0.00"}`;
  document.getElementById("rc_multa").innerText = `R$ ${rc.multaFgts ? rc.multaFgts.toFixed(2) : "0.00"}`;

  document.getElementById("rc_total").innerText = `R$ ${rc.total.toFixed(2)}`;

  document.getElementById("rescisaoFuncionario").style.display = "block";
}

// ====================== MÁSCARA TELEFONE GLOBAL ======================
document.addEventListener("input", function (e) {
  if (!e.target) return;
  const id = e.target.id;
  if (id === "telefone" || id === "telefoneColaborador") {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    else v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    e.target.value = v;
  }
});

// ====================== INICIALIZAÇÃO (caso queira popular selects etc.) ======================
(function init() {
  // garante que colaboradores do localStorage sejam sincronizados
  const stored = JSON.parse(localStorage.getItem("colaboradores"));
  if (stored) colaboradores = stored;
})();
