import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  render() {
    return (
      <h1 style={{'fontFamily': 'sans-serif'}}>Hello World!</h1>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
