import React, { Component, PropTypes as pt } from 'react';
import classNames from 'classnames';

import './card.less'

class Card extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const cardClassNames = classNames({
            card: true,
            shadow: this.props.selected,
            [this.props.suit]: true
        });
        
        return (
            <div
                className={cardClassNames}
                onClick={this.props.onClick.bind(this, this.props.suit, this.props.rank)}
            >
                <div className="topPlaceholder"></div>
                <span>{this.props.rank}</span>
            </div>
        );
    }
}

Card.propsTypes = {
    onClick: pt.func
};

Card.defaultProps = {
    onClick: () => {}
}

export default Card;