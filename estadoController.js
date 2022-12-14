export default class EstadoController {
    constructor(CONFIG, instrucoes) {
        this.configuracao = {
            "numInstrucoes": CONFIG["nInst"], 
            "ciclos": CONFIG["ciclos"],       
            "unidades": CONFIG["unidades"]    
        };
        this.estadoInstrucoes = [];
        for(let i = 0; i < this.configuracao["numInstrucoes"]; i++) {
            let linha = {}
            linha["instrucao"] = {                      
                "operacao": instrucoes[i]["d"],
                "registradorR": instrucoes[i]["r"],
                "registradorS": instrucoes[i]["s"],
                "registradorT": instrucoes[i]["t"],
            };

            linha["posicao"] = i;                      
            linha["issue"] = null;                     
            linha["exeCompleta"] = null;               
            linha["write"] = null;                    
            this.estadoInstrucoes[i] = linha;
        
        }
        
        // cria as unidades funcionais
        this.unidadesFuncionais = {};
        for (var tipoUnidade in CONFIG["unidades"]) {
            for (let i = 0; i < CONFIG["unidades"][tipoUnidade]; i++) {
                let unidadeFuncional = {};
                unidadeFuncional["instrucao"] = null;           // armazena a instrucao que esta executando
                unidadeFuncional["estadoInstrucao"] = null;     // armazena todo o estado da instrucao
                unidadeFuncional["tipoUnidade"] = tipoUnidade;  // define o tipo da unidade funcional
                unidadeFuncional["tempo"] = null;               // salva quanto tempo ainda falta para terminar a exeucao

                let nome = tipoUnidade + (i+1);                 // cria o nome da uf
                unidadeFuncional["nome"] = nome;
                unidadeFuncional["ocupado"] = false;            // se a unidade esta ocupada ou nao

                unidadeFuncional["operacao"] = null;            // nome da instrucao que esta executando
                unidadeFuncional["vj"] = null;                  // valor de j
                unidadeFuncional["vk"] = null;                  // valor de k
                unidadeFuncional["qj"] = null;                  // uf que esta gerando j
                unidadeFuncional["qk"] = null;                  // uf que esta gerando k

                this.unidadesFuncionais[nome] = unidadeFuncional;
            }
            
        }

        // cria as unidades funcionais da memoria
        this.unidadesFuncionaisMemoria = {}
        for(var tipoUnidade in CONFIG["unidadesMem"]) {
            for(let i = 0; i < CONFIG["unidadesMem"][tipoUnidade]; i++) {
                let unidadeFuncionalMemoria = {};
                unidadeFuncionalMemoria["instrucao"] = null;            // armazana a instrucao que esta executando
                unidadeFuncionalMemoria["estadoInstrucao"] = null;      // salva todo o estado da instrucao
                unidadeFuncionalMemoria["tipoUnidade"] = tipoUnidade;   // define o tipo da unidade
                unidadeFuncionalMemoria["tempo"] = null;                // tempo que ainda falta pra instrucao acabar

                let nome = tipoUnidade + (i+1);                         //cria o nome da uf 
                unidadeFuncionalMemoria["nome"] = nome;
                unidadeFuncionalMemoria["ocupado"] = false;             // define se a uf ta ocuapda ou nao   
                unidadeFuncionalMemoria["qi"] = null;                   // uf que esta gerando o valor de vi
                unidadeFuncionalMemoria["qj"] = null;                   // uf que esta gerando o valor de vj (registrador de deslocamento)
                
                unidadeFuncionalMemoria["operacao"] = null;             // operacao que esta sendo executada
                unidadeFuncionalMemoria["endereco"] = null;             // endereco onde vai ser buscado
                unidadeFuncionalMemoria["destino"] = null;              // registrador de destino
                
                this.unidadesFuncionaisMemoria[nome] = unidadeFuncionalMemoria;
            }
        }

        this.clock = 0;
        this.estacaoRegistradores = {}
        
        for(let i = 0; i < 32; i += 2) 
            this.estacaoRegistradores["F" + i] = null;

        for(let i = 0; i < 32; i += 1) 
            this.estacaoRegistradores["R" + i] = null;
    }

    getNovaInstrucao() {
        for (let i = 0; i < this.estadoInstrucoes.length; i++) {
            const element = this.estadoInstrucoes[i];
            if(element.issue == null)
                return element;
        }
        return undefined;
    }

    verificaUFInstrucao(instrucao) {
        switch (instrucao.operacao) {
            // case 'ADDD':
            //     return 'Add'
            case 'SUB':
                return 'Add'
            case 'MULT':
                return 'Mult'
            case 'DIV':
                return 'Mult'
            case 'LD':
                return 'Load'
            case 'SD':
                return 'Store'
            case 'ADD':
                return 'Integer'
            // case 'DADDUI':
            //     return 'Integer'
            case 'BEQ':
                return 'Integer'
            // case 'BNEZ':
            //     return 'Integer'
        }
    }

    getFUVazia(tipoFU) {
        if ((tipoFU === 'Load') || (tipoFU === 'Store')) {
            for(let key in this.unidadesFuncionaisMemoria) {
                var ufMem = this.unidadesFuncionaisMemoria[key];
                if (ufMem.tipoUnidade === tipoFU) {
                    if (!ufMem.ocupado) {
                        return ufMem;
                    }
                }
            }
            return undefined;
        }

        for(let key in this.unidadesFuncionais) {
            var uf = this.unidadesFuncionais[key];
            if (uf.tipoUnidade === tipoFU) {
                if (!uf.ocupado) {
                    return uf;
                }
            }
        }
        return undefined;
    }

    getCiclos(instrucao) {
    // Funcao que busca na configuracao a quantidade de ciclos gastas em cada instrucao
        switch (instrucao.operacao) {
            // case 'ADDD':
            //     return parseInt(this.configuracao.ciclos['Add']);
            case 'SUB':
                return parseInt(this.configuracao.ciclos['Add']);
            case 'MULT':
                return parseInt(this.configuracao.ciclos['Mult']);
            case 'DIV':
                return parseInt(this.configuracao.ciclos['Div']);
            case 'LD':
                return parseInt(this.configuracao.ciclos['Load']);
            case 'SD':
                return parseInt(this.configuracao.ciclos['Store']);
            case 'ADD':
                return parseInt(this.configuracao.ciclos['Integer']);
            // case 'DADDUI':
            //     return parseInt(this.configuracao.ciclos['Integer']);
            case 'BEQ':
                return parseInt(this.configuracao.ciclos['Integer']);
            // case 'BNEZ':
            //     return parseInt(this.configuracao.ciclos['Integer']);
        }
    }

    alocaFuMem(uf, instrucao, estadoInstrucao) {
    // Funcao que aloca uma unidade funcional de memória para uma instrucao
        uf.instrucao = instrucao;
        uf.estadoInstrucao = estadoInstrucao;
        uf.tempo = this.getCiclos(instrucao) + 1; // salva o número de ciclos + 1 uma vez que quando estiver livre, nao execute um ciclo a menos (possivel execucao apos o issue)
        uf.ocupado = true;
        uf.operacao = instrucao.operacao;
        uf.endereco = instrucao.registradorS + '+' + instrucao.registradorT;
        uf.destino = instrucao.registradorR;
        uf.qi = null;
        uf.qj = null;

        // caso a instrucao seja de store, verifica se tem que esperar a uf escrever no registrador que vai salvar
        if (instrucao.operacao === 'SD') {
            // busca no banco de registradores qual o valor que esta escrito (VAL(UF)-execucao completa; UF-execucao pendente)
            let UFQueTemQueEsperar = this.estacaoRegistradores[instrucao.registradorR];

            // caso o nome seja de uma das unidades funcionais, marca que tem que esperar ela
            if ((UFQueTemQueEsperar in this.unidadesFuncionais) || (UFQueTemQueEsperar in this.unidadesFuncionaisMemoria))
                uf.qi = UFQueTemQueEsperar;
            else
                uf.qi = null;
        }

        // verifica se tem que esperar a uf de inteiros escrever o valor do registrador de deslocamento
        // busca no banco de registradores qual o valor que esta escrito (VAL(UF)-execucao completa; UF-execucao pendente)
        let UFintQueTemQueEsperar = this.estacaoRegistradores[instrucao.registradorT];

        // caso o nome seja de uma das unidades funcionais, marca que tem que esperar ela
        if ((UFintQueTemQueEsperar in this.unidadesFuncionais) || (UFintQueTemQueEsperar in this.unidadesFuncionaisMemoria))
            uf.qj = UFintQueTemQueEsperar;
        else
            uf.qj = null;
    }

    escreveEstacaoRegistrador(instrucao, ufNome) {
    // funcao que escreve no banco de registradores a uf que vai escrever naquele registrador
        this.estacaoRegistradores[instrucao.registradorR] = ufNome;
    }

    alocaFU(uf, instrucao, estadoInstrucao) {
    // funcao que aloca uma unidade funcional
        uf.instrucao = instrucao;
        uf.estadoInstrucao = estadoInstrucao;
        uf.tempo = this.getCiclos(instrucao) + 1; // é somado 1 pq vai ser subtraido 1 na fase de execucao apos isso 
        uf.ocupado = true;
        uf.operacao = instrucao.operacao;

        let reg_j;
        let reg_k;
        let reg_j_inst;
        let reg_k_inst;

        // caso seja uma das instrucoes condicionais
        if ((instrucao.operacao === 'BNEZ') || (instrucao.operacao === 'BEQ')) {
            reg_j = this.estacaoRegistradores[instrucao.registradorR];   // busca o nome da uf q esta usando o registrador r
            reg_k = this.estacaoRegistradores[instrucao.registradorS];   // busca o nome da uf q esta usando o registrador s

            reg_j_inst = instrucao.registradorR;                         // salva o nome dos registradores que veio da instrucao
            reg_k_inst = instrucao.registradorS;
        } else {
            reg_j = this.estacaoRegistradores[instrucao.registradorS];   // busca o nome da uf q esta usando o registrador s
            reg_k = this.estacaoRegistradores[instrucao.registradorT];   // busca o nome da uf q esta usando o registrador t

            reg_j_inst = instrucao.registradorS;                         // salva o nome dos registradores que veio da instrucao
            reg_k_inst = instrucao.registradorT;
        }

        // se o registrador j e nulo (ninguem usou ele) ou nao definido (label), usa como valor o registrador que veio da instrucao
        if (reg_j === null || reg_j === undefined)
            uf.vj = reg_j_inst;
        else {
            // caso o nome seja uma unidade funcional, este registrador vai ter o valor escrito ainda, entao tem que esperar
            if ((reg_j in this.unidadesFuncionais) || (reg_j in this.unidadesFuncionaisMemoria))
                uf.qj = reg_j;
            else
                uf.vj = reg_j;
        }

        // se o registrador k e nulo (ninguem usou ele) ou nao definido (label), usa como valor o registrador que veio da instrucao
        if (reg_k === null || reg_k === undefined)
            uf.vk = reg_k_inst;
        else {
            // caso o nome seja uma unidade funcional, este registrador vai ter o valor escrito ainda, entao tem que esperar
            if ((reg_k in this.unidadesFuncionais) || (reg_k in this.unidadesFuncionaisMemoria))
                uf.qk = reg_k;
            else
                uf.vk = reg_k;
        }
    }


    liberaUFEsperandoResultado(UF) {
    // funcao que libera as uf que esta esperando essa terminar

        // percorre todas as unidades funcionais
        for(let keyUF in this.unidadesFuncionais) {
            const ufOlhando = this.unidadesFuncionais[keyUF];
            
            // se a unidade esta ocupada e o esta esperando esta uf em qj ou qk
            if ((ufOlhando.ocupado === true) && 
               ((ufOlhando.qj === UF.nome) || 
               (ufOlhando.qk === UF.nome))) {

                // olha se esta esperando em qj, se estiver
                if (ufOlhando.qj === UF.nome) {
                    ufOlhando.vj = 'VAL(' + UF.nome + ')';   // escreve como vj o valor da uf
                    ufOlhando.qj = null;                     // retira a espera em qj
                }

                // olha se esta esperando em qk, se estiver
                if (ufOlhando.qk === UF.nome) {
                    ufOlhando.vk = 'VAL(' + UF.nome + ')';   // escreve como vj o valor da uf
                    ufOlhando.qk = null;                     // retira a espera em qj
                }

                // caso a unidade nao esteja mais esperando ninguem, retira o ciclo extra que foi adicionado
                if ((ufOlhando.qj === null) && (ufOlhando.qk === null)) {
                    ufOlhando.tempo = ufOlhando.tempo - 1; // subtrai 1 pq tira aquele valor q tava sobrando quando foi colocado
                }
            }
        }

        // percorre todas as unidades funcionais de memoria
        for(let keyUF in this.unidadesFuncionaisMemoria) {
            const ufOlhando = this.unidadesFuncionaisMemoria[keyUF];
            
            // se unidade estiver ocuapda
            if (ufOlhando.ocupado === true) {
                // caso esteja esperando a unidade, libera ela e subtrai o ciclo extra
                if (ufOlhando.qi === UF.nome) {
                    ufOlhando.qi = null;
                    ufOlhando.tempo = ufOlhando.tempo - 1;
                } else if (ufOlhando.qj === UF.nome) {
                    ufOlhando.qj = null;
                    ufOlhando.tempo = ufOlhando.tempo - 1;
                }
            }
        }
    }

    desalocaUnidadeFuncionalMem(ufMem) {
    // funcao que desaloca (limpa os campos) das unidades funcionais de memoria
        ufMem.instrucao = null;
        ufMem.estadoInstrucao = null;
        ufMem.tempo = null;
        ufMem.ocupado = false;
        ufMem.operacao = null;
        ufMem.endereco = null;
        ufMem.destino = null;
        ufMem.qi = null;
        ufMem.qj = null;
    }

    desalocaUnidadeFuncional(unidadeFuncional) {
        unidadeFuncional.instrucao = null;
        unidadeFuncional.estadoInstrucao = null;
        unidadeFuncional.tempo = null;
        unidadeFuncional.ocupado = false;
        unidadeFuncional.operacao = null;
        unidadeFuncional.vj = null;
        unidadeFuncional.vk = null;
        unidadeFuncional.qj = null;
        unidadeFuncional.qk = null;
    }

    verficaTermino() {
        let qtdInstrucaoNaoTerminada = 0;
        for (let i = 0; i < this.estadoInstrucoes.length; i++) {
            const elemento = this.estadoInstrucoes[i];
            if (elemento.write === null)
                qtdInstrucaoNaoTerminada++;
        }
        return qtdInstrucaoNaoTerminada > 0 ? false : true;
    }

    despachaNovaInstrucao() {
    // funcao da fase de issue do tomasulo

        let novaInstrucao = this.getNovaInstrucao();  // busca uma nova instrucao

        // se existe uma nova instrucao pra executar o issue
        if (novaInstrucao) {
            let ufInstrucao = this.verificaUFInstrucao(novaInstrucao.instrucao);  // verifica qual unidade essa instrucao usa
            let UFParaUsar = this.getFUVazia(ufInstrucao);                        // pega a primeira unidade disponivel
            
            // caso exista uma unidade livre, caso contrario, nao faz nada (bolha)
            if (UFParaUsar) {
                // se a unidade e de memoria, aloca uma unidade de memoria, caso contrario uma unidade normal
                if ((UFParaUsar.tipoUnidade == 'Load') || (UFParaUsar.tipoUnidade == 'Store'))
                    this.alocaFuMem(UFParaUsar, novaInstrucao.instrucao, novaInstrucao);
                else
                    this.alocaFU(UFParaUsar, novaInstrucao.instrucao, novaInstrucao);
                
                // escreve em qual ciclo o issue aconteceu
                novaInstrucao.issue = this.clock;

                // caso a instrucao tenha escrita no registrador de destino, esqueve
                if ((UFParaUsar.tipoUnidade !== 'Store') && (UFParaUsar.operacao !== 'BEQ') && (UFParaUsar.operacao !== 'BEQ'))
                    this.escreveEstacaoRegistrador(novaInstrucao.instrucao, UFParaUsar.nome);
            }
        }
    }

    executaInstrucao() {
    // funcao da fase de execucao do tomasulo

        // percorre todas as unidades funcionais da memoria
        for(let key in this.unidadesFuncionaisMemoria) {
            var ufMem = this.unidadesFuncionaisMemoria[key];

            // caso a unidade esteja ocupada e nao esteja esperando ninguem
            if ((ufMem.ocupado === true) && (ufMem.qi === null) && (ufMem.qj === null)) {
                ufMem.tempo = ufMem.tempo - 1;   // decrementa um ciclo para o termino da execucao

                // caso o tempo chegou a 0, escreve em qual ciclo a execucao terminou
                if (ufMem.tempo === 0) {
                    ufMem.estadoInstrucao.exeCompleta = this.clock;
                }
            }
        }

        // percorre todas as unidades funcionais
        for(let key in this.unidadesFuncionais) {
            var uf = this.unidadesFuncionais[key];

            // caso a unidade esteja ocupada e nao esteja esperando ninguem
            if ((uf.ocupado === true) && (uf.vj !== null) && (uf.vk !== null)) {
                uf.tempo = uf.tempo - 1;   // decrementa um ciclo para o termino da execucao

                // caso o tempo chegou a 0, escreve em qual ciclo a execucao terminou
                if (uf.tempo === 0) {
                    uf.estadoInstrucao.exeCompleta = this.clock;
                }
            }
        }
    }

    escreveInstrucao() {
    // fase de escrita do tomasulo

        // percorre todas as unidades funcionais de memoria
        for(let key in this.unidadesFuncionaisMemoria) {
            const ufMem = this.unidadesFuncionaisMemoria[key];

            // caso a unidade esteja ocupada e o tempo for -1
            if (ufMem.ocupado === true) {
                if (ufMem.tempo === -1) {
                    ufMem.estadoInstrucao.write = this.clock;   //escreve em qual ciclo escreveu no registrador

                    // verifica qual é o nome que esta na estacao de registradores
                    let valorReg = this.estacaoRegistradores[ufMem.instrucao.registradorR];

                    // se nenhuma outra uf vai escrever sobre o registrador, escreve nele
                    if (valorReg === ufMem.nome) {
                        this.estacaoRegistradores[ufMem.instrucao.registradorR] = 'VAL(' + ufMem.nome + ')';
                    }

                    // libera as ufs que esta esperando essa terminar e desaloca essa uf
                    this.liberaUFEsperandoResultado(ufMem);
                    this.desalocaUnidadeFuncionalMem(ufMem);
                }
            }
        }

        // percorre todas as unidades funcionais
        for(let key in this.unidadesFuncionais) {
            const uf = this.unidadesFuncionais[key];

            // caso a unidade esteja ocupada e o tempo for -1
            if (uf.ocupado === true) {
                if (uf.tempo === -1) {
                    uf.estadoInstrucao.write = this.clock;   //escreve em qual ciclo escreveu no registrador

                    // verifica qual é o nome que esta na estacao de registradores
                    let valorReg = this.estacaoRegistradores[uf.instrucao.registradorR];

                    // se nenhuma outra uf vai escrever sobre o registrador, escreve nele
                    if (valorReg === uf.nome) {
                        this.estacaoRegistradores[uf.instrucao.registradorR] = 'VAL(' + uf.nome + ')';
                    }

                    // libera as ufs que esta esperando essa terminar e desaloca essa uf
                    this.liberaUFEsperandoResultado(uf);
                    this.desalocaUnidadeFuncional(uf);
                }
            }
        }
    }

    log(mostra_log){
        if(mostra_log){
            console.log('Estado instrução:');
            console.log(JSON.stringify(this.estadoInstrucoes, null, 2));
    
            console.log('\nUnidades Funcionais memória:');
            console.log(JSON.stringify(this.unidadesFuncionaisMemoria, null, 2));
    
            console.log('\nUnidades Funcionais:');
            console.log(JSON.stringify(this.unidadesFuncionais, null, 2));
    
            console.log('Estado registradores:');
            console.log(JSON.stringify(this.estacaoRegistradores, null, 2));
        }
    }

    executa() {
        this.clock++; 
        this.despachaNovaInstrucao();
        this.executaInstrucao();
        this.escreveInstrucao();
        this.log(false)
        return this.verficaTermino();
    }

}