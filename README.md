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

### Props 

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
