import React, { Component } from 'react';
import { Button, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router';
import AiTab from '../../ui/aiTab/AiTab.jsx';

class AiCompetition extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedTabKey: 0,
            tabs: []
        };
        
        this.tabs_counter = 0;
        
        this.handleTabSelect = this.handleTabSelect.bind(this);
        this.addBtnHandler = this.addBtnHandler.bind(this);
        this.onCloseTab = this.onCloseTab.bind(this);
        this.onStrategyNameChangeTab = this.onStrategyNameChangeTab.bind(this);
    }
    
    handleTabSelect(selectedTabKey) {
        this.setState({ selectedTabKey });
    }
    
    addBtnHandler() {
        const newTab = {
            index: ++this.tabs_counter,
            strategyName: 'Strategy'
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
                    <Tabs  tiveKey={this.state.selectedTabKey} onSelect={this.handleTabSelect} animation={false} id="noanim-tab-example">
                        {this.state.tabs.map(tab => <Tab eventKey={tab.index} title={tab.strategyName}><AiTab strategyName={tab.strategyName} index={tab.index} onStrategyNameChange={this.onStrategyNameChangeTab} onClose={this.onCloseTab} /></Tab>)}
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default AiCompetition;