import React, { Component, PropTypes } from 'react';
import { Input, Button } from 'react-bootstrap';

var CodeMirror = require('codemirror/lib/codemirror');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/mode/javascript/javascript');

class AiTab extends Component {    
    constructor(props) {
        super(props)
        
        this.onCloseHandler = this.onCloseHandler.bind(this);
        this.handleStrategyNameChange = this.handleStrategyNameChange.bind(this);
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
    }
    
    onCloseHandler() {
        this.props.onClose(this.props.index);
    }
    
    handleStrategyNameChange(e) {
        this.props.onStrategyNameChange(this.props.index, e.target.value);
    }
    
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-10 col-md-10">
                        <Input type="text" onChange={this.handleStrategyNameChange} value={this.props.strategyName} />
                    </div>
                    <div className="col-sm-2 col-md-2">
                        <Button onClick={this.onCloseHandler}>X</Button>
                    </div>
                </div>
                <div className="row">
                    <textarea id={`cmEditor_${this.props.index}`} rows="3" value="" />
                </div>
            </div>
        );
    }
}

AiTab.propTypes = {
    onClose: PropTypes.func,
    onStrategyNameChange: PropTypes.func
};

AiTab.defaultProps = {
    onClose: () => {},
    onStrategyNameChange: () => {}
};

export default AiTab;