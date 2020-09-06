//Qual o bolo selecinado
let modeloKey = 0;
//Array Carrinho
let carrinho = [];
//Quantidade inicial modelo ao clicar no bolo
let modeloQtd = 1;

//função anonima querySelector() e querySelectorAll();
const s = (seletor) => document.querySelector(seletor);
const ss = (seletores) => document.querySelectorAll(seletores);

//Listagem dos bolos
bolosJson.map((valorAtual, indice) => {

    //clone estrutura class modelo e bolo-item preeche e joga na tela
    let bolosItem = s('.modelos .bolo-item').cloneNode(true);

    //Qual a chave/id do bolo especifico
    bolosItem.setAttribute('data-key', indice);

    //preencher as informações do bolo
    bolosItem.querySelector('.bolo-item-imagem img').src = valorAtual.img;
    bolosItem.querySelector('.bolo-item-preco').innerHTML = `R$ ${valorAtual.preco[2].toFixed(2)}`;
    bolosItem.querySelector('.bolo-item-nome').innerHTML = valorAtual.nome;
    bolosItem.querySelector('.bolo-item-descricao').innerHTML = valorAtual.descricao;

    //Abrir o modelo
    bolosItem.querySelector('a').addEventListener('click', (evento) => {
        evento.preventDefault();

        let key = evento.target.closest('.bolo-item').getAttribute('data-key');

        modeloQtd = 1
        modeloKey = key;

        //dados do bolo
        s('.bolo-grande img').src = bolosJson[key].img;
        s('.bolo-informacao h1').innerHTML = bolosJson[key].nome;
        s('.bolo-informacao-descricao').innerHTML = bolosJson[key].descricao;
        s('.bolo-informacao-preco-atual').innerHTML = `R$ ${bolosJson[key].preco[2].toFixed(2)}`;

        //Deselecionar todos os itens 1Kg 1,5Kg e 2Kg
        s('.bolo-informacao-tamanho.selected').classList.remove('selected');

        //dados do peso do bolo e selecionado item grande ao setar página
        ss('.bolo-informacao-tamanho').forEach((peso, pesoIndice) => {
            if (pesoIndice == 2) {
                peso.classList.add('selected');
            }
            peso.querySelector('span').innerHTML = bolosJson[key].peso[pesoIndice];
        });

        //Evento de clique que troca o peso do bolo e seleciona o preco correspondente conforme o peso
        ss('.bolo-informacao-tamanho').forEach((preco, precoIndice) => {
            preco.addEventListener('click', () => {
                s('.bolo-informacao-preco-atual').innerHTML = `R$ ${bolosJson[key].preco[precoIndice].toFixed(2)}`;
            });
        });

        //Quantidade de item
        s('.bolo-informacao-quantidade').innerHTML = modeloQtd;

        //animação dados ao clicar no bolo
        s('.bolo-janela-area').style.opacity = 0;
        s('.bolo-janela-area').style.display = 'flex';

        setTimeout(() => {
            s('.bolo-janela-area').style.opacity = 1;
        }, 200);
    });
    //add os bolos na bolo-area
    s('.bolo-area').append(bolosItem);

});

//Evento no modelo

//Ação de fechar modelo
function fecharModelo() {
    s('.bolo-janela-area').style.opacity = 0;
    setTimeout(() => {
        s('.bolo-janela-area').style.display = 'none';
    }, 500);
}

//ativar botões de cancelar para fechar Modelo HTML e Mobile
ss('.bolo-informacao-cancelar-celular-botao,.bolo-informacao-cancelar-botao').forEach((valorAtual) => {
    valorAtual.addEventListener('click', fecharModelo);
});

//- item no modelo
s('.bolo-informacao-quantidade-menor').addEventListener("click", (evento) => {
    if (modeloQtd > 1) {
        modeloQtd--;
        s('.bolo-informacao-quantidade').innerHTML = modeloQtd;
    }
});

//+ item no modelo
s('.bolo-informacao-quantidade-maior').addEventListener('click', (evento) => {
    modeloQtd++;
    s('.bolo-informacao-quantidade').innerHTML = modeloQtd;
});

//mudança de peso 1kg 1,5kg e 2kg
ss('.bolo-informacao-tamanho').forEach((peso, indice) => {
    peso.addEventListener('click', (evento) => {
        s('.bolo-informacao-tamanho.selected').classList.remove('selected');
        peso.classList.add('selected');
    });
});
//Ação Botão adicionar ao carrinho
//Evento click no botão
s('.bolo-informacao-adicionar-botao').addEventListener('click', (evento) => {
    let peso = parseInt(s('.bolo-informacao-tamanho.selected').getAttribute('data-key'));

    //Filtro para juntar bolos iguais
    let identificador = bolosJson[modeloKey].id + '#' + peso;

    //verificar no carrinho se já existe bolo selecionado com mesmo peso
    let identificadorChave = carrinho.findIndex((indice) => indice.identificador == identificador);
    if (identificadorChave > -1) {
        carrinho[identificadorChave].qtd += modeloQtd;
    } else {
        //add carrinho
        carrinho.push({
            identificador,
            id: bolosJson[modeloKey].id,
            peso,
            qtd: modeloQtd
        });
    }
    atualizarCarrinho();
    fecharModelo();
});
s('.menu-abrir').addEventListener('click', () => {
    if (carrinho.length > 0) {
        s('aside').style.left = '0';
    }
});
s('.menu-fechar').addEventListener('click', () => {
    s('aside').style.left = '100vw';
});

//Função atualizar carrinho de compras
function atualizarCarrinho() {
    s('.menu-abrir span').innerHTML = carrinho.length;
    //verificar se tem itens no carrinho
    if (carrinho.length > 0) {
        s('aside').classList.add('show');
        s('.carrinho').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in carrinho) {
            let bolosItem = bolosJson.find((indice) => indice.id == carrinho[i].id);
            subtotal += bolosItem.preco[carrinho[i].peso] * [carrinho[i].qtd];

            let carrinhoItem = s('.modelos .carrinho-item').cloneNode(true);

            let boloNomePeso;
            switch (carrinho[i].peso) {
                case 0:
                    boloNomePeso = '1Kg';
                    break;
                case 1:
                    boloNomePeso = '1,5Kg';
                    break;
                case 2:
                    boloNomePeso = '2Kg';
                    break;
            }

            let boloNome = `${bolosItem.nome}(${boloNomePeso})`;

            carrinhoItem.querySelector('img').src = bolosItem.img;
            carrinhoItem.querySelector('.carrinho-item-nome').innerHTML = boloNome;
            carrinhoItem.querySelector('.carrinho-item-quantidade').innerHTML =
                carrinho[i].qtd;
            carrinhoItem.querySelector('.carrinho-item-quantidade-menos').addEventListener('click', () => {
                if (carrinho[i].qtd > 1) {
                    carrinho[i].qtd--;
                } else {
                    carrinho.splice(i, 1);
                }
                atualizarCarrinho();
            });
            carrinhoItem.querySelector('.carrinho-item-quantidade-mais').addEventListener('click', () => {
                carrinho[i].qtd++;
                atualizarCarrinho();
            });
            s('.carrinho').append(carrinhoItem);
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        s('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        s('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        s('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        s('aside').classList.remove('show');
        s('aside').style.left = '100vw';
    }
}