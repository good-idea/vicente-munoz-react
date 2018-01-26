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
			showSplash: true,
			language: 'en',
		}
	}

	componentDidMount() {
		// const timer = Date.now()
		const authorized = R.split(',', Cookies.get('authorized') || '')
		axios.get('/api/initial').then(response => {
			this.setState({
				ready: true,
				...response.data,
				authorized,
			})
		})
	}

	componentDidCatch(error, info) {
		console.log(error, info)
	}

	changeLanguage = language => {
		this.setState({ language })
	}

	disableSplash = () => {
		this.setState({ showSplash: false })
	}

	authorizeSection(slug) {
		const authorized = R.pipe(R.append(slug), R.uniq)(this.state.authorized)
		Cookies.set('authorized', R.join(',', authorized), { expires: 7 })
		this.setState({ authorized, activeSection: slug })
	}

	render() {
		if (!this.state.ready) return null
		return (
			<div className="app">
				<Navigation
					location={this.props.location}
					signature={this.state.home.signature.url}
					isInSplash={this.state.showSplash}
					{...this.state}
				/>
				<Switch>
					<Route
						exact
						path="/"
						render={() => (
							<Home disableSplash={this.disableSplash} {...this.state} />
						)}
					/>
					<Route
						exact
						path="/:slug"
						render={({ match, history }) => {
							const section = this.state.sections.find(
								s => s.slug === match.params.slug,
							)
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

							const infoPage = this.state.infoPages.find(
								p => p.slug === match.params.slug,
							)

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
							if (
								project.protected === true &&
								!this.state.authorized.includes(project.section)
							) {
								history.push(`/${project.section}`)
								return null
							}
							return (
								<Project
									language={this.state.language}
									changeLanguage={this.changeLanguage}
									authorized={this.state.authorized}
									history={history}
									{...project}
								/>
							)
						}}
					/>
					<Route component={NotFound} />
				</Switch>
			</div>
		)
	}
}

export default withRouter(App)
