import React, { Component } from 'react';
import HumanGame from '../HumanGame/HumanGame.jsx';

class HumanGameWrapper extends Component {
    render() {
        return (
            <div>
                <HumanGame multireducerKey="human_game" />
            </div>
        );
    }
}

export default HumanGameWrapper;