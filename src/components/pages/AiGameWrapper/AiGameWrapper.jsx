import React, { Component } from 'react';
import AiGame from '../AiGame/AiGame.jsx';

class AiGameWrapper extends Component {
    render() {
        return (
            <div>
                <AiGame multireducerKey="ai_game" />
            </div>
        );
    }
}

export default AiGameWrapper;