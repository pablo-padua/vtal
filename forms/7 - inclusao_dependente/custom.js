function showAndBlock(activity) {
	for (var i = 0, l = activity.length; i < l; i++) {

		$(activity[i]).show();

		$(activity[i] + " select").each(function () {
			$(this).css('pointer-events', 'none');
		})

		//use an each to block everything inside the class activity-X
		$(activity[i] + " :input").each(function () {
			$(this).attr("readonly", "readonly");
			$(this).css("background-color", "#eee").children("option:not(:selected)").prop("disabled", true);
			$(this).on('mousedown', function (e) {
				this.blur();
				window.focus();
			});
			if ($(this).is(':checkbox')) {
				$(this).on('click keydown', function (e) {
					// Intercepta o evento de clique e teclas de espaço
					if (e.type === 'click' || (e.type === 'keydown' && e.keyCode === 32)) {
						e.preventDefault(); // Impede a alteração do checkbox
						return false; // Sai da função
					}
				});
			} else if ($(this).is(':radio')) {
				$(this).on("click", function () {
					return false;
				});
			}
		});
	}
}

function unblock(activity) {
	for (var i = 0, l = activity.length; i < l; i++) {
		// Remove as propriedades adicionadas pela função showAndBlock
		$(activity[i] + " :input").each(function () {
			$(this).removeAttr("readonly");
			$(this).css("background-color", "").children("option").prop("disabled", false);
			$(this).off('mousedown');
			if ($(this).is(':checkbox')) {
				$(this).removeAttr('disabled');
			} else if ($(this).is(':radio')) {
				$(this).off("click");
			}
		});
		// Limpa o ponteiro do mouse para elementos select
		$(activity[i] + " select").each(function () {
			$(this).css('pointer-events', '');
		});
	}
}

function typePanel(data) {

	window["nomeDependente"].clear();
	removedZoomItem("nomeDependente");
	$('#dependentePCD').prop('checked', false);
	$("#divColaboradorDependente").hide();

	if (data.value == "incluir") {
		$(".panelDadosDependente").show();
		$(".panelBeneficios").show();
		$(".panelDoc").show();
		$(".panelDependentes").hide();
		unblock([".panelDadosDependente", ".panelBeneficios"]);

	}
	if (data.value == "alterar") {
		$(".panelDependentes").show();
		$(".panelDadosDependente").show();
		$(".panelBeneficios").show();
		$(".panelDoc").show();

		unblock([".panelDadosDependente", ".panelBeneficios"]);
	}

}
function mostraAlteraBfcPcd() {	
	const pcd = $("#dependentePCD").is(':checked')
	if (pcd) {
		$("#alteraBnfPcd").show()
	} else {
		$("#alteraBnfPcd").hide()
	}
}

function validarData(data, permiteFuturo, permitePassado) {
	if (data != "") {
		permiteFuturo = (permiteFuturo == null) ? true : permiteFuturo;
		permitePassado = (permitePassado == null) ? true : permitePassado;

		var dataValida = true;
		var dia = parseInt(data.split("/")[0]);
		var mes = parseInt(data.split("/")[1]);
		var ano = parseInt(data.split("/")[2]);

		if (dia > 31 || dia < 1 || mes > 12 || mes < 1) {
			dataValida = false;
		} else if (mes == 2 && (ano % 4) > 0 && dia > 28) {
			dataValida = false;
		} else if (mes == 2 && (ano % 4) == 0 && dia > 29) {
			dataValida = false;
		} else {
			var dataInserida = new Date(ano, (mes - 1), dia);
			var dataAtual = new Date();
			dataAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate());
			console.log("Passado: " + (dataAtual > dataInserida));
			console.log("Futuro: " + (dataAtual < dataInserida));
			console.log(dataAtual + "__" + dataInserida)
			if (!permiteFuturo && dataInserida > dataAtual)
				dataValida = false;

			if (!permitePassado && dataInserida < dataAtual)
				dataValida = false;
		}

		if (!dataValida) {
			FLUIGC.toast({
				"message": "Data inválida",
				"type": "danger"
			});
		}
	}
}

var ultimaOpcaoGrauParentesco = "";
function setSelectedZoomItem(selectedItem) {
	var inputName = selectedItem.inputName;

	if (inputName == "nomeDependente") {
		var DTINCLUSAOASSMED = moment(selectedItem["DTINCLUSAOASSMED"]).format("DD/MM/YYYY");
		var DTEXCLUSAOASSMED = moment(selectedItem["DTEXCLUSAOASSMED"]).format("DD/MM/YYYY");
		var DTINCLUSAOASSODO = moment(selectedItem["DTINCLUSAOASSODO"]).format("DD/MM/YYYY");
		var DTEXCLUSAOASSODO = moment(selectedItem["DTEXCLUSAOASSODO"]).format("DD/MM/YYYY");
		var DTINCLUSAOAUXMED = moment(selectedItem["DTINCLUSAOAUXMED"]).format("DD/MM/YYYY");
		var DTEXCLUSAOAUXMED = moment(selectedItem["DTEXCLUSAOAUXMED"]).format("DD/MM/YYYY");

		var RECEBEAUXPCD = selectedItem["RECEBEAUXPCD"] == "T" ? true : false; 

		var cpf = selectedItem["CPF"].replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

		$("#idDependente").val(selectedItem["NRODEPEND"]);
		$("#dataNascimento").val(moment(selectedItem["DTNASCIMENTO"]).format("DD/MM/YYYY"));
		$("#dependenteNomeCompleto").val(selectedItem["NOME"]);
		$("#dependenteNomeMae").val();
		$("#dependenteDtNascimento").val(moment(selectedItem["DTNASCIMENTO"]).format("DD/MM/YYYY"));
		$("#cpfDependente").val(cpf);
		$("#dependenteSexo").val(selectedItem["SEXO"]);
		$("#dependenteGrauInstrucao").val(selectedItem["GRAUDEINSTRUCAO"]);
		$("#dependenteGrauParentesco").val(selectedItem["GRAUPARENTESCO"]);
		ultimaOpcaoGrauParentesco = selectedItem["GRAUPARENTESCO"];
		$("#grauParentesco").val($("#dependenteGrauParentesco option:selected").text());
		$("#dependenteMunicipioNascimento").val(selectedItem["LOCALNASCIMENTO"]);
		$("#dependenteEstadoCivil").val(selectedItem["ESTADOCIVIL"]);
		$("#dependenteUniversitario").val(selectedItem["UNIVERSITARIO"]);
		$("#numeroDeclaracao").val(selectedItem["NUMDECLARANASCVIVO"]);
		$("#dependenteNomeMae").val(selectedItem["NOMEMAE"]);
		$("#IsDependentePCD").val(RECEBEAUXPCD);
		$('#dependentePCD').prop('checked', RECEBEAUXPCD);
		mostraAlteraBfcPcd();

		mostraImpostoRenda();
		$("#temIR").val(selectedItem["INCIRRF"]);
		$("#DTINCLUSAOIR").val(moment(selectedItem["DTINCLUSAOIR"]).format("DD/MM/YYYY"));
		$("#DTEXCLUSAOIR").val(moment(selectedItem["DTEXCLUSAOIR"]).format("DD/MM/YYYY"));

		$("#temMedica").val(selectedItem["ASSMED"]);
		$("#DTINCLUSAOASSMED").val(DTINCLUSAOASSMED != "Data inválida" ? DTINCLUSAOASSMED : "");
		$("#DTEXCLUSAOASSMED").val(DTEXCLUSAOASSMED != "Data inválida" ? DTEXCLUSAOASSMED : "");
		$("#temOdonto").val(selectedItem["ASSODO"]);	
		$("#DTINCLUSAOASSODO").val(DTINCLUSAOASSODO != "Data inválida" ? DTINCLUSAOASSODO : "");
		$("#DTEXCLUSAOASSODO").val(DTEXCLUSAOASSODO != "Data inválida" ? DTEXCLUSAOASSODO : "");		
		$("#temMedicamento").val(selectedItem["AUXMEDICAMENTO"]);
		$("#DTINCLUSAOAUXMED").val(DTINCLUSAOAUXMED != "Data inválida" ? DTINCLUSAOAUXMED : "");
		$("#DTEXCLUSAOAUXMED").val(DTEXCLUSAOAUXMED != "Data inválida" ? DTEXCLUSAOAUXMED : "");
		const ultimoId = Number(selectedItem["ultimoID"]);
		if (isNaN(ultimoId)) {
			FLUIGC.toast({
				title: 'Erro',
				message: 'Erro ao buscar o último ID do dependente. Favor reportar esse erro e não seguir com a solicitação!',
				type: 'danger',
				timeout: 60000
			});
			throw new Error("Erro ao buscar o último ID do dependente");
		}
		$("#dependenteUltimoID").val(ultimoId + 1);
	}

	// if (!inputName.split("___")[1]) {
	// 	//TODO INSERIR TRATATIVAS PARA DEMAIS CAMPOS
	// 	return;
	// }

	// var paiFilho = inputName.split("___")[0];
	// switch (paiFilho) {
	// 	case "descricaoBeneficio":
	// 		var index = inputName.split("___")[1];
	// 		$("#codigoBeneficio___" + index).val(selectedItem.colleagueId);
	// }
}

function removedZoomItem(removedItem) {
	var inputName = removedItem.inputName == undefined ? removedItem : removedItem.inputName;


	if (inputName == "nomeDependente") {
		$("#idDependente").val("");
		$("#grauParentesco").val("");
		$("#dataNascimento").val("");
		$("#dependenteNomeCompleto").val("");
		$("#dependenteNomeMae").val("");
		$("#dependenteDtNascimento").val("");
		$("#cpfDependente").val("");
		$("#dependenteSexo").val("");
		$("#dependenteGrauInstrucao").val("");
		$("#dependenteGrauParentesco").val("");
		$("#dependenteMunicipioNascimento").val("");
		$("#dependenteEstadoCivil").val("");
		$("#dependenteUniversitario").val("");
		$("#numeroDeclaracao").val("");
		$('#dependentePCD').prop('checked', false);
		$("#IsDependentePCD").val("false");
		$("#dependenteNomeMae").val("");
		$("#temMedica").val("");
		$("#DTINCLUSAOASSMED").val("");
		$("#DTEXCLUSAOASSMED").val("");
		$("#temOdonto").val("");
		$("#temMedicamento").val("");
		$("#AUXMEDICAMENTO").val("");
		$("#DTINCLUSAOASSODO").val("");
		$("#DTEXCLUSAOASSODO").val("");
		$("#DTINCLUSAOAUXMED").val("");
		$("#DTEXCLUSAOAUXMED").val("");
	}

	// if (!inputName.split("___")[1]) {
	// 	//TODO INSERIR TRATATIVAS PARA DEMAIS CAMPOS
	// 	return;
	// }

	// var paiFilho = inputName.split("___")[0];
	// switch (paiFilho) {
	// 	case "descricaoBeneficio":
	// 		var index = inputName.split("___")[1];
	// 		$("#codigoBeneficio___" + index).val("");
	// }
}

function anexar() {
	parent.document.getElementById("ecm-navigation-inputFile-clone").click();
}

function getDependentes() {
	var idExterno = $("#idExterno").val();
	var filtro = 'processo,inclusaoDependente,idExterno,' + idExterno;
	reloadZoomFilterValues("nomeDependente", filtro);

	var constraitsDependente = []
	constraitsDependente.push(DatasetFactory.createConstraint("idExterno", idExterno, idExterno, ConstraintType.MUST));
	constraitsDependente.push(DatasetFactory.createConstraint("processo", "inclusaoDependente", "inclusaoDependente", ConstraintType.MUST));
	var dependente = DatasetFactory.getDataset("dependendes_reembolso", null, constraitsDependente, null);

	if (dependente?.values?.length > 0) {
		$("#dependenteUltimoID").val(Number(dependente.values[0].ultimoID) + 1);
	}


}

var beforeSendValidate = function (numState, nextState) {
	var activity = $("#activity").val();
	var erro = 0;
	var msg = "Existem campos que estão preenchidos incorretamente e/ou não foram preenchidos. <br>";
	var ret = false;

	$(".alertaCampo").removeClass("has-error");

	if (activity == 0 || activity == 3 || activity == 13) {


		if ($("input[name='tipoSolicitacao']:checked").val() == undefined) {
			msg = "Selecione o tipo de solciitação: inclusão ou alteração de dependente !"
			erro++
		} else {

			if ($("#dependenteNomeCompleto").val() == "") {
				$(".dependente_NomeCompleto").addClass("has-error");
				erro++
			}
			if ($("#dependenteNomeMae").val() == "") {
				$(".dependente_NomeMae").addClass("has-error");
				erro++
			}
			if ($("#dependenteDtNascimento").val() == "") {
				$(".dependente_DtNascimento").addClass("has-error");
				erro++
			}
			if ($("#cpfDependente").val() == "") {
				$(".cpf_Dependente").addClass("has-error");
				erro++
			}
			if ($("#dependenteSexo").val() == "") {
				$(".dependente_Sexo").addClass("has-error");
				erro++
			}
			if ($("#dependenteGrauInstrucao").val() == "") {
				$(".dependente_GrauInstrucao").addClass("has-error");
				erro++
			}
			if ($("#dependenteGrauParentesco").val() == "") {
				$(".dependente_GrauParentesco").addClass("has-error");
				erro++
			}
			if ($("#dependenteMunicipioNascimento").val() == "") {
				$(".dependente_MunicipioNascimento").addClass("has-error");
				erro++
			}
			if ($("#dependenteEstadoCivil").val() == "") {
				$(".dependente_EstadoCivil").addClass("has-error");
				erro++
			}
			if ($("#dependenteUniversitario").val() == "") {
				$(".dependente_universitario").addClass("has-error");
				erro++
			}
			if ($("#temMedica").val() == "") {
				$(".tem_Medica").addClass("has-error");
				erro++
			}
			if ($("#temOdonto").val() == "") {
				$(".tem_Odonto").addClass("has-error");
				erro++
			}
			if ($("#temMedicamento").val() == "") {
				$(".tem_Medicamento").addClass("has-error");
				erro++
			}

			if (!$("#checkBeneficios").is(":checked")) {
				msg += "Confirme a declaração dos benefícios.<br>"
				erro++
			}
			if (!$("#checkDocumentos").is(":checked")) {
				msg += "Confirme a entrega dos documentos.<br>"
				erro++
			}
			if (!$("#checkVeracidade").is(":checked")) {
				msg += "Confirme a veracidade das informações.<br>"
				erro++
			}
			if ($("#localVeracidade").val() == "") {
				$(".local_Veracidade").addClass("has-error");
				erro++
			}

			if (!checkIdade()) {
				msg = "Idade máxima para incluir filhos e enteados nos beneficios é de 21 anos ou 24 anos se o dependente for universitário !"
				erro++
			}
		}
	}

	if (activity == 27) {
		if ($("input[name='aprovacaoSaude']:checked").val() == undefined) {
			$(".div_aprovacaoSaude").addClass("has-error");
			erro++
		}
		if ($("input[name='aprovacaoSaude']:checked").val() == "reprovar" || $("input[name='aprovacaoSaude']:checked").val() == "ajustar") {
			if ($("#obsSaude").val() == "") {
				$(".obs_Saude").addClass("has-error");
				erro++
			}
		}
	}
	if (activity == 6) {
		if ($("input[name='aprovacaoRH']:checked").val() == undefined) {
			$(".div_aprovacaoSaude").addClass("has-error");
			erro++
		}
		if ($("input[name='aprovacaoRH']:checked").val() == "reprovar" || $("input[name='aprovacaoRH']:checked").val() == "ajustar") {
			if ($("#obsRH").val() == "") {
				$(".obs_RH").addClass("has-error");
				erro++
			}
		}
	}



	if (!erro) {
		ret = true
	} else {
		msgModal(msg);
	}
	return ret;
}

function msgModal(msg) {
	FLUIGC.modal({
		title: "Atenção",
		content: msg,
		id: 'fluig-modal',
		size: "medium",
		actions: [{
			'label': 'Ok, entendi',
			'bind': 'data-fechar',
			'autoClose': true
		}]
	}, function (err, data) { });
}

function checkIdade() {
	var parentesco = $("#dependenteGrauParentesco").val();

	if (parentesco == "1" || parentesco == "D") {
		var dataNascimento = $("#dependenteDtNascimento").val();
		var idadeMax = $("#dependenteUniversitario").val() != "1" ? 21 : 24;
		var [dia, mes, ano] = dataNascimento.split('/');
		var idade = new Date().getFullYear() - ano;
		if (new Date().getMonth() < mes - 1 || (new Date().getMonth() == mes - 1 && new Date().getDate() < dia)) {
			idade--;
		}

		var temAssistencia = $("#temMedica").val() == "T" || $("#temOdonto").val() == "T" || $("#temMedicamento").val() == "T" ? true : false;

		if (idade >= idadeMax && temAssistencia) {

			return false;
		}
	}
	return true;
}

$(document).ready(function () {
	const idExterno = $("#idExterno").val();
	if (idExterno == "Erro ao buscar idExterno") {
		return FLUIGC.message.error({
			title: 'Erro!',
			message: 'Usuário FLUIG não possui ID Externo',
			details: 'Certifique-se de que o usuário logado tenha um ID EXTERNO que mapeie com o RM',
		}, function(el, ev) {
			if (ev.type == "click")
				location.reload()
		});
	}
	var activity = $("#activity").val();



	if ($("#formMode").val() == "VIEW") {

		showAndBlock([".activity0", ".panelDependentes", ".panelDadosDependente", ".panelBeneficios", ".panelDoc"]);
		if ($("input[name='aprovacaoSaude']:checked").val() != undefined) {
			showAndBlock([".panelAprovacaoSaude"]);
		}
		if ($("input[name='aprovacaoRH']:checked").val() != undefined) {
			showAndBlock([".panelAprovacaoRH"]);
		}

	} else {

		var dataAtual = new Date();

		if (activity == 0 || activity == 3 || activity == 13) {

			if (activity != 0) {
				$(".activity0, .panelDependentes, .panelDadosDependente, .panelBeneficios, .panelDoc").show();
				if ($("input[name='aprovacaoSaude']:checked").val() != undefined) {
					showAndBlock([".panelAprovacaoSaude"]);
				}
				if ($("input[name='aprovacaoRH']:checked").val() != undefined) {
					showAndBlock([".panelAprovacaoRH"]);
				}
			} else {
				getDependentes();
			}
			$("#dependentePCD").change(function () {
				if ($(this).is(":checked")) {
					$("#IsDependentePCD").val("true")
					if (ultimaOpcaoGrauParentesco == '1')
						$("#dependenteGrauParentesco").val("3");
				} else {
					$("#IsDependentePCD").val("false");
					$("#dependenteGrauParentesco").val(ultimaOpcaoGrauParentesco);
					$("#alterarBnfPcd").prop("checked", false);
					$("#isAlterarBnfPcd").val("false");
				}
				mostraAlteraBfcPcd();
			});
			$("#alterarBnfPcd").change(function () {
				if ($(this).is(":checked")) {
					$("#isAlterarBnfPcd").val("true");
				} else {
					$("#isAlterarBnfPcd").val("false");
				}
			});
			$("#dependenteGrauParentesco").change(function () {
				ultimaOpcaoGrauParentesco = $(this).val();
			});

			$("#dependenteDtNascimento").change(function () {
				validarData($(this).val(), false, true);
			});

			var birthday = FLUIGC.calendar('#dependenteDtNascimento');

			$("input[name^='tipoSolicitacao']").change(function () {
				typePanel(this);
			});
		}

		if (activity == 27) {
			showAndBlock([".activity0", ".panelDependentes", ".panelDadosDependente", ".panelBeneficios", ".panelDoc"]);
			$("#btnAnexos").hide();
			$(".panelAprovacaoSaude").show();
		}
		if (activity == 6) {
			showAndBlock([".activity0", ".panelDependentes", ".panelDadosDependente", ".panelBeneficios", ".panelDoc"]);
			$("#btnAnexos").hide();
			if ($("input[name='aprovacaoSaude']:checked").val() != undefined) {
				showAndBlock([".panelAprovacaoSaude"]);
			}
			$(".panelAprovacaoRH").show();
		}

		if (activity == 20) {
			$(".panel").show();
		}
	}

	$('input[name="tipoSolicitacao"]').change(function() {
        tipoSolicitacaoIncluirAlterar = $(this).val();
        $("#tipoSolicitacaoIncluirAlterar").val(tipoSolicitacaoIncluirAlterar)
    });
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
	mostraAlteraBfcPcd();
	mostraImpostoRenda();
});

function mostraImpostoRenda() {
	const opcoes = [
		"1", // Filho(a) sem deficiência
		"3", // Filho(a) com deficiência
		"5", // Cônjuge
		"6", // Pai
		"7", // Mãe
		"C", // Companheiro(a)
		"D", // Enteado(a)
		"I", // Irmã(o) Válido
		"N", // Irmã(o) Inválido
		"T", // Neto(a)
		"M", // Menor pobre
		"B"  // Incapaz
	];
	const grauParentesco = $("#dependenteGrauParentesco").val() ?? '';
	if (opcoes.includes(grauParentesco)) $("#mostraIR").show();
	else $("#mostraIR").hide();
	const atividade = Number($("#activity").val());
	if (atividade == 0 || atividade == 4) {
		$("#temIR").val("");
		$("#DTINCLUSAOIR").val("");
		$("#DTEXCLUSAOIR").val("");
	}
}