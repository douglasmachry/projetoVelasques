import React, { Component } from 'react';
import clientesApi from '../../clientes';
import comprasApi from '../../compras';
//import { Container, Title } from './styles';

class listaMaiorCompra extends Component {


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
    });
  }



  parseCPF(cpf) {
    cpf = String(cpf).replace(/[^\d]+/g, '');
    cpf = Number(cpf);
    return cpf;
  }
  maiorCompra() {
    const { clientes, compras } = this.state;
    var dadosCompra = [];
    
    var maiorCompra = compras.filter(compra => compra.data.substr(-4) === "2016")
      .sort((a, b) => b.valorTotal - a.valorTotal);
    maiorCompra = maiorCompra[0];
    
    for (var value in maiorCompra) {
      maiorCompra['cliente'] = this.parseCPF(maiorCompra['cliente']);
      dadosCompra[value] = maiorCompra[value];
    }
    clientes.filter(nome => this.parseCPF(nome.cpf) == maiorCompra.cliente)
      .map(filtroCliente => (
        dadosCompra["nomeCliente"] = filtroCliente.nome,
        dadosCompra["cpf"] = String(filtroCliente.cpf)));
    
    console.log(dadosCompra);
    return dadosCompra;


  }
  render() {
    var maiorCompra = this.maiorCompra();
    var itens = [];
    for (var item in maiorCompra.itens) {
      itens[item] = maiorCompra.itens[item];
    }
    return (
      
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
      
    );
  }
}


export default listaMaiorCompra;