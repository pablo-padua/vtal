function showAndBlock(activity) {
  for (var i = 0, l = activity.length; i < l; i++) {
    $(activity[i]).show();

    $(activity[i] + " select").each(function () {
      $(this).css("pointer-events", "none");
    });

    //use an each to block everything inside the class activity-X
    $(activity[i] + " :input").each(function () {
      $(this).attr("readonly", "readonly");
      $(this)
        .css("background-color", "#eee")
        .children("option:not(:selected)")
        .prop("disabled", true);
      $(this).on("mousedown", function (e) {
        this.blur();
        window.focus();
      });
      if ($(this).is(":checkbox")) {
        $(this).on("click keydown", function (e) {
          // Intercepta o evento de clique e teclas de espaço
          if (
            e.type === "click" ||
            (e.type === "keydown" && e.keyCode === 32)
          ) {
            e.preventDefault(); // Impede a alteração do checkbox
            return false; // Sai da função
          }
        });
      } else if ($(this).is(":radio")) {
        $(this).on("click", function () {
          return false;
        });
      }
    });
  }
}

const mascaraMoeda = (field) => {
  console.trace("mascaraMoeda triggered");
  let valor = field.value;
  valor = valor.replace(
    /\D/g,
    ""
  ); /**Substitui o que não é dígito por "", /g é [Global][1]*/
  valor = valor.replace(/(\d{1})(\d{14})$/, "$1.$2"); // Ponto antes dos últimos dígitos.
  valor = valor.replace(/(\d{1})(\d{11})$/, "$1.$2"); // Ponto antes dos últimos 11 dígitos.
  valor = valor.replace(/(\d{1})(\d{8})$/, "$1.$2"); // Ponto antes dos últimos 8 dígitos.
  valor = valor.replace(/(\d{1})(\d{5})$/, "$1.$2"); // Ponto antes dos últimos 5 dígitos.
  valor = valor.replace(/(\d{1})(\d{1,2})$/, "$1,$2"); // Virgula antes dos últimos 2 dígitos.
  field.value = "R$ " + valor;
};

function anexar() {
  parent.document.getElementById("ecm-navigation-inputFile-clone").click();
}

function addLinha() {
  var row = wdkAddChild("tabela_auxilio_creche");
  var dataAtual = new Date();
  var minDate = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 2, 1);
  setTimeout(() => {
    $("#dataPagamentoAuxilio___" + row)
      .mask("00/0000")
      .keydown(function (event) {
        event.preventDefault();
      });
    FLUIGC.calendar("#dataPagamentoAuxilio___" + row, {
      type: "month", // Define o tipo de visualização como mês
      minViewMode: "months", // Define o modo mínimo de visualização como mês
      format: "MM/yyyy", // Formato de exibição do mês e ano
      minDate: minDate,
      maxDate: dataAtual,
      keyboard: false,
    });
  }, 500);
}

function removeLinha(element) {
  fnWdkRemoveChild(element);
}

function hasLine() {
  return $("#tableBodyRow tr").length > 1;
}

function typeReembolso() {
  const tipoReembolso = $("#tipoReembolso").val();

  const panelBaba = `
                        <ul>
							<p><b>Babá:</b></p>
							<li>Recibo mensal de pagamento, contendo o nome e CPF da babá, nome do colaborador, valor e
								mês de referência.</li>
							<li>Guia de recolhimento do E-social.</li>
							<li>Comprovante de pagamento do Guia.</li>
						</ul>
    `;
  const panelCreche = `
                        <ul>
							<p><b>Auxílio creche:</b></p>
							<li>Anexo Nota fiscal eletrônica ou boleto.</li>
							<li>Anexo comprovante de pagamento.</li>
							<li>Caso o recibo esteja no nome do cônjuge, anexar carta de próprio punho explicando o motivo de 
                            estar no nome do cônjuge.</li>
						</ul>
    `;
  $(".panelCreche").hide();
  $(".panelBaba").hide();
  $(".panelDoc").hide();

  if (tipoReembolso == 1) {
    $(".panelCreche").show();
    $(".panelBaba").hide();
    $(".panelDoc").show();
    $(".panelText").html(panelCreche);
  }
  if (tipoReembolso == 2) {
    $(".panelCreche").hide();
    $(".panelBaba").show();
    $(".panelDoc").show();
    $(".panelText").html(panelBaba);
  }
}

var beforeSendValidate = function (numState, nextState) {
  var activity = $("#activity").val();
  var erro = 0;
  var msg =
    "Existem campos que estão preenchidos incorretamente e/ou não foram preenchidos. <br>";
  var ret = false;

  $(".alertaCampo").removeClass("has-error");

  if (activity == 0 || activity == 4 || activity == 10) {
    if ($("#tipoReembolso").val() == "") {
      $(".tipo_reembolso").addClass("has-error");
      erro++;
    }
    if ($("#idDependente").val() == "") {
      $(".nome_dependente").addClass("has-error");
      msg+= 'Não foi possível localizar o ID RM do dependente.<br>';
      erro++;
    }
    if ($("#nomeDependente").val() == "") {
      $(".nome_dependente").addClass("has-error");
      erro++;
    }
    if ($("#tipoReembolso").val() == 2) {
      if ($("#cpfBaba").val() == "") {
        $(".cpf_baba").addClass("has-error");
        erro++;
      }
      if ($("#nomeBaba").val() == "") {
        $(".nome_baba").addClass("has-error");
        erro++;
      }
      if ($("#tipoPagamentoBaba").val() == "") {
        $(".tipo_pagamentoBaba").addClass("has-error");
        erro++;
      }
      if ($("#dataPagamentoBaba").val() == "") {
        $(".data_pagamentoBaba").addClass("has-error");
        erro++;
      }
      if ($("#valorPagamentoBaba").val() == "") {
        $(".valor_pagamentoBaba").addClass("has-error");
        erro++;
      }
    }
    if ($("#tipoReembolso").val() == 1) {
      if ($("#cnpjAuxilio").val() == "") {
        $(".cnpj_auxilio").addClass("has-error");
        erro++;
      }
      if ($("#nomeAuxilio").val() == "") {
        $(".nome_auxilio").addClass("has-error");
        erro++;
      }

      let campos = $("#tableBodyRow tr").find(
        "input[name^='dataPagamentoAuxilio___']"
      );
      if (campos.length == 0) {
        erro++;
      }
      for (let i = 0; i < campos.length; i++) {
        let index = campos[i].id.split("___")[1];
        if ($(`#tipoPagamentoAuxilio___${index}`).val() == "") {
          setErrorTable("tipoPagamentoAuxilio", index);
          erro++;
        }
        if ($(`#dataPagamentoAuxilio___${index}`).val() == "") {
          setErrorTable("dataPagamentoAuxilio", index);
          erro++;
        }
        if ($(`#valorPagamentoAuxilio___${index}`).val() == "") {
          setErrorTable("valorPagamentoAuxilio", index);
          erro++;
        }
      }
    }
    if (!$("#checkDocumentos").is(":checked")) {
      msg += "Confirme a entrega dos documentos.<br>";
      erro++;
    }
  }

  if (activity == 5) {
    if ($("input[name='aprovacao']:checked").val() == undefined) {
      $(".div_aprovacao").addClass("has-error");
      erro++;
    }
    if (
      $("input[name='aprovacao']:checked").val() == "reprovar" ||
      $("input[name='aprovacao']:checked").val() == "ajustar"
    ) {
      if ($("#obs").val() == "") {
        $(".obs").addClass("has-error");
        erro++;
      }
    }
  }

  if (!erro) {
    ret = true;
  } else {
    msgModal(msg);
  }
  return ret;
};

function setErrorTable(field, index) {
  $(`#${field}___${index}`).parent().addClass("has-error");
}

function msgModal(msg) {
  FLUIGC.modal(
    {
      title: "Atenção",
      content: msg,
      id: "fluig-modal",
      size: "medium",
      actions: [
        {
          label: "Ok, entendi",
          bind: "data-fechar",
          autoClose: true,
        },
      ],
    },
    function (err, data) {}
  );
}

function setSelectedZoomItem(item) {
  // no momento que o usuario seleciona o dependente no zoom, ja checa se a idade esta de acordo com o pré cadastro

  var genero = $("#generoColaborador").val();
  var dataNascimento = item["DTNASCIMENTO"];
  var idadeMax = genero == "M" ? $("#idadePAi").val() : $("#idadeMae").val();
  var permitido = calcularIdade(dataNascimento, idadeMax);

  if (permitido) {
    $("#idDependente").val(item["NRODEPEND"]);
    $("#grauParentesco").val(item["GRAUPARENTESCO"]);
    $("#dataNascimento").val(moment(dataNascimento).format("DD/MM/YYYY"));
    checkDependentes(item["NRODEPEND"]);
  } else {
    $("#idDependente").val("");
    $("#grauParentesco").val("");
    $("#dataNascimento").val("");
    $("#qtdMatricula").val("");
    $("#qtdMensalidade").val("");
    window["nomeDependente"].clear();

    var texto = genero == "M" ? "Pais" : "Mães";

    FLUIGC.toast({
      title: "",
      message: `Idade maxima do dependente para solicitação feita por ${texto} é de ${idadeMax} ano(s).`,
      type: "warning",
    });
  }
}

function removedZoomItem(removedItem) {
  $("#idDependente").val("");
  $("#grauParentesco").val("");
  $("#dataNascimento").val("");
  $("#qtdMatricula").val("");
  $("#qtdMensalidade").val("");
  $("#tabela_auxilio_creche tbody tr").not(":first").remove();
  hasLine() ? "" : addLinha();
}

function checkDependentes(NRODEPEND) {
  var idExterno = $("#idExterno").val();
  var ANOCOMP = $("#dtSolicitacao").val().substr(6);
  var constraitsDependente = [];
  constraitsDependente.push(
    DatasetFactory.createConstraint(
      "idExterno",
      idExterno,
      idExterno,
      ConstraintType.MUST
    )
  );
  constraitsDependente.push(
    DatasetFactory.createConstraint(
      "codConsulta",
      "FLUIG_INTGR03",
      "FLUIG_INTGR03",
      ConstraintType.MUST
    )
  );
  constraitsDependente.push(
    DatasetFactory.createConstraint(
      "ANOCOMP",
      ANOCOMP,
      ANOCOMP,
      ConstraintType.MUST
    )
  );
  constraitsDependente.push(
    DatasetFactory.createConstraint(
      "NRODEPEND",
      NRODEPEND,
      NRODEPEND,
      ConstraintType.MUST
    )
  );
  var dependente = DatasetFactory.getDataset(
    "ds_consulta_dependentes_rm",
    null,
    constraitsDependente,
    null
  );
  var qtdMatriculaBaba = 0;
  var qtdMensalidadeBaba = 0;
  var qtdMatriculaCreche = 0;
  var qtdMensalidadeCreche = 0;

  for (let i = 0; i < dependente.values.length; i++) {
    if (dependente.values[i].TIPOREEMBOLSO == "1") {
      dependente.values[i].TIPOPAGAMENTO == "1"
        ? qtdMatriculaCreche++
        : qtdMensalidadeCreche++;
    } else {
      dependente.values[i].TIPOPAGAMENTO == "1"
        ? qtdMatriculaBaba++
        : qtdMensalidadeBaba++;
    }
  }

  $("#qtdMatriculaBaba").val(qtdMatriculaBaba);
  $("#qtdMensalidadeBaba").val(qtdMensalidadeBaba);
  $("#qtdMatriculaCreche").val(qtdMatriculaCreche);
  $("#qtdMensalidadeCreche").val(qtdMensalidadeCreche);
}

// função para não deixar colocar 2 matriculas e mais de 12 mensalidades na tabela
function checkMatricula(field) {
  var matriculaEncontrada = false;
  var maximoMensalidades = false;
  var qtd;

  if (field.value === "1") {
    qtd =
      field.id == "tipoPagamentoBaba"
        ? parseInt($("#qtdMatriculaBaba").val())
        : parseInt($("#qtdMatriculaCreche").val());

    qtd > 0 ? (matriculaEncontrada = true) : (matriculaEncontrada = false);

    if (!matriculaEncontrada && field.id != "tipoPagamentoBaba") {
      matriculaEncontrada = $("#tableBodyRow tr")
        .find("[name^='tipoPagamentoAuxilio___']")
        .toArray()
        .some((input) => {
          return input.id !== field.id && $(input).val() === "1";
        });
    }

    if (matriculaEncontrada) {
      FLUIGC.toast({
        title: "",
        message: `Este dependente ja possui cadastro de matrícula, só é permitido o cadastro de 1 matrícula por ano para cada dependente.`,
        type: "warning",
      });
      field.value = "";
    }
  }
  if (field.value === "2") {
    var count;

    count =
      field.id == "tipoPagamentoBaba"
        ? parseInt($("#qtdMensalidadeBaba").val())
        : parseInt($("#qtdMensalidadeCreche").val());

    if (field.id != "tipoPagamentoBaba") {
      $("#tableBodyRow tr")
        .find("[name^='tipoPagamentoAuxilio___']")
        .each((index, element) => {
          element.value == 2 && element.id != field.id ? count++ : "";
        });
    }

    if (count >= 12) {
      maximoMensalidades = true
    }
    if (maximoMensalidades) {
      FLUIGC.toast({
        title: "",
        message: `Esse dependente ja atingiu o limite de mensalidades, só é permitido o cadastro de 12 mensalidades por ano para cada dependente.`,
        type: "warning",
      });
      field.value = "";
    }
  }
}

// verifica se a idade do dependente esta de acordo com o pré-cadastro
function calcularIdade(dataNascimento, idadeMax) {
  var hoje = new Date();
  var dataNascimento = new Date(dataNascimento);
  var idade = hoje.getFullYear() - dataNascimento.getFullYear();
  var mes = hoje.getMonth() - dataNascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
    idade--;
  }

  console.log(idade);
  console.log(idadeMax);

  if (idade > idadeMax) {
    return false;
  } else {
    return true;
  }
}

$(document).ready(function () {
  const diaCorte = buscaDiaCorte();

  const idExterno = $("#idExterno").val();
  if (idExterno == "Erro ao buscar idExterno") {
    return FLUIGC.message.error(
      {
        title: "Erro!",
        message: "Usuário FLUIG não possui ID Externo",
        details:
          "Certifique-se de que o usuário logado tenha um ID EXTERNO que mapeie com o RM",
      },
      function (el, ev) {
        if (ev.type == "click") location.reload();
      }
    );
  }
  var activity = $("#activity").val();

  if ($("#formMode").val() == "VIEW") {
    showAndBlock([".aprovacao"]);
    typeReembolso();
    $(".button").attr("disabled", true);
  } else {
    var dataAtual = new Date();
    var minDate = new Date(
      dataAtual.getFullYear(),
      dataAtual.getMonth() - 2,
      1
    );
    FLUIGC.calendar("#dataPagamentoBaba", {
      type: "month", // Define o tipo de visualização como mês
      minViewMode: "months", // Define o modo mínimo de visualização como mês
      format: "MM/yyyy", // Formato de exibição do mês e ano
      minDate: minDate,
      maxDate: dataAtual,
    });
    $("#dataPagamentoBaba").keydown(function (event) {
      event.preventDefault();
    });

    if (activity == 0 || activity == 4) {
      hasLine() ? "" : addLinha();
      $(".hiddenButton").show();
      var filtro = "idExterno," + $("#idExterno").val();
      reloadZoomFilterValues("nomeDependente", filtro);

      if ($("#diaCorte").val() < dataAtual.getDate()) {
        FLUIGC.toast({
          title: "",
          message: `Solicitações realizadas após o dia ${diaCorte}, terão o reembolso na folha de pagamento do mês seguinte`,
          type: "warning",
          timeout: 15000,
        });
      }
    }

    if (activity == 5) { //Etapa Analisar Documentação
      showAndBlock([".inicio"]);
      typeReembolso();
      $(".aprovacao").show();
      $(".button").attr("disabled", true);
    }
    if (activity == 10) {// Etapa Ajustar
      showAndBlock([".aprovacao"]);
      typeReembolso();
      $(".hiddenButton").show();
    }
    if (activity == 21) { //Etapa tratativa TI
      typeReembolso();
      $(".aprovacao").show();
      $(".hiddenButton").show();
    }
  }

  $("input[type='text']").on("input", function () {
    let value = $(this).val() || "";
  
    // Normalize and remove diacritics
    value = value
      .normalize("NFD") // Decompose combined letters into base + diacritics
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
      .replace(/[^a-zA-Z0-9.,-\s]/g, ""); // Remove special characters
  
    // Convert to uppercase
    value = value.toUpperCase();
  
    $(this).val(value);
});
});

function buscaDiaCorte() {
    var campos = ["diaCorte"]
    var c1 = [DatasetFactory.createConstraint('userSecurityId', 'gabriela.vieira', 'gabriela.vieira', ConstraintType.MUST)];
    var parametros = DatasetFactory.getDataset("ds_parametros_beneficios", campos, c1, null);
    if (!parametros?.values[0]?.diaCorte) {
        return FLUIGC.toast({
            title: "",
            message: `Erro ao buscar dia de corte`,
            type: "warning",
            timeout: 15000,
        });
    }
    return parametros.values[0].diaCorte;
}
