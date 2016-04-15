require('normalize.css');
//require('styles/App.css');

import React from 'react';

import Card from './ui/Card.jsx';

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div class="container-fluid">
        <div class="row">
          <Card rank="1" />
          <Card rank="2" />
        </div>
        <img src={yeomanImage} alt="Yeoman Generator" />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
