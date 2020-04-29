import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Main from '../pages/Main';
import listaMaiorCompra from '../pages/MaiorCompra';
import listaPorFidelidade from '../pages/ListaFidelidade';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Main} />
      <Route path="/listaFidelidade" exact component={listaPorFidelidade} />
      <Route path="/listaMaiorCompra" exact component={listaMaiorCompra} />
    </Switch>
  );
}