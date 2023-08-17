import dataBase from "./Model/dataBase";

class CaixaDaLanchonete {

    calcularValorDaCompra(metodoDePagamento, itens) {
        
        //Verifico se o array e valido
        if(!Array.isArray(itens)) {
            return "Item inválido!";
        }
        if(itens === []){
            return "Não há itens no carrinho de compra!"
        }
        
        //Transformo os itens do carrinho em um array com nome e quantidade
        let arrayCarrinhoCompras = [];
        for(const item of itens) {
            const [nome, quantidadeStr] = item.split(',');
            const quantidade = parseInt(quantidadeStr);
            if(isNaN(quantidade) || quantidade <= 0 && metodoDePagamento === "credito") {
                return "Item inválido!";
            }
            if(isNaN(quantidade) || quantidade <= 0 && metodoDePagamento === "dinheiro") {
                return "Quantidade inválida!";
            }
            arrayCarrinhoCompras.push({ nome, quantidade });
        }

        //Valido se o item existe no banco de dados
        if(!Array.isArray(arrayCarrinhoCompras)) {
            return "Item inválido!";
        }
        const itemsValidados = [];
        for(const orderItem of arrayCarrinhoCompras) {
            const { nome, quantidade } = orderItem;
            const produto = dataBase.find(prod => prod.nome === nome);

            if(!produto) {
                return "Item inválido!";
            }
            itemsValidados.push({ nome, quantidade, preco: produto.preco, tipo: produto.tipo });
        }

        arrayCarrinhoCompras = itemsValidados;

        if(!Array.isArray(arrayCarrinhoCompras)) {
            return "Item inválido!";
        }

        const itemsValidos = [];
        const itensPrincipais = [];
        const itensAdicional = [];

        for(const orderItem of arrayCarrinhoCompras) {
            const { nome, quantidade } = orderItem;

            const product = dataBase.find(prod => prod.nome === nome);

            if(!product) {
                return "Item inválido!"
            }

            // Verificar o tipo do produto
            if(product.tipo === "principal") {
                itensPrincipais.push(orderItem);
            } else if(product.tipo === "adicional") {
                itensAdicional.push(orderItem);

                if(nome === "chantily") {
                    const temCafe = itensPrincipais.some(item => item.nome === "cafe");
                    if(!temCafe) {
                        return "Item extra não pode ser pedido sem o principal";
                    }
                } else if(nome === "queijo") {
                    const temSanduiche = itensPrincipais.some(item => item.nome === "sanduiche");
                    if(!temSanduiche) {
                        return "Item extra não pode ser pedido sem o principal";
                    }
                }
            }

            itemsValidos.push({nome,quantidade,preco:product.preco});
        }
        arrayCarrinhoCompras = itemsValidos;

        let precoFinal = 0;
        for( const item of arrayCarrinhoCompras){
            if (item.preco !== undefined && item.quantidade !== undefined) {
                precoFinal += item.preco * item.quantidade;
              }
            }
        if(precoFinal === 0){
            return "Não há itens no carrinho de compra!"
        }
        
          switch (metodoDePagamento) {
            case "dinheiro":
                precoFinal =(precoFinal * 0.95).toFixed(2)
              return `R$ ${precoFinal.toString().replace('.',',')}`;
            case "debito":
              return `R$ ${precoFinal.toFixed(2).toString().replace('.',',')}`;
            case "credito":
                precoFinal =(precoFinal * 1.03).toFixed(2)
              return `R$ ${precoFinal.toString().replace('.',',')}`;
            default:
              return "Forma de pagamento inválida!";
          }
    }

}
export { CaixaDaLanchonete }

new CaixaDaLanchonete()
    .calcularValorDaCompra('credito', ['combo1,1','cafe,2'])