import React, { Component } from 'react';
import { Button, Tab, Tabs, Panel, Input, Table } from 'react-bootstrap';
import { Link } from 'react-router';

import AiTab from '../../ui/aiTab/AiTab.jsx';
import { generateDeck, cardGameReducer } from '../../../reducers/cardGameReducer';
import { actionTypes } from '../../../actions/actionTypes';
import { min5Strategy } from '../../../utils/strategies';

var rd3 = require('react-d3');
var { LineChart } = rd3;

class AiCompetition extends Component {
    constructor(props) {
        super(props);
        
        const defaultTabs = [
            {
                index: 1,
                strategyName: 'NoobStrategy',
                strategyColor: 'green',
                code: min5Strategy
            }
        ];
        
        this.state = {
            selectedTabKey: 1,
            tabs: defaultTabs,
            
            iterations: 1000,
            iterating: false,
            
            competitionResults: []
        };
        
        this.tabs_counter = 1;
        
        this.handleTabSelect = this.handleTabSelect.bind(this);
        this.addBtnHandler = this.addBtnHandler.bind(this);
        this.onCloseTab = this.onCloseTab.bind(this);
        this.onStrategyNameChangeTab = this.onStrategyNameChangeTab.bind(this);
        this.onStrategyColorChange = this.onStrategyColorChange.bind(this);
        this.handleIterationsChange = this.handleIterationsChange.bind(this);
        this.onIterateBtnClick = this.onIterateBtnClick.bind(this);
        this.onTabCodeChange = this.onTabCodeChange.bind(this);
        this.runIteration = this.runIteration.bind(this);
    }
    
    handleTabSelect(selectedTabKey) {
        this.setState({ selectedTabKey });
    }
    
    addBtnHandler() {
        const newTab = {
            index: ++this.tabs_counter,
            strategyName: 'Strategy',
            strategyColor: 'red',
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
    
    onStrategyColorChange(index, strategyColor) {
        this.setState({
            tabs: this.state.tabs.map(tab => {
                if (tab.index === index) {
                    return { ...tab, strategyColor };
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
        
        let newCompRes = {
            iteration: this.state.competitionResults.length + 1,
            deck,
            scores: [] 
        };
        
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
            
            newCompRes.scores.push({
                strategyName: tab.strategyName,
                score: gameState.totalScore
            });
        });
        
        this.setState({
            competitionResults: this.state.competitionResults.concat(newCompRes)
        });
        
        if (this.state.iterating) {
            if (this.state.competitionResults.length < this.state.iterations) {
                setTimeout(() => {
                    this.runIteration();
                }, 500);
            } else {
                    this.setState({
                        iterating: false
                    });
            }
        }
    }
    
    onIterateBtnClick() {
        var nextstate;
        if (!this.state.iterating) {
            nextstate = {
                competitionResults: []
            };
        }
        
        this.setState({
            ...nextstate,
            iterating: !this.state.iterating
        }, () => {
            if (this.state.iterating) {
                this.runIteration();
            }
        });
    }
    
    render() {
        let sums = this.state.tabs.map(tab => 0);
        
        var lineData = this.state.tabs.map((tab, idx) => {
            return {
                name: tab.strategyName,
                values: this.state.competitionResults.map(competitionRes => {
                    sums[idx] += competitionRes.scores[idx].score;
                    
                    return {
                        x: competitionRes.iteration,
                        y: sums[idx] //competitionRes.scores[idx].score
                    };
                })
            };
        });
        
        const colorFunc = idx => this.state.tabs[idx].strategyColor;

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
                        {this.state.tabs.map(tab => <Tab eventKey={tab.index} title={tab.strategyName}>
                            <AiTab index={tab.index} code={tab.code} strategyName={tab.strategyName} strategyColor={tab.strategyColor}
                                onStrategyNameChange={this.onStrategyNameChangeTab} onStrategyColorChange={this.onStrategyColorChange} onClose={this.onCloseTab} onCodeChange={this.onTabCodeChange} />
                        </Tab>)}
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
                        <div className="row">
                            <div className="col-sm-4 col-md-4">
                                <Table striped bordered condensed hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            {this.state.tabs.map(tab => <th>{tab.strategyName}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.competitionResults.map((competitionRes, idx) => {
                                            return (
                                                <tr>
                                                    <td>{competitionRes.iteration}</td>
                                                    {competitionRes.scores.map(scoreRec => <td>{scoreRec.score}</td>)}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                            <div className="col-sm-8 col-md-8">
                                {lineData.length > 0 && lineData[0].values.length > 0 &&
                                <LineChart
                                    legend={true}
                                    width={1000}
                                    height={500}
                                    circleRadius={1}
                                    data={lineData}
                                    colors={colorFunc}
                                    title="Compare"
                                >
                                </LineChart>}
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>
        );
    }
}

export default AiCompetition;