import React, { Component } from 'react'
import './App.css';

import HomeContainer from './components/HomeContainer'

class App extends Component {
  render() {
    return (
      <div className="background">
        <HomeContainer />
      </div>
    );
  }
}

export default App
