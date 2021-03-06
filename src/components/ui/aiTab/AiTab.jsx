import React, { Component, PropTypes } from 'react';
import { Input, Button } from 'react-bootstrap';

var CodeMirror = require('codemirror/lib/codemirror');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/mode/javascript/javascript');

require('./ai-tab.less');

class AiTab extends Component {    
    constructor(props) {
        super(props)
        
        this.onCloseHandler = this.onCloseHandler.bind(this);
        this.handleStrategyNameChange = this.handleStrategyNameChange.bind(this);
        this.handleStrategyColorChange = this.handleStrategyColorChange.bind(this);
    }
    
    componentDidMount() {
        this.codeMirror = CodeMirror.fromTextArea(
            document.getElementById(`cmEditor_${this.props.index}`),
            {
                lineNumbers: true,
                theme: 'material',
                mode: 'javascript'
            }
        );
        this.codeMirror.on('change', cm => this.props.onCodeChange(this.props.index, cm.getValue()));
    }
    
    onCloseHandler() {
        this.props.onClose(this.props.index);
    }
    
    handleStrategyNameChange(e) {
        this.props.onStrategyNameChange(this.props.index, e.target.value);
    }
    
    handleStrategyColorChange(e) {
        this.props.onStrategyColorChange(this.props.index, e.target.value);
    }
    
    render() {
        return (
            <div className="container ai-tab">
                <div className="row">
                    <div className="col-sm-5 col-md-5">
                        <Input type="text" onChange={this.handleStrategyNameChange} value={this.props.strategyName} />
                    </div>
                    <div className="col-sm-5 col-md-5">
                        <Input type="text" onChange={this.handleStrategyColorChange} value={this.props.strategyColor} />
                    </div>
                    <div className="col-sm-2 col-md-2">
                        <Button onClick={this.onCloseHandler}>X</Button>
                    </div>
                </div>
                <div className="row">
                    <textarea id={`cmEditor_${this.props.index}`} rows="3" value={this.props.code} />
                </div>
            </div>
        );
    }
}

AiTab.propTypes = {
    onClose: PropTypes.func,
    onStrategyNameChange: PropTypes.func,
    onStrategyColorChange: PropTypes.func,
    onCodeChange: PropTypes.func
};

AiTab.defaultProps = {
    onClose: () => {},
    onStrategyNameChange: () => {},
    onStrategyColorChange: () => {},
    onCodeChange: () => {}
};

export default AiTab;