import React from 'react'
import PropTypes from 'prop-types'
import { Link, NavLink } from 'react-router-dom'

import { cn } from '../utils/helpers'

/**
 * InfoLink
 */

const InfoLink = ({ id, title, link, islink }) => {
	const infoLink =
		islink === true ? (
			<a href={link} target="_blank" rel="nooopener">
				{title}
			</a>
		) : (
			<Link href={`/${id}`} to={`/${id}`}>
				{title}
			</Link>
		)
	return (
		<div key={`infoPage-${id}`} className="nav__section">
			<h3>{infoLink}</h3>
		</div>
	)
}

InfoLink.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	link: PropTypes.string,
	islink: PropTypes.bool,
}

InfoLink.defaultProps = {
	link: '',
	islink: false,
}

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

	renderChildren() {
		if (this.props.location.pathname.replace(/^\//, '') === this.props.id)
			return null
		return this.props.children.map(project => (
			<h3 key={`nav-${this.props.slug}/${project.slug}`} className="nav__item">
				<NavLink
					activeClassName="active"
					to={`/${this.props.slug}/${project.slug}`}
				>
					{project.title}
				</NavLink>
			</h3>
		))
	}

	render() {
		if (this.props.protected && !this.props.authorized) return null

		const classNames = ['nav__section']

		const buttonOrLink = this.props.displayindex ? (
			<NavLink
				to={`/${this.props.slug}`}
				activeClassName="nav__section--activeIndex"
			>
				{this.props.title}
			</NavLink>
		) : (
			<button onClick={this.handleClick}>{this.props.title}</button>
		)
		if (this.props.displayindex) classNames.push('nav__section--index')

		classNames.push('nav_section--dropdown')
		if (this.props.active) classNames.push('nav__section--active')
		// Create a dropdown to link to projects

		return (
			<div key={`nav-${this.props.slug}`} className={cn(classNames)}>
				<h3 className="nav__sectionTitle">{buttonOrLink}</h3>
				<div className="nav__subnav">{this.renderChildren()}</div>
			</div>
		)
	}
}

NavSection.propTypes = {
	title: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired,
	setActiveSection: PropTypes.func.isRequired,
	children: PropTypes.arrayOf(PropTypes.shape),
	active: PropTypes.bool,
	displayindex: PropTypes.bool,
	authorized: PropTypes.bool,
	protected: PropTypes.bool,
}

NavSection.defaultProps = {
	children: [],
	active: false,
	displayindex: false,
	protected: false,
	authorized: false,
}

/**
 * Navigation
 */

class Navigation extends React.Component {
	constructor(props) {
		super(props)
		this.handleScroll = this.handleScroll.bind(this)
		this.setActiveSection = this.setActiveSection.bind(this)
		const slugOne = props.location.pathname.split('/')[1]
		this.state = {
			visible: true,
			activeSection: slugOne,
			authorized: [],
		}
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll)
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll)
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.activeSection &&
			this.state.activeSection !== nextProps.activeSection
		) {
			this.setState({ activeSection: nextProps.activeSection })
		}
	}

	setActiveSection(slug) {
		this.setState({ activeSection: slug })
	}

	handleScroll() {
		const visible =
			document.documentElement.scrollTop === 0 &&
			document.documentElement.scrollLeft === 0
		if (this.state.visible !== visible) {
			this.setState({ visible })
		}
	}

	render() {
		const classNames = []
		if (this.state.visible) classNames.push('visible')
		if (this.state.isInSplash) classNames.push('inSplash')
		return (
			<nav className={cn(classNames)}>
				<div className="nav__title">
					<Link to="/">
						<img src={this.props.signature} alt={this.props.title} />
					</Link>
				</div>
				{this.props.sections.map(section => (
					<NavSection
						location={this.props.location}
						key={`nav-section-${section.slug}`}
						setActiveSection={this.setActiveSection}
						active={this.state.activeSection === section.slug}
						authorized={this.props.authorized.includes(section.slug)}
						{...section}
					/>
				))}
				<div className="nav__infoPages">
					<div className="nav__infoPages--inner">
						{this.props.infoPages.map(page => (
							<InfoLink key={`nav-infoPage-${page.slug}`} {...page} />
						))}
					</div>
				</div>
			</nav>
		)
	}
}

Navigation.propTypes = {
	sections: PropTypes.arrayOf(PropTypes.shape),
	authorized: PropTypes.arrayOf(PropTypes.string),
	infoPages: PropTypes.arrayOf(PropTypes.shape),
	activeSection: PropTypes.string,
	location: PropTypes.shape().isRequired,
}

Navigation.defaultProps = {
	activeSection: undefined,
	sections: [],
	authorized: [],
	infoPages: [],
}

export default Navigation
