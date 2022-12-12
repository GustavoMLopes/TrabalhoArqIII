from instrucao import *
from processador import Processador
from leitura_instrucao import *

p = Processador()
instrucoes = cria_instrucoes()
for instrucao in instrucoes:
    p.insere_fila(instrucao)
p.mostra_fila()
p.despacho()