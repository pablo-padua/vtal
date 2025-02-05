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

function verificarBeneficios() {

	var valeTransporteAtual = $("#dtInicio___1").val() ? true : false;
	var valeRefeicaoAtual = $("#valeRefeicaoAtual").val() != "" ? true : false;
	var planoOdontologicoAtual = $("#planoOdontologicoAtual").val() != "" ? true : false;
	var previdenciaPrivadaAtual = $("#previdenciaPrivadaAtual").val() != "" ? true : false;
	var seguroVidaAtual = $("#seguroVidaAtual").val() != "" ? true : false;

	if (document.getElementById("valeTransporte").checked) {
		$("#painelValeTransporte").show();
		valeTransporteAtual ? (showAndBlock([".valeTransporte"]), $(".VTnovo").hide(), $(".VTatual").show()) : "";
		// hasLine() ? "" : addLinha();
	} else {
		$("#painelValeTransporte").hide();
		limpaLinhasNovas();
	}

	if (document.getElementById("valeRefeicaoAlimentacao").checked) {
		$("#painelValeRefeicaoAlimentacao").show();
		valeRefeicaoAtual ? ($(".valeRefeicaoAtual").show(), showAndBlock([".valeRefeicaoAlimentacao"])) : $(".valeRefeicaoAtual").hide();
		valeRefeicaoAtual && !$("#alteraValeRefeicaoAtual").is(":checked") ? $(".valeRefeicaoNovo").hide() : $(".valeRefeicaoNovo").show();
	} else {
		$("#painelValeRefeicaoAlimentacao").hide();
	}

	$("#permiteOdonto").val() == "false" ? (showAndBlock([".valeRefeicaoAlimentacao"]), $(".alteraPlanoOdontologicoAtual").hide()) : "";

	if (document.getElementById("planoOdontologico").checked) {
		$("#painelPlanoOdontologico").show();
		planoOdontologicoAtual ? ($(".planoOdontologicoAtual").show(), showAndBlock([".planoOdontologico"])) : $(".planoOdontologicoAtual").hide();
		planoOdontologicoAtual && !$("#alteraPlanoOdontologicoAtual").is(":checked") ? $(".planoOdontologicoNovo").hide() : $(".planoOdontologicoNovo").show();
	} else {
		$("#painelPlanoOdontologico").hide();
	}

	if (document.getElementById("previdenciaPrivada").checked) {
		$("#painelPrevidenciaPrivada").show();
		previdenciaPrivadaAtual ? ($(".previdenciaPrivadaAtual").show(), showAndBlock([".previdenciaPrivada"])) : ($(".previdenciaPrivadaAtual").hide(), $(".avisoPrevidenciaPrivada").show(), $(".previdenciaPrivadaNovo").hide());
		planoOdontologicoAtual && !$("#alteraPrevidenciaPrivadaAtual").is(":checked") ? $(".previdenciaPrivadaNovo").hide() : $(".previdenciaPrivadaNovo").show();
	} else {
		$("#painelPrevidenciaPrivada").hide();
	}

	if (document.getElementById("seguroVida").checked) {
		$("#painelSeguroVida").show();
		seguroVidaAtual ? ($(".seguroVidaAtual").show(), showAndBlock([".seguroVida"])) : $(".seguroVidaAtual").hide();
		seguroVidaAtual && !$("#alteraSeguroVidaAtual").is(":checked") ? $(".seguroVidaNovo").hide() : $(".seguroVidaNovo").show();
	} else {
		$("#painelSeguroVida").hide();
	}
}

function alteraBeneficios(field) {
	if (field.id == "alteraVTAtual") {
		$(field).is(":checked") ? ($(".VTnovo").show(), $("#excluiVT").val("false"), $("#excluiVTatual").prop('checked', false), $("#alteraVT").val("true"), bloqueiaLinhaAtual(false)) : ($(".VTnovo").hide(), limpaLinhasNovas(), bloqueiaLinhaAtual(true));
	}
	if (field.id == "excluiVTatual") {
		$(field).is(":checked") ? ($(".VTnovo").hide(), $("#excluiVT").val("true"), $("#alteraVTAtual").prop('checked', false), $("#alteraVT").val("false"), limpaLinhasNovas(), bloqueiaLinhaAtual(true)) : $("#excluiVT").val("false");
	}
	if (field.id == "alteraValeRefeicaoAtual") {
		$(field).is(":checked") ? $(".valeRefeicaoNovo").show() : ($(".valeRefeicaoNovo").hide(), window["valeRefeicaoNovo"].clear(), $("#codValeRefeicaoNovo, #nomeValeRefeicaoNovo").val(""))
	}
	if (field.id == "alteraPlanoOdontologicoAtual") {
		$(field).is(":checked") ? $(".planoOdontologicoNovo").show() : ($(".planoOdontologicoNovo").hide(), window["planoOdontologicoNovo"].clear(), $("#codPlanoOdontologicoNovo, #nomePlanoOdontologicoNovo").val(""))
	}
	if (field.id == "alteraPrevidenciaPrivadaAtual") {
		$(field).is(":checked") ? ($(".previdenciaPrivadaNovo").show(), $("#excluiPrevidenciaPrivadaAtual").prop('checked', false), $("#excluiPrevidencia").val("false")) : ($(".previdenciaPrivadaNovo").hide(), window["previdenciaPrivadaNovo"].clear(), $("#codPrevidenciaPrivadaNovo, #nomePrevidenciaPrivadaNovo").val(""))
	}
	if (field.id == "excluiPrevidenciaPrivadaAtual") {
		$(field).is(":checked") ? ($(".previdenciaPrivadaNovo").hide(), $("#alteraPrevidenciaPrivadaAtual").prop('checked', false), window["previdenciaPrivadaNovo"].clear(), $("#codPrevidenciaPrivadaNovo, #nomePrevidenciaPrivadaNovo").val(""), $("#excluiPrevidencia").val("true")) : $("#excluiPrevidencia").val("false");
	}
	if (field.id == "alteraSeguroVidaAtual") {
		$(field).is(":checked") ? ($(".seguroVidaNovo").show(), $("#excluiSeguroVidaAtual").prop('checked', false), $("#excluiSeguroVida").val("false")) : ($(".seguroVidaNovo").hide(), window["seguroVidaNovo"].clear(), $("#codSeguroVidaNovo, #nomeSeguroVidaNovo").val(""))
	}
	if (field.id == "excluiSeguroVidaAtual") {
		$(field).is(":checked") ? ($(".seguroVidaNovo").hide(), $("#alteraSeguroVidaAtual").prop('checked', false), window["seguroVidaNovo"].clear(), $("#codSeguroVidaNovo, #nomeSeguroVidaNovo").val(""), $("#excluiSeguroVida").val("true")) : $("#excluiSeguroVida").val("false");
	}

	if (field.id == "alterarEndereco") {
		$(field).is(":checked") ? ($("#enderecoCep ,#enderecoLogradouro, #enderecoNumero,#enderecoComplemento,#enderecoEstado,#enderecoCidade,#enderecoBairro").prop('readonly', false), $("#alteraEndereco").val("true")) : ($("#enderecoCep ,#enderecoLogradouro, #enderecoNumero,#enderecoComplemento,#enderecoEstado,#enderecoCidade,#enderecoBairro").prop('readonly', true), $("#alteraEndereco").val("false"));
	}
	if (field.id == "alterarFormMetLife") {
		const alterarFormMetLife = $("#alterarFormMetLife").is(':checked')
		if (alterarFormMetLife) {
			$("#apenasAtualizarFormMetLife").hide();
			$(".seguroVidaNovo").show();
			$("#btnSimulaCusto").hide();
		} else {
			$("#apenasAtualizarFormMetLife").show();
			$(".seguroVidaNovo").hide();
			$("#btnSimulaCusto").show();
		}
	}
}


async function GetCEP(param) {

	if (param.length != 9) {
		FLUIGC.toast({
			title: 'CEP: ',
			message: 'Por favor digite um CEP válido.',
			type: 'warning'
		});
	} else {
		await fetch(`https://viacep.com.br/ws/${param}/json/`).then(res => res.json()).then(async data => {
			console.log(data);
			if (data.logradouro == undefined) {
				FLUIGC.toast({
					title: 'CEP: ',
					message: 'Por favor digite um CEP válido.',
					type: 'warning'
				});

			} else {
				$("#enderecoLogradouro").val(data.logradouro)
				$("#enderecoBairro").val(data.bairro)
				$("#enderecoCidade").val(data.localidade)
				$("#enderecoEstado").val(data.uf)
			};
		});
	}
};

function addLinha() {
	var row = wdkAddChild("tblLinhasValeTransporte");

}
function removeLinha(element) {
	fnWdkRemoveChild(element);
}

function hasLine() {
	return $("#tableBodyRow tr").length > 1;
}

function setSelectedZoomItem(item) {

	if (item.inputId == "valeRefeicaoNovo") {
		if (item.CODBENEFICIO == $("#codValeRefeicaoAtual").val()) {
			FLUIGC.toast({
				title: '',
				message: `Para alteração é necessário selecionar um benefício diferente do atual !`,
				type: 'warning'
			});
			window["valeRefeicaoNovo"].clear();
			$("#codValeRefeicaoNovo, #nomeValeRefeicaoNovo").val("");
		} else {
			$("#codValeRefeicaoNovo").val(item.CODBENEFICIO);
			$("#nomeValeRefeicaoNovo").val(item.NOME);
		}
	}
	if (item.inputId == "planoOdontologicoNovo") {
		if (item.CODBENEFICIO == "0502") {
			FLUIGC.toast({
				title: '',
				message: `Este plano não esta dispinível !`,
				type: 'warning'
			});
			window["planoOdontologicoNovo"].clear();
			$("#codPlanoOdontologicoNovo , #nomePlanoOdontologicoNovo").val("");
		} else if (item.CODBENEFICIO == $("#codPlanoOdontologicoAtual").val()) {
			FLUIGC.toast({
				title: '',
				message: `Para alteração é necessário selecionar um benefício diferente do atual !`,
				type: 'warning'
			});
			window["planoOdontologicoNovo"].clear();
			$("#codPlanoOdontologicoNovo , #nomePlanoOdontologicoNovo").val("");
		} else {
			$("#codPlanoOdontologicoNovo").val(item.CODBENEFICIO);
			$("#nomePlanoOdontologicoNovo").val(item.NOME);
		}
	}
	if (item.inputId == "previdenciaPrivadaNovo") {
		if (item.CODBENEFICIO == $("#codPrevidenciaPrivadaAtual").val()) {
			FLUIGC.toast({
				title: '',
				message: `Para alteração é necessário selecionar um benefício diferente do atual !`,
				type: 'warning'
			});
			window["previdenciaPrivadaNovo"].clear();
			$("#codPrevidenciaPrivadaNovo, #nomePrevidenciaPrivadaNovo").val("");
		} else {
			$("#codPrevidenciaPrivadaNovo").val(item.CODBENEFICIO);
			$("#nomePrevidenciaPrivadaNovo").val(item.NOME);
		}

	}
	if (item.inputId == "seguroVidaNovo") {

		if (item.CODBENEFICIO == $("#codSeguroVidaAtual").val()) {
			FLUIGC.toast({
				title: '',
				message: `Para alteração é necessário selecionar um benefício diferente do atual !`,
				type: 'warning'
			});
			window["seguroVidaNovo"].clear();
			$("#codSeguroVidaNovo, #nomeSeguroVidaNovo").val("");
		} else {
			$("#codSeguroVidaNovo").val(item.CODBENEFICIO);
			$("#nomeSeguroVidaNovo").val(item.NOME);

			// $("#taxaSeguroVidaNovo").val(item.VALOR);

			switch (item.CODBENEFICIO) {
				case "3001":
					$("#taxaSeguroVidaNovo").val("0.1303");
					break;
				case "3002":
					$("#taxaSeguroVidaNovo").val("1.1053");
					break;
				case "3003":
					$("#taxaSeguroVidaNovo").val("1.1053");
					break;

				default:
					break;
			}
		}
	}

	if (item.inputId.split('___')[0] == "descricaoLinhaTransporte") {
		let index = item.inputId.split('___')[1];

		if (checkLinhas(item.PVALETR_CODIGO)) {
			$("#precoUnitarioTransporte___" + index).val(item.PTARIFA_VALOR);
			$("#codLinha___" + index).val(item.PVALETR_CODIGO);
			$("#nomeLinha___" + index).val(item.PVALETR_NOMELINHA);
		} else {
			window["descricaoLinhaTransporte___" + index].clear();
			FLUIGC.toast({
				title: '',
				message: "Ja existe esta linha com esta tarifa!",
				type: 'warning'
			});
		}
	}
}

function removedZoomItem(removedItem) {
	if (removedItem.inputId == "valeRefeicaoNovo") {
		$("#codValeRefeicaoNovo, #nomeValeRefeicaoNovo").val("");
	}
	if (removedItem.inputId == "planoOdontologicoNovo") {
		$("#codPlanoOdontologicoNovo , #nomePlanoOdontologicoNovo").val("");
	}
	if (removedItem.inputId == "previdenciaPrivadaNovo") {
		$("#codPrevidenciaPrivadaNovo, #nomePrevidenciaPrivadaNovo").val("");
	}
	if (removedItem.inputId == "seguroVidaNovo") {
		$("#codSeguroVidaNovo, #nomeSeguroVidaNovo, #taxaSeguroVidaNovo").val("");
	}
	if (removedItem.inputId.split('___')[0] == "descricaoLinhaTransporte") {

		let index = removedItem.inputId.split('___')[1];
		$("#precoUnitarioTransporte___" + index).val("");
		$("#codLinha___" + index).val("");
		$("#nomeLinha___" + index).val("");
	}
}

var beforeSendValidate = function (numState, nextState) {
	var activity = $("#activity").val();
	var erro = 0;
	var msg = "Existem campos que estão preenchidos incorretamente e/ou não foram preenchidos. <br>";
	var ret = false;
	var valida = false;

	var valeTransporte = $("#valeTransporte").is(":checked");
	var valeRefeicaoAlimentacao = $("#valeRefeicaoAlimentacao").is(":checked");
	var planoOdontologico = $("#planoOdontologico").is(":checked");
	var previdenciaPrivada = $("#previdenciaPrivada").is(":checked");
	var seguroVida = $("#seguroVida").is(":checked");

	$(".alertaCampo").removeClass("has-error");

	if (activity == 0 || activity == 4 || activity == 15) {

		if (valeTransporte) {

			var alterarEndereco = $("#alterarEndereco").is(":checked")
			valida = $("#dtInicio___1").val() == '' || $("#alteraVTAtual").is(":checked") ? true : false;


			if (alterarEndereco) {
				if ($("#enderecoCep").val() == "") {
					$(".enderecoCep").addClass("has-error");
					erro++
				}
				if ($("#enderecoLogradouro").val() == "") {
					$(".enderecoLogradouro").addClass("has-error");
					erro++
				}
				if ($("#enderecoNumero").val() == "") {
					$(".enderecoNumero").addClass("has-error");
					erro++
				}
				if ($("#enderecoEstado").val() == "") {
					$(".enderecoEstado").addClass("has-error");
					erro++
				}
				if ($("#enderecoCidade").val() == "") {
					$(".enderecoCidade").addClass("has-error");
					erro++
				}
				if ($("#enderecoBairro").val() == "") {
					$(".enderecoBairro").addClass("has-error");
					erro++
				}
			}

			if (valida) {
				let campos = $("#tableBodyRow tr").find("input[name^='quantidadeTransporte___']");
				for (let i = 0; i < campos.length; i++) {
					let index = campos[i].id.split("___")[1];
					if ($(`#descricaoLinhaTransporte___${index}`).val() == "") {
						setErrorTable("descricaoLinhaTransporte", index);
						erro++
					}
					if ($(`#quantidadeTransporte___${index}`).val() == "") {
						setErrorTable("quantidadeTransporte", index);
						erro++
					}
				}

				if (!$("#cienciaValeTransporte").is(":checked")) {
					$(".cienciaValeTransporte").addClass("has-error");
					erro++
				}

				var attach = false;
				$.each(parent.ECM.attachmentTable.getData(), function (i, attachment) {
					attachment.description == "residencia" ? attach = true : "";
				});
				if (!attach) {
					msg += "Obrigatório anexar o comprovante residencial ! <br>";
					erro++
				}
			}

		}

		if (valeRefeicaoAlimentacao) {
			valida = $("#codValeRefeicaoAtual").val() == '' || $("#alteraValeRefeicaoAtual").is(":checked") ? true : false;

			if (valida) {
				if ($("#valeRefeicaoNovo").val() == "") {
					$(".valeRefeicaoNovo").addClass("has-error");
					erro++
				}
			}
		}
		if (planoOdontologico) {
			valida = $("#codPlanoOdontologicoAtual").val() == '' || $("#alteraPlanoOdontologicoAtual").is(":checked") ? true : false;

			if (valida) {
				if ($("#planoOdontologicoNovo").val() == "") {
					$(".planoOdontologicoNovo").addClass("has-error");
					erro++
				}
			}
		}
		if (previdenciaPrivada) {
			valida = $("#alteraPrevidenciaPrivadaAtual").is(":checked") ? true : false;

			if (valida) {
				if ($("#previdenciaPrivadaNovo").val() == "") {
					$(".previdenciaPrivadaNovo").not(":last").addClass("has-error");
					erro++
				}
				if (!$("#cienciaPrevidenciaPrivada").is(":checked")) {
					$(".cienciaPrevidenciaPrivada").addClass("has-error");
					erro++
				}
			}
		}
		if (seguroVida) {
			valida = $("#codSeguroVidaAtual").val() == '' || $("#alteraSeguroVidaAtual").is(":checked") ? true : false;

			if (valida) {
				if ($("#seguroVidaNovo").val() == "") {
					$(".seguroVidaNovo").addClass("has-error");
					erro++
				}
				var attach = false;
				$.each(parent.ECM.attachmentTable.getData(), function (i, attachment) {
					attachment.description == "metLife" ? attach = true : "";
				});
				if (!attach) {
					msg += "Obrigatório anexar o formulario MetLife preenchido ! <br>";
					erro++
				}
			}
		}

	}

	if (activity == 5) {
		if ($("input[name='radioAprovacao']:checked").val() == undefined) {
			$(".div_radioAprovacao").addClass("has-error");
			erro++
		}
		if ($("input[name='radioAprovacao']:checked").val() == "Reprovado" || $("input[name='radioAprovacao']:checked").val() == "Ajustar") {
			if ($("#observacoesAprovacao").val() == "") {
				$(".observacoesAprovacao").addClass("has-error");
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

function setErrorTable(field, index) {
	$(`#${field}___${index}`).parent().addClass("has-error");
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

function downloadMetLife() {
	fetch(`/api/public/ecm/document/downloadURL/${$("#idMetLife").val()}`).then(res => res.json()).then(registros => window.open(registros.content))
}

function showCamera(param) {
	JSInterface.showCamera(param);
}

function simularCusto() {
	const salario = parseFloat($("#salarioColaborador").val())
	const taxa = parseFloat($("#taxaSeguroVidaNovo").val())
	const desconto = parseFloat(salario * (taxa / 100));
	var msg;

	if ($("#codSeguroVidaNovo").val() == "") {
		msg = "Selecione um beneficio !"
	} else if ($("#codSeguroVidaNovo").val() == "3003") {
		msg = "O valor do desconto na folha sera de " + (parseFloat(desconto) + 3.97).toFixed(2) + " R$"
	} else {
		msg = "O valor do desconto na folha sera de " + desconto.toFixed(2) + " R$"
	}

	FLUIGC.toast({
		title: '',
		message: msg,
		type: 'warning'
	});
}

function limpaLinhasNovas() {
	$(".linhaNova:not(:first)").each(function () {
		$(this).remove(); // Remove a linha atual
	});
}

function bloqueiaLinhaAtual(bloqueia) {

	$(".linhaAtual").each((i, el) => {
		$("#quantidadeTransporte___" + (i + 1)).prop('readonly', bloqueia);
		$("#observacaoTransporte___" + (i + 1)).prop('readonly', bloqueia);
		$("#desativar___" + (i + 1)).prop('disabled', bloqueia);
	})

}

function checkLinhas(codLinha) {
	var retorno = true;

	$("#tableBodyRow tr").find("input[name^='codLinha___']").each(function (i, el) {
		if (codLinha == el.value) {
			retorno = false;
		}
	});

	return retorno;
}

$(document).ready(function () {
	const idExterno = $("#idExterno").val();
	if (idExterno == "Erro ao buscar idExterno") {
		return FLUIGC.message.error({
			title: 'Erro!',
			message: 'Usuário FLUIG não possui ID Externo',
			details: 'Certifique-se de que o usuário logado tenha um ID EXTERNO que mapeie com o RM',
		}, function (el, ev) {
			if (ev.type == "click")
				location.reload()
		});
	}
	verificarBeneficios();

	var dataAtual = new Date();
	var activity = $("#activity").val();

	$("#tableBodyRow tr").find("input[name^='dtInicio___']").each(function (i, el) {
		if (el.value) {
			$("#desativar___" + (i + 1)).show()
			$("#desativar___" + (i + 1)).next().hide()
		}
	});


	if ($("#formMode").val() == "VIEW") {
		showAndBlock([".inicio", "#painelAprovacao"]);
		$(".btn").hide()

		if (activity == 5) {
			validaCamposAlterados();
		}

	} else {
		if (activity == 0 || activity == 4) {

			if (activity == 0) {
				var constraintsLinhas = []
				constraintsLinhas.push(DatasetFactory.createConstraint("chapa", $("#chapaColaborador").val(), $("#chapaColaborador").val(), ConstraintType.MUST));
				var linhas = DatasetFactory.getDataset("ds_consulta_VT_funcionario_rm", null, constraintsLinhas, null);

				if (linhas.values[0].CODLINHA != "") {
					for (var i = 0; i < linhas.values.length; i++) {
						var row = wdkAddChild("tblLinhasValeTransporte");
						$("#valeTransporte").prop("checked", true);
						$("#tblLinhasValeTransporte tr:last").addClass("linhaAtual").removeClass("linhaNova");
						$("#descricaoLinhaTransporte___" + row).val(linhas.values[i].NOMELINHA).prop('readonly', true);
						$("#codLinha___" + row).val(linhas.values[i].CODLINHA).prop('readonly', true);
						$("#nomeLinha___" + row).val(linhas.values[i].NOMELINHA).prop('readonly', true);
						$("#dtInicio___" + row).val(linhas.values[i].DTINICIO).prop('readonly', true);
						$("#quantidadeTransporte___" + row).val(linhas.values[i].NROVIAGENS).prop('readonly', true);
						$("#precoUnitarioTransporte___" + row).val(linhas.values[i].VALOR).prop('readonly', true);
						$("#observacaoTransporte___" + row).prop('readonly', true);
						$("#observacaoTransporte___" + row).closest('td').next().find('button').hide();
						$("#desativar___" + row).show().val("ativo").prop('disabled', true);
					}
				}

				verificarBeneficios();
			}

			// if ($("#diaCorte").val() < dataAtual.getDate()) {
			// 	FLUIGC.toast({
			// 		title: '',
			// 		message: `solicitações de benefícios após o dia ${$("#diaCorte").val()}, serão considerados apenas na folha de pagamento seguinte ao mês corrente.`,
			// 		type: 'warning'
			// 	});
			// }

			document.querySelector("#enderecoCep").addEventListener("change", function () {
				FLUIGC.loading(window).show();
				setTimeout(async () => {
					await GetCEP(this.value);
					FLUIGC.loading(window).hide();
				}, 400);
			});

			$('.desativar').change(function () {
				if ($(this).is(':checked')) {
					// Ação quando o switch está ativado
					console.log('Switch ativado');
				} else {
					// Ação quando o switch está desativado
					console.log('Switch desativado');
				}
			});

		}

		if (activity == 5) {
			showAndBlock([".inicio"]);
			$("#painelAprovacao").show();
			$(".btn").hide()

			if ($("#observacoesAprovacao").val() != "") {
				$("#observacoesAprovacao").val("");
				$("input[name='radioAprovacao']").prop("checked", false);
			}
			validaCamposAlterados();
		}

		if (activity == 15) {
			showAndBlock(["#painelAprovacao"]);

			document.querySelector("#enderecoCep").addEventListener("change", function () {
				FLUIGC.loading(window).show();
				setTimeout(async () => {
					await GetCEP(this.value);
					FLUIGC.loading(window).hide();
				}, 400);
			});
		}
	}


});

const validaCamposAlterados = () => {
	let camposAlterados = [];

	const alteracoesEndereco = validaAlteracaoEndereco();
	if (alteracoesEndereco.length > 0) camposAlterados = camposAlterados.concat(alteracoesEndereco);

	const valeTransporte = validaAlteracaoVT();
	if (valeTransporte.length > 0 ) camposAlterados = camposAlterados.concat(valeTransporte);

	const valeRefeicao = $("#alteraValeRefeicaoAtual").is(':checked') || $("#codValeRefeicaoNovo").val() != "";
	if (valeRefeicao) camposAlterados.push('Vale Refeição - De: <span style="color: red;">' + $("#valeRefeicaoAtual").val() + '</span> Para: <span style="color: green;">' + $("#valeRefeicaoNovo").val() + '</span>');

	const planoOdontologia = $("#alteraPlanoOdontologicoAtual").is(':checked') || $("#codPlanoOdontologicoNovo").val() != "";
	if (planoOdontologia) camposAlterados.push('Plano Odontológico - De: <span style="color: red;">' + $("#planoOdontologicoAtual").val() + '</span> Para: <span style="color: green;">' + $("#planoOdontologicoNovo").val() + '</span>');

	const previdenciaPrivada = $("#alteraPrevidenciaPrivadaAtual").is(':checked') 
	|| $("#excluiPrevidenciaPrivadaAtual").is(':checked') 
	|| $("#codPrevidenciaPrivadaNovo").val() != "";
	if (previdenciaPrivada) camposAlterados.push('Previdência Privada - De: <span style="color: red;">' + $("#previdenciaPrivadaAtual").val() + '</span> Para: <span style="color: green;">' + $("#previdenciaPrivadaNovo").val() + '</span>');

	const formularioMetLife = $("#alterarFormMetLife").is(':checked');
	if (formularioMetLife) camposAlterados.push('Formulário MetLife');

	const seguroVida = $("#alteraSeguroVidaAtual").is(':checked') 
	|| $("#excluiSeguroVidaAtual").is(':checked') 
	|| $("#codSeguroVidaNovo").val() != "";
	if (seguroVida) camposAlterados.push('Seguro de Vida - De: <span style="color: red;">' + $("#seguroVidaAtual").val() + '</span> Para: <span style="color: green;">' + $("#seguroVidaNovo").val() + '</span>');

	$("#divWarnChangedBenefits").show();
	$("#warnChangedBenefits").html("Os seguintes benefícios foram alterados: <br><br>" + camposAlterados.join('<br>'));
}

const validaAlteracaoEndereco = () => {
	var emailColaborador = $("#emailColaborador").val();
	var c1 = DatasetFactory.createConstraint("mail", emailColaborador, emailColaborador, ConstraintType.MUST);
	var filter = new Array(c1);
    var fields = new Array("colleagueName", "mail", "colleaguePK.colleagueId");
	var retornoColleague = DatasetFactory.getDataset("colleague", fields, filter, null);
	var idExterno = retornoColleague.values[0]["colleaguePK.colleagueId"];
	const alteracoesEndereco = [];
	var contraintUsuario = [DatasetFactory.createConstraint("idExterno", idExterno, idExterno, ConstraintType.MUST)]
 	const endereco = DatasetFactory.getDataset("ds_consulta_func_rm", null, contraintUsuario, null);
	const enderecoAtual = [
		{
		name: 'CEP',
		value: endereco.values[0]?.CEP
		},
		{
		name: 'Rua',
		value: endereco.values[0]?.RUA
		},
		{
		name: 'Numero',
		value: endereco.values[0]?.NUMERO
		},
		{
		name: 'Complemento',
		value: endereco.values[0]?.COMPLEMENTO
		},
		{
		name: 'Estado',
		value: endereco.values[0]?.ESTADO
		},
		{
		name: 'Cidade',
		value: endereco.values[0]?.CIDADE
		},
		{
		name: 'Bairro',
		value: endereco.values[0]?.BAIRRO
		}
	]
	const enderecoNovo = [
		{
		name: 'CEP',
		value: $("#enderecoCep").val()
		},
		{
		name: 'Rua',
		value: $("#enderecoLogradouro").val()},
		{
		name: 'Numero',
		value: $("#enderecoNumero").val()},
		{
		name: 'Complemento',
		value: $("#enderecoComplemento").val()},
		{
		name: 'Estado',
		value: $("#enderecoEstado").val()},
		{
		name: 'Cidade',
		value: $("#enderecoCidade").val()},
		{
		name: 'Bairro',
		value: $("#enderecoBairro").val()
		}
	]
	enderecoAtual.map((item, index) => {
		let valorNovo = enderecoNovo.find((el) => el.name === item.name).value
		if (item.name === 'CEP') {
			item.value = item.value.replace(/\D/g, '');
			valorNovo = valorNovo.replace(/\D/g, '');
		}
		if (item.value !== valorNovo)
			alteracoesEndereco.push(item.name + ' (Endereço VT) - De: <span style="color: red;">' + item.value + '</span> Para: <span style="color: green;">' + valorNovo + '</span>');
	})
	return alteracoesEndereco;
}

const validaAlteracaoVT = () => {
	const linhasAlteradas = []
	let linhasVT = DatasetFactory.getDataset("ds_consulta_VT_funcionario_rm", null, [DatasetFactory.createConstraint("chapa", $("#chapaColaborador").val(), $("#chapaColaborador").val(), ConstraintType.MUST)], null);
	linhasVT = linhasVT.values;
	const linhasAtuais = []
	$("input[name^='descricaoLinhaTransporte___']").each((index, element) => {
		const id = element.id.split('___')[1]
		const valeTrasporte = {
			CODLINHA: $("#codLinha___" + id).val(),
			DTINICIO: $("#dtInicio___" + id).val(),
			NOMELINHA: $("#nomeLinha___" + id).val(),
			NROVIAGENS: $("#quantidadeTransporte___" + id).val(),
			VALOR: $("#precoUnitarioTransporte___" + id).val()
		}
		if ($("#desativar___"+id).val() == "desativar") linhasAlteradas.push('Linha de Transporte Desativada - ' + valeTrasporte.NOMELINHA + ' - De: <span style="color: red;">Ativo</span> Para: <span style="color: green;">Desativado</span>');
		else linhasAtuais.push(valeTrasporte);
	});
	linhasAtuais.map((linhaAtual, index) => {
		const linhaRM = linhasVT.find((linha) => linha.CODLINHA === linhaAtual.CODLINHA)
		if (linhaRM) {
			if (linhaAtual.DTINICIO !== linhaRM.DTINICIO || linhaAtual.NROVIAGENS !== linhaRM.NROVIAGENS || linhaAtual.VALOR !== linhaRM.VALOR) {
				linhasAlteradas.push('Linha de Transporte Alterada - ' + linhaAtual.NOMELINHA + ' - De: <span style="color: red;"> Quantidade: ' + linhaRM.NROVIAGENS + ' - Valor R$ ' + linhaRM.VALOR + '</span> Para: <span style="color: green;">' + linhaAtual.NROVIAGENS + ' - ' + linhaAtual.VALOR + '</span>');
			}
		} else {
			linhasAlteradas.push('Linha de Transporte Adicionada - <span style="color: green">' + linhaAtual.NOMELINHA + ' - Quantidade: ' + linhaAtual.NROVIAGENS + ' - Valor R$ ' + linhaAtual.VALOR + "</span>");
		}
	})
	return linhasAlteradas;
}