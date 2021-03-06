/**
 *  Copyright (c) 2019 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './TokenProvider.css'

/**
 * TokenProvider
 *
 * What a nice round shiny toggle button and a little input text to insert a bearer token inside your GraphQL Request.
 */
export default class TokenProvider extends React.Component {
    static propTypes = {
        onTokenUpdate: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            token: ''
        };
    }

    render() {
        const buttonStyle = {};
        const title = 'Authentication token';
        const abbreviation = 'This includes the token within the request headers to make authenticated requests.'
        buttonStyle.background = 'linear-gradient(rgb(33, 150, 243), rgb(0, 122, 220))';
        buttonStyle.color = 'white';
        return (
            <div className="token-container">
                <span className="token-title">
                    <abbr title={abbreviation}>{title}</abbr>
                </span>
                <input 
                    type="text" 
                    name="token" 
                    placeholder="Token" 
                    className="form-control" 
                    onChange={this.handleChange} 
                    value={this.state.token}         
                />
            </div>
        );
    }

    handleChange = (e) => {
        const token = e.target.value;
        this.setState({
            ...this.state,
            token
        });
        this.props.onTokenUpdate(token);
    };
}
