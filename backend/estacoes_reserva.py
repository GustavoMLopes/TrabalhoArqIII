class RSMem:
    def __init__(self, nome):
        self.nome = nome
        self.op = None
        self.ocupado = False
        self.endereco = None
        self.destino = None
        self.tempo_termino = 0
    
    def reset(self):
        self.ocupado = False
        self.endereco = None
        self.op = None
        self.destino = None
        self.tempo_termino = 0
    
    def atualiza_endereco(self, instrucao):
        self.endereco = instrucao.imediato + instrucao.reg_deslocamento
    
    def __str__(self):
        str_rep = f'Nome:{self.nome}, '
        str_rep = f'OP:{self.op}, '
        #str_rep += f'Termino:{self.tempo_termino}, '
        str_rep += f'Ocupado:{self.ocupado}, '
        str_rep += f'Endereco:{self.endereco}, '
        str_rep += f'Destino:{self.destino}, '
        return str_rep
    
    def inserir(self, instrucao, reg_endereco, reg_destino):
        self.op = instrucao.op_code
        #self.tempo_termino = instrucao.clocks_necessarios + tempo_excedente
        self.ocupado = True
        self.endereco = f'{instrucao.imediato} + {instrucao.reg_deslocamento}'
        self.destino = instrucao.reg_destino
    
    def decrementa_tempo(self, decremento = 1):
        self.tempo_termino -= decremento
    

class RSMultiplicador:
    def __init__(self, nome):
        self.nome = nome
        self.tempo_termino = 0
        self.ocupado = False
        self.op = None
        self.vj = None
        self.vk = None
        self.qj = None
        self.qk = None
    
    def reset(self):
        self.tempo_termino = 0
        self.ocupado = False
        self.op = None
        self.vj = None
        self.vk = None
        self.qj = None
        self.qk = None

    def __str__(self):
        str_rep = f'Nome:{self.nome}, '
        #str_rep += f'Termino:{self.tempo_termino}, '
        str_rep += f'Ocupado:{self.ocupado}, '
        str_rep += f'OP:{self.op}, '
        str_rep += f'Vj:{self.vj}, '
        str_rep += f'Vk:{self.vk}, '
        str_rep += f'Qj:{self.qj}, '
        str_rep += f'Qk:{self.qk}, '
        return str_rep
    
    def inserir(self, instrucao, reg_j, reg_k, pronto_j, pronto_k):
        self.op = instrucao.op_code
        self.tempo_termino = instrucao.clocks_necessarios # + algo
        self.ocupado = True
        if pronto_j:
            self.vj = reg_j
        else:
            self.qj = reg_j
        
        if pronto_k:
            self.vk = reg_k
        else:
            self.qk = reg_k
    def decrementa_tempo(self, decremento = 1):
        self.tempo_termino -= decremento
        

class RSSomador:
    def __init__(self, nome):
        self.nome = nome
        self.tempo_termino = 0
        self.ocupado = False
        self.op = None
        self.vj = None
        self.vk = None
        self.qj = None
        self.qk = None

    def reset(self):
        self.tempo_termino = 0
        self.ocupado = False
        self.op = None
        self.vj = None
        self.vk = None
        self.qj = None
        self.qk = None

    def __str__(self):
        str_rep = f'Nome:{self.nome}, '
        str_rep = f'Termino:{self.tempo_termino}, '
        str_rep += f'Ocupado:{self.ocupado}, '
        str_rep += f'OP:{self.op}, '
        str_rep += f'Vj:{self.vj}, '
        str_rep += f'Vk:{self.vk}, '
        str_rep += f'Qj:{self.qj}, '
        str_rep += f'Qk:{self.qk}, '
        return str_rep
    
    def inserir(self, instrucao, reg_j, reg_k, pronto_j, pronto_k):
        self.op = instrucao.op_code
        self.tempo_termino = instrucao.clocks_necessarios # + algo
        self.ocupado = True
        if pronto_j:
            self.vj = reg_j
        else:
            self.qj = reg_j
        
        if pronto_k:
            self.vk = reg_k
        else:
            self.qk = reg_k

    def decrementa_tempo(self, decremento = 1):
        self.tempo_termino -= decremento