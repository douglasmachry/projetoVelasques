import React, { Component } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Routes from './routes';
import GlobalStyle, { Container } from './styles';



class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <GlobalStyle />
        <Container>
          <Sidebar />
          <Routes />
        </Container>
      </BrowserRouter>
    );
  };
};

export default App;
