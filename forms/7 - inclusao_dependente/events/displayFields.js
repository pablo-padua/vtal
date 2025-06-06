function displayFields(form, customHTML) {
	if (form.getValue("dependenteAssociado") != "Sim") form.setVisibleById("divColaboradorDependente", false);

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
	var idExterno = fluigAPI.getUserService().getUser(userId).getExtraData("idpId");
	if (idExterno == 'b8bbd8be8929414ab255699de0c7640f') {
		idExterno = "b7d7fbfe2c344ce09b5203340d065b1a" //AMBIENTE QA
	}
	if (idExterno == '774fabb1af7e43babcf4de942acdd36f') {
		idExterno = "7f7f30746a9a4b769f52eac2d5226b19" //AMBIENTE PROD
	}

	if (activity == 0 || activity == 3) { // Se for Inicio
		if (!idExterno) return form.setValue("idExterno", "Erro ao buscar idExterno");
		form.setValue("idExterno", idExterno);
	}

	if (activity == 0) {
		form.setValue("idExternoSolicitante", idExterno);
		var campos = ["diaCorte"]
        var c1 = [DatasetFactory.createConstraint('userSecurityId', 'gabriela.vieira', 'gabriela.vieira', ConstraintType.MUST)];
        var parametros = DatasetFactory.getDataset("ds_parametros_beneficios", campos, c1, null);
        form.setValue("diaCorte", parametros.getValue(0, "diaCorte"));

		var email = retornoColleague.getValue(0, "mail")
		var contraintUsuario = [DatasetFactory.createConstraint("idExterno", idExterno, idExterno, ConstraintType.MUST)]
		var usuario = DatasetFactory.getDataset("ds_consulta_func_rm", null, contraintUsuario, null);

		form.setValue("dtSolicitacao", getCurrentDate()[0]);
		form.setValue("dataVeracidade", getCurrentDate()[0] + " - " + getCurrentDate()[1]);

		form.setValue("idEmpresa", usuario.getValue(0, "CODCOLIGADA"));
        form.setValue("nomeColaborador", usuario.getValue(0, "NOME"));
        form.setValue("chapaColaborador", usuario.getValue(0, "CHAPA"));
        form.setValue("generoColaborador", usuario.getValue(0, "SEXO"));
        form.setValue("celularColaborador", String(usuario.getValue(0, "TELEFONE2")).replace(/^(\d{2})(\d{5})(\d{4})/, "(\$1) \$2-\$3"));
        form.setValue("nomeEmpresa", usuario.getValue(0, "NOMECOLIGADA"));
        form.setValue("emailColaborador", email);
	}


	if (activity == 6) {

		var requestDate = getCurrentDate();

		form.setValue("nomeAprovadorRH", retornoColleague.getValue(0, "colleagueName"));
		form.setValue("idAprovadorRH", userId);
		form.setValue("dataAprovacaoRH", requestDate[0] + " - " + requestDate[1]);
	}
	if (activity == 27) {

		var requestDate = getCurrentDate();

		form.setValue("nomeAprovadorSaude", retornoColleague.getValue(0, "colleagueName"));
		form.setValue("idAprovadorSaude", userId);
		form.setValue("dataAprovacaoSaude", requestDate[0] + " - " + requestDate[1]);
	}

	customHTML.append('<script>function getTask(){ return ' + activity + '; }</script>');
  	customHTML.append("<script>function getMode(){ return '" + form.getFormMode() + "'; }</script>");
  	customHTML.append("<script>function getUser(){ return '" + userId + "'; }</script>");
  	customHTML.append("<script>function getUserIdExterno(){ return '" + idExterno + "'; }</script>");
  	customHTML.append('<script>function getCompany(){ return ' + getValue('WKCompany') + '; }</script>');
  	customHTML.append('<script>function getMobile(){ return ' + form.getMobile() + '; }</script>');
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