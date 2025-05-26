function createDataset(fields, constraints, sortFields) {
  log.info("******************** DATASET RM - INICIO **************************");
  log.info("****************** busca_proximo_id_dependente ***********************");

  var NOME_SERVICO = "TBC_RM_CONSULTA";
  var credenciais = DatasetFactory.getDataset("ds_user_wsecm", null, null, null);
  if (credenciais == null || credenciais.rowsCount == 0) {
    return getDatasetErro(["?", "?", "?", "?", "Credenciais não encontradas"], "0 - CONSULTA CREDENCIAIS");
  }
  var INTEGRATION_USER = credenciais.getValue(0, "usuario");
  var INTEGRATION_PASS = credenciais.getValue(0, "senha");

  var CAMINHO_SERVICO = "com.totvs.WsConsultaSQL";
  var WEBSERVICE = "com.totvs.IwsConsultaSQL";

  var idExterno = getConstraint(constraints, "idExterno");
  var filtro = "USERFLUIG=" + idExterno;

  var dataset = DatasetBuilder.newDataset();

  //------------------------------------------------------------------------------------------------------------------------------------------
  //ETAPA 1 - CARREGAR SERVICO
  //------------------------------------------------------------------------------------------------------------------------------------------
  try {
    log.info("filtro>>>>: " + filtro);

    var servico = ServiceManager.getServiceInstance(NOME_SERVICO);
    log.warn("Servico: " + servico);

    var serviceHelper = servico.getBean();
    log.warn("ServiceHelper: " + serviceHelper);

    var instancia = serviceHelper.instantiate(CAMINHO_SERVICO);
    log.warn("Instancia: " + instancia);

    var ws = instancia.getRMIwsConsultaSQL();
    log.warn("WS: " + ws);

    //CONFIGURA O SERVICO PARA ENVIAR OS DADOS DA AUTENTICACAO BASICO NO CABECALHO DA REQUISICAO
    var wsDataServerAuthenticated = serviceHelper.getBasicAuthenticatedClient(ws, WEBSERVICE, INTEGRATION_USER, INTEGRATION_PASS);
    log.warn("WsDataServerAuthenticated: " + wsDataServerAuthenticated);
  } catch (e) {
    return getDatasetErro(["?", "?", "?", "?", e], "1 - CARREGAR SERVIÇO");
  }

  //------------------------------------------------------------------------------------------------------------------------------------------
  //ETAPA 2.1 - PREPARAR PARAMETROS
  //------------------------------------------------------------------------------------------------------------------------------------------
  var sentenca = "FLUIG_INTGR08";
  var coligada = 0;
  var sistema = "P";
  var parametros = filtro;

  //------------------------------------------------------------------------------------------------------------------------------------------
  //ETAPA 2.2 - EXECUTAR CHAMADA
  //------------------------------------------------------------------------------------------------------------------------------------------
  try {
    var result = wsDataServerAuthenticated.realizarConsultaSQL(sentenca, coligada, sistema, parametros);
  } catch (e) {
    return getDatasetErro([sentenca, coligada, sistema, parametros, e], "2.2 - EXECUTAR CHAMADA");
  }

  //------------------------------------------------------------------------------------------------------------------------------------------
  //ETAPA 3.2 - TRANSFORMAR RESULTADO
  //------------------------------------------------------------------------------------------------------------------------------------------
  try {
    var xmlResultados = new XML(result);

    // Get the first record to dynamically get the column names
    var firstRecord = xmlResultados.Resultado[0];
    if (firstRecord) {
      var children = firstRecord.children();
      for (var i = 0; i < children.length(); i++) {
            // Add each child element name as a column dynamically
            dataset.addColumn(children[i].name().toString().toUpperCase());
      }
    } else {
      throw new Error("Não foi retornado colunas nessa consulta.");
    }
  } catch (e) {
    return getDatasetErro([sentenca, coligada, sistema, parametros, e], "3.2 - TRANSFORMAR RESULTADO");
  }

  //------------------------------------------------------------------------------------------------------------------------------------------
  //ETAPA 3.3 - TRANSFORMAR RESULTADO
  //------------------------------------------------------------------------------------------------------------------------------------------
  try {
    var xmlResultados = new XML(result);
  } catch (e) {
    return getDatasetErro([sentenca, coligada, sistema, parametros, e], "3.3 - TRANSFORMAR RESULTADO");
  }

  //------------------------------------------------------------------------------------------------------------------------------------------
  //ETAPA 4 - CARREGAR DADOS
  //------------------------------------------------------------------------------------------------------------------------------------------
  try {
    var registros = new Array();
    var xmlList = new XMLList(xmlResultados.Resultado);
    log.info("###### PASSO 1");
    for (item in xmlList) {
      var valores = new Array();
      for (col in xmlList[item].children()) {
        valores.push(new String(xmlList[item].children()[col].valueOf()).toString());
      }
      registros.push(valores);
    }
    log.info("###### PASSO 2");
    for (record in registros) {
      dataset.addRow(registros[record]);
    }
    log.info("###### PASSO 3: " + dataset.rowsCount);
    return dataset;
  } catch (e) {
    return getDatasetErro([sentenca, coligada, sistema, parametros, e], "4 - CARREGAR DADOS");
  }
}

//----------------------------------------------------------------------------------------------------------------------------------------------
//FUNCAO PARA CRIAR UM DATASET COM A MENSAGEM DE ERRO OCORRIDA
//----------------------------------------------------------------------------------------------------------------------------------------------
function getDatasetErro(params, etapa) {
  if (params[4] == null) msg = "Erro desconhecido; verifique o log do Servidor";
  var mensagemErro = "Erro na comunicação com o Serviço de integração (etapa " + new String(etapa).toString() + "): " + String(params[4]);
  log.error(mensagemErro);

  var dataset = DatasetBuilder.newDataset();
  dataset.addColumn("ERROR");
  dataset.addRow(new Array(mensagemErro));
  return dataset;
}

function getConstraint(constraints, filter) {
	for (var i = 0; i < constraints.length; i++) {
		if (constraints[i].fieldName == filter && constraints[i].initialValue != "") {
			return constraints[i].initialValue;
		}
	}
	return null;
}