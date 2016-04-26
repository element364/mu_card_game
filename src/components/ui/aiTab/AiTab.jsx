import React, { Component, PropTypes } from 'react';
import { Input, Button } from 'react-bootstrap';

class AiTab extends Component {    
    constructor(props) {
        super(props)
        
        this.onCloseHandler = this.onCloseHandler.bind(this);
        this.handleStrategyNameChange = this.handleStrategyNameChange.bind(this);
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
                <div className="col-sm-10 col-md-10">
                    <Input type="text" onChange={this.handleStrategyNameChange} value={this.props.strategyName} />
                </div>
                <div className="col-sm-2 col-md-2">
                    <Button onClick={this.onCloseHandler}>X</Button>
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