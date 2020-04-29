import React, { Component } from 'react';
import './App.css';
import clientesApi from './clientes'
import comprasApi from './compras'


Array.prototype.groupBy = function (prop) {

  var value = this.reduce(function (total, item) {
    var key = item[prop];
    total[key] = (total[key] || []).concat(item);

    return total;
  }, {});

  return value;
}


class App extends Component {

  state = {
    clientes: [],
    compras: []
  }



  async componentDidMount() {
    const responseClientes = await clientesApi.get();
    const responseCompras = await comprasApi.get();
    this.setState({
      clientes: responseClientes.data,
      compras: responseCompras.data,
      listaOrdenadaPorCompra: this.ordenarClientes(),
      maiorCompra: this.maiorCompra(),

    });


  }

  parseCPF(cpf) {
    cpf = String(cpf).replace(/[^\d]+/g, '');

    cpf = Number(cpf);
    return cpf;
  }



  ordenarClientes() {
    var { clientes, compras } = this.state;
    var listaOrdenadaPorCompra = [];
    compras.map(compra => (
      compra['cliente'] = this.parseCPF(compra.cliente)
    ));
    var listaAgrupadaPorCliente = compras.groupBy('cliente');

    for (var cpf in listaAgrupadaPorCliente) {
      var comprasPorCPF = listaAgrupadaPorCliente[cpf];

      var totalCompras = 0;
      var pontosFidelidade = 0;
      comprasPorCPF.map(compra => (
        totalCompras += compra.valorTotal,
        pontosFidelidade++
      ))
      clientes.filter(nome => this.parseCPF(nome.cpf) == cpf)
        .map(filtroCliente => (
          comprasPorCPF["nomeCliente"] = filtroCliente.nome,
          comprasPorCPF["cpf"] = String(filtroCliente.cpf)));
      totalCompras = Number(totalCompras.toFixed(2))
      comprasPorCPF["totalCompras"] = totalCompras
      comprasPorCPF["pontosFidelidade"] = pontosFidelidade

      listaOrdenadaPorCompra.push(comprasPorCPF)
    }

    listaOrdenadaPorCompra.sort((a, b) => b.totalCompras - a.totalCompras);

    return listaOrdenadaPorCompra;
  }



  maiorCompra() {
    const { clientes, compras } = this.state;
    var dadosCompra = [];

    var maiorCompra = compras.filter(compra => compra.data.substr(-4) === "2016")
      .sort((a, b) => b.valorTotal - a.valorTotal);
    maiorCompra = maiorCompra[0];
    for (var value in maiorCompra) {
      dadosCompra[value] = maiorCompra[value];
    }
    clientes.filter(nome => this.parseCPF(nome.cpf) == maiorCompra.cliente)
      .map(filtroCliente => (
        dadosCompra["nomeCliente"] = filtroCliente.nome,
        dadosCompra["cpf"] = String(filtroCliente.cpf)));
    return dadosCompra;
  }

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
    obj = listaVinhos.produto;
    for (var prop in obj) {
      // ignorar propriedades herdadas
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

    var listaClientes = this.ordenarClientes();
    var listaFidelidade = this.ordenarClientes();
    var maiorCompra = this.maiorCompra();
    var itens = [];
    for (var item in maiorCompra.itens) {
      itens[item] = maiorCompra.itens[item];
    }


    return (
      <div>
        <div>
          <h1>Lista de clientes</h1>
          <ul>
            {listaClientes.map(cliente => (
              <li key={cliente[0].cliente}>
                <h3>
                  <strong>Nome: </strong>
                  {cliente.nomeCliente}
                </h3>
                <p><strong>CPF: </strong>
                  {cliente.cpf}
                </p>
                <p>
                  <strong>Total em compras: </strong>
              R$ {cliente.totalCompras.toFixed(2).replace('.', ',')}
                </p>
                <p>
                  <strong>Vinho recomendado: </strong>
                  {this.recomendarVinho(cliente)}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h1>Maior compra do último ano</h1>
          <h3>Cliente: {maiorCompra.nomeCliente}</h3>
          <p>CPF: {maiorCompra.cpf}</p>
          <p>Data: {String(maiorCompra.data).replace(/-/g, "/")}</p>
          <p>Valor: R$ {Number(maiorCompra.valorTotal).toFixed(2).replace(".", ",")}</p>
          <p>Produtos:</p>
          <ol>
            {

              itens.map(item => (
                (<li>{item.produto} - {item.variedade}</li>)
              ))}
          </ol>

        </div>
        <div>
          <h1> Clientes por fidelidade</h1>
          <ol>
            {
              listaFidelidade.sort((a, b) => b.pontosFidelidade - a.pontosFidelidade)
                .map(cliente => (
                  <li key={cliente.cpf}>
                    {cliente.nomeCliente} - Qtd compras: {cliente.pontosFidelidade}
                  </li>
                ))
            }
          </ol>
        </div>
      </div>
    );
  };
};

export default App;
