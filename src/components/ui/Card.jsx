import React, { Component } from 'react';

import './card.css'

class Card extends Component {
    render() {
        const cardStyle = {
            display: 'inline-block',
            height: '185px',
            width: '132px',
            float: 'left'
        };
        
        console.log('card');
        return <div className="card" style={cardStyle}>
            <span>{this.props.rank}</span>
        </div>;
    }
}

export default Card;