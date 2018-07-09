import React, { Component, createContext } from 'react';
import * as Eos from 'eosjs';
import * as EosFormat from 'eosjs/lib/format';
import { BigNumber } from 'bignumber.js';
import moment from 'moment';
import * as AppCommon from './AppCommon';
import * as RootState from './RootState';

const Context = createContext(); 
const { Provider, Consumer: RootConsumer } = Context; 

class RootProvider extends Component {
    state = RootState.state;

    _analyzeChartStatus = async () => {
        const { scatter, eos, newsfeed, head_block_time } = this.state;
        if(!scatter || !eos) return;

        const eosLatestBlockTime = new Date(head_block_time);
        eosLatestBlockTime.setDate(eosLatestBlockTime.getDate() - 7);
        
        var byDay = {};

        let reduct = (feed) => {
            let key = eosLatestBlockTime.toDateString();
                
            const existDay = byDay[key];
            byDay[key] = existDay + 1;

            return feed;
        }

        for (let i = 0; i < 7; i++) {
            let key = eosLatestBlockTime.toDateString();

            byDay[key] = 0;
            
            newsfeed.filter(feed => {
                return new Date(feed['created']).toDateString() === eosLatestBlockTime.toDateString();
            })
            .map(reduct);

            eosLatestBlockTime.setDate(eosLatestBlockTime.getDate() + 1);
        }

        newsfeed.filter(feed => {
            return new Date(feed['created']) >= eosLatestBlockTime
        })
        .map(feed => {
            let key = new Date(feed['created']).toDateString();
            
            const existDay = byDay[key];
            if(existDay === undefined){
                byDay[key] = 1;
            }
            else {
                byDay[key] = existDay + 1;
            }

            return feed;
        });

        const chartData = []


        for( var key in byDay ) {
            chartData.push({date : new Date(key).toISOString(), value : byDay[key]});
        }

        //chartData.push({date: "2018-07-01T15:00:00.000Z", value : 2});
        this.setState({
            chartData
        });
    }

    actions = {
        login: async () => {
            const { scatter} = this.state;
            if(!scatter) return;
            let id = await scatter.getIdentity(AppCommon.requiredFields);
            
            if (id) {
                scatter.useIdentity(id);
                console.log('Possible identity', scatter.identity);
                const accountName = scatter.identity.accounts.find(acc => acc.blockchain === AppCommon.NETWORK.blockchain);

                this.setState({
                    identity: id,
                    accountName: accountName.name
                });
            }
        },

        logout: async () => {
            const { scatter } = this.state;
            if(!scatter) return;
            let res = await scatter.forgetIdentity();

            console.log('logout : ' + res);

            this.setState({
                identity: null,
                accountName: ''
            });
        },

        checkLoginState: async () => {
            const { scatter } = this.state;
            if(!scatter) return;
            let isLoggedIn = scatter && !!scatter.identity;

            if (!isLoggedIn) {
                this.setState({
                    identity: null,
                    accountName: ''
                });
            } else {
                const accountName = scatter.identity.accounts.find(acc => acc.blockchain === AppCommon.NETWORK.blockchain);

                this.setState({
                    identity: scatter.identity,
                    accountName: accountName.name
                });
            }
        },

        isLoggedIn: () => {
            const { scatter } = this.state;
            if(!scatter) return false;
            return scatter && !!scatter.identity;
        },

        homePageLoaded: async () =>{
            const { scatter, eos } = this.state;
            if(!scatter || !eos) return;

            try
            {
                const { loadLatestFeeds, checkLoginState, notifyFeedsUpdated } = this.actions;
                const chainInfo = await eos.getInfo({}).then(result => result);
                const head_block_time = chainInfo["head_block_time"]
    
                await checkLoginState();
                const result = await loadLatestFeeds();
                const resultLength = result.length;
                const nextUpperBound = (result && resultLength > 0 ? result[resultLength - 1].id : 0);
                notifyFeedsUpdated(result, nextUpperBound);
                
                this.setState({
                    head_block_time
                });
    
                this._analyzeChartStatus();
            }catch(err){
                console.log(err);
            }
        },

        eosAccountPageLoaded : async () => {
            const { loadMyAccountInfo} = this.actions;
            const { scatter } = this.state;
            if(!scatter) return;

            await loadMyAccountInfo();
        },

        loadLatestFeeds : async () =>{
            const { scatter, eos, accountName } = this.state;
            if(!scatter || !eos) return;

            const table_key = new BigNumber(EosFormat.encodeName(accountName, false))
    
            return new Promise((resolve, reject) => {
                    eos.getTableRows(
                    {
                        json: true, 
                        code: AppCommon.CONTRACT_NAME, 
                        scope: AppCommon.CONTRACT_NAME, 
                        table: AppCommon.TABLE_NAME, 
                        table_key: table_key, 
                        upper_bound: AppCommon.MAX_BOUND,
                        limit : AppCommon.MAX_LIMIT})
                        .then((data) => {
                            let newFeeds = [];
                            
                            if (data.rows && data.rows.length > 0) {
                                const sortedData = data.rows.reverse();
                                const latestFeeds = sortedData.slice(0, AppCommon.PAGE_LIMIT);
                                latestFeeds.map(d => {
                                    return newFeeds.push(
                                        {
                                            id : d._id,
                                            author : d.author, 
                                            content : d.content, 
                                            created : moment.unix(d.created).format('LLL')
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

            loadMoreFeeds : async () =>{
                const { scatter, eos, nextUpperBound, accountName } = this.state;
                if(!scatter || !eos) return;
                const nextLowerBound = Math.max(nextUpperBound - AppCommon.PAGE_LIMIT, 0);
                const table_key = new BigNumber(EosFormat.encodeName(accountName, false));

                return new Promise((resolve, reject) => {
                    eos.getTableRows(
                        {
                            json: true, 
                            code: AppCommon.CONTRACT_NAME, 
                            scope: AppCommon.CONTRACT_NAME, 
                            table: AppCommon.TABLE_NAME, 
                            table_key: table_key, 
                            lower_bound : nextLowerBound,
                            upper_bound: nextUpperBound,
                            limit : AppCommon.PAGE_LIMIT})
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
                                                created : moment.unix(d.created).format('LLL')
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

            loadBetweenLatestAndCurrentFeed : async () =>{
                const { scatter, eos, newsfeed, accountName } = this.state;
                if(!scatter || !eos) return;
                const table_key = new BigNumber(EosFormat.encodeName(accountName, false))
                const latestFeed = newsfeed[0];
                let lowerBound = 0;
    
                if(latestFeed !== undefined){
                    lowerBound = latestFeed.id + 1;
                }
                
                eos.getTableRows(
                {
                    json: true, 
                    code: AppCommon.CONTRACT_NAME, 
                    scope: AppCommon.CONTRACT_NAME, 
                    table: AppCommon.TABLE_NAME, 
                    table_key: table_key, 
                    lower_bound: lowerBound,
                    upper_bound: AppCommon.MAX_BOUND,
                    limit : AppCommon.MAX_LIMIT})
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
                                        created : moment.unix(d.created).format('LLL')
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

            loadMyFeeds : async () =>{
                const { scatter, eos, accountName } = this.state;
                if(!scatter || !eos) return;
                const table_key = new BigNumber(EosFormat.encodeName(accountName, false))
        
                return new Promise((resolve, reject) => {
                    eos.getTableRows(
                    {
                        json: true, 
                        code: AppCommon.CONTRACT_NAME, 
                        scope: AppCommon.CONTRACT_NAME, 
                        table: AppCommon.TABLE_NAME, 
                        table_key: table_key, 
                        upper_bound: AppCommon.MAX_BOUND,
                        limit : AppCommon.MAX_LIMIT})
                        .then((data) => {
                            let newFeeds = [];
                            
                            if (data.rows && data.rows.length > 0) {
                                const sortedData = data.rows.reverse();
                                const latestFeeds = sortedData.slice(0, AppCommon.PAGE_LIMIT);
                                latestFeeds.map(d => {
                                    if(d.author !== accountName) return d;
                                    return newFeeds.push(
                                        {
                                            id : d._id,
                                            author : d.author, 
                                            content : d.content, 
                                            created : moment.unix(d.created).format('LLL')
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

        notifyFeedsUpdated : (newFeeds, nextUpperBound) => {
            this.setState({
                newsfeed : newFeeds,
                nextUpperBound
            })
        },

        postFeed: async (title, msg) => {
            const { scatter, eos } = this.state;
            if(!scatter || !eos) return;

            if (scatter && scatter.identity) {
                const account = scatter.identity.accounts.find(acc => acc.blockchain === AppCommon.NETWORK.blockchain);
                const options = {authorization: [`${account.name}@${account.authority}`]};
                return eos.contract(AppCommon.CONTRACT_NAME).then(contract => contract.write(account.name, title, msg, options));
            }

            return false;
        },

        removeFeed: async (_id) => {
            const { scatter, eos } = this.state;
            if(!scatter || !eos) return;

            if (scatter && scatter.identity) {
                //const account = scatter.identity.accounts.find(acc => acc.blockchain === AppCommon.NETWORK.blockchain);
                //const options = {authorization: [`${account.name}@${account.authority}`]};
                return eos.contract(AppCommon.CONTRACT_NAME).then(contract => contract.remove(_id));
            }
            return false;
        },

        loadMyAccountInfo: async () => {
            const { checkLoginState } = this.actions;
            const { scatter, eos } = this.state;
            if(!scatter || !eos) return;
            
            await checkLoginState();
            const { accountName } = this.state;

            if(eos && accountName){
                console.log(accountName);
                const { loadMyFeeds } = this.actions;
                const accountInfo = await eos.getAccount(accountName);

                const mynewsfeed = await loadMyFeeds();
                const myFeedsLength = mynewsfeed.length;
                const myfeednextUpperBound = (mynewsfeed && myFeedsLength > 0 ? mynewsfeed[myFeedsLength - 1].id : 0);
                
                this.setState({
                    accountInfo,
                    mynewsfeed,
                    myfeednextUpperBound
                })
            }
        },

        setScatter: (scatter) => {

            this.setState({
                scatter,
                eos : scatter && scatter.eos(AppCommon.NETWORK, Eos, AppCommon.CONFIG)
            })            
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

function withRoot(WrappedComponent) {
    return function WithRoot(props) {
        return (
            <RootConsumer>
            {
                ({ state, actions }) => (
                    <WrappedComponent
                        scatter={state.scatter}
                        eos={state.eos}
                        identity={state.identity}
                        accountName={state.accountName}
                        accountInfo={state.accountInfo}
                        nextUpperBound={state.nextUpperBound}
                        chartData={state.chartData}
                        newsfeed={state.newsfeed}
                        mynewsfeed={state.mynewsfeed}
                        login={actions.login}
                        logout={actions.logout}
                        isLoggedIn={actions.isLoggedIn}
                        checkLoginState={actions.checkLoginState}
                        homePageLoaded={actions.homePageLoaded}
                        postFeed={actions.postFeed}
                        removeFeed={actions.removeFeed}
                        loadLatestFeeds={actions.loadLatestFeeds}
                        loadMoreFeeds={actions.loadMoreFeeds}
                        loadBetweenLatestAndCurrentFeed={actions.loadBetweenLatestAndCurrentFeed}
                        notifyFeedsUpdated={actions.notifyFeedsUpdated}
                        loadMyAccountInfo={actions.loadMyAccountInfo}
                        loadMyFeeds={actions.loadMyFeeds}
                        eosAccountPageLoaded={actions.eosAccountPageLoaded}
                        setScatter={actions.setScatter}
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