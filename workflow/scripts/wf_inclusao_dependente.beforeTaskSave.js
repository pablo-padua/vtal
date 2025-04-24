function beforeTaskSave(colleagueId,nextSequenceId,userList){
    var activity = getValue("WKNumState");
    if (activity == 0 || activity == 3) { // Se for Inicio
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
            var idpId = fluigAPI.getUserService().getUser(idExterno).getExtraData("idpId");
            if (!idpId || idpId == "" || idpId == null || idpId == "null" || idpId == undefined) {
                throw "ID Externo inválido.";
            }

            var campos = ["diaCorte"];
            var c1c = [DatasetFactory.createConstraint('userSecurityId', 'gabriela.vieira', 'gabriela.vieira', ConstraintType.MUST)];
            var parametros = DatasetFactory.getDataset("ds_parametros_beneficios", campos, c1c, null);
            hAPI.setCardValue("diaCorte", parametros.getValue(0, "diaCorte"));

	    	var email = fluigAPI.getUserService().findById(idExterno).getEmail();
	    	var contraintUsuario = [DatasetFactory.createConstraint("idExterno", idpId, idpId, ConstraintType.MUST)]
	    	var usuario = DatasetFactory.getDataset("ds_consulta_func_rm", null, contraintUsuario, null);
            if (!usuario || !usuario.rowsCount) {
                throw "Funcionário não encontrado no RM com esse ID Externo.";
            }

	    	hAPI.setCardValue("dtSolicitacao", getCurrentDate()[0]);
	    	hAPI.setCardValue("dataVeracidade", getCurrentDate()[0] + " - " + getCurrentDate()[1]);
	    	hAPI.setCardValue("idEmpresa", usuario.getValue(0, "CODCOLIGADA"));
            hAPI.setCardValue("nomeColaborador", usuario.getValue(0, "NOME"));
            hAPI.setCardValue("chapaColaborador", usuario.getValue(0, "CHAPA"));
            hAPI.setCardValue("generoColaborador", usuario.getValue(0, "SEXO"));
            hAPI.setCardValue("celularColaborador", String(usuario.getValue(0, "TELEFONE2")).replace(/^(\d{2})(\d{5})(\d{4})/, "(\$1) \$2-\$3"));
            hAPI.setCardValue("nomeEmpresa", usuario.getValue(0, "NOMECOLIGADA"));
            hAPI.setCardValue("emailColaborador", email);
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