function beforeTaskSave(colleagueId,nextSequenceId,userList) {
    var activity = getValue("WKNumState");
    if (activity == 0 || activity == 4) { // Se for Inicio
        var chapaColaborador = hAPI.getCardValue("chapaColaborador");
        var idExterno = hAPI.getCardValue("idExterno");
        if (!idExterno || idExterno == "" || idExterno == null || idExterno == "null") {
            throw "O campo idExterno não foi preenchido.";
        }

        var idExternoSolicitante = hAPI.getCardValue("idExternoSolicitante");
        if (!idExternoSolicitante || idExternoSolicitante == "" || idExternoSolicitante == null || idExternoSolicitante == "null") {
            hAPI.setCardValue("idExternoSolicitante", idExterno);
        }

        if (!chapaColaborador || chapaColaborador == "" || chapaColaborador == null || chapaColaborador == "null") {

            var c1 = DatasetFactory.createConstraint("colleagueId", idExterno, idExterno, ConstraintType.MUST);
	        var filter = new Array(c1);
            var fields = new Array("colleagueName", "mail", "colleaguePK.colleagueId");
	        var retornoColleague = DatasetFactory.getDataset("colleague", fields, filter, null);
            if (!retornoColleague || !retornoColleague.rowsCount) {
                throw "ID Externo inválido.";
            }

            hAPI.setCardValue("idExternoSolicitante", idExterno);
            var campos = ["diaCorte", "dataInicio", "dataLimite", "alteracao"];
            var c1Param = DatasetFactory.createConstraint('userSecurityId', 'gabriela.vieira', 'gabriela.vieira', ConstraintType.MUST);
            var constraintsParam = [c1Param];
            var parametros = DatasetFactory.getDataset("dsParametrosBeneficios", campos, constraintsParam, null);
            if (!parametros || !parametros.rowsCount) {
                throw "Parâmetros não encontrados.";
            }
            hAPI.setCardValue("diaCorte", parametros.getValue(0, "diaCorte"));
            
            var dataInicio = parseData(parametros.getValue(0, "dataInicio"));
            var dataLimite = parseData(parametros.getValue(0, "dataLimite"));
            var dataAtual = parseData(getCurrentDate()[0]);
            
            var permiteOdonto = parametros.getValue(0, "alteracao") && dataAtual >= dataInicio && dataAtual <= dataLimite ? "true" : "false";
            hAPI.setCardValue("permiteOdonto", permiteOdonto);

            var email = retornoColleague.getValue(0, "mail");
            var contraintUsuario = [DatasetFactory.createConstraint("idExterno", idExterno, idExterno, ConstraintType.MUST)]
            var usuario = DatasetFactory.getDataset("ds_consulta_func_rm", null, contraintUsuario, null);
            if (!usuario || !usuario.rowsCount) {
                throw "Funcionário não encontrado no RM com esse ID Externo.";
            }

            hAPI.setCardValue("dtSolicitacao", getCurrentDate()[0]);

            hAPI.setCardValue("idEmpresa", usuario.getValue(0, "CODCOLIGADA"));
            hAPI.setCardValue("nomeColaborador", usuario.getValue(0, "NOME"));
            hAPI.setCardValue("chapaColaborador", usuario.getValue(0, "CHAPA"));
            hAPI.setCardValue("generoColaborador", usuario.getValue(0, "SEXO"));
            hAPI.setCardValue("salarioColaborador", usuario.getValue(0, "SALARIO"));
            hAPI.setCardValue("celularColaborador", String(usuario.getValue(0, "TELEFONE2")).replace(/^(\d{2})(\d{5})(\d{4})/, "(\$1) \$2-\$3"));
            hAPI.setCardValue("cpfColaborador", String(usuario.getValue(0, "CPF")).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'));
            hAPI.setCardValue("emailColaborador", email);
            hAPI.setCardValue("enderecoCep", usuario.getValue(0, "CEP"));
            hAPI.setCardValue("enderecoLogradouro", usuario.getValue(0, "RUA"));
            hAPI.setCardValue("enderecoNumero", usuario.getValue(0, "NUMERO"));
            hAPI.setCardValue("enderecoComplemento", usuario.getValue(0, "COMPLEMENTO"));
            hAPI.setCardValue("enderecoEstado", usuario.getValue(0, "ESTADO"));
            hAPI.setCardValue("enderecoCidade", usuario.getValue(0, "CIDADE"));
            hAPI.setCardValue("enderecoBairro", usuario.getValue(0, "BAIRRO"));

            var c1Benef = DatasetFactory.createConstraint("CHAPA", usuario.getValue(0, "CHAPA"), usuario.getValue(0, "CHAPA"), ConstraintType.MUST);
            var c2Benef = DatasetFactory.createConstraint('userSecurityId', 'gabriela.vieira', 'gabriela.vieira', ConstraintType.MUST);
            var contraintBeneficios = [c1Benef, c2Benef];
            var beneficios = DatasetFactory.getDataset("dsBeneficiosFuncionarios", null, contraintBeneficios, null);

            for (var i = 0; i < beneficios.rowsCount; i++) {

                var tipoBeneficio = beneficios.getValue(i, "CODTIPOBENEFICIO");
                if (tipoBeneficio == "03") {
                    hAPI.setCardValue("valeRefeicaoAlimentacao", true);
                    hAPI.setCardValue("valeRefeicaoAtual", beneficios.getValue(i, "NOME"));
                    hAPI.setCardValue("codValeRefeicaoAtual", beneficios.getValue(i, "CODBENEFICIO"));
                    hAPI.setCardValue("dataValeRefeicaoAtual", beneficios.getValue(i, "DTVINCULACAO"));
                }
                if (tipoBeneficio == "02") {
                    hAPI.setCardValue("planoOdontologico", true);
                    hAPI.setCardValue("planoOdontologicoAtual", beneficios.getValue(i, "NOME"));
                    hAPI.setCardValue("codPlanoOdontologicoAtual", beneficios.getValue(i, "CODBENEFICIO"));
                    hAPI.setCardValue("dataPlanoOdontologicoAtual", beneficios.getValue(i, "DTVINCULACAO"));
                }
                if (tipoBeneficio == "04" || tipoBeneficio == "05") {
                    hAPI.setCardValue("previdenciaPrivada", true);
                    hAPI.setCardValue("previdenciaPrivadaAtual", beneficios.getValue(i, "NOME"));
                    hAPI.setCardValue("codPrevidenciaPrivadaAtual", beneficios.getValue(i, "CODBENEFICIO"));
                    hAPI.setCardValue("dataPrevidenciaPrivadaAtual", beneficios.getValue(i, "DTVINCULACAO"));
                }
                if (tipoBeneficio == "07") {
                    hAPI.setCardValue("seguroVida", true);
                    hAPI.setCardValue("seguroVidaAtual", beneficios.getValue(i, "NOME"));
                    hAPI.setCardValue("codSeguroVidaAtual", beneficios.getValue(i, "CODBENEFICIO"));
                    hAPI.setCardValue("dataSeguroVidaAtual", beneficios.getValue(i, "DTVINCULACAO"));
                }
            }

            var camposMetLife = ["documentPK.documentId"]
            var constraintsMetLife = []
            var fluigUrl = fluigAPI.getPageService().getServerURL();
            var isProd = fluigUrl == "https://vtal166313.fluig.cloudtotvs.com.br";
            var codigoFormularioMetLife = isProd ? 19 : 15;
            constraintsMetLife.push(DatasetFactory.createConstraint("parentDocumentId", codigoFormularioMetLife, codigoFormularioMetLife, ConstraintType.MUST))
            constraintsMetLife.push(DatasetFactory.createConstraint("activeVersion", "true", "true", ConstraintType.MUST));
            constraintsMetLife.push(DatasetFactory.createConstraint('userSecurityId', 'gabriela.vieira', 'gabriela.vieira', ConstraintType.MUST));
            var formMetLife = DatasetFactory.getDataset("document", camposMetLife, constraintsMetLife, null);
            if (formMetLife.rowsCount > 0) hAPI.setCardValue("idMetLife", formMetLife.getValue(0, "documentPK.documentId"));
        }
    }
}

function getCurrentDate() {
	var newDate = new Date();
	var h = newDate.getHours();
	if (h < 10) {
		h = "0" + h;
	}
	var m = newDate.getMinutes();
	if (m < 10) {
		m = "0" + m;
	}
	var hour = h + ":" + m; // + ":" + s;
	var day = newDate.getDate();
	if (day < 10) {
		day = "0" + day;
	}
	var month = newDate.getMonth() + 1;
	if (month < 10) {
		month = "0" + month;
	}
	newDate = day + '/' + month + '/' + newDate.getFullYear();
	var currentDate = [newDate, hour];
	return currentDate;
}

function parseData(dataString) {
    log.info("DATA STRING --- DSPADUA");
    log.dir(dataString);
    var partesData = dataString.split("/");
    return new Date(partesData[2], partesData[1] - 1, partesData[0]);
}