function createDataset(fields, constraints, sortFields) {
	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn("success");
	newDataset.addColumn("Result");

	try {

		var result;
		var usuario = "";
		var senha = "";
		var codcoligada = 1;
		var success;

		// busca usuário e senha para integração
		var datasetBase64 = DatasetFactory.getDataset("ds_user_wsecm", null, null, null);

		if (datasetBase64 != null && datasetBase64.values.length > 0) {
			usuario = datasetBase64.getValue(0, "usuario");
			senha = datasetBase64.getValue(0, "senha");
		}

		// declaração do serviço
		var serviceName = "TBC_RM";	
		var servico = ServiceManager.getServiceInstance(serviceName);
		var servicePath = "com.totvs.WsDataServer";
		var instancia = servico.instantiate(servicePath);
		var ws = instancia.getRMIwsDataServer();
		var serviceHelper = servico.getBean();
		var authService = null;

  		var xml = getConstraint(constraints, "xml");
  		var dataServer = getConstraint(constraints, "dataServer");
		
		authService = serviceHelper.getBasicAuthenticatedClient(ws, "com.totvs.IwsDataServer", usuario, senha);

		result = authService.saveRecord(dataServer, xml, 'CODCOLIGADA=' + codcoligada + ';CODUSUARIO=' + usuario);

		if (isError(result.toString())) {
			log.error('@@@@@@@@@@ Erro Integração -> ' + result);
			//throw result + "[XML] ----> \n" + xml;
			success = "false";
		} else {
			success = "true";
			log.info('@@@@@@@@@@ Successo Integração -> ' + result.toString());
		}

		newDataset.addRow([success,result]);

	} catch (error) {
		newDataset.addRow([error]);
	}

	return newDataset;
}


function getConstraint(constraints, filter) {
	for (var i = 0; i < constraints.length; i++) {
		if (constraints[i].fieldName == filter && constraints[i].initialValue != "") {
			return constraints[i].initialValue;
		}
	}
	return null;
}


function isError(result) {
	return isNaN(result.substring(0, 1));
}

