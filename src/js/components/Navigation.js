import React from 'react'
import PropTypes from 'prop-types'
import { Link, NavLink } from 'react-router-dom'

import { cn } from '../utils/helpers'

/**
 * NavSection
 */

class NavSection extends React.Component {
	constructor(props) {
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick() {
		this.props.setActiveSection(this.props.slug)
	}

	render() {
		if (this.props.protected && !this.props.authorized) return null

		const classNames = ['nav__section']

		// Link to an Index page
		if (this.props.displayindex) {
			classNames.push('nav__section--index')
			return (
				<div key={`nav-${this.props.slug}`} className={cn(classNames)}>
					<h3>
						<NavLink to={`/${this.props.slug}`} activeClassName={'nav__section--activeIndex'}>
							{this.props.title}
						</NavLink>
					</h3>
				</div>
			)
		}

		classNames.push('nav_section--dropdown')
		if (this.props.active) classNames.push('nav__section--active')
		// Create a dropdown to link to projects

		return (
			<div key={`nav-${this.props.slug}`} className={cn(classNames)}>
				<h3 className="nav__sectionTitle">
					<button onClick={this.handleClick} >{this.props.title}</button>
				</h3>
				<div className="nav__subnav">
					{this.props.children.map(project => (
						<h3 key={`nav-${this.props.slug}/${project.slug}`} className="nav__item">
							<NavLink activeClassName="active" to={`/${this.props.slug}/${project.slug}`}>
								{project.title}
							</NavLink>
						</h3>
					))}
				</div>
			</div>
		)

	}
}

NavSection.propTypes = {
	// title: PropTypes.string
}

NavSection.defaultProps = {
	// title: 'My Title'
}

/**
 * Navigation
 */

class Navigation extends React.Component {
	constructor(props) {
		super(props)
		this.handleScroll = this.handleScroll.bind(this)
		this.setActiveSection = this.setActiveSection.bind(this)
		this.state = {
			visible: true,
			activeSection: undefined,
			authorized: [],
		}
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll)
	}

	setActiveSection(slug) {
		this.setState({ activeSection: slug })
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.activeSection !== nextProps.activeSection) {
			this.setState({ activeSection: nextProps.activeSection })
		}
	}

	handleScroll() {
		const visible = (document.body.scrollTop === 0 && document.body.scrollLeft === 0)
		if (this.state.visible !== visible) {
			this.setState({ visible })
		}
	}

	render() {
		const navClass = (this.state.visible) ? 'visible' : ''
		return (
			<nav className={navClass}>
				<h2 className="nav__title">
					<Link to="/">Vicente Munoz</Link>
				</h2>
				{this.props.sections.map(section => (
					<NavSection
						key={`nav-section-${section.slug}`}
						setActiveSection={this.setActiveSection}
						active={this.state.activeSection === section.slug}
						authorized={this.props.authorized.includes(section.slug)}
						{...section}
					/>
				))}
			</nav>
		)
	}
}


Navigation.propTypes = {
	sections: PropTypes.arrayOf(PropTypes.shape),
	authorized: PropTypes.arrayOf(PropTypes.string),
}

Navigation.defaultProps = {
	sections: [],
	authorized: [],
}

export default Navigation
