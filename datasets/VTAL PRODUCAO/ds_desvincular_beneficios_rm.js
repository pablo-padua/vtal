function createDataset(fields, constraints, sortFields) {
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn("success");
    newDataset.addColumn("Result");

    try {

        var result;
        var usuario = "";
        var senha = "";
        var codcoligada = 1;
        var chapa = getConstraint(constraints, "chapa");
        var codBeneficio = getConstraint(constraints, "codBeneficio");
        var dataDesvinculacao = getConstraint(constraints, "dataDesvinculacao");
        var dataInicio = getConstraint(constraints, "dataInicio");

        // busca usuário e senha para integração
        var datasetBase64 = DatasetFactory.getDataset("ds_user_wsecm", null, null, null);

        if (datasetBase64 != null && datasetBase64.values.length > 0) {
            usuario = datasetBase64.getValue(0, "usuario");
            senha = datasetBase64.getValue(0, "senha");
        }

        // declaração do serviço
        var serviceName = "TBC_RM_PROCESSOS";
        var servicePath = "com.totvs.WsProcess";
        var servico = ServiceManager.getServiceInstance(serviceName);
        var instancia = servico.instantiate(servicePath);
        var ws = instancia.getRMIwsProcess();
        var serviceHelper = servico.getBean();
        var authService = null;
        var processName = "RhuCancelarDesvincularBeneficioProcess";

        authService = serviceHelper.getBasicAuthenticatedClient(ws, "com.totvs.IwsProcess", usuario, senha);

        xml = createXml(usuario, codcoligada, chapa, codBeneficio, dataDesvinculacao, dataInicio);

        result = authService.executeWithXmlParams(processName, xml);

        if (isError(result.toString())) {
            success = "false";
            log.error('@@@@@@@@@@ Erro Integração -> ' + result);
            throw result + "[XML] ----> \n" + xml;
        } else {
            success = "true";
            log.info('@@@@@@@@@@ Successo Integração -> ' + result.toString());
            //hAPI.setCardValue("txtChaveRM", result.toString().split(";")[1]);
        }

        newDataset.addRow([success, result]);
    } catch (error) {

        newDataset.addRow(["false", error]);
        log.error("@@@@@@@@@@ erro: " + error);
        throw error;
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

function createXml(usuario, codcoligada, chapa, codBeneficio, dataDesvinculacao, dataInicio) {

    var xml = '<RhuCancelarDesvincularBeneficiosProcessParams z:Id="i1" xmlns="http://www.totvs.com.br/RM/" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:z="http://schemas.microsoft.com/2003/10/Serialization/">\n';
    xml += '  <ActionModule xmlns="http://www.totvs.com/">V</ActionModule>\n';
    xml += '  <ActionName xmlns="http://www.totvs.com/">RhuDesvincularBeneficioProcessAction</ActionName>\n';
    xml += '  <CanParallelize xmlns="http://www.totvs.com/">true</CanParallelize>\n';
    xml += '  <CanSendMail xmlns="http://www.totvs.com/">false</CanSendMail>\n';
    xml += '  <CanWaitSchedule xmlns="http://www.totvs.com/">false</CanWaitSchedule>\n';
    xml += '  <CodUsuario xmlns="http://www.totvs.com/">' + usuario + '</CodUsuario>\n';
    xml += '  <ConnectionId i:nil="true" xmlns="http://www.totvs.com/" />\n';
    xml += '  <ConnectionString i:nil="true" xmlns="http://www.totvs.com/" />\n';
    xml += '  <Context z:Id="i2" xmlns="http://www.totvs.com/" xmlns:a="http://www.totvs.com.br/RM/">\n';
    xml += '  <a:_params xmlns:b="http://schemas.microsoft.com/2003/10/Serialization/Arrays">\n';
    xml += '  <b:KeyValueOfanyTypeanyType>\n';
    xml += '    <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$EXERCICIOFISCAL</b:Key>\n';
    xml += '    <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>\n';
    xml += '  </b:KeyValueOfanyTypeanyType>\n';
    xml += '  <b:KeyValueOfanyTypeanyType>\n';
    xml += '    <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODLOCPRT</b:Key>\n';
    xml += '    <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>\n';
    xml += '  </b:KeyValueOfanyTypeanyType>\n';
    xml += '  <b:KeyValueOfanyTypeanyType>\n';
    xml += '    <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODTIPOCURSO</b:Key>\n';
    xml += '    <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>\n';
    xml += '  </b:KeyValueOfanyTypeanyType>\n';
    xml += '  <b:KeyValueOfanyTypeanyType>\n';
    xml += '    <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$EDUTIPOUSR</b:Key>\n';
    xml += '    <b:Value i:nil="true" />\n';
    xml += '  </b:KeyValueOfanyTypeanyType>\n';
    xml += '  <b:KeyValueOfanyTypeanyType>\n';
    xml += '    <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODUNIDADEBIB</b:Key>\n';
    xml += '    <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>\n';
    xml += '  </b:KeyValueOfanyTypeanyType>\n';
    xml += '  <b:KeyValueOfanyTypeanyType>\n';
    xml += '    <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODCOLIGADA</b:Key>\n';
    xml += '    <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">1</b:Value>\n';
    xml += '  </b:KeyValueOfanyTypeanyType>\n';
    xml += '  <b:KeyValueOfanyTypeanyType>\n';
    xml += '    <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$RHTIPOUSR</b:Key>\n';
    xml += '    <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>\n';
    xml += '  </b:KeyValueOfanyTypeanyType>\n';
    xml += '  <b:KeyValueOfanyTypeanyType>\n';
    xml += '    <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODIGOEXTERNO</b:Key>\n';
    xml += '    <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>\n';
    xml += '  </b:KeyValueOfanyTypeanyType>\n';
    xml += '  <b:KeyValueOfanyTypeanyType>\n';
    xml += '    <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODSISTEMA</b:Key>\n';
    xml += '    <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">P</b:Value>\n';
    xml += '  </b:KeyValueOfanyTypeanyType>\n';
    xml += '  <b:KeyValueOfanyTypeanyType>\n';
    xml += '    <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODUSUARIOSERVICO</b:Key>\n';
    xml += '    <b:Value i:nil="true" />\n';
    xml += '  </b:KeyValueOfanyTypeanyType>\n';
    xml += '  <b:KeyValueOfanyTypeanyType>\n';
    xml += '    <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODUSUARIO</b:Key>\n';
    xml += '    <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">' + usuario + '</b:Value>\n';
    xml += '  </b:KeyValueOfanyTypeanyType>\n';
    xml += '  <b:KeyValueOfanyTypeanyType>\n';
    xml += '    <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$IDPRJ</b:Key>\n';
    xml += '    <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>\n';
    xml += '  </b:KeyValueOfanyTypeanyType>\n';
    xml += '  <b:KeyValueOfanyTypeanyType>\n';
    xml += '    <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CHAPAFUNCIONARIO</b:Key>\n';
    xml += '    <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>\n';
    xml += '  </b:KeyValueOfanyTypeanyType>\n';
    xml += '  <b:KeyValueOfanyTypeanyType>\n';
    xml += '    <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODFILIAL</b:Key>\n';
    xml += '    <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>\n';
    xml += '  </b:KeyValueOfanyTypeanyType>\n';
    xml += '  </a:_params>';
    xml += '    <a:Environment>DotNet</a:Environment>\n';
    xml += '  </Context>\n';
    xml += '  <CustomData i:nil="true" xmlns="http://www.totvs.com/" />\n';
    xml += '  <DisableIsolateProcess xmlns="http://www.totvs.com/">false</DisableIsolateProcess>\n';
    xml += '  <DriverType i:nil="true" xmlns="http://www.totvs.com/" />\n';
    xml += '  <ExecutionId xmlns="http://www.totvs.com/">6cc74ef7-82ce-4a6b-a66d-32e0c3f76530</ExecutionId>\n';
    xml += '  <FailureMessage xmlns="http://www.totvs.com/">Falha na execução do processo</FailureMessage>\n';
    xml += '  <FriendlyLogs i:nil="true" xmlns="http://www.totvs.com/" />\n';
    xml += '  <HideProgressDialog xmlns="http://www.totvs.com/">false</HideProgressDialog>\n';
    xml += '  <HostName xmlns="http://www.totvs.com/">SPON010118720</HostName>\n';
    xml += '  <Initialized xmlns="http://www.totvs.com/">true</Initialized>\n';
    xml += '  <Ip xmlns="http://www.totvs.com/">10.0.2.10</Ip>\n';
    xml += '  <IsolateProcess xmlns="http://www.totvs.com/">false</IsolateProcess>\n';
    xml += '  <JobID xmlns="http://www.totvs.com/">\n';
    xml += '    <Children />\n';
    xml += '    <ExecID>1</ExecID>\n';
    xml += '    <ID>104158</ID>\n';
    xml += '    <IsPriorityJob>false</IsPriorityJob>\n';
    xml += '  </JobID>\n';
    xml += '  <JobServerHostName xmlns="http://www.totvs.com/">166319-core-instance-N-RM-D-C2SK4D-1-7fcc7WIN-SP05</JobServerHostName>\n';
    xml += '  <MasterActionName xmlns="http://www.totvs.com/">RhuBenefFuncAction</MasterActionName>\n';
    xml += '  <MaximumQuantityOfPrimaryKeysPerProcess xmlns="http://www.totvs.com/">1000</MaximumQuantityOfPrimaryKeysPerProcess>\n';
    xml += '  <MinimumQuantityOfPrimaryKeysPerProcess xmlns="http://www.totvs.com/">1</MinimumQuantityOfPrimaryKeysPerProcess>\n';
    xml += '  <NetworkUser xmlns="http://www.totvs.com/" />\n';
    xml += '  <NotifyEmail xmlns="http://www.totvs.com/">false</NotifyEmail>\n';
    xml += '  <NotifyEmailList i:nil="true" xmlns="http://www.totvs.com/" xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays" />\n';
    xml += '  <NotifyFluig xmlns="http://www.totvs.com/">false</NotifyFluig>\n';
    xml += '  <OnlineMode xmlns="http://www.totvs.com/">false</OnlineMode>\n';
    xml += '  <PrimaryKeyList xmlns="http://www.totvs.com/" xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">\n';
    xml += '    <a:ArrayOfanyType>\n';
    xml += '      <a:anyType z:Id="i3" i:type="b:RhuCancelarDesvincularBeneficiosProcessParams" xmlns:b="-RM.Rhu.Beneficios.Intf, Version=12.1.2402.117, Culture=neutral, PublicKeyToken=null-RM.Rhu.Beneficios-RM.Rhu.Beneficios.RhuCancelarDesvincularBeneficiosProcessParams">\n';
    xml += '        <ActionModule i:nil="true" />\n';
    xml += '        <ActionName i:nil="true" />\n';
    xml += '        <CanParallelize>false</CanParallelize>\n';
    xml += '        <CanSendMail>false</CanSendMail>\n';
    xml += '        <CanWaitSchedule>false</CanWaitSchedule>\n';
    xml += '        <CodUsuario i:nil="true" />\n';
    xml += '        <ConnectionId i:nil="true" />\n';
    xml += '        <ConnectionString i:nil="true" />\n';
    xml += '        <Context i:nil="true" xmlns:c="http://www.totvs.com.br/RM/" />\n';
    xml += '        <CustomData i:nil="true" />\n';
    xml += '        <DisableIsolateProcess>false</DisableIsolateProcess>\n';
    xml += '        <DriverType i:nil="true" />\n';
    xml += '        <ExecutionId>8b0e2877-3ca3-4484-8617-cd252efe1eb5</ExecutionId>\n';
    xml += '        <FailureMessage>Falha na execução do processo</FailureMessage>\n';
    xml += '        <FriendlyLogs i:nil="true" />\n';
    xml += '        <HideProgressDialog>false</HideProgressDialog>\n';
    xml += '        <HostName i:nil="true" />\n';
    xml += '        <Initialized>false</Initialized>\n';
    xml += '        <Ip i:nil="true" />\n';
    xml += '        <IsolateProcess>false</IsolateProcess>\n';
    xml += '        <JobID>\n';
    xml += '          <Children />\n';
    xml += '          <ExecID>-1</ExecID>\n';
    xml += '          <ID>-1</ID>\n';
    xml += '          <IsPriorityJob>false</IsPriorityJob>\n';
    xml += '        </JobID>\n';
    xml += '        <JobServerHostName i:nil="true" />\n';
    xml += '        <MasterActionName i:nil="true" />\n';
    xml += '        <MaximumQuantityOfPrimaryKeysPerProcess>1000</MaximumQuantityOfPrimaryKeysPerProcess>\n';
    xml += '        <MinimumQuantityOfPrimaryKeysPerProcess>1</MinimumQuantityOfPrimaryKeysPerProcess>\n';
    xml += '        <NetworkUser i:nil="true" />\n';
    xml += '        <NotifyEmail>false</NotifyEmail>\n';
    xml += '        <NotifyEmailList i:nil="true" />\n';
    xml += '        <NotifyFluig>false</NotifyFluig>\n';
    xml += '        <OnlineMode>false</OnlineMode>\n';
    xml += '        <PrimaryKeyList />\n';
    xml += '        <PrimaryKeyNames i:nil="true" />\n';
    xml += '        <PrimaryKeyTableName i:nil="true" />\n';
    xml += '        <ProcessName i:nil="true" />\n';
    xml += '        <QuantityOfSplits>0</QuantityOfSplits>\n';
    xml += '        <SaveLogInDatabase>true</SaveLogInDatabase>\n';
    xml += '        <SaveParamsExecution>false</SaveParamsExecution>\n';
    xml += '        <ScheduleDateTime>2024-06-13T15:42:09.9053177-03:00</ScheduleDateTime>\n';
    xml += '        <Scheduler>JobMonitor</Scheduler>\n';
    xml += '        <SendMail>false</SendMail>\n';
    xml += '        <ServerName i:nil="true" />\n';
    xml += '        <ServiceInterface i:nil="true" xmlns:c="http://schemas.datacontract.org/2004/07/System" />\n';
    xml += '        <ShouldParallelize>false</ShouldParallelize>\n';
    xml += '        <ShowReExecuteButton>true</ShowReExecuteButton>\n';
    xml += '        <StatusMessage i:nil="true" />\n';
    xml += '        <SuccessMessage>Processo executado com sucesso</SuccessMessage>\n';
    xml += '        <SyncExecution>false</SyncExecution>\n';
    xml += '        <UseJobMonitor>true</UseJobMonitor>\n';
    xml += '        <UserName i:nil="true" />\n';
    xml += '        <WaitSchedule>false</WaitSchedule>\n';
    xml += '        <AutoVinc xmlns="http://www.totvs.com.br/RM/">0</AutoVinc>\n';
    xml += '        <Chapa xmlns="http://www.totvs.com.br/RM/">'+chapa+'</Chapa>\n';
    xml += '        <CodBeneficio xmlns="http://www.totvs.com.br/RM/">'+codBeneficio+'</CodBeneficio>\n';
    xml += '        <CodColigada xmlns="http://www.totvs.com.br/RM/">'+codcoligada+'</CodColigada>\n';
    xml += '        <Data xmlns="http://www.totvs.com.br/RM/">'+dataDesvinculacao+'</Data>\n';
    xml += '        <DataInicio xmlns="http://www.totvs.com.br/RM/">'+dataInicio+'</DataInicio>\n';
    xml += '        <NomeAction xmlns="http://www.totvs.com.br/RM/">RhuDesvincularBeneficioProcessAction</NomeAction>\n';
    xml += '        <Valor xmlns="http://www.totvs.com.br/RM/">0</Valor>\n';
    xml += '        <codUsuarioDesvincularCancelar xmlns="http://www.totvs.com.br/RM/">' + usuario + '</codUsuarioDesvincularCancelar>\n';
    xml += '        <nrIdentificacao i:nil="true" xmlns="http://www.totvs.com.br/RM/" />\n';
    xml += '        <nroDependente xmlns="http://www.totvs.com.br/RM/">0</nroDependente>\n';
    xml += '        <periodicidade xmlns="http://www.totvs.com.br/RM/">0</periodicidade>\n';
    xml += '      </a:anyType>\n';
    xml += '    </a:ArrayOfanyType>\n';
    xml += '  </PrimaryKeyList>\n';
    xml += '  <PrimaryKeyNames xmlns="http://www.totvs.com/" xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">\n';
    xml += '    <a:string>CODCOLIGADA</a:string>\n';
    xml += '    <a:string>CHAPA</a:string>\n';
    xml += '    <a:string>CODBENEFICIO</a:string>\n';
    xml += '  </PrimaryKeyNames>\n';
    xml += '  <PrimaryKeyTableName xmlns="http://www.totvs.com/">VBENEFFUNC</PrimaryKeyTableName>\n';
    xml += '  <ProcessName xmlns="http://www.totvs.com/">Desvincular Benefício</ProcessName>\n';
    xml += '  <QuantityOfSplits xmlns="http://www.totvs.com/">0</QuantityOfSplits>\n';
    xml += '  <SaveLogInDatabase xmlns="http://www.totvs.com/">true</SaveLogInDatabase>\n';
    xml += '  <SaveParamsExecution xmlns="http://www.totvs.com/">false</SaveParamsExecution>\n';
    xml += '  <ScheduleDateTime xmlns="http://www.totvs.com/">2024-06-13T15:42:06.9241604-03:00</ScheduleDateTime>\n';
    xml += '  <Scheduler xmlns="http://www.totvs.com/">JobMonitor</Scheduler>\n';
    xml += '  <SendMail xmlns="http://www.totvs.com/">false</SendMail>\n';
    xml += '  <ServerName xmlns="http://www.totvs.com/">RhuCancelarDesvincularBeneficioProcess</ServerName>\n';
    xml += '  <ServiceInterface i:nil="true" xmlns="http://www.totvs.com/" xmlns:a="http://schemas.datacontract.org/2004/07/System" />\n';
    xml += '  <ShouldParallelize xmlns="http://www.totvs.com/">false</ShouldParallelize>\n';
    xml += '  <ShowReExecuteButton xmlns="http://www.totvs.com/">true</ShowReExecuteButton>\n';
    xml += '  <StatusMessage i:nil="true" xmlns="http://www.totvs.com/" />\n';
    xml += '  <SuccessMessage xmlns="http://www.totvs.com/">Processo executado com sucesso</SuccessMessage>\n';
    xml += '  <SyncExecution xmlns="http://www.totvs.com/">false</SyncExecution>\n';
    xml += '  <UseJobMonitor xmlns="http://www.totvs.com/">true</UseJobMonitor>\n';
    xml += '  <UserName xmlns="http://www.totvs.com/">' + usuario + '</UserName>\n';
    xml += '  <WaitSchedule xmlns="http://www.totvs.com/">false</WaitSchedule>\n';
    xml += '  <AutoVinc>0</AutoVinc>\n';
    xml += '  <Chapa i:nil="true" />\n';
    xml += '  <CodBeneficio i:nil="true" />\n';
    xml += '  <CodColigada>0</CodColigada>\n';
    xml += '  <Data>0001-01-01T00:00:00</Data>\n';
    xml += '  <DataInicio>0001-01-01T00:00:00</DataInicio>\n';
    xml += '  <NomeAction i:nil="true" />\n';
    xml += '  <Valor>0</Valor>\n';
    xml += '  <codUsuarioDesvincularCancelar i:nil="true" />\n';
    xml += '  <nrIdentificacao i:nil="true" />\n';
    xml += '  <nroDependente>0</nroDependente>\n';
    xml += '  <periodicidade>0</periodicidade>\n';
    xml += '</RhuCancelarDesvincularBeneficiosProcessParams>';

    log.info(" @@@@@ XML" + xml);
    return xml;
}

