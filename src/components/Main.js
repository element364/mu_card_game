require('normalize.css');
//require('styles/App.css');

import React from 'react';
import { Button, Panel } from 'react-bootstrap';
import { shuffle, filter, find, sortBy } from 'lodash';

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
              selected: false,
              rank
            });
        }
    }
    
    return shuffle(result);
};

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = this.getNewGameState();
      
        this.cardClickHandler = this.cardClickHandler.bind(this);
        this.changeButtonClickHandler = this.changeButtonClickHandler.bind(this);
        this.realeseButtonClickHanler = this.realeseButtonClickHanler.bind(this);
        this.endGameButtonClickHandler = this.endGameButtonClickHandler.bind(this);
    }
  
  getNewGameState() {
      const deck = generateDeck(),
        cards = [];
      
      for (let i = 0; i < 5; i++) {
         cards.push( deck.shift() );
      }
        
      return {
          deck,
          cards,
          deadCards: [],
          
          totalScore: 0
      };
  }
  
  cardClickHandler(suit, rank) {
      let card = find(this.state.cards, { suit, rank })
      card.selected = !card.selected;

      this.setState({ cards: this.state.cards });
  }
  
  getSelectedCards() {
      const { cards } = this.state;
      return filter(cards, { selected: true });
  }
  
  changeButtonClickHandler() {
      const { cards, deck, deadCards } = this.state;
      const selectedCards = this.getSelectedCards();
      
      const newCards = [];
      
      for (let i = 0; i < selectedCards.length; i++) {
        if (deck.length > 0) {
            newCards.push(deck.pop());
        }
      }
      
      this.setState({
          deck,
          cards: filter(cards, { selected: false }).concat(newCards),
          deadCards: deadCards.concat(selectedCards)
      });
  }
  
  realeseButtonClickHanler() {
    const selectedCards = this.getSelectedCards(),
        score = this.getCardsScore(selectedCards);
        
    if (score > 0) {
        let { deck, cards, deadCards, totalScore } = this.state;
        totalScore += score;
        
        const newCards = [];
        
        for (let i = 0; i < selectedCards.length; i++) {
            if (deck.length > 0) {
                newCards.push(deck.pop());
            }
        }
        
        this.setState({
            deck,
            cards: filter(cards, { selected: false }).concat(newCards),
            deadCards: deadCards.concat(selectedCards),
            totalScore
        });
    }
  }
  
  getCardsScore(selectedCards) {
      if (selectedCards.length !== 3) {
          return 0;
      }
      
      const sortedCards = sortBy(selectedCards, card => card.rank);
      
      // Street
      if (sortedCards[1].rank === sortedCards[0].rank + 1
        && sortedCards[2].rank === sortedCards[1].rank + 1) {
            // Street Flush
            if (sortedCards[0].suit === sortedCards[1].suit
                && sortedCards[1].suit === sortedCards[2].suit) {
                return (sortedCards[2].rank + 2) * 10;
                /* [1, 2, 3] => 50
                   [2, 3, 4] => 60
                   ...
                   [6, 7, 8] => 100
                */
                
            } else {
                return sortedCards[0].rank * 10;
                /*
                   [1, 2, 3] => 10
                   [2, 3, 4] => 20
                   ...
                   [6, 7, 8] => 60
                */
            }
        }
        
        // Set
        if (sortedCards[0].rank === sortedCards[1].rank
            && sortedCards[1].rank === sortedCards[2].rank) {
            return (sortedCards[2].rank + 1) * 10;
            /*
               [1, 1, 1] => 20
               [2, 2, 2] => 30
               ...
               [8, 8, 8] => 90
            */
        }
        
        return 0;
  }
  
  endGameButtonClickHandler() {
      alert(`Вы набрали ${this.state.totalScore} очков`);
      
      this.setState(this.getNewGameState());
  }
  
  render() {
    const selectedCards = this.getSelectedCards(),
        score = this.getCardsScore(selectedCards);
      
    return (
      <div className="container-fluid">
        <div className="row">
            <Panel header={`Deck, ${this.state.deck.length} left`} style={{ minHeight: 393 }}>
                {this.state.deck.map(c => <Card suit={c.suit} rank={c.rank} />)}
            </Panel>
        </div>
        <div className="row">
            <div className="col-sm-3 col-md-2 sidebar">
                <Button onClick={this.changeButtonClickHandler} bsSize="large block" bsStyle="warning">Change</Button>
                <Button onClick={this.realeseButtonClickHanler} disabled={score === 0} bsSize="large block" bsStyle="success">Release {score > 0 && score}</Button>
                <h3>Score: {this.state.totalScore}</h3>
                <Button onClick={this.endGameButtonClickHandler} bsSize="large" bsStyle="primary">End game</Button>
            </div>
            <div className="col-sm-5 cold-md-5">
                {this.state.cards.map(c => <Card rank={c.rank} suit={c.suit} selected={c.selected} onClick={this.cardClickHandler} />)}
            </div>
        </div>
        <div className="row">
            <Panel header="Dead cards" style={{ height: 233 }}>
                {this.state.deadCards.map(c => <Card rank={c.rank} suit={c.suit} />)}
            </Panel>
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
