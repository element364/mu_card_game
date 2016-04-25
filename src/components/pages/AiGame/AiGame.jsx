import React, { Component, PropTypes } from 'react';
import { Button, Panel } from 'react-bootstrap';
import ReactBootstrapToggle from 'react-bootstrap-toggle';
import { connectMultireducer, multireducerBindActionCreators } from 'multireducer';
import { Link } from 'react-router';
import { actionTypes } from '../../../actions/actionTypes';
import * as gameActions from '../../../actions/gameActions';
import Card from '../../ui/card/Card.jsx';

var CodeMirror = require('codemirror/lib/codemirror');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/mode/javascript/javascript');

require('./ai-game.less');

const defaultCode = `
    function getCardsScore(cards) {
        var sortedCards = _.sortBy(cards, card => card.rank);
        
        if (sortedCards[1].rank === sortedCards[0].rank + 1 && sortedCards[2].rank === sortedCards[1].rank + 1) {
            if (sortedCards[0].suit === sortedCards[1].suit && sortedCards[1].suit === sortedCards[2].suit) {
                return (sortedCards[2].rank + 2);
            } else {
                return sortedCards[0].rank * 10;
            }
        }
        
        if (sortedCards[0].rank === sortedCards[1].rank && sortedCards[1].rank === sortedCards[2].rank) {
            return (sortedCards[2].rank + 1) * 10;
        }
        
        return 0;
    }
    
    function makeMove(cards, deadCards) {
        // Находим все возможные варианты реализации 3 карт
        var candidates = [];
        
        for (var i = 0; i < cards.length; i++) {
            for (var j = i + 1; j < cards.length; j++) {
                for (var k = j + 1; k < cards.length; k++) {
                    var cardsSubset = [ cards[i], cards[j], cards[k] ],
                        cardsSubsetScore = getCardsScore(cardsSubset);
                    
                    if (cardsSubsetScore > 0) {
                        candidates.push({
                            cardsSubsetScore,
                            cardsSubset
                        });
                    }
                }
            }
        }
        
        if (candidates.length > 0) {
            // Находим кобинацию, дающую меньше всего очков
            var worstScoreIdx = 0;
            for (var i = 0; i < candidates.length; i++) {
                if (candidates[i].cardsSubsetScore < candidates[worstScoreIdx].cardsSubsetScore) {
                    worstScoreIdx = i;
                }
            }
            
            return {
                type: 'RELEASE_CARDS',
                payload: candidates[worstScoreIdx].cardsSubset
            };
        }
        
        if (deadCards.length === 24) {
            return {
                type: 'END_GAME'
            };
        } else {
            return {
                type: 'CHANGE_CARDS',
                payload: cards
            };
        }
    }
`;

class AiGame extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            cheater: false,
            loopMode: false
        };
        
        this.props.gameActions.startNewGame();
        
        this.runBtnHandler = this.runBtnHandler.bind(this);
        this.handleCheaterChange = this.handleCheaterChange.bind(this);
        this.endGameButtonClickHandler = this.endGameButtonClickHandler.bind(this);
        this.runLoopBtnHandler = this.runLoopBtnHandler.bind(this);
    }
    
    componentDidMount() {
        this.codeMirror = CodeMirror.fromTextArea(
            document.getElementById('cmEditor'),
            {
                lineNumbers: true,
                theme: 'material',
                mode: 'javascript'
            }
        );
    }
    
    runBtnHandler() {
        let code = this.codeMirror.getValue();
        console.log(code);
        
        eval.call(null, code);
        let result = makeMove([...this.props.game.cards], [...this.props.game.deadCards]);
        console.log('result');
        console.log(result);
        
        if (result.type === actionTypes.CHANGE_CARDS || result.type === actionTypes.RELEASE_CARDS) {
            this.props.gameActions.selectCards(result.payload)
        }
        setTimeout(() => {
            this.props.dispatch(result);
            
            switch (result.type) {
                case actionTypes.CHANGE_CARDS:
                    this.props.gameActions.changeCards(result.payload);
                    break;
                case actionTypes.RELEASE_CARDS:
                    this.props.gameActions.releaseCards(result.payload);
                    break;
                case actionTypes.END_GAME:
                    this.setState({ loopMode: false });
                    this.props.gameActions.endGame();
                    break;
            }
            
            if (this.state.loopMode) {
                setTimeout(() => {
                    this.runBtnHandler();
                }, 1000);
            }
        }, 1000);
    }
    
    endGameButtonClickHandler() {
        alert(`Вы набрали ${this.props.game.totalScore} очков`);

        this.props.gameActions.startNewGame();
    }
    
    handleCheaterChange(cheater) {
        this.setState({ cheater });
    }
    
    runLoopBtnHandler() {
        this.setState({ loopMode: !this.state.loopMode });
    }
    
    render() {
        return (
            <div className="container-fluid">
                <Link to="/">Main</Link>
                <div className="row">
                    <Panel header={`Deck, ${this.props.game.deck.length} left`} style={{ minHeight: 393 }}>
                        {this.props.game.deck.map(c => <Card suit={c.suit} rank={c.rank} closed={!this.state.cheater} key={`card-${c.suit}${c.rank}`} />)}
                    </Panel>
                </div>
                <div className="row">
                    <div className="col-sm-6 col-md-6 sidebar">
                        <textarea id="cmEditor" rows="3" value={defaultCode} />
                        <Button onClick={this.runBtnHandler}>Run</Button>
                        <Button onClick={this.runLoopBtnHandler}>{this.state.loopMode ? 'End loop' : 'Start loop'}</Button>
                        <h3>Score: {this.props.game.totalScore}</h3>
                        <Button onClick={this.endGameButtonClickHandler} bsSize="large" bsStyle="primary">End game</Button>
                        <div className="checkbox">
                            <label>
                                Cheater
                                <ReactBootstrapToggle active={this.state.cheater} onChange={this.handleCheaterChange} />
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

AiGame.propTypes = {
    game: PropTypes.object.isRequired
};

const mapStateToProps = (key, state) => {
    return {
        game: state.games[key]
    };
};

const mapDispatchToProps = (key, dispatch) => {
    return {
        dispatch,
        gameActions: multireducerBindActionCreators(key, gameActions, dispatch)
    };
};

export default connectMultireducer(mapStateToProps, mapDispatchToProps)(AiGame);