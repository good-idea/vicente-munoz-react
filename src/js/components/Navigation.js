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

	render() {
		// if (this.props.protected && !this.props.authorized) return null

		const classNames = ['nav__section']

		// Link to an Index page
		if (this.props.displayindex) {
			classNames.push('nav__section--index')
			return (
				<div key={`nav-${this.props.slug}`} className={cn(classNames)}>
					<h3>
						<NavLink
							to={`/${this.props.slug}`}
							activeClassName="nav__section--activeIndex"
						>
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
					<button onClick={this.handleClick}>{this.props.title}</button>
				</h3>
				<div className="nav__subnav">
					{this.props.children.map(project => (
						<h3
							key={`nav-${this.props.slug}/${project.slug}`}
							className="nav__item"
						>
							<NavLink
								activeClassName="active"
								to={`/${this.props.slug}/${project.slug}`}
							>
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
			nextProps.location.pathname.split('/')[1] !== this.state.activeSection
		) {
			console.log(
				nextProps.location.pathname.split('/')[1],
				this.state.activeSection,
			)
			this.setState({
				activeSection: nextProps.location.pathname.split('/')[1],
			})
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
	location: PropTypes.shape().isRequired,
}

Navigation.defaultProps = {
	sections: [],
	authorized: [],
	infoPages: [],
}

export default Navigation
