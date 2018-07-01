import React, { Component, createContext } from 'react';
import * as Eos from 'eosjs';
import * as EosFormat from 'eosjs/lib/format';
import { BigNumber } from 'bignumber.js';

const Context = createContext(); 
const { Provider, Consumer: RootConsumer } = Context; 

const MAX_BOUND = "10000000000000000000";
const MAX_LIMIT = "10000000000000000000";
const PAGE_LIMIT = 20;

const protocol = 'http';
const host = '127.0.0.1';
const port = 8888;
const chainId = 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f';

const CONTRACT_NAME = 'board';
const TABLE_NAME = 'mcontent';

const requiredFields = {
    accounts:[
        {
            blockchain:'eos', 
            host: host, 
            port: port, 
            chainId: chainId
        }
    ]
};

const NETWORK = {
    blockchain: 'eos',
    protocol: protocol,
    host: host,
    port: port,
    chainId: chainId
};

const CONFIG = {
    broadcast: true,
    sign: true,
    chainId: chainId
};

class RootProvider extends Component {
    constructor(props) {
        super(props);

        document.addEventListener('scatterLoaded', scatterExtension => {
            console.log('scatterloaded');
            this.scatter = window.scatter;

            if (this.scatter) {
                this.eos = this.scatter.eos(NETWORK, Eos, CONFIG);

                console.log('스캐터 초기화 직전!');
                this.handleHm();
                //this.handleInitialLoad();
                this.actions.loadNewsFeed();
            }
        });
    }

    handleHm = () => {
        console.log("오 초기화 할거야1");
        this.setState({
            scatterInitialized : true
        })
    }
    // handleInitialLoad = async() =>{
    //     const result = await this.actions.loadLatestFeeds();

    //     console.log(result);
    // }

    state = {
        scatterInitialized : false,
        identity: null,
        accountName: '',
        newsfeed: []
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

        loadNewsFeed: async () => {
            let data = await this.eos.getTableRows(true, CONTRACT_NAME, CONTRACT_NAME, TABLE_NAME, '', '' ,'' , 2000);
            
            let results = [];

            if (data.rows) {
                const sortedData = data.rows.reverse();

                sortedData.map(d => {
                    return results.push({author : d.author, content : d.content, created : new Date(d.created * 1000).toDateString()});
                });
            }

            this.setState({
                newsfeed : results
            })
        },

        loadLatestFeeds : () =>{
            const { accountName } = this.state;
            const table_key = new BigNumber(EosFormat.encodeName(accountName, false))
    
            return new Promise((resolve, reject) => {
                    this.eos.getTableRows(
                    {
                        json: true, 
                        code: CONTRACT_NAME, 
                        scope: CONTRACT_NAME, 
                        table: TABLE_NAME, 
                        table_key: table_key, 
                        upper_bound: MAX_BOUND,
                        limit : MAX_LIMIT})
                        .then((data) => {
                            let newFeeds = [];
                            
                            if (data.rows && data.rows.length > 0) {
                                const sortedData = data.rows.reverse();
                                const latestFeeds = sortedData.slice(0, PAGE_LIMIT);
                                latestFeeds.map(d => {
                                    return newFeeds.push(
                                        {
                                            id : d._id,
                                            author : d.author, 
                                            content : d.content, 
                                            created : new Date(d.created * 1000).toDateString()
                                        });
                                });
                            }
                            
                            return newFeeds;
                        })
                        .then((result) => {
                            resolve(result);
                        })
                        .catch(err => {
                            reject(err);
                        });
                    }
                );
            },

        postFeed: async (title, msg) => {
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
                        scatterInitialized={state.scatterInitialized}
                        newsfeed={state.newsfeed}
                        login={actions.login}
                        logout={actions.logout}
                        isLoggedIn={actions.isLoggedIn}
                        loadNewsFeed={actions.loadNewsFeed}
                        postFeed={actions.postFeed}
                        loadLatestFeeds={actions.loadLatestFeeds}
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