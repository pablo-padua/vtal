function displayFields(form, customHTML) {
    var fluigUrl = fluigAPI.getPageService().getServerURL();
    var isProd = fluigUrl == "https://vtal166313.fluig.cloudtotvs.com.br" ? true : false;
    var activity = getValue('WKNumState');
    var userId = getValue('WKUser');
    form.setShowDisabledFields(true);
    form.setHidePrintLink(true);

    form.setValue("WKNumProces", getValue('WKNumProces'));
    form.setValue("activity", activity);
    form.setValue("formMode", form.getFormMode());

    var c1 = DatasetFactory.createConstraint("colleagueId", userId, userId, ConstraintType.MUST);
	var filter = new Array(c1);
    var fields = new Array("colleagueName", "mail", "colleaguePK.colleagueId");
	var retornoColleague = DatasetFactory.getDataset("colleague", fields, filter, null);
	var idExterno = retornoColleague.getValue(0, "colleaguePK.colleagueId");
    if (idExterno == 'b8bbd8be8929414ab255699de0c7640f') {
		// idExterno = "fb42dc0ff40d4565b916b358d8ebeeb0" //AMBIENTE QA
	}
	if (idExterno == 'gabriela.vieira') {
		idExterno = "628985d9a0e44ce9986f54ebf726cde4" //AMBIENTE PROD
	}
    
    if (activity == 0 || activity == 4) { // Se for Inicio
        if (!idExterno) return form.setValue("idExterno", "Erro ao buscar idExterno");
        form.setValue("idExterno", idExterno);
    }

    var requestDate = getCurrentDate();

    if (activity == 0) {
        form.setValue("idExternoSolicitante", idExterno);
        var campos = ["diaCorte", "dataInicio", "dataLimite", "alteracao"]
        var c1 = [DatasetFactory.createConstraint('userSecurityId', 'gabriela.vieira', 'gabriela.vieira', ConstraintType.MUST)];
        var parametros = DatasetFactory.getDataset("ds_parametros_beneficios", campos, c1, null);
        form.setValue("diaCorte", parametros.getValue(0, "diaCorte"));

        var dataInicio = criarDataFromString(parametros.getValue(0, "dataInicio"));
        var dataLimite = criarDataFromString(parametros.getValue(0, "dataLimite"));
        var dataAtual = criarDataFromString(requestDate[0]);

        var permiteOdonto = parametros.getValue(0, "alteracao") && dataAtual >= dataInicio && dataAtual <= dataLimite ? "true" : "false";
        form.setValue("permiteOdonto", permiteOdonto);

        var email = retornoColleague.getValue(0, "mail");
        var contraintUsuario = [DatasetFactory.createConstraint("idExterno", idExterno, idExterno, ConstraintType.MUST)]
        var usuario = DatasetFactory.getDataset("ds_consulta_func_rm", null, contraintUsuario, null);

        form.setValue("dtSolicitacao", getCurrentDate()[0]);

        form.setValue("idEmpresa", usuario.getValue(0, "CODCOLIGADA"));
        form.setValue("nomeColaborador", usuario.getValue(0, "NOME"));
        form.setValue("chapaColaborador", usuario.getValue(0, "CHAPA"));
        form.setValue("generoColaborador", usuario.getValue(0, "SEXO"));
        form.setValue("salarioColaborador", usuario.getValue(0, "SALARIO"));
        form.setValue("celularColaborador", String(usuario.getValue(0, "TELEFONE2")).replace(/^(\d{2})(\d{5})(\d{4})/, "(\$1) \$2-\$3"));
        form.setValue("cpfColaborador", String(usuario.getValue(0, "CPF")).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'));
        form.setValue("emailColaborador", email);
        form.setValue("enderecoCep", usuario.getValue(0, "CEP"));
        form.setValue("enderecoLogradouro", usuario.getValue(0, "RUA"));
        form.setValue("enderecoNumero", usuario.getValue(0, "NUMERO"));
        form.setValue("enderecoComplemento", usuario.getValue(0, "COMPLEMENTO"));
        form.setValue("enderecoEstado", usuario.getValue(0, "ESTADO"));
        form.setValue("enderecoCidade", usuario.getValue(0, "CIDADE"));
        form.setValue("enderecoBairro", usuario.getValue(0, "BAIRRO"));

        var contraintBeneficios = [DatasetFactory.createConstraint("CHAPA", usuario.getValue(0, "CHAPA"), usuario.getValue(0, "CHAPA"), ConstraintType.MUST)]
        var beneficios = DatasetFactory.getDataset("ds_beneficios_funcionario", null, contraintBeneficios, null);

        for (var i = 0; i < beneficios.values.length; i++) {

            var tipoBeneficio = beneficios.getValue(i, "CODTIPOBENEFICIO");
            if (tipoBeneficio == "03") {
                form.setValue("valeRefeicaoAlimentacao", true);
                form.setValue("valeRefeicaoAtual", beneficios.getValue(i, "NOME"));
                form.setValue("codValeRefeicaoAtual", beneficios.getValue(i, "CODBENEFICIO"));
                form.setValue("dataValeRefeicaoAtual", beneficios.getValue(i, "DTVINCULACAO"));
            }
            if (tipoBeneficio == "02") {
                form.setValue("planoOdontologico", true);
                form.setValue("planoOdontologicoAtual", beneficios.getValue(i, "NOME"));
                form.setValue("codPlanoOdontologicoAtual", beneficios.getValue(i, "CODBENEFICIO"));
                form.setValue("dataPlanoOdontologicoAtual", beneficios.getValue(i, "DTVINCULACAO"));
            }
            if (tipoBeneficio == "04" || tipoBeneficio == "05") {
                form.setValue("previdenciaPrivada", true);
                form.setValue("previdenciaPrivadaAtual", beneficios.getValue(i, "NOME"));
                form.setValue("codPrevidenciaPrivadaAtual", beneficios.getValue(i, "CODBENEFICIO"));
                form.setValue("dataPrevidenciaPrivadaAtual", beneficios.getValue(i, "DTVINCULACAO"));
            }
            if (tipoBeneficio == "07") {
                form.setValue("seguroVida", true);
                form.setValue("seguroVidaAtual", beneficios.getValue(i, "NOME"));
                form.setValue("codSeguroVidaAtual", beneficios.getValue(i, "CODBENEFICIO"));
                form.setValue("dataSeguroVidaAtual", beneficios.getValue(i, "DTVINCULACAO"));
            }
        }

        var camposMetLife = ["documentPK.documentId"]
        var constraintsMetLife = []
        var codigoFormularioMetLife = isProd ? 19 : 15;
        constraintsMetLife.push(DatasetFactory.createConstraint("parentDocumentId", codigoFormularioMetLife, codigoFormularioMetLife, ConstraintType.MUST))
        constraintsMetLife.push(DatasetFactory.createConstraint("activeVersion", "true", "true", ConstraintType.MUST));
        constraintsMetLife.push(DatasetFactory.createConstraint('userSecurityId', 'gabriela.vieira', 'gabriela.vieira', ConstraintType.MUST));
        var formMetLife = DatasetFactory.getDataset("document", camposMetLife, constraintsMetLife, null);
        if (formMetLife.rowsCount > 0) form.setValue("idMetLife", formMetLife.getValue(0, "documentPK.documentId"));
        
    }


    if (activity == 5) {
        form.setValue("nomeAprovador", retornoColleague.getValue(0, "colleagueName"));
        form.setValue("idAprovador", userId);
        form.setValue("dataAprovacao", requestDate[0] + " - " + requestDate[1]);
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

function criarDataFromString(dataString) {
    var partesData = dataString.split("/");
    return new Date(partesData[2], partesData[1] - 1, partesData[0]);
}