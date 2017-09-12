import React from 'react'
import axios from 'axios'
import { Switch, Route } from 'react-router-dom'

import Navigation from './Navigation'
import Home from './Home'
import Project from './Project'
// import Index from './Index'
// import InfoPage from './InfoPage'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			ready: false,
			authorized: [],
		}
	}
	componentDidMount() {
		const timer = Date.now()
		axios.get('/api/initial').then((response) => {
			console.log(`Duration of call: ${Date.now() - timer}`)
			this.setState({
				ready: true,
				...response.data,
			})
		})
	}

	render() {
		if (!this.state.ready) return null
		return (
			<div className="app">
				<Navigation {...this.state} />
				<Switch>
					<Route
						exact
						path="/"
						render={() => (
							<Home {...this.state} />
						)}
					/>
					<Route
						exact
						path="/:slug"
						render={() => (
							null
							// Index or Info Page
						)}
					/>
					<Route
						path="/:section/:project"
						render={({ match }) => {
							const project = this.state.sections
								.find(s => s.slug === match.params.section)
								.children.find(p => p.slug === match.params.project)
							return <Project {...project} />
						}}
					/>
				</Switch>
			</div>
		)
	}
}


export default App;
