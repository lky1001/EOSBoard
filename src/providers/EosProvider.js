import React, { Component, createContext } from 'react';

const Context = createContext();

const { Provider, Consumer: EosConsumer } = Context;

class EosProvider extends Component {
    state = {
        eos: null
    }

    actions = {
        setValue: (value) => {
            this.setState(value);
        }
    }

    render() {
        const { state, actions } = this;
        const value = { state, actions };
        return (
            <Provider value={value}>
                {this.props.children}
            </Provider>
        )
    }
}

export {
    EosProvider,
    EosConsumer
};