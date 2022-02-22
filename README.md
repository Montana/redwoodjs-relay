## Writing a Relay, Dispatcher into a RedwoodJS application 

I wrote a `relay` component, a `relay` component is usualy used to set a Relay environment in a React Context, not a RedwoodJS context. Usually, a single instance of this component should be rendered at the very root of the application, in order to set the Relay environment for the whole application:

```jsx
const React = require('React');

const {RelayEnvironmentProvider} = require('react-relay');

const Environment = createNewEnvironment();

function Root() {
  return (
    <RelayEnvironmentProvider environment={Environment}>
      <App />
    </RelayEnvironmentProvider>
  );
}

module.exports = Root;
```

## Props 

`environment`: The Relay environment to set in React Context. Any Relay Hooks (like `useLazyLoadQuery` or `useFragment`) used in descendants of this provider component will use the Relay environment.

## Reusing Data

While an app is in use, Relay will accumulate and cache (for some time) the data for the multiple queries that have been fetched throughout usage of our app.

## Example

So for example let's say we don't want any suspense on prerendered pages, we can have a piece of Redwood look like this I wrote out: 

```jsx
import type { AuthContextInterface } from '@redwoodjs/auth'
import { useIsBrowser } from '@redwoodjs/prerender/browserUtils'
import { useAuth as useRWAuth } from '@redwoodjs/auth'
import { FetchConfigProvider, useFetchConfig } from '@redwoodjs/web'

import { Suspense } from 'react'
import { RelayEnvironmentProvider } from 'react-relay'
import { Environment, FetchFunction, Network, RecordSource, Store } from 'relay-runtime'

export type UseAuthProp = () => AuthContextInterface

const RelayProviderWithFetchConfig: React.FunctionComponent<{
  environment: Environment
  useAuth: UseAuthProp
}> = ({ environment, children, useAuth }) => {
  const { uri, headers } = useFetchConfig()
  const { getToken, type: authProviderType, isAuthenticated } = useAuth()

  async function fetcher(operation, variables) {
    let token: string | undefined = undefined
    if (isAuthenticated && getToken) {
      token = await getToken()
    }

    const authHeaders = token
      ? {
          'auth-provider': authProviderType,
          authorization: `Bearer ${token}`,
        }
      : {}

    const body = {
      query: operation.text,
      operationName: operation.name,
      operationKind: operation.operationKind,
      variables,
    }

    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        ...headers,
        ...authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    return await response.json()
  }

  const env = environment || createDefaultEnvironment(fetcher)

  return (
    <RelayEnvironmentProvider environment={env}>
      {/* <GraphQLHooksProvider useQuery={hooks.useQuery} useMutation={hooks.useMutation}> */}
      {children}
      {/* </GraphQLHooksProvider> */}
    </RelayEnvironmentProvider>
  )
}

export const createDefaultEnvironment = (fetch: FetchFunction) => {
  return new Environment({
    network: Network.create(fetch),
    store: new Store(new RecordSource()),
  })
}

export const RedwoodRelayProvider: React.FunctionComponent<{
  environment?: Environment
  useAuth?: UseAuthProp
}> = ({ environment, useAuth = useRWAuth, children }) => {
  const browser = useIsBrowser()
  const SsrCompatibleSuspense = browser ? Suspense : (props) => props.children

  return (
    <FetchConfigProvider useAuth={useAuth}>
      <RelayProviderWithFetchConfig environment={environment} useAuth={useAuth}>
        <SsrCompatibleSuspense fallback={<div>Site loader</div>}>{children}</SsrCompatibleSuspense>
      </RelayProviderWithFetchConfig>
    </FetchConfigProvider>
  )
}
```
## Dispatcher 

Here's the `dispatcher` I wrote for this Redwood project, which I have yet to figure out how I want this to work. I may have to use Redwood Router in conjunction:

```jsx
import React, { Component } from 'react';

export default function dispatch(store, atom, action) {
  return store(atom, action);
}

export class Dispatcher extends Component {
  static propTypes = {
    store: React.PropTypes.func.isRequired
  };

  static childContextTypes = {
    dispatch: React.PropTypes.func,
    atom: React.PropTypes.any
  };

  getChildContext() {
    return {
      atom: this.state.atom,
      dispatch: this.dispatch.bind(this)
    };
  }

  constructor(props, context) {
    super(props, context);

    this.state = { atom: dispatch(props.store, undefined, {}) };
  }

  dispatch(payload) {
    this.setState(prevState => ({
      atom: dispatch(this.props.store, prevState.atom, payload)
    }));
  }

  render() {
    return typeof this.props.children === 'function'
      ? this.props.children(this.state.atom)
      : this.props.children;
  }
}

export class Injector extends Component {
  static contextTypes = {
    dispatch: React.PropTypes.func.isRequired,
    atom: React.PropTypes.any
  };

  static propTypes = {
    actions: React.PropTypes.object
  };

  performAction(actionCreator, ...args) {
    const { dispatch } = this.context;
    const payload = actionCreator(...args);

    return typeof payload === 'function'
      ? payload(dispatch)
      : dispatch(payload);
  };

  render() {
    const { dispatch, atom } = this.context;
    const { actions: _actions } = this.props;

    const actions = Object.keys(_actions).reduce((result, key) => {
      result[key] = this.performAction.bind(this, _actions[key]);
      return result;
    }, {});

    return this.props.children({ actions, atom });
  }
}
```

## Styling

I’m using `twin.macro` for styling, which (before `v0.35`) has worked a treat up until I try to add a prerender prop to one of my routes. Twin is a Babel macro which allows for writing Tailwind classes within (in my case) styled-components. I’ll separate out the two issues below:

As soon as I import tw from 'twin.macro', the dev process can suddenly no longer render the page, failing with the error:

`Failed to compile.`

`../node_modules/babel-plugin-macros/node_modules/cosmiconfig/dist/readFile.js`
`Module not found: Error: Can't resolve 'fs' in '/Users/me/sandbox/rw-twin/node_modules/babel-plugin-macros/node_modules/cosmiconfig/dist`

This works absolutely fine in Redwood 0.34, so I was suspecting some sort of version mismatch nested in the dependency tree. I tried pinning cosmiconfig to 6.0.0 via the resolutions field in package.json, but to no avail (this was a bit of a shot in the dark anyway).

This is the bigger of my two issues as without a solution, the only workaround I can see would be to stop using twin.macro and rewrite all of my existing styles!

## With Redwood 0.34

Back on `0.34`, running `yarn rw dev` or `yarn rw build` both presented no problems until I added the prerender prop to one of my routes. The build command then failed with an error from `twin.macro` noting that it couldn’t find one of the custom styles from my Tailwind config:

```bash
---------- Error rendering path "/" ----------
MacroError: /Users/me/sandbox/rw-twin/web/src/pages/HomePage/HomePage.js: 

✕ text-customColor was not found

Try one of these classes:
[there follows a long list of similar inbuilt class names, omitted for brevity]
```

Note that this is thrown in the ‘prerender’ phase of the process - the ‘build’ phase completes successfully.

Interestingly, no such error is thrown if I simply don’t reference any of my custom styles. Using only Tailwind’s predefined styles allows the build and the prerender to complete successfully.

## Deployment 

I'm currently using Vercel. 





