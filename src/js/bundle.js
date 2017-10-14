import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import App from './components/App'


const renderApp = (Component) => {
	render(
		<AppContainer>
			<BrowserRouter>
				<Component />
			</BrowserRouter>
		</AppContainer>,
		document.getElementById('root'),
	)
}

renderApp(App)

if (module.hot) {
	module.hot.accept('./components/App', () => {
		// eslint-disable-next-line
		const newApp = require('./components/App').default
		renderApp(newApp)
	})
}
