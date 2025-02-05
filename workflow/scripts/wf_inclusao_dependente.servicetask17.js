function servicetask17(attempt, message) {

	try {

		var xml = createXml();

		log.info(" @@@@@ XML" + xml);
		var contraint = [];
		contraint.push(DatasetFactory.createConstraint("xml", xml, xml, ConstraintType.MUST))
		contraint.push(DatasetFactory.createConstraint("dataServer", "FopDependData", "FopDependData", ConstraintType.MUST))
		var saveRecord = DatasetFactory.getDataset("saveRecord_rm", null, contraint, null);

		if (saveRecord != null && saveRecord.rowsCount > 0) {
			var succes = saveRecord.getValue(0, "success");
			log.info("RETORNO saveRecord");
			log.dir(saveRecord);
			if (succes == "true") {
				log.info("Sucesso ao integrar com o RM.");
				return true;
			} else {
				throw saveRecord.getValue(0, "result");
			}

		} else {
			throw "Erro no dataset saveRecord_rm"
		}
	} catch (error) {
		log.info("Erro ao integrar com o RM: " + error);
		throw error;
	}

}

function createXml() {

	var tipo = hAPI.getCardValue("tipoSolicitacaoIncluirAlterar");
	

	var newElement = "<FopDepend><PFDepend>";

	var CODCOLIGADA = hAPI.getCardValue("idEmpresa");
	var CHAPA = hAPI.getCardValue("chapaColaborador");
	var NRODEPEND = tipo == "incluir" ? hAPI.getCardValue("dependenteUltimoID") : hAPI.getCardValue("idDependente");
	var NOME = hAPI.getCardValue("dependenteNomeCompleto");
	var DTNASCIMENTO = hAPI.getCardValue("dependenteDtNascimento");
	var CPF = String(hAPI.getCardValue("cpfDependente")).replace(/[^0-9]/g, '');
	var SEXO = hAPI.getCardValue("dependenteSexo");
	var GRAUPARENTESCO = hAPI.getCardValue("dependenteGrauParentesco");
	var GRAUDEINSTRUCAO = hAPI.getCardValue("dependenteGrauInstrucao");
	var RECEBEAUXPCD = hAPI.getCardValue("IsDependentePCD") == "true" ? "T" : "F";
	var UNIVERSITARIO = hAPI.getCardValue("dependenteUniversitario");
	var LOCALNASCIMENTO = hAPI.getCardValue("dependenteMunicipioNascimento");
	var ESTADOCIVIL = hAPI.getCardValue("dependenteEstadoCivil");
	var NUMDECLARANASCVIVO = hAPI.getCardValue("numeroDeclaracao");
	var NOMEMAE = hAPI.getCardValue("dependenteNomeMae");



	var ASSMED = hAPI.getCardValue("temMedica");
	var DTINCLUSAOASSMED = hAPI.getCardValue("DTINCLUSAOASSMED");
	var DTEXCLUSAOASSMED = hAPI.getCardValue("DTEXCLUSAOASSMED");

	if (ASSMED == "0" && DTEXCLUSAOASSMED == "") {
		DTEXCLUSAOASSMED = hAPI.getCardValue("dataAprovacaoRH").substr(0, 10);
		DTINCLUSAOASSMED = "";
	}
	if (ASSMED == "1" && DTINCLUSAOASSMED == "") {
		DTINCLUSAOASSMED = hAPI.getCardValue("dataAprovacaoRH").substr(0, 10);
		DTEXCLUSAOASSMED = "";
	}

	var ASSODO = hAPI.getCardValue("temOdonto");
	var DTINCLUSAOASSODO = hAPI.getCardValue("DTINCLUSAOASSODO");
	var DTEXCLUSAOASSODO = hAPI.getCardValue("DTEXCLUSAOASSODO");

	if (ASSODO == "0" && DTINCLUSAOASSODO != "") {
		DTEXCLUSAOASSODO = hAPI.getCardValue("dataAprovacaoRH").substr(0, 10);
		DTINCLUSAOASSODO = "";
	}

	if (ASSODO == "1" && DTINCLUSAOASSODO == "") {
		DTINCLUSAOASSODO = hAPI.getCardValue("dataAprovacaoRH").substr(0, 10);
		DTEXCLUSAOASSODO = "";
	}

	var IMPOSTORENDA = hAPI.getCardValue("temIR");
	var DTINCLUSAOIR = hAPI.getCardValue("DTINCLUSAOIR");
	var DTEXCLUSAOIR = hAPI.getCardValue("DTEXCLUSAOIR");

	if (IMPOSTORENDA == "0") {
		DTEXCLUSAOIR = hAPI.getCardValue("dataAprovacaoRH").substr(0, 10);
	}
	if (IMPOSTORENDA == "1") {
		DTINCLUSAOIR = hAPI.getCardValue("dataAprovacaoRH").substr(0, 10);
		DTEXCLUSAOIR = "";
	}

	var AUXMEDICAMENTO = hAPI.getCardValue("temMedicamento");
	var DTINCLUSAOAUXMED = hAPI.getCardValue("DTINCLUSAOAUXMED");
	var DTEXCLUSAOAUXMED = hAPI.getCardValue("DTEXCLUSAOAUXMED");

	if (AUXMEDICAMENTO == "F" && DTINCLUSAOAUXMED != "") {
		DTEXCLUSAOAUXMED = hAPI.getCardValue("dataAprovacaoRH").substr(0, 10);
		DTINCLUSAOAUXMED = "";
	}

	if (AUXMEDICAMENTO == "T" && DTINCLUSAOAUXMED == "") {
		DTINCLUSAOAUXMED = hAPI.getCardValue("dataAprovacaoRH").substr(0, 10);
		DTEXCLUSAOAUXMED = "";
	}

	if (ASSMED == "0") {
		var INCASSISTMEDICA = "0";
	} else {
		var INCASSISTMEDICA = "1";
	}
	if (ASSODO == "0") {
		var INCASSISTODONTO = "0";
	} else {
		var INCASSISTODONTO = "1";
	}


	newElement += setNode("CODCOLIGADA", CODCOLIGADA);
	newElement += setNode("CHAPA", CHAPA);
	newElement += setNode("NRODEPEND", NRODEPEND);
	newElement += setNode("NOME", NOME);
	newElement += setNode("DTNASCIMENTO", DTNASCIMENTO);
	newElement += setNode("CPF", CPF);
	newElement += setNode("SEXO", SEXO);
	newElement += setNode("GRAUPARENTESCO", GRAUPARENTESCO);
	newElement += setNode("UNIVERSITARIO", UNIVERSITARIO);
	newElement += setNode("LOCALNASCIMENTO", LOCALNASCIMENTO);
	newElement += setNode("ESTADOCIVIL", ESTADOCIVIL);
	newElement += setNode("NUMDECLARANASCVIVO", NUMDECLARANASCVIVO);
	newElement += setNode("INCASSISTMEDICA", INCASSISTMEDICA);
	newElement += setNode("INCASSISTODONTO", INCASSISTODONTO);
	newElement += setNode("INCIRRF", IMPOSTORENDA);

	newElement += "</PFDepend><PFDEPENDCOMPL>"
	newElement += setNode("CODCOLIGADA", CODCOLIGADA);
	newElement += setNode("CHAPA", CHAPA);
	newElement += setNode("NRODEPEND", NRODEPEND);
	newElement += setNode("NOMEMAE", NOMEMAE);
	newElement += setNode("AUXMEDICAMENTO", AUXMEDICAMENTO);
	newElement += setNode("GRAUDEINSTRUCAO", GRAUDEINSTRUCAO);
	newElement += setNode("RECEBEAUXPCD", RECEBEAUXPCD);
	newElement += setNode("DTINCLUSAOASSMED", DTINCLUSAOASSMED);
	newElement += setNode("DTEXCLUSAOASSMED", DTEXCLUSAOASSMED);
	newElement += setNode("DTINCLUSAOASSODO", DTINCLUSAOASSODO);
	newElement += setNode("DTEXCLUSAOASSODO", DTEXCLUSAOASSODO);
	newElement += setNode("DTINCLUSAOAUXMED", DTINCLUSAOAUXMED);
	newElement += setNode("DTEXCLUSAOAUXMED", DTEXCLUSAOAUXMED);
	newElement += setNode("DTINCLUSAOIR", DTINCLUSAOIR);
	newElement += setNode("DTEXCLUSAOIR", DTEXCLUSAOIR);
	newElement += "</PFDEPENDCOMPL>"


	newElement += "</FopDepend>";

	return newElement;
}


function setNode(node, valor) {
	var line = createNode(node) + valor + createNode("/" + node);
	return line;
}

function createNode(node) {
	return "<" + node + ">";
}

