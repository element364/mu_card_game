import React, { Component } from 'react';
import classNames from 'classnames';

import './card.less'

class Card extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selected: false
        };
        
        this.clickHandler = this.clickHandler.bind(this)
    }
    
    clickHandler() {
        this.setState({
            selected: !this.state.selected
        })
    }
    
    render() {
        const cardStyle = {
            //backgroundColor: this.props.suit
        };
        
        console.log('card');
        return (
            <div
                className={classNames({ card: true, shadow: this.state.selected })}
                style={cardStyle}
                onClick={this.clickHandler}
            >
                <span>{this.props.rank}</span>
            </div>
        );
    }
}

export default Card;