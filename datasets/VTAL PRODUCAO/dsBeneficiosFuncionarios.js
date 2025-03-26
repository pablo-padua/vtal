function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
    var parametros = DatasetFactory.getDataset("ds_beneficios_funcionario", fields, constraints, sortFields);
    return parametros;
}
function onMobileSync(user) {

}