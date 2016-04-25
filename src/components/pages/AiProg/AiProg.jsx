import React, { Component } from 'react';
import { Button, Panel } from 'react-bootstrap';
import ReactBootstrapToggle from 'react-bootstrap-toggle';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { _ } from 'lodash';
import { getCardsScore } from '../../../reducers/cardGameReducer';
import { actionTypes } from '../../../actions/actionTypes';
import * as gameActions from '../../../actions/gameActions';
import Card from '../../ui/card/Card.jsx';

var CodeMirror = require('codemirror/lib/codemirror');
require('codemirror/lib/codemirror.css');
require('codemirror/mode/javascript/javascript');

require('./ai-prog.less');

const defaultCode = `
    function makeMove(cards, deadCards) {
        console.log(cards);
        console.log(getCardsScore(cards.slice(0, 3)));
        
        return {
            type: 'CHANGE_CARDS',
            payload: cards
        };
    }
`;

class AiProg extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            cheater: false,
            circleMode: false
        };
        
        this.runBtnHandler = this.runBtnHandler.bind(this);
        this.handleCheaterChange = this.handleCheaterChange.bind(this);
        this.endGameButtonClickHandler = this.endGameButtonClickHandler.bind(this);
        this.handleRunCircleChange = this.handleRunCircleChange.bind(this);
    }
    
    componentDidMount() {
        console.log('componentDidMount');
        this.codeMirror = CodeMirror.fromTextArea(
            document.getElementById('cmEditor'),
            {
                lineNumbers: true,
                mode: 'javascript'
            }
        );
    }
    
    runBtnHandler() {
        let code = this.codeMirror.getValue();
        code = `${getCardsScore.toString()};${code}`;
        console.log(code);
        
        eval.call(null, code);
        let result = makeMove([...this.props.game.cards], [...this.props.game.deadCards]);
        
        if (result.type === actionTypes.CHANGE_CARDS || result.type === actionTypes.RELEASE_CARDS) {
            this.props.dispatch({
                type: actionTypes.SELECT_CARDS,
                payload: result.payload
            });
        }
        setTimeout(() => {
            this.props.dispatch(result);
            
            if (this.state.circleMode) {
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
    
    handleRunCircleChange(circleMode) {
        this.setState({ circleMode });
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
                        <div className="checkbox">
                            <label>
                                Circle
                                <ReactBootstrapToggle active={false} onChange={this.handleRunCircleChange} />
                            </label>
                        </div>
                        <Button onClick={this.runCicleBtnHandler}>{this.state.circleMode ? 'Stop cicle' : 'Run cicle'}</Button>
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

const mapStateToProps = state => {
    return {
        game: state.ai_game
    };
};

const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        gameActions: bindActionCreators(gameActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AiProg);