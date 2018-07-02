import React, { Component, createContext } from 'react';
import * as Eos from 'eosjs';
import * as EosFormat from 'eosjs/lib/format';
import { BigNumber } from 'bignumber.js';

const Context = createContext(); 
const { Provider, Consumer: RootConsumer } = Context; 

const MAX_BOUND = "10000000000000000000";
const MAX_LIMIT = "10000000000000000000";
const PAGE_LIMIT = 20;

const protocol = 'https';
const host = 'nodes.get-scatter.com';
const port = 443;
const chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';

const CONTRACT_NAME = 'faceostest12';
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
                this._handleScatterInitialized();
            }
        });
    }

    state = {
        identity: null,
        accountName: '',
        newsfeed: [], 
        nextUpperBound : 0
    }

    _handleScatterInitialized = async() =>{
        const { checkLoginState, loadLatestFeeds, notifyFeedsUpdated } = this.actions;

        try
        {
            await checkLoginState();
            const result = await loadLatestFeeds();
            const resultLength = result.length;
            const nextUpperBound = (result && resultLength > 0 ? result[resultLength - 1].id : 0);
            notifyFeedsUpdated(result, nextUpperBound);
        }
        catch(err){
            console.log(err);
        }
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

        checkLoginState: async () => {
            let isLoggedIn = this.scatter && !!this.scatter.identity;

            if (!isLoggedIn) {
                this.setState({
                    identity: null,
                    accountName: ''
                });
            } else {
                const accountName = this.scatter.identity.accounts.find(acc => acc.blockchain === NETWORK.blockchain);

                this.setState({
                    identity: this.scatter.identity,
                    accountName: accountName.name
                });
            }
        },

        isLoggedIn: () => {
            return this.scatter && !!this.scatter.identity;
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

            loadMoreFeeds : () =>{
                const { nextUpperBound, accountName } = this.state;
                const nextLowerBound = Math.max(nextUpperBound - PAGE_LIMIT, 0);
                const table_key = new BigNumber(EosFormat.encodeName(accountName, false));

                return new Promise((resolve, reject) => {
                    this.eos.getTableRows(
                        {
                            json: true, 
                            code: CONTRACT_NAME, 
                            scope: CONTRACT_NAME, 
                            table: TABLE_NAME, 
                            table_key: table_key, 
                            lower_bound : nextLowerBound,
                            upper_bound: nextUpperBound,
                            limit : PAGE_LIMIT})
                            .then((data) => {
                                let moreFeeds = [];
                                if (data.rows) {
                                    const sortedData = data.rows.reverse();
                                    sortedData.map(d => {
                                        return moreFeeds.push(
                                            {
                                                id : d._id,
                                                author : d.author, 
                                                content : d.content, 
                                                created : new Date(d.created * 1000).toDateString()
                                            });
                                    });
                                }
                                
                            return moreFeeds;
                        })
                        .then((result) => {
                            resolve(result);
                        })
                        .catch(err => {
                            reject(err);
                        });
                  });
            },

            loadBetweenLatestAndCurrentFeed : () =>{
                const { newsfeed, accountName } = this.state;
                const table_key = new BigNumber(EosFormat.encodeName(accountName, false))
                const latestFeed = newsfeed[0];
                let lowerBound = 0;
    
                if(latestFeed !== undefined){
                    lowerBound = latestFeed.id + 1;
                }
                
                this.eos.getTableRows(
                {
                    json: true, 
                    code: CONTRACT_NAME, 
                    scope: CONTRACT_NAME, 
                    table: TABLE_NAME, 
                    table_key: table_key, 
                    lower_bound: lowerBound,
                    upper_bound: MAX_BOUND,
                    limit : MAX_LIMIT})
                    .then((data) => {
                        if (data.rows && data.rows.length > 0) {
                            let newFeeds = [];
                            const sortedData = data.rows.reverse();
    
                            sortedData.map(d => {
                                return newFeeds.push(
                                    {
                                        id : d._id,
                                        author : d.author, 
                                        content : d.content, 
                                        created : new Date(d.created * 1000).toDateString()
                                    });
                            });
    
                            this.setState({
                                newsfeed : [
                                    ...newFeeds,
                                    ...newsfeed
                                ]
                            });
                        }
                    }
                )
            },

        notifyFeedsUpdated : (newFeeds, nextUpperBound) => {
            console.log(newFeeds);
            this.setState({
                newsfeed : newFeeds,
                nextUpperBound
            })
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
                        nextUpperBound={state.nextUpperBound}
                        newsfeed={state.newsfeed}
                        login={actions.login}
                        logout={actions.logout}
                        isLoggedIn={actions.isLoggedIn}
                        checkLoginState={actions.checkLoginState}
                        loadNewsFeed={actions.loadNewsFeed}
                        postFeed={actions.postFeed}
                        loadLatestFeeds={actions.loadLatestFeeds}
                        loadMoreFeeds={actions.loadMoreFeeds}
                        loadBetweenLatestAndCurrentFeed={actions.loadBetweenLatestAndCurrentFeed}
                        notifyFeedsUpdated={actions.notifyFeedsUpdated}
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