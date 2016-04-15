require('normalize.css');
//require('styles/App.css');

import React from 'react';

import Card from './ui/card/Card.jsx';

let yeomanImage = require('../images/yeoman.png');

const generateDeck = () => {
    let result = [];
  
    for (let suit = 0; suit < 3; suit++) {
        for (let rank = 1; rank <= 8; rank++) {
            let suitColor = '';
            switch (suit) {
                case 0:
                    suitColor = 'red';
                    break;
                case 1:
                    suitColor = 'blue';
                    break;
                case 2:
                    suitColor = 'yellow';
                    break;
            }
          
            result.push({
              suit: suitColor,
              rank
            });
        }
    }
    
    return result;
};

class AppComponent extends React.Component {
  render() {
    const deck = generateDeck();
    
    return (
      <div className="container-fluid">
        <div className="row">
          {deck.map(c => <Card suit={c.suit} rank={c.rank} />)}
        </div>
        <div className="row">
            <div className="col-sm-3 col-md-2 sidebar">
            </div>
            <div className="col-sm-5 cold-md-5">
                <Card rank="1" suit="red" />
                <Card rank="2" suit="green" />
                <Card rank="3" suit="yellow" />
                <Card rank="4" suit="cyan" />
                <Card rank="5" suit="blue" />
            </div>
        </div>
        <div className="row">
            <img src={yeomanImage} alt="Yeoman Generator" />
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
