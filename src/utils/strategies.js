const min5Strategy = `
    function getCardsScore(cards) {
        var sortedCards = _.sortBy(cards, card => card.rank);
        
        if (sortedCards[1].rank === sortedCards[0].rank + 1 && sortedCards[2].rank === sortedCards[1].rank + 1) {
            if (sortedCards[0].suit === sortedCards[1].suit && sortedCards[1].suit === sortedCards[2].suit) {
                return (sortedCards[2].rank + 2);
            } else {
                return sortedCards[0].rank * 10;
            }
        }
        
        if (sortedCards[0].rank === sortedCards[1].rank && sortedCards[1].rank === sortedCards[2].rank) {
            return (sortedCards[2].rank + 1) * 10;
        }
        
        return 0;
    }
    
    function makeMove(cards, deadCards) {
        // Находим все возможные варианты реализации 3 карт
        var candidates = [];
        
        for (var i = 0; i < cards.length; i++) {
            for (var j = i + 1; j < cards.length; j++) {
                for (var k = j + 1; k < cards.length; k++) {
                    var cardsSubset = [ cards[i], cards[j], cards[k] ],
                        cardsSubsetScore = getCardsScore(cardsSubset);
                    
                    if (cardsSubsetScore > 0) {
                        candidates.push({
                            cardsSubsetScore,
                            cardsSubset
                        });
                    }
                }
            }
        }
        
        if (candidates.length > 0) {
            // Находим кобинацию, дающую меньше всего очков
            var worstScoreIdx = 0;
            for (var i = 0; i < candidates.length; i++) {
                if (candidates[i].cardsSubsetScore < candidates[worstScoreIdx].cardsSubsetScore) {
                    worstScoreIdx = i;
                }
            }
            
            return {
                type: 'RELEASE_CARDS',
                payload: candidates[worstScoreIdx].cardsSubset
            };
        }
        
        if (deadCards.length === 24) {
            return {
                type: 'END_GAME'
            };
        } else {
            return {
                type: 'CHANGE_CARDS',
                payload: cards
            };
        }
    }
    function getCardsScore(cards) {
        var sortedCards = _.sortBy(cards, card => card.rank);
        
        if (sortedCards[1].rank === sortedCards[0].rank + 1 && sortedCards[2].rank === sortedCards[1].rank + 1) {
            if (sortedCards[0].suit === sortedCards[1].suit && sortedCards[1].suit === sortedCards[2].suit) {
                return (sortedCards[2].rank + 2);
            } else {
                return sortedCards[0].rank * 10;
            }
        }
        
        if (sortedCards[0].rank === sortedCards[1].rank && sortedCards[1].rank === sortedCards[2].rank) {
            return (sortedCards[2].rank + 1) * 10;
        }
        
        return 0;
    }
    
    function makeMove(cards, deadCards) {
        // Находим все возможные варианты реализации 3 карт
        var candidates = [];
        
        for (var i = 0; i < cards.length; i++) {
            for (var j = i + 1; j < cards.length; j++) {
                for (var k = j + 1; k < cards.length; k++) {
                    var cardsSubset = [ cards[i], cards[j], cards[k] ],
                        cardsSubsetScore = getCardsScore(cardsSubset);
                    
                    if (cardsSubsetScore > 0) {
                        candidates.push({
                            cardsSubsetScore,
                            cardsSubset
                        });
                    }
                }
            }
        }
        
        if (candidates.length > 0) {
            // Находим кобинацию, дающую меньше всего очков
            var worstScoreIdx = 0;
            for (var i = 0; i < candidates.length; i++) {
                if (candidates[i].cardsSubsetScore < candidates[worstScoreIdx].cardsSubsetScore) {
                    worstScoreIdx = i;
                }
            }
            
            return {
                type: 'RELEASE_CARDS',
                payload: candidates[worstScoreIdx].cardsSubset
            };
        }
        
        if (deadCards.length === 24) {
            return {
                type: 'END_GAME'
            };
        } else {
            return {
                type: 'CHANGE_CARDS',
                payload: cards
            };
        }
    }

`;

export { min5Strategy }

const min1Strategy = `
    function getCardsScore(cards) {
        var sortedCards = _.sortBy(cards, card => card.rank);
        
        if (sortedCards[1].rank === sortedCards[0].rank + 1 && sortedCards[2].rank === sortedCards[1].rank + 1) {
            if (sortedCards[0].suit === sortedCards[1].suit && sortedCards[1].suit === sortedCards[2].suit) {
                return (sortedCards[2].rank + 2);
            } else {
                return sortedCards[0].rank * 10;
            }
        }
        
        if (sortedCards[0].rank === sortedCards[1].rank && sortedCards[1].rank === sortedCards[2].rank) {
            return (sortedCards[2].rank + 1) * 10;
        }
        
        return 0;
    }
    
    function makeMove(cards, deadCards) {
        // Находим все возможные варианты реализации 3 карт
        var candidates = [];
        
        for (var i = 0; i < cards.length; i++) {
            for (var j = i + 1; j < cards.length; j++) {
                for (var k = j + 1; k < cards.length; k++) {
                    var cardsSubset = [ cards[i], cards[j], cards[k] ],
                        cardsSubsetScore = getCardsScore(cardsSubset);
                    
                    if (cardsSubsetScore > 0) {
                        candidates.push({
                            cardsSubsetScore,
                            cardsSubset
                        });
                    }
                }
            }
        }
        
        if (candidates.length > 0) {
            // Находим кобинацию, дающую меньше всего очков
            var worstScoreIdx = 0;
            for (var i = 0; i < candidates.length; i++) {
                if (candidates[i].cardsSubsetScore < candidates[worstScoreIdx].cardsSubsetScore) {
                    worstScoreIdx = i;
                }
            }
            
            return {
                type: 'RELEASE_CARDS',
                payload: candidates[worstScoreIdx].cardsSubset
            };
        }
        
        if (deadCards.length === 24) {
            return {
                type: 'END_GAME'
            };
        } else {
            return {
                type: 'CHANGE_CARDS',
                payload: [cards[Math.floor(Math.random()*cards.length)]]
            };
        }
    }
`;

export { min1Strategy }

const superStrategy = `
    function getCardsScore(sortedCards) {
        if (sortedCards[1].rank === sortedCards[0].rank + 1 && sortedCards[2].rank === sortedCards[1].rank + 1) {
            if (sortedCards[0].suit === sortedCards[1].suit && sortedCards[1].suit === sortedCards[2].suit) {
                return (sortedCards[2].rank + 2);
            } else {
                return sortedCards[0].rank * 10;
            }
        }
        
        if (sortedCards[0].rank === sortedCards[1].rank && sortedCards[1].rank === sortedCards[2].rank) {
            return (sortedCards[2].rank + 1) * 10;
        }
        
        return 0;
    }
    
    function makeMove(cards, deadCards) {
        // Находим все возможные варианты реализации 3 карт
        var candidates = [];
        
        for (var i = 0; i < cards.length; i++) {
            for (var j = i + 1; j < cards.length; j++) {
                for (var k = j + 1; k < cards.length; k++) {
                    var cardsSubset = _.sortBy([ cards[i], cards[j], cards[k] ], card => card.rank),
                        cardsSubsetScore = getCardsScore(cardsSubset);
                    
                    if (cardsSubsetScore > 0) {
                        candidates.push({
                            cardsSubsetScore,
                            cardsSubset
                        });
                    }
                }
            }
        }
        
        if (candidates.length > 0) {
			candidates = _.sortBy(candidates, candidate => -candidate.cardsSubsetScore);
          
            for (var i = 0; i < candidates.length; i++) {
              	var candidate = candidates[i];
				if (candidate.cardsSubset[0].rank === 6 && candidate.cardsSubset[1].rank === 7 && candidate.cardsSubset[2].rank === 8) {
                    return {
                        type: 'RELEASE_CARDS',
                        payload: candidate.cardsSubset
                    };
                }
            }
            
            for (var i = 0; i < candidates.length; i++) {
              	var candidate = candidates[i];
				if (candidate.cardsSubset[0].rank < 6 && candidate.cardsSubset[1].rank < 6 && candidate.cardsSubset[2].rank < 6) {
                    return {
                        type: 'RELEASE_CARDS',
                        payload: candidate.cardsSubset
                    };
                }
            }
        }
        
        if (deadCards.length === 24) {
            return {
                type: 'END_GAME'
            };
        } else {
          	var sortedCards = _.sortBy(cards, card => card.rank);
            return {
                type: 'CHANGE_CARDS',
                payload: [sortedCards[0]]
            };
        }
    }
`;

export { superStrategy }