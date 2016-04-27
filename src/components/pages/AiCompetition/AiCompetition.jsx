import React, { Component } from 'react';
import { Button, Tab, Tabs, Panel, Input } from 'react-bootstrap';
import { Link } from 'react-router';
import AiTab from '../../ui/aiTab/AiTab.jsx';
import { generateDeck, cardGameReducer } from '../../../reducers/cardGameReducer';
import { actionTypes } from '../../../actions/actionTypes';
import { antiGreedStrategy } from '../../../utils/strategies';

class AiCompetition extends Component {
    constructor(props) {
        super(props);
        
        const defaultTabs = [
            {
                index: 1,
                strategyName: 'NoobStrategy',
                code: antiGreedStrategy
            }
        ];
        
        this.state = {
            selectedTabKey: 1,
            tabs: defaultTabs,
            
            iterations: 1000,
            iterating: false
        };
        
        this.tabs_counter = 1;
        
        this.handleTabSelect = this.handleTabSelect.bind(this);
        this.addBtnHandler = this.addBtnHandler.bind(this);
        this.onCloseTab = this.onCloseTab.bind(this);
        this.onStrategyNameChangeTab = this.onStrategyNameChangeTab.bind(this);
        this.handleIterationsChange = this.handleIterationsChange.bind(this);
        this.onIterateBtnClick = this.onIterateBtnClick.bind(this);
        this.onTabCodeChange = this.onTabCodeChange.bind(this); 
    }
    
    handleTabSelect(selectedTabKey) {
        this.setState({ selectedTabKey });
    }
    
    addBtnHandler() {
        const newTab = {
            index: ++this.tabs_counter,
            strategyName: 'Strategy',
            code: ''
        };
        
        this.setState({
            selectedTabKey: newTab.index,
            tabs: this.state.tabs.concat(newTab)
        });
    }
    
    onCloseTab(index) {
        this.setState({
            tabs: this.state.tabs.filter(tab => tab.index !== index)
        });
    }
    
    onStrategyNameChangeTab(index, strategyName) {
        this.setState({
            tabs: this.state.tabs.map(tab => {
                if (tab.index === index) {
                    return { ...tab, strategyName };
                }
                
                return tab;
            })
        });
    }
    
    onTabCodeChange(index, code) {
        this.setState({
            tabs: this.state.tabs.map(tab => {
                if (tab.index === index) {
                    return { ...tab, code };
                }
                
                return tab;
            })
        });
    }
    
    handleIterationsChange(e) {
        this.setState({
            iterations: parseInt(e.target.value) || 0
        });
    }
    
    runIteration() {
        const deck = generateDeck();
        console.log(deck.map(card => `${card.suit}${card.rank}`).join(', '));
        
        this.state.tabs.forEach(tab => {
            var gameState = cardGameReducer(null, {
                type: actionTypes.NEW_GAME,
                payload: deck
            });
                
            const code = tab.code;
            eval.call(null, code);
            
            while (true) {
                var executionResult = makeMove([...gameState.cards], [...gameState.deadCards]);
                if (executionResult.type === actionTypes.END_GAME) {
                    break;
                } else {
                    gameState = cardGameReducer(gameState, executionResult);
                }
            }
            
            console.log(`${tab.strategyName} - ${gameState.totalScore}`);
        });
        
        if (this.state.iterating) {
            setTimeout(() => {
                this.runIteration();
            }, 500);
        }
    }
    
    onIterateBtnClick() {
        this.setState({ iterating: !this.state.iterating }, () => {
            if (this.state.iterating) {
                this.runIteration();
            }
        });
    }
    
    render() {
        return (
            <div className="container-fluid">
                <Link to="/">Main</Link>
                &nbsp;
                <Link to="/ai_prog">AI</Link>
                <div className="row">
                    <Button onClick={this.addBtnHandler}>Add</Button>
                </div>
                <div className="row">
                    <Tabs activeKey={this.state.selectedTabKey} onSelect={this.handleTabSelect} animation={false} id="noanim-tab-example">
                        {this.state.tabs.map(tab => <Tab eventKey={tab.index} title={tab.strategyName}><AiTab strategyName={tab.strategyName} code={tab.code} index={tab.index} onStrategyNameChange={this.onStrategyNameChangeTab} onClose={this.onCloseTab} onCodeChange={this.onTabCodeChange} /></Tab>)}
                    </Tabs>
                </div>
                <div className="row">
                    <Panel header="Competition">
                        <div className="row">
                            <div className="col-sm-10 col-md-10">
                                <Input type="text" onChange={this.handleIterationsChange} value={this.state.iterations} />
                            </div>
                            <div className="col-sm-2 col-md-2">
                                <Button onClick={this.onIterateBtnClick}>{this.state.iterating ? 'End' : 'Start'}</Button>
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>
        );
    }
}

export default AiCompetition;