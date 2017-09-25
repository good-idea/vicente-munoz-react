import React from 'react'
import axios from 'axios'
import { Switch, Route, withRouter } from 'react-router-dom'
import R from 'ramda'
import Cookies from 'js-cookie'

import Navigation from './Navigation'
import Home from './Home'
import Project from './Project'
import NotFound from './NotFound'
import Index from './Index'
import Authorize from './Authorize'
import InfoPage from './InfoPage'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.authorizeSection = this.authorizeSection.bind(this)
		this.state = {
			ready: false,
			authorized: [],
			activeSection: undefined,
		}
	}

	componentDidMount() {
		const timer = Date.now()
		const authorized = R.split(',', Cookies.get('authorized') || '')
		axios.get('/api/initial').then((response) => {
			console.log(`Duration of call: ${Date.now() - timer}`)
			this.setState({
				ready: true,
				...response.data,
				authorized,
			})
		})
	}

	authorizeSection(slug) {
		const authorized = R.pipe(
			R.append(slug),
			R.uniq,
		)(this.state.authorized)
		Cookies.set('authorized', R.join(',', authorized), 7)
		this.setState({ authorized, activeSection: slug })
	}

	render() {
		if (!this.state.ready) return null
		return (
			<div className="app">
				<Navigation location={this.props.location} {...this.state} />
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
						render={({ match, history }) => {
							const section = this.state.sections.find(s => s.slug === match.params.slug)
							if (section) {
								if (!this.state.authorized.includes(section.slug)) {
									return (
										<Authorize
											{...section}
											history={history}
											authorizeSection={this.authorizeSection}
										/>
									)
								}
								return <Index {...section} />
							}

							const infoPage = this.state.infoPages.find(p => p.slug === match.params.slug)

							if (infoPage) return <InfoPage {...infoPage} />

							return <NotFound />
						}}
					/>
					<Route
						path="/:section/:project"
						exact
						render={({ match, history }) => {
							const project = this.state.sections
								.find(s => s.slug === match.params.section)
								.children.find(p => p.slug === match.params.project)
							console.log(project.protected, this.state.authorized, project.section)
							if (project.protected === true && !this.state.authorized.includes(project.section)) {
								conso
								history.push(`/${project.section}`)
								return null
							}
							return <Project authorized={this.state.authorized} history={history} {...project} />
						}}
					/>
					<Route component={NotFound} />
				</Switch>
			</div>
		)
	}
}


export default withRouter(App)
