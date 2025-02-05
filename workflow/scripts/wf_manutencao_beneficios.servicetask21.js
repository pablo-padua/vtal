function servicetask21() {

    try {

        var status = false;
        var xml;
        var result;
        var CODBENEFICIO;
        var BENEFICIO;
        var codBeneficioAntigo;
        var dataBeneficioAntigo;
        var tabela = hAPI.getChildrenIndexes("tblLinhasValeTransporte").length;

        if (hAPI.getCardValue("alteraEndereco") == "true") {
            var newElement = "<FopFunc><PFunc>";
            newElement += setNode("CODCOLIGADA", hAPI.getCardValue("idEmpresa"));
            newElement += setNode("CHAPA", hAPI.getCardValue("chapaColaborador"));
            newElement += setNode("RUA", hAPI.getCardValue("enderecoLogradouro"));
            newElement += setNode("NUMERO", hAPI.getCardValue("enderecoNumero"));
            newElement += setNode("BAIRRO", hAPI.getCardValue("enderecoBairro"));
            newElement += setNode("CIDADE", hAPI.getCardValue("enderecoCidade"));
            newElement += setNode("ESTADO", hAPI.getCardValue("enderecoEstado"));
            newElement += setNode("CEP", hAPI.getCardValue("enderecoCep"));
            newElement += setNode("COMPLEMENTO", hAPI.getCardValue("enderecoComplemento"));
            newElement += "</PFunc></FopFunc>";

            result = saveRecord(newElement, "FopFuncData");
            result == "true" ? status = true : (function () { throw result })();
        }

        if (hAPI.getCardValue("excluiVT") == "true") {
            var xmlExcluir = "<FopHstValeTr>";
            for (var i = 1; i <= tabela; i++) {
                xmlExcluir += "<PFValeTr>"
                xmlExcluir += setNode("CODCOLIGADA", hAPI.getCardValue("idEmpresa"));
                xmlExcluir += setNode("CHAPA", hAPI.getCardValue("chapaColaborador"));
                xmlExcluir += setNode("CODLINHA", hAPI.getCardValue("codLinha___" + i));
                xmlExcluir += setNode("DTINICIO", hAPI.getCardValue("dtInicio___" + i));
                xmlExcluir += "</PFValeTr>"
            }
            xmlExcluir += "</FopHstValeTr>";
            result = deleteRecord(xmlExcluir, "FopHstValeTrData");
            String(result).replace(/[\r\n]+/g, '') == "Exclusão de registro(s) realizado com sucesso" ? status = true : (function () { throw result })();

        }
        else if (tabela > 0) {
            var newElement = "<FopHstValeTr>";
            var xmlExcluir = "<FopHstValeTr>";
            var ativar = false;
            var excluir = false;

            for (var i = 1; i <= tabela; i++) {
                var status = hAPI.getCardValue("desativar___" + i)
                var DTINICIO = hAPI.getCardValue("dtInicio___" + i) != "" ? hAPI.getCardValue("dtInicio___" + i) : hAPI.getCardValue("dataAprovacao").substr(0, 10);

                if (status == "ativo") {
                    ativar = true;
                    newElement += "<PFValeTr>"
                    newElement += setNode("CODCOLIGADA", hAPI.getCardValue("idEmpresa"));
                    newElement += setNode("CHAPA", hAPI.getCardValue("chapaColaborador"));
                    newElement += setNode("CODLINHA", hAPI.getCardValue("codLinha___" + i));
                    newElement += setNode("DTINICIO", DTINICIO);
                    newElement += setNode("NROVIAGENS", hAPI.getCardValue("quantidadeTransporte___" + i));
                    newElement += "</PFValeTr>"
                } else {
                    excluir = true;
                    xmlExcluir += "<PFValeTr>"
                    xmlExcluir += setNode("CODCOLIGADA", hAPI.getCardValue("idEmpresa"));
                    xmlExcluir += setNode("CHAPA", hAPI.getCardValue("chapaColaborador"));
                    xmlExcluir += setNode("CODLINHA", hAPI.getCardValue("codLinha___" + i));
                    xmlExcluir += setNode("DTINICIO", DTINICIO);
                    xmlExcluir += "</PFValeTr>"
                }
            }

            if (excluir) {
                xmlExcluir += "</FopHstValeTr>";
                result = deleteRecord(xmlExcluir, "FopHstValeTrData");
                String(result).replace(/[\r\n]+/g, '') == "Exclusão de registro(s) realizado com sucesso" ? status = true : (function () { throw result })();
            }
            if (ativar) {
                newElement += "</FopHstValeTr>";
                result = saveRecord(newElement, "FopHstValeTrData");
                result == "true" ? status = true : (function () { throw result })();
            }
        }

        if (hAPI.getCardValue("codValeRefeicaoNovo") != "") {

            codBeneficioAntigo = hAPI.getCardValue("codValeRefeicaoAtual") == "" ? false : hAPI.getCardValue("codValeRefeicaoAtual");
            if (codBeneficioAntigo) {
                dataBeneficioAntigo = hAPI.getCardValue("dataValeRefeicaoAtual");
                result = desvincularBeneficio(codBeneficioAntigo, dataBeneficioAntigo);
                result == "true" ? status = true : (function () { throw result })();
            }

            CODBENEFICIO = hAPI.getCardValue("codValeRefeicaoNovo");
            BENEFICIO = hAPI.getCardValue("nomeValeRefeicaoNovo");
            xml = createXmlBeneficios(CODBENEFICIO, BENEFICIO);
            result = saveRecord(xml, "RhuBenefFuncData");
            result == "true" ? status = true : (function () { throw result })();
        }
        if (hAPI.getCardValue("codPlanoOdontologicoNovo") != "") {

            codBeneficioAntigo = hAPI.getCardValue("codPlanoOdontologicoAtual") == "" ? false : hAPI.getCardValue("codPlanoOdontologicoAtual");
            if (codBeneficioAntigo) {
                dataBeneficioAntigo = hAPI.getCardValue("dataPlanoOdontologicoAtual")
                result = desvincularBeneficio(codBeneficioAntigo, dataBeneficioAntigo);
                result == "true" ? status = true : (function () { throw result })();
            }

            CODBENEFICIO = hAPI.getCardValue("codPlanoOdontologicoNovo");
            BENEFICIO = hAPI.getCardValue("nomePlanoOdontologicoNovo");
            xml = createXmlBeneficios(CODBENEFICIO, BENEFICIO);
            result = saveRecord(xml, "RhuBenefFuncData");
            result == "true" ? status = true : (function () { throw result })();
        }
        if (hAPI.getCardValue("codPrevidenciaPrivadaNovo") != "") {

            codBeneficioAntigo = hAPI.getCardValue("codPrevidenciaPrivadaAtual") == "" ? false : hAPI.getCardValue("codPrevidenciaPrivadaAtual");
            if (codBeneficioAntigo) {
                dataBeneficioAntigo = hAPI.getCardValue("dataPrevidenciaPrivadaAtual")
                result = desvincularBeneficio(codBeneficioAntigo, dataBeneficioAntigo);
                result == "true" ? status = true : (function () { throw result })();
            }

            CODBENEFICIO = hAPI.getCardValue("codPrevidenciaPrivadaNovo");
            BENEFICIO = hAPI.getCardValue("nomePrevidenciaPrivadaNovo");
            xml = createXmlBeneficios(CODBENEFICIO, BENEFICIO);
            result = saveRecord(xml, "RhuBenefFuncData");
            result == "true" ? status = true : (function () { throw result })();
        }
        if (hAPI.getCardValue("codSeguroVidaNovo") != "") {

            codBeneficioAntigo = hAPI.getCardValue("codSeguroVidaAtual") == "" ? false : hAPI.getCardValue("codSeguroVidaAtual");
            if (codBeneficioAntigo) {
                dataBeneficioAntigo = hAPI.getCardValue("dataSeguroVidaAtual")
                result = desvincularBeneficio(codBeneficioAntigo, dataBeneficioAntigo);
                result == "true" ? status = true : (function () { throw result })();
            }

            CODBENEFICIO = hAPI.getCardValue("codSeguroVidaNovo");
            BENEFICIO = hAPI.getCardValue("nomeSeguroVidaNovo");
            xml = createXmlBeneficios(CODBENEFICIO, BENEFICIO);
            result = saveRecord(xml, "RhuBenefFuncData");
            result == "true" ? status = true : (function () { throw result })();
        }

        if (hAPI.getCardValue("excluiPrevidencia") == "true") {
            codBeneficioAntigo = hAPI.getCardValue("codPrevidenciaPrivadaAtual")
            dataBeneficioAntigo = hAPI.getCardValue("dataPrevidenciaPrivadaAtual")
            result = desvincularBeneficio(codBeneficioAntigo, dataBeneficioAntigo);
            result == "true" ? status = true : (function () { throw result })();
        }
        if (hAPI.getCardValue("excluiSeguroVida") == "true") {
            codBeneficioAntigo = hAPI.getCardValue("codSeguroVidaAtual")
            dataBeneficioAntigo = hAPI.getCardValue("dataSeguroVidaAtual")
            result = desvincularBeneficio(codBeneficioAntigo, dataBeneficioAntigo);
            result == "true" ? status = true : (function () { throw result })();
        }

        return status;

    } catch (error) {
        log.info("Erro ao integrar com o RM: " + error);
        throw error;
    }
}

function createXmlBeneficios(codigo, nome) {

    var CODCOLIGADA = hAPI.getCardValue("idEmpresa");
    var CHAPA = hAPI.getCardValue("chapaColaborador");
    var DTINIVIGENCIA = formataData(hAPI.getCardValue("dataAprovacao").substr(0, 10));

    var newElement = "<VBENEFFUNC>";

    newElement += setNode("CODCOLIGADA", CODCOLIGADA);
    newElement += setNode("CHAPA", CHAPA);
    newElement += setNode("CODBENEFICIO", codigo);
    newElement += setNode("DTINIVIGENCIA", DTINIVIGENCIA);
    newElement += setNode("AUTOVINC", "0");
    newElement += setNode("BENEFICIO", nome);

    newElement += "</VBENEFFUNC>";

    return newElement;
}

function setNode(node, valor) {
    var line = createNode(node) + valor + createNode("/" + node);
    return line;
}

function createNode(node) {
    return "<" + node + ">";
}

function saveRecord(xml, dataServer) {
    log.info(" @@@@@ XML" + xml);
    var contraint = [];
    contraint.push(DatasetFactory.createConstraint("xml", xml, xml, ConstraintType.MUST));
    contraint.push(DatasetFactory.createConstraint("dataServer", dataServer, dataServer, ConstraintType.MUST));
    var saveRecord = DatasetFactory.getDataset("saveRecord_rm", null, contraint, null);

    if (saveRecord != null && saveRecord.values.length > 0) {
        var succes = saveRecord.getValue(0, "success");
        if (succes == "true") {
            log.info("Sucesso ao integrar com o RM.");
            return succes;
        } else {
            return saveRecord.getValue(0, "result");
        }

    } else {
        throw "Erro no dataset saveRecord_rm";
    }
}

function deleteRecord(xml, dataServer) {
    log.info(" @@@@@ XML" + xml);
    var contraint = [];
    contraint.push(DatasetFactory.createConstraint("xml", xml, xml, ConstraintType.MUST));
    contraint.push(DatasetFactory.createConstraint("dataServer", dataServer, dataServer, ConstraintType.MUST));
    var deleteRecord = DatasetFactory.getDataset("deleteRecord_RM", null, contraint, null);

    if (deleteRecord != null && deleteRecord.values.length > 0) {
        return deleteRecord.getValue(0, "result")

    } else {
        throw "Erro no dataset deleteRecord_RM";
    }
}



function desvincularBeneficio(codBeneficioAntigo, dataBeneficioAntigo) {

    var chapa = hAPI.getCardValue("chapaColaborador");
    var dataDesvinculacao = formataData(hAPI.getCardValue("dataAprovacao").substr(0, 10));

    var contraint = [];
    contraint.push(DatasetFactory.createConstraint("chapa", chapa, chapa, ConstraintType.MUST))
    contraint.push(DatasetFactory.createConstraint("codBeneficio", codBeneficioAntigo, codBeneficioAntigo, ConstraintType.MUST));
    contraint.push(DatasetFactory.createConstraint("dataInicio", dataBeneficioAntigo, dataBeneficioAntigo, ConstraintType.MUST));
    contraint.push(DatasetFactory.createConstraint("dataDesvinculacao", dataDesvinculacao, dataDesvinculacao, ConstraintType.MUST));
    var process = DatasetFactory.getDataset("ds_desvincular_beneficios_rm", null, contraint, null);

    if (process != null && process.values.length > 0) {

        var succes = process.getValue(0, "success");
        if (succes == "true") {
            log.info("Sucesso ao integrar com o RM." + process);
            return succes;
        } else {
            return process.getValue(0, "result");
        }

    } else {
        throw "Erro no dataset ds_desvincular_beneficios_rm";
    }
}

function formataData(data) {
    var partes = data.split("/");
    return partes[2] + "-" + partes[1] + "-" + partes[0];
}