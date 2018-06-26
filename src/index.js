import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';
import './styles/index.scss';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
