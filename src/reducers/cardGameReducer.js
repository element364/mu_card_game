import { shuffle, find, sortBy, remove, isUndefined } from 'lodash';

import { actionTypes } from '../actions/actionTypes';

const generateDeck = () => {
    let result = [];
  
    for (let suit = 0; suit < 3; suit++) {
        for (let rank = 1; rank <= 8; rank++) {
            let suitColor = '';
            switch (suit) {
                case 0:
                    suitColor = 'red';
                    break;
                case 1:
                    suitColor = 'blue';
                    break;
                case 2:
                    suitColor = 'yellow';
                    break;
            }
          
            result.push({
              suit: suitColor,
              selected: false,
              rank
            });
        }
    }
    
    return shuffle(result);
};

const getCardsScore = selectedCards => {
    if (selectedCards.length !== 3) {
        return 0;
    }
    
    const sortedCards = sortBy(selectedCards, card => card.rank);
    
    // Street
    if (sortedCards[1].rank === sortedCards[0].rank + 1
    && sortedCards[2].rank === sortedCards[1].rank + 1) {
        // Street Flush
        if (sortedCards[0].suit === sortedCards[1].suit
            && sortedCards[1].suit === sortedCards[2].suit) {
            return (sortedCards[2].rank + 2) * 10;
            /* [1, 2, 3] => 50
                [2, 3, 4] => 60
                ...
                [6, 7, 8] => 100
            */
            
        } else {
            return sortedCards[0].rank * 10;
            /*
                [1, 2, 3] => 10
                [2, 3, 4] => 20
                ...
                [6, 7, 8] => 60
            */
        }
    }
    
    // Set
    if (sortedCards[0].rank === sortedCards[1].rank
        && sortedCards[1].rank === sortedCards[2].rank) {
        return (sortedCards[2].rank + 1) * 10;
        /*
            [1, 1, 1] => 20
            [2, 2, 2] => 30
            ...
            [8, 8, 8] => 90
        */
    }
    
    return 0;
};

export { getCardsScore }

const initialCardGameState = {
      deck: [],
      cards: [],
      deadCards: [],
      
      totalScore: 0
};

const cardGameReducer = (state = initialCardGameState, action) => {
    switch (action.type) {
        case actionTypes.NEW_GAME:
            var deck = generateDeck(),
                cards = [];
            
            for (let i = 0; i < 5; i++) {
                cards.push( deck.shift() );
            }
                
            return {
                deck,
                cards,
                deadCards: [],
                
                totalScore: 0
            };
        case actionTypes.SELECT_CARDS:
            return {
                ...state,
                cards: state.cards.map(card => {
                    if (find(action.payload, { suit: card.suit, rank: card.rank })) {
                        return { ...card, selected: !card.selected };
                    }
                    return card;
                })
            };
        case actionTypes.CHANGE_CARDS:
            var deck = [...state.deck],
                cards = [...state.cards];
                
            const removedCards = remove(cards, card => {
                return !isUndefined(find(action.payload, { suit: card.suit, rank: card.rank }));
            });
            
            if (removedCards.length !== action.payload.length) {
                console.log('Change wrong args');
                return state;
            }
            
            cards = cards.concat(deck.splice(0, removedCards.length));
                
            return {
                ...state,
                deck,
                cards,
                deadCards: state.deadCards.concat(removedCards)
            };
        case actionTypes.RELEASE_CARDS:
            var deck = [...state.deck],
                cards = [...state.cards];
                
            const releasedCards = remove(cards, card => {
                return !isUndefined(find(action.payload, { suit: card.suit, rank: card.rank }));
            });
            
            if (releasedCards.length !== action.payload.length) {
                console.log('Release wrong args');
                return state;
            }
            
            const score = getCardsScore(releasedCards);
            
            if (score <= 0) {
                console.log('Released cards have no score');
                return state;
            }
            
            cards = cards.concat(deck.splice(0, releasedCards.length));
            
            return {
                ...state,
                deck,
                cards,
                deadCards: state.deadCards.concat(releasedCards),
                totalScore: state.totalScore + score
            };
    }
    
    return state;
};

export { cardGameReducer }