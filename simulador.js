import EstadoController from "./estadoController.js"

function configura() {
    const ciclos = {};
    var unidades = {};
    const configuracoes = {};

    configuracoes["nInst"] = $("#nInst").val();
    
    if(configuracoes["nInst"] < 1) {
        alert("Quantidade de instrucoes inválida!");
        return null;
    }


    ciclos["Integer"] = $("#ciclosInt").val();
    ciclos["Add"] = $("#ciclosFPAdd").val();
    ciclos["Mult"] = $("#ciclosFPMul").val();
    ciclos["Div"] = $("#ciclosFPDiv").val();
    ciclos["Load"] = $("#ciclosLoad").val();
    ciclos["Store"] = $("#ciclosStore").val();


    if ((ciclos["Integer"] <= 0) || (ciclos["Add"] <= 0) || (ciclos["Div"] <= 0) ||
        (ciclos["Mult"] <= 0) || (ciclos["Load"] <= 0)  || (ciclos["Store"] <= 0)) {
        alert("Quantidade de ciclos inválida");
        return null;
    }

    configuracoes["ciclos"] = ciclos

    unidades["Integer"] = $("#fuInt").val();
    unidades["Add"] = $("#fuFPAdd").val();
    unidades["Mult"] = $("#fuFPMul").val();
    
    if ((unidades["Integer"] < 1) || (unidades["Add"] < 1) ||
    (unidades["Mult"] < 1)) {
        alert("Quantidade de unidades funcionais inválida!");
        console.log("Erro na criacao de unidades funcionais");
        return;
    }
    
    var unidadesLS = {}//load store
    unidadesLS["Load"] = $("#fuLoad").val();
    unidadesLS["Store"] = $("#fuStore").val();


    if(unidades["Load"] < 1 || unidadesLS["Store"] < 1) {
        alert("A quantidade de unidades funcionais de memória deve ser no mínimo 1!");
        console.log("Erro na criacao dos clocks");
        return;
    }


    configuracoes["unidades"] = unidades;
    configuracoes["unidadesMem"] = unidadesLS;
    return configuracoes;
}

function getInst(i) {
    var inst = {};
    inst["indice"] = i;
    inst["d"] = $(`#D${i}`).val();
    inst["r"] = $(`#R${i}`).val();
    inst["s"] = $(`#S${i}`).val();
    inst["t"] = $(`#T${i}`).val();

    return inst;
}

//Alerta padrão para entradas inválidas das instruções
function alertValidaInstrucao(instrucao) {
    let saida = "A instrução \n";
    saida += instrucao["d"] + " " + instrucao["r"] + ", ";
    saida += instrucao["s"] + ", " + instrucao["t"];
    saida += " não atende os paramêtros do comando " + instrucao["d"];
    alert(saida);
}

function numeroEhInteiro(numero) {
    var valor = parseInt(numero);
    if (valor != numero){
        return false;
    }
    return true;
}

function registradorInvalidoR(registrador) {
	 return (registrador[0] != 'R' || registrador.replace("R", "") == "" || isNaN(registrador.replace("R", "")))
            || !(numeroEhInteiro(registrador.replace("R", "")));
}

function registradorInvalidoF(registrador) {
    return (registrador[0] != 'F' || registrador.replace("F", "") == "" ||
        registrador.replace("F", "") % 2 != 0 || registrador.replace("F", "") > 30) ||
        !numeroEhInteiro(registrador.replace("F", ""));
}

function validaInstrucao(instrucao) {
    var unidade = getUnidadeFuncional(instrucao["d"]);
    if(!unidade) {
        alert("O comando da instrução é inváilido");
        return false;
    }

    if(unidade == "Load" || unidade == "Store") {
        var comando = instrucao["d"]

        if(comando == "LD" || comando == "SD") {
            if(registradorInvalidoF(instrucao["r"]) || isNaN(parseInt(instrucao["s"])) || registradorInvalidoR(instrucao["t"])) {
                alertValidaInstrucao(instrucao);
                return false;
            }
            return true;
        }
    }

    if(unidade == "Integer") {
        var comando = instrucao["d"]

        if(comando == "BEQ") {
            if(registradorInvalidoR(instrucao["r"]) || registradorInvalidoR(instrucao["s"]) || (instrucao["t"].replace(" ", "") == "")) {
                alertValidaInstrucao(instrucao);
                return false;
            }
            return true;
        }
        if(comando == "BNEZ") {
            if(registradorInvalidoR(instrucao["r"]) || (instrucao["s"].replace(" ", "") == "") || (instrucao["t"].replace(" ", "") != "")) {
                alertValidaInstrucao(instrucao);
                return false;
            }
            return true;
        }
        if(comando == "ADD") {
            if(registradorInvalidoR(instrucao["r"]) || registradorInvalidoR(instrucao["s"]) || registradorInvalidoR(instrucao["t"])) {
                alertValidaInstrucao(instrucao);
                return false;
            }
            return true;
        }
        if(comando == "DADDUI") {
            if(registradorInvalidoR(instrucao["r"]) || registradorInvalidoR(instrucao["s"]) || isNaN(parseInt(instrucao["t"]))) {
                alertValidaInstrucao(instrucao);
                return false;
            }
        }
        return true;
    }

    if(registradorInvalidoF(instrucao["r"]) || registradorInvalidoF(instrucao["s"]) || registradorInvalidoF(instrucao["t"])) {
        alertValidaInstrucao(instrucao);
        return false;
    }
    return true;

}

function getAllInst(quantidadeInstrucoes) {
    const instrucoes = []
    for (let i = 0; i < quantidadeInstrucoes; i++) {
        const instrucao = getInst(i);
        if(validaInstrucao(instrucao) == false) 
            return null;
        instrucoes.push(instrucao);
    }
    return instrucoes;
}

function getUnidadeFuncional(instrucao) {
    switch (instrucao) {
        case "ADD":
            return "Integer";
        case "DADDUI":
            return "Integer";
        case "BEQ":
            return "Integer";
        case "BNEZ":
            return "Integer";

        case "SD":
            return 'Store';
        case "LD":
            return "Load";


        case "SUBD":
            return "Add";
        case "ADDD":
            return "Add";

        case "MULTD":
            return "Mult";
        case "DIVD":
            return "Mult";

        default:
            return null
    }
}

function atualizaTabelaEstadoInstrucaoHTML(tabelaInsts) {
    for(let i in tabelaInsts) {
        const inst = tabelaInsts[i];
        $(`#i${inst["posicao"]}_is`).text(inst["issue"] ? inst["issue"] : "");
        $(`#i${inst["posicao"]}_ec`).text(inst["exeCompleta"] ? inst["exeCompleta"] : "");
        $(`#i${inst["posicao"]}_wr`).text(inst["write"] ? inst["write"] : "");
    }
}

function atualizaTabelaEstadoUFHTML(ufs) {
    for(let i in ufs) {
        const uf = ufs[i];
        $(`#${uf["nome"]}_tempo`).text((uf["tempo"] !== null) ? uf["tempo"] : "");
        $(`#${uf["nome"]}_ocupado`).text((uf["ocupado"]) ? "sim" : "não");
        $(`#${uf["nome"]}_operacao`).text(uf["operacao"] ? uf["operacao"] : "");
        $(`#${uf["nome"]}_vj`).text(uf["vj"] ? uf["vj"] : "");
        $(`#${uf["nome"]}_vk`).text(uf["vk"] ? uf["vk"] : "");
        $(`#${uf["nome"]}_qj`).text(((uf["qj"]) && (uf["qj"] !== 1)) ? uf["qj"] : "");
        $(`#${uf["nome"]}_qk`).text(((uf["qk"]) && (uf["qk"] !== 1)) ? uf["qk"] : "");
    }
}

function atualizaTabelaEstadoMenHTML(men) {
    for (var reg in men) {
        $(`#${reg}`).html(men[reg] ? men[reg] : "&nbsp;");
    }
}

function updateClock(clock) {
    $("#clock").html("<h3>Ciclo: <small id='clock'>" + clock + "</small></h3>");
}

function gerarTabelaEstadoInstrucaoHTML(estado) {
    var s = (
        "<h3>Instruções</h3><table class='result'>"
        + "<tr><th></th><th>Instrução</th><th>i</th><th>j</th>"
        + "<th>k</th><th>Issue</th><th>Exec.<br>Completa</th><th>Write</th></tr>"
    );

    for (let i = 0 ; i < estado.configuracao["numInstrucoes"]; ++i) {
        let instrucao = estado.estadoInstrucoes[i].instrucao;
        s += (
            `<tr> <td>I${i}</td> <td>${instrucao["operacao"]}</td>
            <td>${instrucao["registradorR"]}</td> <td>${instrucao["registradorS"]}</td> <td>${instrucao["registradorT"]}</td>
            <td id='i${i}_is'></td></td> <td id='i${i}_ec'></td>
            <td id='i${i}_wr'></td> </tr>`
        );
    }

    s += "</table>";
    $("#estadoInst").html(s);
}

function gerarTabelaEstadoUFHTML(estado) {
    var s = (
        "<h3>Estações de Reserva</h3><table class='result'><tr> <th>Tempo Restante</th> <th>UF</th> <th>Ocupado</th>"
        + "<th>OP</th> <th>Vj</th> <th>Vk</th> <th>Qj</th> <th>Qk</th>"
    );
    
    let unidadesFuncionais = estado.unidadesFuncionais;
    for(let key in unidadesFuncionais) {
        var uf = unidadesFuncionais[key];

        s += `<tr><td id="${uf["nome"]}_tempo"></td>
             <td>${uf["nome"]}</td> <td id="${uf["nome"]}_ocupado"></td>
             <td id="${uf["nome"]}_operacao"></td>
             <td id="${uf["nome"]}_vj"></td> <td id="${uf["nome"]}_vk"></td>
             <td id="${uf["nome"]}_qj"></td> <td id="${uf["nome"]}_qk"></td>
             `
    }

    s += "</table>"
    $("#estadoUF").html(s);
}

function gerarTabelaEstadoMenHTML() {
    var s = `<h3>Registradores</h3> <table class="result">`;

    for(var i = 0; i < 2; ++i) {
        s += `<tr>`
        for(var j = 0; j < 16; j += 2) {
            s += `<th>F${j+i*16}</th>`
        }
        s += `</tr> <tr>`
        for(var j = 0; j < 16; j += 2) {
            s += `<td id="F${j+i*16}">&nbsp;</td>`
        }
        s += `</tr>`
    }

    s += "</table>"
    $("#estadoMem").html(s);
}

function gerarTabelaEstadoUFMem(diagrama) {
    var s = (
        "<h3>Estações de Reserva de Memória</h3><table class='result'>"
        + "<tr><th>Tempo Restante</th><th>OP</th><th>Ocupado</th><th>A</th>"
        + "<th>Destino</th>"
    );
    for(let key in diagrama.unidadesFuncionaisMemoria) {
        var ufMem = diagrama.unidadesFuncionaisMemoria[key];

        s += `<tr><td id="${ufMem["nome"]}_tempo"></td>
             <td>${ufMem["nome"]}</td> <td id="${ufMem["nome"]}_ocupado"></td>
             <td id="${ufMem["nome"]}_endereco"></td><td id="${ufMem["nome"]}_destino"></td>
             `
    }
    s += "</table>"
    $("#estadoMemUF").html(s);
}

function atualizaTabelaEstadoUFMemHTML(ufsMem) {
    for(let key in ufsMem) {
        const ufMem = ufsMem[key];
        $(`#${ufMem["nome"]}_tempo`).text((ufMem["tempo"] !== null) ? ufMem["tempo"] : "");
        $(`#${ufMem["nome"]}_ocupado`).text((ufMem["ocupado"]) ? "sim" : "não");
        $(`#${ufMem["nome"]}_operacao`).text(ufMem["operacao"] ? ufMem["operacao"] : "");
        $(`#${ufMem["nome"]}_endereco`).text(ufMem["endereco"] ? ufMem["endereco"] : "");
        $(`#${ufMem["nome"]}_destino`).text(ufMem["destino"] ? ufMem["destino"] : "");
    }
}

function geraTabelaParaInserirInstrucoes(nInst) {
    var tabela = "<table id='tabelaInst'>"
        for(var i = 0; i < nInst; i++) {
            var d = "D" + i;
            var r = "R" + i;
            var s = "S" + i;
            var t = "T" + i;
            tabela += (
                "<tr>" +
                    "<td>" +
                        "<select size=\"1\" name=\"" + d + "\" id=\"" + d + "\">" +
                        "<option selected value = \"\">None</option>" +
                        "<option value=\"LD\">LD</option>" +
                        "<option value=\"SD\">SD</option>" +
                        "<option value=\"MULTD\">MULTD</option>" +
                        "<option value=\"DIVD\">DIVD</option>" +
                        "<option value=\"ADDD\">ADDD</option>" +
                        "<option value=\"SUBD\">SUBD</option>" +
                        "<option value=\"ADD\">ADD</option>" +
                        "<option value=\"DADDUI\">DADDUI</option>" +
                        "<option value=\"BEQ\">BEQ</option>" +
                        "<option value=\"BNEZ\">BNEZ</option>" +
                    "</td>" +
                    "<td><input type=\"text\" name=\""+ r + "\" id=\""+ r + "\" size=\"3\" maxlength=\"3\" /></td>" +
                    "<td><input type=\"text\" name=\""+ s + "\" id=\""+ s + "\" size=\"3\" maxlength=\"5\" /></td>" +
                    "<td><input type=\"text\" name=\""+ t + "\" id=\""+ t + "\" size=\"3\" maxlength=\"3\" /></td>" +
                "</tr>"
            );
        }
        tabela += "</table>";
        $("#listaInstrucoes").html(tabela);
}

function confirmarNInst() {
    var nInst = $("#nInst").val();
    if(nInst < 1) {
        alert("O número de instruções deve ser no mínimo 1");
        return false;
    }
    geraTabelaParaInserirInstrucoes(nInst);
    return true;
}

function verificaQuantidadeInstrucoes() {
    var tds = $("#tabelaInst").children('tbody').children('tr').length;
    $("#nInst").val(tds);
}

function resetCampoInput() {
    $("#exemploSelect").val("---");

    $("#nInst").val(1);
    $("#listaInstrucoes").html("");

    $("#ciclosInt").val(1);
    $("#ciclosFPAdd").val(1);
    $("#ciclosFPMul").val(1);
    $("#ciclosFPDiv").val(1);

    $("#fuStore").val(1);
    $("#fuLoad").val(1);
    $("#fuInt").val(1);
    $("#fuFPAdd").val(1);
    $("#fuFPMul").val(1);

    $("#clock").html("");
    $("#estadoInst").html("");
    $("#estadoMemUF").html("");
    $("#estadoUF").html("");
    $("#estadoMem").html("");
}

function carregaExemplo() {
    const exemplo = $("#exemploSelect").val();
    $.getJSON(`./exemplos/ex${exemplo}.json`)
      .fail(() => alert("Falha ao carregar o exemplo!"))
      .done(function(data) {
        $("#nInst").val(data["insts"].length);
        confirmarNInst();
        for (var i = 0; i < data["insts"].length; i++) {
           $(`#D${i}`).val(data["insts"][i]["D"]);
           $(`#R${i}`).val(data["insts"][i]["R"]);
           $(`#S${i}`).val(data["insts"][i]["S"]);
           $(`#T${i}`).val(data["insts"][i]["T"]);
        }
        
        for (var key in data["config"]["ciclos"]) {
           $(`#${key}`).val(parseInt(data["config"]["ciclos"][key]));
        }

        for (var key in data["config"]["unidades"]) {
            $(`#${key}`).val(parseInt(data["config"]["unidades"][key]));
        }
    });
}

//---------------- configurações ou atualizações nas tabelas -----------
function configuraTabelasEnvio(estado){
    gerarTabelaEstadoInstrucaoHTML(estado);
    atualizaTabelaEstadoInstrucaoHTML(estado["tabela"])
    gerarTabelaEstadoUFHTML(estado);
    atualizaTabelaEstadoUFHTML(estado["uf"]);
    gerarTabelaEstadoMenHTML();
    gerarTabelaEstadoUFMem(estado);
    atualizaTabelaEstadoUFMemHTML(estado["ufMem"]);
}

function configuraTabelasTrocaEstado(estado){
    atualizaTabelaEstadoInstrucaoHTML(estado.estadoInstrucoes);
    atualizaTabelaEstadoUFMemHTML(estado.unidadesFuncionaisMemoria);
    atualizaTabelaEstadoUFHTML(estado.unidadesFuncionais);
    atualizaTabelaEstadoMenHTML(estado.estacaoRegistradores);
}

function configuraTabelasResultado(estado){
    atualizaTabelaEstadoInstrucaoHTML(estado.estadoInstrucoes);
    atualizaTabelaEstadoUFMemHTML(estado.unidadesFuncionaisMemoria);
    atualizaTabelaEstadoUFHTML(estado.unidadesFuncionais);
    atualizaTabelaEstadoMenHTML(estado.estacaoRegistradores);
}
//--------------------------------------------------------------------

function startSimulacao(){
    //jquery
    $(document).ready(() => {
        let estado = null;
        //variáveis de controle do fluxo da simulação
        let fimExecucao = false;
        let instrucoesConfirmadas = false;

        //caso o botão de resetar os campos seja clicado
        $("#limpar").click(()=>  resetCampoInput());
        //caso o botão de confirmação das instruções seja clicado
        $("#confirmarNInst").click(()=>  instrucoesConfirmadas = confirmarNInst());
        //caso o botão de load do exemplo seja clicado
        $("#carregaExemplo").click(function() {
            carregaExemplo();
            instrucoesConfirmadas = true;
        });
        //caso o botão de gerar o estado final seja clicado
        $("#resultado").click(() => {
            if(!estado) {
                alert("As instruções devem ser submetidas");
                return;
            }
            while(fimExecucao == false) {
                fimExecucao = estado.executa();
                configuraTabelasResultado(estado);
                updateClock(estado.clock);
            }
        });
        //caso o botão de próximo estado seja clicado
        $("#proximo").click(() => {
            if(!estado) {
                alert("As instruções devem ser submetidas");
                return;
            }
            else if(fimExecucao) {
                alert("Todas as instruções finalizadas.");
                return;
            }
        
            fimExecucao = estado.executa();
            configuraTabelasTrocaEstado(estado);
            updateClock(estado.clock);
        });
        //caso o botão de envio das instruções seja clicado
        $("#enviar").click(() => {
            fimExecucao = false;
            if(instrucoesConfirmadas == false) {
                alert("Confirme o número de instruções!");
                return;
            }
            verificaQuantidadeInstrucoes();
            const configuracoes = configura();
            //Houve erro na insercao de algum input
            if(!configuracoes) 
                return;
            //Nao houve erro na insercao de algum input

            const instsrucoes = getAllInst(configuracoes["nInst"]);
            if(!instsrucoes) {
                return;
            }
            estado = new EstadoController(configuracoes, instsrucoes);
            configuraTabelasEnvio(estado)
            
            $("#clock").html("<h3>Ciclo: <small id='clock'>0</small></h3>");
        });
    });
}
startSimulacao();