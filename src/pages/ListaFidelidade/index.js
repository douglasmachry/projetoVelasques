import React, { Component } from 'react';
import clientesApi from '../../clientes';
import comprasApi from '../../compras';


class listaPorFidelidade extends Component {

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


  //Função para recuperar os clientes e contabilizar a frequência de compras por cada cliente
  ordenarClientesPorFidelidade() {
    const { clientes, compras } = this.state;
    var listaOrdenadaPorFidelidade = [];
    compras.map(compra => (
      compra['cliente'] = this.parseCPF(compra.cliente)
    ));
    var listaAgrupadaPorCliente = compras.groupBy('cliente');

    //Percorre as compras de cada cliente e incrementa a variável pontosFidelidade para cada compra realizada
    for (var cpf in listaAgrupadaPorCliente) {
      var comprasPorCPF = listaAgrupadaPorCliente[cpf];
      var pontosFidelidade = 0;
      comprasPorCPF.map(compra => (
        pontosFidelidade++
      ))
      clientes.filter(nome => this.parseCPF(nome.cpf) == cpf)
        .map(filtroCliente => (
          comprasPorCPF["nomeCliente"] = filtroCliente.nome,
          comprasPorCPF["cpf"] = String(filtroCliente.cpf)));
      
      comprasPorCPF["pontosFidelidade"] = pontosFidelidade

      listaOrdenadaPorFidelidade.push(comprasPorCPF)
    }
    
    return listaOrdenadaPorFidelidade;
  }

  render(){
    var listaFidelidade = this.ordenarClientesPorFidelidade();
    return (
      <div>
      <h1>Lista de Clientes por Fidelidade</h1>
      
          <ol>
            {
              listaFidelidade.sort((a, b) => b.pontosFidelidade - a.pontosFidelidade)
                .map(cliente => (
                  <li key={cliente.cpf}>
                    {cliente.nomeCliente} - Frequência de compras: {cliente.pontosFidelidade}
                  </li>
                ))
            }
          </ol>
      </div>
  );
  }
}

export default listaPorFidelidade;