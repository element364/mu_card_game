require('normalize.css');
require('react-bootstrap-toggle/lib/bootstrap2-toggle.css');

import React, { Component, PropTypes } from 'react';
import { connectMultireducer, multireducerBindActionCreators } from 'multireducer';
import { Button, Panel } from 'react-bootstrap';
import ReactBootstrapToggle from 'react-bootstrap-toggle';
import { Link } from 'react-router';
import { filter } from 'lodash';
import { getCardsScore } from '../../../reducers/cardGameReducer';
import * as gameActions from '../../../actions/gameActions';
import Card from '../../ui/card/Card.jsx';

class HumanGame extends Component {
    constructor(props) {
        super(props);
        
        this.state = Object.assign({}, { cheater: false });
        
        this.props.gameActions.startNewGame();
      
        this.cardClickHandler = this.cardClickHandler.bind(this);
        this.changeButtonClickHandler = this.changeButtonClickHandler.bind(this);
        this.realeseButtonClickHanler = this.realeseButtonClickHanler.bind(this);
        this.endGameButtonClickHandler = this.endGameButtonClickHandler.bind(this);
        this.handleCheaterChange = this.handleCheaterChange.bind(this);
    }
  
    cardClickHandler(suit, rank) {
        this.props.gameActions.selectCards([{ suit, rank }]);
    }
  
  getSelectedCards(cards = this.state.cards) {
      return filter(cards, { selected: true });
  }
  
  changeButtonClickHandler() {
      const { cards } = this.props.game;
      const selectedCards = this.getSelectedCards(cards);
      
      this.props.gameActions.changeCards(selectedCards);
  }
  
  realeseButtonClickHanler() {
    const selectedCards = this.getSelectedCards(this.props.game.cards);
    
    this.props.gameActions.releaseCards(selectedCards);
  }

    endGameButtonClickHandler() {
        console.log('endGameButtonClickHandler');
        this.props.gameActions.endGame();
    }
  
    handleCheaterChange(cheater) {
        this.setState({ cheater });
    }
    
  render() {
    const selectedCards = this.getSelectedCards(this.props.game.cards),
        score = getCardsScore(selectedCards);
      
    return (
      <div className="container-fluid">
        <Link to="/ai_prog">AI</Link>
        &nbsp;
        <Link to="/ai_comp">AI Competition</Link>
        <div className="row">
            <Panel header={`Deck, ${this.props.game.deck.length} left`} style={{ minHeight: 393 }}>
                {this.props.game.deck.map(c => <Card suit={c.suit} rank={c.rank} closed={!this.state.cheater} key={`card-${c.suit}${c.rank}`} />)}
            </Panel>
        </div>
        <div className="row">
            <div className="col-sm-6 col-md-6 sidebar">
                <Button onClick={this.changeButtonClickHandler} disabled={selectedCards.length === 0} bsSize="large" bsStyle="warning">Change</Button>
                <Button onClick={this.realeseButtonClickHanler} disabled={score === 0} bsSize="large" bsStyle="success">Release {score > 0 && score}</Button>
                <h3>Score: {this.props.game.totalScore}</h3>
                <Button onClick={this.endGameButtonClickHandler} bsSize="large" bsStyle="primary">End game</Button>
                <div className="checkbox">
                    <label>
                        Cheater
                        <ReactBootstrapToggle active={false} onChange={this.handleCheaterChange} />
                    </label>
                </div>
            </div>
            <div className="col-sm-6 cold-md-6">
                {this.props.game.cards.map(c => <Card rank={c.rank} suit={c.suit} selected={c.selected} onClick={this.cardClickHandler} key={`card-${c.suit}${c.rank}`} />)}
            </div>
        </div>
        <div className="row">
            <Panel header="Dead cards" style={{ height: 233 }}>
                {this.props.game.deadCards.map(c => <Card rank={c.rank} suit={c.suit} key={`card-${c.suit}${c.rank}`} />)}
            </Panel>
        </div>
      </div>
    );
  }
}

HumanGame.propTypes = {
    game: PropTypes.object.isRequired
};

const mapStateToProps = (key, state) => {
    return {
        game: state.games[key]
    };
};

const mapDispatchToProps = (key, dispatch) => {
    return {
        gameActions: multireducerBindActionCreators(key, gameActions, dispatch)
    };
}

export default connectMultireducer(mapStateToProps, mapDispatchToProps)(HumanGame);
