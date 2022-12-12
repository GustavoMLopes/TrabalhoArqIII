from instrucao import *
def cria_instrucao(splitted):
    op_code = splitted[0]
    aritmeticas = ['ADD', 'SUB', 'MUL', 'DIV']
    memoria = ['LW', 'SW']
    if op_code in aritmeticas:
        return InstrucaoAritmetica(op_code,splitted[1],splitted[2], splitted[3])
    elif op_code in memoria:
        return InstrucaoMemoria(op_code, splitted[1], splitted[2], splitted[3])
    else:
        return InstrucaoBeq(op_code, splitted[1], splitted[2], splitted[3])

def cria_instrucoes():
    instrucoes = []
    arquivo = open('input.txt', 'r')
    linhas = arquivo.readlines()
    for linha in linhas:
        splitted = linha.split()
        instrucoes.append(cria_instrucao(splitted))
    arquivo.close()
    return instrucoes