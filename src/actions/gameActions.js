import { actionTypes } from './actionTypes';

const startNewGame = () => {
    return {
        type: actionTypes.NEW_GAME,
        payload: ''
    };
};

const selectCards = cards => {
    return {
        type: actionTypes.SELECT_CARDS,
        payload: cards
    };
};

const changeCards = cards => {
    return {
        type: actionTypes.CHANGE_CARDS,
        payload: cards
    };
}

const releaseCards = cards => {
    return {
        type: actionTypes.RELEASE_CARDS,
        payload: cards
    };
};

export { startNewGame, selectCards, changeCards, releaseCards }