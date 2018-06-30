import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { RootProvider } from '../contexts/RootContext';

const AppProvider = ({ contexts, children }) => contexts.reduce(
    (prev, context) => React.createElement(context, {
      children: prev
    }), 
    children
);
class Root extends Component {
    render(){
        return(
            <AppProvider contexts={[RootProvider]}>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </AppProvider>
        );
    }
} 

export default Root;