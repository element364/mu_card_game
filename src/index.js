import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, hashHistory } from 'react-router';
import configureStore from './stores';
import HumanGameWrapper from './components/pages/HumanGameWrapper/HumanGameWrapper.jsx';
import AiGameWrapper from './components/pages/AiGameWrapper/AiGameWrapper.jsx';

const store = configureStore();

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, store)

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/ai_prog" component={AiGameWrapper} />
            <Route path="/" component={HumanGameWrapper} />
        </Router>
    </Provider>,
    document.getElementById('app')
);
