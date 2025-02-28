function displayFields(form,customHTML){
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
        idExterno = "fb42dc0ff40d4565b916b358d8ebeeb0" //AMBIENTE QA
    }
    if (idExterno == 'gabriela.vieira') {
        idExterno = "dddc3e710d304fa1a0edc51eadad2c0c" //AMBIENTE PROD
    }

    if (activity == 0 || activity == 4) {
        if (!idExterno) return form.setValue("idExterno", "Erro ao buscar idExterno");
        form.setValue("idExterno", idExterno);
    }

    if (activity == 0) {
        form.setValue("idExternoSolicitante", idExterno);
        var campos = ["pai","mae","diaCorte"];
        var c1Param = DatasetFactory.createConstraint('userSecurityId', 'gabriela.vieira', 'gabriela.vieira', ConstraintType.MUST);
        var contraintsParam = [c1Param];
        var parametros = DatasetFactory.getDataset("ds_parametros_beneficios", campos, contraintsParam, null);
        form.setValue("idadePAi", parametros.getValue(0, "pai"));
        form.setValue("idadeMae", parametros.getValue(0, "mae"));
        form.setValue("diaCorte", parametros.getValue(0, "diaCorte"));

        var email =  retornoColleague.getValue(0, "mail");
        var contraintUsuario = [DatasetFactory.createConstraint("idExterno", idExterno, idExterno, ConstraintType.MUST)];
        var usuario = DatasetFactory.getDataset("ds_consulta_func_rm", null, contraintUsuario, null);

        form.setValue("dtSolicitacao", getCurrentDate()[0]);

        form.setValue("idEmpresa", usuario.getValue(0, "CODCOLIGADA"));
        form.setValue("nomeColaborador", usuario.getValue(0, "NOME"));
        form.setValue("chapaColaborador", usuario.getValue(0, "CHAPA"));
        form.setValue("generoColaborador", usuario.getValue(0, "SEXO"));
        form.setValue("celularColaborador", String(usuario.getValue(0, "TELEFONE2")).replace(/^(\d{2})(\d{5})(\d{4})/, "(\$1) \$2-\$3"));
        form.setValue("nomeEmpresa", usuario.getValue(0, "NOMECOLIGADA"));
        form.setValue("emailColaborador", email);
    }


    if(activity == 5){

        var requestDate = getCurrentDate();

        var c1 = DatasetFactory.createConstraint("colleagueId", userId, userId, ConstraintType.MUST);
        var filter = new Array(c1);
        var fields = new Array("colleagueName", "mail", "colleaguePK.colleagueId");
        var retornoColleague = DatasetFactory.getDataset("colleague", fields, filter, null);
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