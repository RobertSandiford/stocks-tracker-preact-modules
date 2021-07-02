import { h } from 'preact';
import { Router } from 'preact-router';

import { Provider as ReduxProvider } from 'react-redux';
import store from '../redux/store';

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache()
});

store.subscribe( () => { console.log("store state: ", store.getState()) } )

const dispatch = (obj) => {
	store.dispatch({ 
		type : "update",
		payload : obj
	})
}
dispatch({ apolloClient : apolloClient })
dispatch({ displayCurrency : "USD" })

import Holdings from './holdings/Holdings';

const App = () => (
		<ReduxProvider store={store}>
			<div className="App">
				<header className="App-header">
					<Router>
						<Holdings path="/" />
					</Router>
				</header>
			</div>
		</ReduxProvider>
)

export default App;
