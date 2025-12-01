
function login() {
  const tipo = document.getElementById("tipoUsuario").value;
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("senha").value;

  if (!tipo) {
    alert("Escolha o tipo de usuário!");
    return;
  }

  if (tipo === "gerente" && user === "gerente" && pass === "123") {
    localStorage.setItem("tipoUsuario", "gerente");
    window.location.href = "/Atividade-Demanda/assets/html/gerente.html";
    return;
  }

  if (tipo === "funcionario" && user === "funcionario" && pass === "123") {
    localStorage.setItem("tipoUsuario", "funcionario");
    window.location.href = "/Atividade-Demanda/assets/html/funcionario.html";
    return;
  }

  alert("Usuário ou senha inválidos!");
}



