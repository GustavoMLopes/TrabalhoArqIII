# TrabalhoArqIII 👨‍💻
Trabalho final do grupo 8 da matéria de arquitetura III. 

## Enunciado
O trabalho é o desenvolvimento de um simulador (qualquer linguagem) do algoritmo de Tomasulo, conforme últimos slides de superescalaridade. Livro básico: Arquitetura de Computadores, uma Abordagem Quantitativa, Hennessy e Patterson. O simulador deve suportar instruções de desvio e descarte de instruções no buffer de reordenamento. O simulador deve suportar instruções RISC-V. 

## Campos das estações de reserva
 - **op**: A operacao a ser realizada.
 - **QJ, Qk**: As estações de reserva que produzirão os operandos-fonte correspondentes.
 - **VJ, VK**: O valor dos operandos fonte.
 - **Endereço**: Usado para manter informações do cálculo de endereço de memória em operações load/store.
 - **Ocupado**: Indica que essa estação e sua respectiva unidade funcional estão ocupadas.

## Estrutura das Instruções
 - ADD destino, leitura, leitura
 - SUB destino, leitura, leitura
 - MUL destino, leitura, leitura
 - DIV destino, leitura, leitura
 - BEQ leitura, leitura, #label
 - LW destino, imediato(leitura)
 - SW leitura, imediato(leitura) 

### Referências
 - Computer Organization and Design, the Hardware/Software Interface, RISC-V Edition. David Patterson and John Hennessy.
 - Guia Prático RISC-V: Atlas de uma Arquitetura Aberta Links to an external site., David Patterson and Andrew Waterman Arquitetura de Computadores, Uma Abordagem Quantitativa, John Hennessy e David Patterson.
 - Superescalaridade e algoritmo de Tomasulo.