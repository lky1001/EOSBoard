import React, { Component } from 'react';
import "../styles/EosAccount.scss";
import { withRoot } from '../contexts/RootContext';

class EosAccount extends Component {
    render() {
        const { identity, accountName } = this.props;

        return(
            <div>
                {accountName}
            </div>
        )
    }
}

export default withRoot((EosAccount));