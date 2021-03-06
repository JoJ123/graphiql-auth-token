# GraphiQL-Auth-Token

[![License](https://img.shields.io/npm/l/graphiql.svg?style=flat-square)](LICENSE)

A React subclass of [GraphiQL](https://github.com/graphql/graphiql/tree/master/packages/graphiql) allowing you to add an authentication token from the user interface and to pop up notifications from the server.

<p align="center">
  <img src="https://raw.githubusercontent.com/JohannC/img/master/GraphiQL-with-token-and-notif.png" alt="GraphiQL Auth Token - Screenshot"/>
</p>

## Demo

[Try the live demo](https://nusid.net/graphql-auth-service/). It is implemented in this other package: [GraphQL Auth Service](https://github.com/JohannC/GraphQL-Auth-Service), a customizable authentication service working with express-graphql.

```python
# Enter the following queries replacing the username, email and password #

# First
mutation{
  register(fields:{username:"yourname", email: "your@mail.com" password:"yourpassword"}){
    notifications{
      type
    }
  }
}

# Second
mutation{
  login(fields:{login: "your@mail.com", password:"yourpassword"}){
    token
  }
}

# Third - you need to pass the token fetched in the second query
query{
  me{
    _id
  }
}
```

## Installation
```
npm install --save graphiql-auth-token
```

Alternatively, if you are using [`yarn`](https://yarnpkg.com/):

```
yarn add graphiql-auth-token
```

## Adding an authentication token

GraphiQLAuthToken offers the same properties as [GraphiQL](https://github.com/graphql/graphiql/tree/master/packages/graphiql) as it is its subclass. It just requires one more property, `onTokenUpdate`: a callback function that will be called whenever the user enter / update the auth token. You can use it to store the token and include it inside the `fetcher`.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql-auth-token';
import fetch from 'isomorphic-fetch';

let token =  null;

const graphQLFetcher = (graphQLParams) => {
    const headers = { 'Content-Type': 'application/json' }
    if (token){
        headers['Authorization'] = 'Bearer ' + token;
    }
    return fetch(window.location.origin + '/graphql', { //Server address to adapt
        method: 'post',
        headers,
        body: JSON.stringify(graphQLParams),
    }).then(response => response.json());

const onTokenUpdate = (newToken) => token = newToken;

const style = { position: 'fixed', height: '100%', width: '100%', left: '0px',top: '0px' }

ReactDOM.render(
    <div style={style}>
        <GraphiQLAuthToken fetcher={graphQLFetcher} onTokenUpdate={onTokenUpdate} />
    </div>, 
    document.body
);
```

To know the rest of the properties available, please refer to [GraphiQL](https://github.com/graphql/graphiql/tree/master/packages/graphiql) documentation.

## Sending pop-up notifications

You can display notifications from the server by using for instance [socket.io](https://github.com/socketio/socket.io). You just have to pass each notification into the `notification` property of the component. It can contain the following attributes:

```js
const notification = {
        title: "Notification title", // Mandatory
        message: "Notificaiton message", // Mandatory
        type: "info", // Possible values undefined | "secondary" | "success" | "info" | "warning" | "danger"
        date: new Date() // If not specified, it will be automatically set
}
```
The `title` and `message` can contain HTML tags.

Find a minimal example below or look at complete one with the client [here](https://github.com/JohannC/graphiql-auth-token/tree/master/demo/src/index.js) and the server [here](https://github.com/jrebecchi/graphiql-auth-token/blob/master/demo/src/server.js).

```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
import GraphiQLAuthToken from 'graphiql-auth-token';

class Demo extends Component {
    constructor() {
        super();
        this.state = { notification: null }
    }

    componentDidMount() {
        this.socket = socketIOClient("http://localhost:43500"); //Server addess to adapt
        this.socket.on("notification", data => {
            this.setState({ notification: data })
        });
    }

    componentWillUnmount() {
        this.socket.close();
    }

    render() {
        const graphQLFetcher = (graphQLParams) => ...; // To complete
        const style = { position: 'fixed', height: '100%', width: '100%', left: '0px',top: '0px' }

        return (
            <div style={style}>
                <GraphiQLAuthToken fetcher={graphQLFetcher} notification={this.state.notification} />
            </div>
        )
    }
}

ReactDOM.render((<Demo />, document.body);

```

## Usage with express-graphql

To use GraphiQL-Auth-Token inside express-graphql instead of the regular GraphiQL please refer to this [example](https://github.com/JohannC/graphiql-auth-token/tree/master/examples/ExampleWithExpressGraphQL.js).