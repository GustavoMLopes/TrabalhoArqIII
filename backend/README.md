## Campos das estações de reserva
 - **op**: A operacao a ser realizada.
 - **QJ, Qk**: As estações de reserva que produzirão os operandos-fonte correspondentes.
 - **VJ, VK**: O valor dos operandos fonte.
 - **Endereço**: Usado para manter informações do cálculo de endereço de memória em operações load/store.
 - **Ocupado**: Indica que essa estação e sua respectiva unidade funcional estão ocupadas.

## Todo List
 - [ ] Inserir informações na estação de reserva.
 	- [ ] Atualizar registradores pra Q ou pra V.

## Estrutura das Instruções
 - ADD destino, leitura, leitura
 - SUB destino, leitura, leitura
 - MUL destino, leitura, leitura
 - DIV destino, leitura, leitura
 - BEQ leitura, leitura, #label
 - LW destino, imediato(leitura)
 - SW leitura, imediato(leitura) 

## Pseudocódigo do algoritmo
def despacho():
	As instruções inicialmente ficam na fila de instrucoes
	Para cada Instrucao:
		se estacao_reserva_vazia():
			insira instrucao na estacao_reserva
			se operandos_prontos():
				insira instrucao na unidade_funcional
				exec(instrucao)
			senao:
				registre na unidade funcional as unidades que vao retornar os operandos
		senao:
			stall na instrucao

def exec(instrucao):
	se operandos_prontos():
		execute(instrucao)