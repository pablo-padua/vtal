function createDataset(fields, constraints, sortFields) {
	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn("CHAPA");
	newDataset.addColumn("NOME");
	newDataset.addColumn("SEXO");
	newDataset.addColumn("TELEFONE2");
	newDataset.addColumn("NOMECOLIGADA");
	newDataset.addColumn("NOMEFANTASIACOLIGADA");
	newDataset.addColumn("NOMEFILIAL");
	newDataset.addColumn("NOMEFANTASIAFILIAL");
	newDataset.addColumn("CODCOLIGADA");
	newDataset.addColumn("CPF");
	newDataset.addColumn("SALARIO");
	newDataset.addColumn("CEP");
	newDataset.addColumn("RUA");
	newDataset.addColumn("NUMERO");
	newDataset.addColumn("COMPLEMENTO");
	newDataset.addColumn("ESTADO");
	newDataset.addColumn("CIDADE");
	newDataset.addColumn("BAIRRO");

	var fields = [];
	for(let i = 0; i < newDataset.columnsCount; i++) {
		fields.push(newDataset.getColumnName(i));
	}
	var codConsulta = 'FLUIG_INTGR02';
	var codSistema = 'P';
	var codcoligada = 0;
 	var idExterno = getConstraint(constraints, "idExterno");
	var PARAMS = "USERFLUIG=" + idExterno;
	var usuario;
	var senha;
	var datasetBase64 = DatasetFactory.getDataset("ds_user_wsecm", null, null, null);

	if (datasetBase64 != null && datasetBase64.values.length > 0) {
		usuario = datasetBase64.getValue(0, "usuario");
		senha = datasetBase64.getValue(0, "senha");
	}

	try {
		var serviceName = "TBC_RM_CONSULTA";	
		var servico = ServiceManager.getServiceInstance(serviceName);
		var servicePath = "com.totvs.WsConsultaSQL";
		var instancia = servico.instantiate(servicePath);
		var ws = instancia.getRMIwsConsultaSQL();
		var serviceHelper = servico.getBean();
		var authService = null;		
		authService = serviceHelper.getBasicAuthenticatedClient(ws, "com.totvs.IwsConsultaSQL", usuario, senha);
		
		result = authService.realizarConsultaSQL(codConsulta, codcoligada, codSistema, PARAMS);
		var jsonObj = getTagsByName(result, "Resultado");
		if (jsonObj.length > 0) {
			for (var i = 0; i < jsonObj.length; i++) {
				var row = [];
				for (var j = 0; j < fields.length; j++) {
					var field = fields[j];
					var tags = getTagsByName(jsonObj[i], field);
					var regex = new RegExp('(<' + field + '>|<\/' + field + '>)', 'g');
					row.push(tags[0].replace(regex, ''));
				}
				newDataset.addRow(row);
			}
		} else {
			log.info("@ds_generic_rm_sql diz: TAG resultado inexistente");
		}
	} catch (erro) {
		newDataset.addRow(new Array(erro));
	}
	return newDataset;
}

function getTagsByName(stringXML, tagName) {
	var linarize = stringXML.replace("\n", "").replace("\r", "");
	var regex = new RegExp('<' + tagName + '>(.*?)<\/' + tagName + '>', 'g');
	var tags = linarize.match(regex);
	if (tags == null) {
		log.warn('@ds_generic_rm_sql diz: Tag ' + tagName + ' nao foi encontrada no retorno da consulta.');
		return [ '' ];
	} else
		return tags;
}

function getValue(e, field) {
	var name = e.getElementsByTagName(field);
	var line = name.item(0);
	if (line != null) {
		var child = line.getFirstChild();
		return child.getNodeValue();
	} else {
		return;
	}
}

function getConstraint(constraints, filter) {
	for (var i = 0; i < constraints.length; i++) {
		if (constraints[i].fieldName == filter && constraints[i].initialValue != "") {
			return constraints[i].initialValue;
		}
	}
	return null;
}