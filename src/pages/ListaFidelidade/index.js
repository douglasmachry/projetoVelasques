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

  ordenarClientes() {
    const { clientes, compras } = this.state;
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


 
  render(){
    var listaFidelidade = this.ordenarClientes();
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