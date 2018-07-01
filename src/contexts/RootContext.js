import React, { Component, createContext } from 'react';
import * as Eos from 'eosjs';

const Context = createContext(); 
const { Provider, Consumer: RootConsumer } = Context; 

const CONTRACT_NAME = "board";
const TABLE_NAME = "mcontent";

const requiredFields = {
    accounts:[
        {blockchain:'eos', host:'127.0.0.1', port:8888, chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'}
    ]
};

const NETWORK = {
    protocol:'http',
    blockchain: 'eos',
    host: '127.0.0.1',
    port: '8888',
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
};

const CONFIG = {
    broadcast: true,
    sign: true,
    chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
};

class RootProvider extends Component {
    constructor(props) {
        super(props);

        document.addEventListener('scatterLoaded', scatterExtension => {
            this.scatter = window.scatter;

            if (this.scatter) {
                this.eos = this.scatter.eos(NETWORK, Eos, CONFIG);            
            }
        });
    }

    state = {
        identity: null,
        accountName: '',
        posts: []
    }

    actions = {
        login: async () => {
            if (this.scatter) {
                let id = await this.scatter.getIdentity(requiredFields);
                
                if (id) {
                    this.scatter.useIdentity(id);
                    console.log('Possible identity', this.scatter.identity);
                    const accountName = this.scatter.identity.accounts.find(acc => acc.blockchain === NETWORK.blockchain);

                    this.setState({
                        identity: id,
                        accountName: accountName.name
                    });
                }
            } else {
                // todo - login eosjs with private key
            }
        },

        logout: async () => {
            if (this.scatter) {
                let res = await this.scatter.forgetIdentity();

                console.log('logout : ' + res);

                this.setState({
                    identity: null,
                    accountName: ''
                });
            }
        },

        isLoggedIn: () => {
            return this.scatter && !!this.scatter.identity;
        },

        loadLastPost: async () => {
            let data = await this.eos.getTableRows(true, CONTRACT_NAME, CONTRACT_NAME, TABLE_NAME, '', '' ,'' , 2000);
            
            let results = [];

            if (data.rows) {
                const sortedData = data.rows.reverse();

                sortedData.map(d => {
                    return results.push({author : d.author, content : d.content, created : new Date(d.created * 1000).toDateString()});
                });
            }

            this.setState({
                posts : results
            })
        },

        doPost: async (title, msg) => {
            if (this.scatter && this.scatter.identity) {
                const account = this.scatter.identity.accounts.find(acc => acc.blockchain === NETWORK.blockchain);
                const options = {authorization: [`${account.name}@${account.authority}`]};
                return this.eos.contract(CONTRACT_NAME).then(contract => contract.write(account.name, title, msg, options));
            }

            return false;
        },
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

function withRoot(WrappedComponent) {
    return function WithRoot(props) {
        return (
            <RootConsumer>
            {
                ({ state, actions }) => (
                    <WrappedComponent
                        identity={state.identity}
                        accountName={state.accountName}
                        posts={state.posts}
                        login={actions.login}
                        logout={actions.logout}
                        isLoggedIn={actions.isLoggedIn}
                        loadLastPost={actions.loadLastPost}
                        doPost={actions.doPost}
                    />
                )
            }
            </RootConsumer>
        )
    }
  }
  
  export {
    RootProvider,
    RootConsumer,
    withRoot
  };