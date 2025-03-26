function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
    var parametros = DatasetFactory.getDataset("ds_parametros_beneficios", fields, constraints, sortFields);
    return parametros;
}
function onMobileSync(user) {

}