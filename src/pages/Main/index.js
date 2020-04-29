import React, { Component } from 'react';
import clientesApi from '../../clientes';
import comprasApi from '../../compras';

//Função para agrupar dados de uma array
Array.prototype.groupBy = function (prop) {

  var value = this.reduce(function (total, item) {
    var key = item[prop];
    total[key] = (total[key] || []).concat(item);

    return total;
  }, {});

  return value;
}


class Main extends Component {

  state = {
    clientes: [],
    compras: []
  }
  //realiza a requisição de todos os clientes e todas as compras realizadas
  async componentDidMount() {
    const responseClientes = await clientesApi.get();
    const responseCompras = await comprasApi.get();
    this.setState({
      clientes: responseClientes.data,
      compras: responseCompras.data,
    });
  }
  //Converter um String de CPF para Number, retirando outros elementos que não sejam número
  parseCPF(cpf) {
    cpf = String(cpf).replace(/[^\d]+/g, '');

    cpf = Number(cpf);
    return cpf;
  }

  //esta função monta um Array com todos os dados de clientes e compras, agrupado por cliente
  ordenarClientes() {
    const { clientes, compras } = this.state;
    var listaOrdenadaPorCompra = [];
    compras.map(compra => (
      compra['cliente'] = this.parseCPF(compra.cliente)
    ));

    //agrupa Compras pela propriedade "cliente"
    var listaAgrupadaPorCliente = compras.groupBy('cliente');


    //para cada registro de cliente, será calculado o valor total em compras e será inserido na array com a chave "totalCompras"
    for (var cpf in listaAgrupadaPorCliente) {
      var comprasPorCPF = listaAgrupadaPorCliente[cpf];

      var totalCompras = 0;
      comprasPorCPF.map(compra => (
        totalCompras += compra.valorTotal
      ))
      
      //recupera os dados do cliente que realizou a compra, para inserir o nome e CPF na array
      clientes.filter(nome => this.parseCPF(nome.cpf) == cpf)
        .map(filtroCliente => (
          comprasPorCPF["nomeCliente"] = filtroCliente.nome,
          comprasPorCPF["cpf"] = String(filtroCliente.cpf)));
      totalCompras = Number(totalCompras.toFixed(2))
      comprasPorCPF["totalCompras"] = totalCompras

      listaOrdenadaPorCompra.push(comprasPorCPF)
    }

    //ordenar a lista de compras pelo valor total em compras
    listaOrdenadaPorCompra.sort((a, b) => b.totalCompras - a.totalCompras);

    return listaOrdenadaPorCompra;
  }


  //Verificar o histórico de determinado cliente e recomendar um vinho
  recomendarVinho(cliente) {
    var listaVinhos = [];
    var maior = -Infinity;
    var chave;
    var obj;
    var dadosPesquisa = [
      "variedade",
      "produto",
      "ano",
      "pais",
      "categoria"
    ]

    /*
      Percorre todas as compras do cliente e contabiliza os dados de compras já realizadas, conforme a variável "dadosPesquisa" acima. 
      Esta função retorna um array conforme abaixo:

      listaVinhos[
        categoria:[categoria:qtd, ...],
        produto:[produto:qtd, ...],
        ano: [ano:qtd, ...],
        varidedade: [variedade:qtd, ...],
        pais: [pais:qtd, ...]
      ]
    */
    cliente.map(function (compras) {
      compras.itens.map(function (item) {
        for (var i in item) {
          if (dadosPesquisa.includes(i)) {
            if (listaVinhos[i] === undefined) {
              listaVinhos[i] = []
              listaVinhos[i][item[i]] = (listaVinhos[i][item[i]] || 0) + 1
            } else {
              listaVinhos[i][item[i]] = (listaVinhos[i][item[i]] || 0) + 1
            }
          }
        }
      });
    })

    //Percorre os dados já contabilizados e retorna uma informação do produto mais comprado pelo cliente, neste caso estou retornando somente o nome do produto comprado
    obj = listaVinhos.produto;
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (obj[prop] > maior) {
          maior = obj[prop];
          chave = prop;
        }
      }
    }

    return chave;

  }

render() {
  const listaClientes = this.ordenarClientes();
  return (
      <div>
        <h1>Lista de Clientes</h1>
        <ul>
          {listaClientes.map(cliente => (
            <li key={cliente[0].cliente}>
              <h3>
                <strong>Nome: </strong>
                {cliente.nomeCliente}
              </h3>
              
              <p>
                <strong>Total em compras: </strong>
              R$ {cliente.totalCompras.toFixed(2).replace('.', ',')}
              </p>
              <p class='vinhoRecomendado'>
                <strong>Vinho recomendado: </strong>
                {this.recomendarVinho(cliente)}
              </p>
            </li>
          ))}
        </ul>
      </div>
  );
}
}

export default Main;