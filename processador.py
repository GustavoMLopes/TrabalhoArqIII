class Processador:
    def __init__(self, quant_somadores = 3, quant_multiplicadores = 2):
        self.clock = 0
        self.fila_instrucoes = []
        self.banco_registradores = []
        self.somadores = []
        self.multiplicadores = []
        #for i in range(quant_multiplicadores)
    
    def update_clock(self, update = 1):
        self.clock += update
    
    def inserir_fila(self, nova_instrucao):
        self.fila_instrucoes.append(nova_instrucao)

    def visualiza_fila(self):
        print('[')
        for instrucao in self.fila_instrucoes:
            print(instrucao)
            print('\n')
        print(']')
