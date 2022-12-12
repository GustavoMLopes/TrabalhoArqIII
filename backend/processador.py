from instrucao import *
from estacoes_reserva import *

class Processador:
    def __init__(self, quant_registradores = 16, quant_somadores = 3, quant_multiplicadores = 2, quant_mem = 2):
        self.clock = 0
        self.fila_instrucoes = []
        self.rs_somadores = [RSSomador('ADD' + str(i)) for i in range(quant_somadores)]
        self.rs_multiplicadores = [RSMultiplicador('MULT' + str(i)) for i in range(quant_multiplicadores)]
        self.rs_memoria = [RSMem('LOAD' + str(i)) for i in range(quant_mem)]

        self.banco_registradores = [None for i in range(quant_registradores)]
        self.indices_registradores = {}
        
        for i in range(quant_registradores):
            self.indices_registradores['R' +str(i)] = i
    
    def atualiza_clock(self, update = 1):
        self.clock += update
    
    def insere_fila(self, nova_instrucao):
        self.fila_instrucoes.append(nova_instrucao)

    def mostra_fila(self):
        print('\n*** Fila de Instrucoes ***')
        print('[')
        for i in range(len(self.fila_instrucoes) - 1):
            print('  ' + self.fila_instrucoes[i].__str__())
        print('  ' + self.fila_instrucoes[-1].__str__())
            
        print(']')
    def mostra_estacoes_reserva(self):
        print('\n\n *** Estacoes de reserva dos somadores ***')
        for estacao in self.rs_somadores:
            print(estacao)

        print('\n\n *** Estacoes de reserva de multiplicadores ***')
        for estacao in self.rs_multiplicadores:
            print(estacao)
        
        print('\n\n *** Estacoes de reserva de memoria ***')
        for estacao in self.rs_memoria:
            print(estacao)

    def despacho(self):
        for instrucao in self.fila_instrucoes:
            disponivel, rs = self.rs_disponivel(instrucao)
            if(disponivel):
                rs.ocupado = True
                self.fila_instrucoes.remove(instrucao)
            else:
                instrucao.stall = True
                
    def rs_disponivel(self, instrucao):
        if instrucao.op_code == 'ADD' or instrucao.op_code == 'SUB':
            for rs in self.rs_somadores:
                if not rs.ocupado:
                    return True, rs
        
        elif instrucao.op_code == 'LW' or instrucao.op_code == 'SW':
            for rs in self.rs_memoria:
                if not rs.ocupado:
                    return True, rs

        elif instrucao.op_code == 'MUL' or instrucao.op_code == 'DIV':
            for rs in self.rs_multiplicadores:
                if not rs.ocupado:
                    return True, rs
        return False, None
    def exec():
        pass