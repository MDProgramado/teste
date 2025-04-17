
const estado = {
    passoAtual: null,
    distancia: null,
    consumo: null,
    consumoLitros: null,
    postos: null,
    valoresPostos: [],
    med: null,
    gastos: null
};

function mostrarTela(tag, texto) {
    const elemento = document.querySelector(tag);

    if (elemento) {
        elemento.textContent = texto;
    }
}

function validarEntrada(tipo = 'float') {
    const entrada = document.getElementById("inputValor").value;
    const valor = tipo === 'int' ? parseInt(entrada) : parseFloat(entrada);

    if (isNaN(valor) || valor <= 0) {
        mostrarTela("#mensagem", "Valor inválido! Digite um número positivo.");
        return null;
    }
    return valor;
}

function limparEntrada() {
    document.getElementById("inputValor").value = "";
}

function toggleElementos(mostrarInput = true) {
    const input = document.getElementById('inputValor');
    const botaoConfirmar = document.getElementById('confirmar');
    
    input.style.display = mostrarInput ? 'block' : 'none';
    botaoConfirmar.style.display = mostrarInput ? 'block' : 'none';
}

function proximoPasso() {
    switch(estado.passoAtual) {
        case 'distancia':
            estado.distancia = validarEntrada();
            if (estado.distancia !== null) {
                mostrarTela("#mensagem", `Distância: ${estado.distancia} km`);
                estado.passoAtual = 'consumo';
                consumoMedio();
            }
            break;
            
        case 'consumo':
            estado.consumo = validarEntrada();
            if (estado.consumo !== null) {
                mostrarTela("#mensagem", `Consumo: ${estado.consumo} km/L`);
                estado.passoAtual = 'postos';
                quantidadePostos();
            }
            break;
            
        case 'postos':
            estado.postos = validarEntrada('int');
            if (estado.postos !== null) {
                estado.valoresPostos = [];
                estado.passoAtual = 'valores';
                valores();
            }
            break;
            
        case 'valores':
            const valor = validarEntrada();
            if (valor !== null) {
                estado.valoresPostos.push(valor);
                if (estado.valoresPostos.length < estado.postos) {
                    mostrarTela("#mensagem", `Posto ${estado.valoresPostos.length + 1}/${estado.postos}:`);
                } else {
                    finalizarCalculos();
                }
            }
            break;
    }
}

function iniciarCalculo() {
    Object.assign(estado, {
        passoAtual: 'distancia',
        distancia: null,
        consumo: null,
        postos: null,
        valoresPostos: [],
        med: null,
        gastos: null
    });
    
    document.getElementById('botaoIniciar').textContent = 'Reiniciar';
    toggleElementos();
    mostrarTela("#mensagem", "Distância de sua casa até o trabalho é (km):");
    document.getElementById('confirmar').onclick = proximoPasso;
}

function consumoMedio() {
    toggleElementos();
    limparEntrada();
    mostrarTela("#mensagem", "Consumo médio do veículo é (km/L):");
}

function quantidadePostos() {
    toggleElementos();
    limparEntrada();
    mostrarTela("#mensagem", "Digite a quantidade de postos pesquisados:");
}

function valores() {
    toggleElementos();
    limparEntrada();
    mostrarTela("#mensagem", `Preço no posto 1/${estado.postos}:`);
}

function finalizarCalculos() {
    toggleElementos(false);
    
   
    estado.consumoLitros = estado.distancia / estado.consumo;
    estado.valorMenor = Math.min(...estado.valoresPostos);
    estado.med = estado.valoresPostos.reduce((a, b) => a + b, 0) / estado.postos;
    estado.gastos = 2 * (estado.consumoLitros * estado.valorMenor);

    mostrarTela("#mensagem", 
        `RESULTADO:
        - Litros necessários para chegar na empresa é de : ${estado.consumoLitros.toFixed(2)}L
        - Menor preço dos postos pesquisados foi: R$ ${estado.valorMenor.toFixed(2)}
        - Média de preços da gasolina é: R$ ${estado.med.toFixed(2)}
        - Gasto diário para chegar até a empresa é : R$ ${estado.gastos.toFixed(2)}`);
}