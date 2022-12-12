class RSMem:
    def __init__(self, nome):
        self.nome = nome
        self.ocupado = False
        self.endereco = None
    
    def atualiza_endereco(self, instrucao):
        self.endereco = instrucao.imediato + instrucao.reg_deslocamento
    
    def __str__(self):
        str_rep = f'Nome:{self.nome}, '
        str_rep += f'Ocupado:{self.ocupado}, '
        str_rep += f'Endereco:{self.endereco}, '
        return str_rep

class RSMultiplicador:
    def __init__(self, nome):
        self.nome = nome
        self.ocupado = False
        self.op = None
        self.vj = None
        self.vk = None
        self.qj = None
        self.qk = None
    
    def __str__(self):
        str_rep = f'Nome:{self.nome}, '
        str_rep += f'Ocupado:{self.ocupado}, '
        str_rep += f'OP:{self.op}, '
        str_rep += f'Vj:{self.vj}, '
        str_rep += f'Vk:{self.vk}, '
        str_rep += f'Qj:{self.qj}, '
        str_rep += f'Qk:{self.qk}, '
        return str_rep

class RSSomador:
    def __init__(self, nome):
        self.nome = nome
        self.ocupado = False
        self.op = None
        self.vj = None
        self.vk = None
        self.qj = None
        self.qk = None
    
    def __str__(self):
        str_rep = f'Nome:{self.nome}, '
        str_rep += f'Ocupado:{self.ocupado}, '
        str_rep += f'OP:{self.op}, '
        str_rep += f'Vj:{self.vj}, '
        str_rep += f'Vk:{self.vk}, '
        str_rep += f'Qj:{self.qj}, '
        str_rep += f'Qk:{self.qk}, '
        return str_rep