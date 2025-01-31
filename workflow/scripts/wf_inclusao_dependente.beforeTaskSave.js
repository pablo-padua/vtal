function beforeTaskSave(colleagueId, nextSequenceId, userList) {
    var atv      = getValue("WKNumState");
    if (atv == 0 || atv == 4) {

        var anexos   = hAPI.listAttachments();
        var temAnexo = false;

        if (anexos.size() > 0) {
            temAnexo = true;
        }

        if (!temAnexo) {
            //throw "É preciso anexar o documento para continuar a solicitação";
        }

    }
}