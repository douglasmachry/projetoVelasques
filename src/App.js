import React, {Component} from 'react';
import './App.css';
import clientesApi from './clientes'
import comprasApi from './compras'


Array.prototype.groupBy = function(prop) {
      
  var value = this.reduce(function(total, item) {
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
      compras: responseCompras.data
    });
    
   
  }

  parseCPF(cpf){
    cpf = String(cpf).replace(/[^\d]+/g,'');
    
    cpf = Number(cpf);
    return cpf;
  }

  ordenarClientes(){
    var { compras } = this.state;
    var totalCompras = 0;
    var listaOrdenadaPorCompra = [];

    compras.map(compra => (
      compra['cliente'] = this.parseCPF(compra.cliente)
    ));
    var listaAgrupadaPorCliente = compras.groupBy('cliente');
    
  
    
    for(var cpf in listaAgrupadaPorCliente){
       var comprasPorCPF = listaAgrupadaPorCliente[cpf];
       var totalCompras = 0;
       comprasPorCPF.map(compra => (
          totalCompras += compra.valorTotal
        ))
        totalCompras = Number(totalCompras.toFixed(2))
        comprasPorCPF["totalCompras"] = totalCompras
        listaOrdenadaPorCompra.push(comprasPorCPF)
    }
    listaOrdenadaPorCompra.sort((a, b) => b.totalCompras - a.totalCompras);

    return listaOrdenadaPorCompra;
  }

  carregarCompras(cpf){
    const cpfFinal = this.parseCPF(cpf);

    const { compras } = this.state;
    var valorFinal = 0;
    compras.filter(compra => this.parseCPF(compra.cliente) == cpfFinal).map(filtroCompra => 
      valorFinal += Number(filtroCompra.valorTotal)
    );
    return (
      <p><strong>Total em Compras:</strong> R$ {valorFinal.toFixed(2).replace(".",",")}</p>
    );

  }

  render() {
    const { clientes } = this.state;
    var valorCompras = 0;
    this.ordenarClientes();
    return (
      <div>
        <h1>Lista de clientes</h1>
        <ul>
        {clientes.map(cliente => (
          valorCompras = this.carregarCompras(cliente.cpf),
          <li key={cliente.id}>
            <h3>
              <strong>Nome: </strong>
              {cliente.nome}
            </h3>
            <p><strong>CPF: </strong>
              {cliente.cpf}
            </p>
            {valorCompras}
          </li>
        ))}
        </ul>
      </div>
    );
  };
};

export default App;
