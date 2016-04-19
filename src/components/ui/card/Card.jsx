import React, { Component, PropTypes as pt } from 'react';
import classNames from 'classnames';

import './card.less'

class Card extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const suitClass = this.props.closed ? 'closed' : this.props.suit;
        
        const cardClassNames = classNames({
            card: true,
            shadow: this.props.selected,
            [suitClass]: true
        });
        
        return (
            <div
                className={cardClassNames}
                onClick={this.props.onClick.bind(this, this.props.suit, this.props.rank)}
            >
                <div className="topPlaceholder"></div>
                <span>{this.props.closed ? '?' : this.props.rank}</span>
            </div>
        );
    }
}

Card.propsTypes = {
    closed: pt.bool,
    
    onClick: pt.func
};

Card.defaultProps = {
    closed: false,
    
    onClick: () => {}
}

export default Card;