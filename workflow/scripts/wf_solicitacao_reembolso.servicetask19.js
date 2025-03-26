function servicetask19(attempt, message) {

	try {

		var xml = createXml();

		log.info(" @@@@@ XML" + xml);
		var contraint = [];
		contraint.push(DatasetFactory.createConstraint("xml", xml, xml, ConstraintType.MUST));
		contraint.push(DatasetFactory.createConstraint("dataServer", "RMSPRJ4921856Server", "RMSPRJ4921856Server", ConstraintType.MUST));
		var saveRecord = DatasetFactory.getDataset("saveRecord_rm", null, contraint, null);

		if (saveRecord != null && saveRecord.values.length > 0) {
			var succes = saveRecord.getValue(0, "success");
			if (succes == "true") {
				log.info("Sucesso ao integrar com o RM.");
				return true;
			} else {
				throw saveRecord.getValue(0, "result");
			}

		} else {
			throw "Erro no dataset saveRecord_rm";
		}
	} catch (error) {
		log.info("Erro ao integrar com o RM: " + error);
		throw error;
	}
}

function createXml() {

	var newElement = "<PRJ4921856>";

	var TIPOREEMBOLSO = hAPI.getCardValue("tipoReembolso");

	var quantidade;

	if (TIPOREEMBOLSO == "1") {
		quantidade = hAPI.getChildrenIndexes("tabela_auxilio_creche").length;
		
	} else {
		quantidade = 1
		var TIPOPAGAMENTO = hAPI.getCardValue("tipoPagamentoBaba");
		var ANOPAGTO = hAPI.getCardValue("dataPagamentoBaba").substr(3);
		var MESPAGTO =  hAPI.getCardValue("dataPagamentoBaba").substr(0,2);
		log.info("LOGVALORPAGAMENTO: " + hAPI.getCardValue("valorPagamentoBaba"));
		log.info("SOLICITACAO: "+ hAPI.getCardValue("WKNumProces"));
		var VALOR = String(hAPI.getCardValue("valorPagamentoBaba"));
		if (!VALOR || VALOR == "") {
			throw "O campo 'Valor do pagamento da babá' está vazio.";
		}
		VALOR = VALOR
		.replace(/[^0-9,.]/g, '') // Remove todos os caracteres que não sejam números, vírgulas ou pontos
		.replace(/\./g, '') // Remove todos os pontos
	}

	for (var i = 1; i <= quantidade; i++) {

		if(TIPOREEMBOLSO == "1"){
			var TIPOPAGAMENTO = hAPI.getCardValue("tipoPagamentoAuxilio___"+i);
			var ANOPAGTO = hAPI.getCardValue("dataPagamentoAuxilio___"+i).substr(3);
			var MESPAGTO = hAPI.getCardValue("dataPagamentoAuxilio___"+i).substr(0,2);
			log.info("LOGVALORPAGAMENTO: " + hAPI.getCardValue("valorPagamentoAuxilio___"+i));
			log.info("SOLICITACAO: "+ hAPI.getCardValue("WKNumProces"));
			var VALOR = String(hAPI.getCardValue("valorPagamentoAuxilio___"+i));
			if (!VALOR || VALOR == "") {
				throw "O campo 'Valor do pagamento do auxílio creche' está vazio.";
			}
			VALOR = VALOR
			.replace(/[^0-9,.]/g, '') // Remove todos os caracteres que não sejam números, vírgulas ou pontos
			.replace(/\./g, '') // Remove todos os pontos
		}
		
		var CODCOLIGADA = hAPI.getCardValue("idEmpresa");
		var CHAPA = hAPI.getCardValue("chapaColaborador");
		var NRODEPEND = hAPI.getCardValue("idDependente");
		var DTSOLICITACAO = hAPI.getCardValue("dtSolicitacao");
		var DTAPROVACAO = hAPI.getCardValue("dataAprovacao").substr(0,10);
		var NRSOLICITACAO = hAPI.getCardValue("WKNumProces");
		var DTCOMPETENCIA = formataData(DTSOLICITACAO);
		var MESCOMP = DTCOMPETENCIA.substr(5, 2);
		var ANOCOMP = DTCOMPETENCIA.substr(0, 4);
		
		var CPF = String(hAPI.getCardValue("cpfBaba")).replace(/[^0-9]/g, '');	
		var CNPJ = String(hAPI.getCardValue("cnpjAuxilio")).replace(/[^0-9]/g, '');
	
		newElement += "<ZMDREEMBOLSO>";
		newElement += setNode("CODCOLIGADA", CODCOLIGADA);
		newElement += setNode("CHAPA", CHAPA);
		newElement += setNode("NRODEPEND", NRODEPEND);
		newElement += setNode("DTSOLICITACAO", DTSOLICITACAO);
		newElement += setNode("TIPOPAGAMENTO", TIPOPAGAMENTO);
		newElement += setNode("TIPOREEMBOLSO", TIPOREEMBOLSO);
		newElement += setNode("CNPJ", CNPJ);
		newElement += setNode("CPF", CPF);
		newElement += setNode("ANOPAGTO", ANOPAGTO);
		newElement += setNode("MESPAGTO", MESPAGTO);
		newElement += setNode("VALOR", VALOR);
		newElement += setNode("DTAPROVACAO", DTAPROVACAO);
		newElement += setNode("NRSOLICITACAO", NRSOLICITACAO);
		newElement += setNode("MESCOMP", MESCOMP);
		newElement += setNode("ANOCOMP", ANOCOMP);
		newElement += "</ZMDREEMBOLSO>";
	}

	newElement += "</PRJ4921856>";

	return newElement;
}


function setNode(node, valor) {
	var line = createNode(node) + valor + createNode("/" + node);
	return line;
}

function createNode(node) {
	return "<" + node + ">";
}

function formataData(dataAbertura) {
    var dataFormatoMesDiaAno = dataAbertura.split("/");
    dataFormatoMesDiaAno = dataFormatoMesDiaAno[1] + "/" + dataFormatoMesDiaAno[0] + "/" + dataFormatoMesDiaAno[2];
    var dataAberturaSolicitacao = new Date(dataFormatoMesDiaAno);
    var diaCorte = parseInt(hAPI.getCardValue("diaCorte"));

    // Verifica se o dia da data de abertura é maior que o dia de corte
    if (dataAberturaSolicitacao.getDate() > diaCorte) {
        // Salva o dia original
        var diaOriginal = dataAberturaSolicitacao.getDate();
        
        // Adiciona 1 mês à data atual
        dataAberturaSolicitacao.setMonth(dataAberturaSolicitacao.getMonth() + 1);
        
        // Se o novo dia for menor que o dia original, ajusta para o último dia do novo mês
        if (dataAberturaSolicitacao.getDate() < diaOriginal) {
            dataAberturaSolicitacao.setDate(0); // O dia 0 do mês seguinte é o último dia do mês atual
        }

        var ano = dataAberturaSolicitacao.getFullYear();
        var mes = dataAberturaSolicitacao.getMonth() + 1; // Meses são indexados de 0 a 11
        var dia = dataAberturaSolicitacao.getDate();

        // Formata a nova data para 'YYYY-MM-DD'
        var dataFormatada = ano + '-' + (mes < 10 ? '0' + mes : mes) + '-' + (dia < 10 ? '0' + dia : dia);
        return dataFormatada;
    } else {
        // A data não precisa ser modificada, apenas formata para 'YYYY-MM-DD'
        var partes = dataAbertura.split("/");
        return partes[2] + "-" + partes[1] + "-" + partes[0];
    }
}
