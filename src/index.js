import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, hashHistory } from 'react-router';
import configureStore from './stores';
import App from './containers/App';
import AiProg from './components/pages/AiProg/AiProg.jsx';

const store = configureStore();

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, store)

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/ai_prog" component={AiProg} />
            <Route path="/" component={App} />
        </Router>
    </Provider>,
    document.getElementById('app')
);
