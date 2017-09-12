import React from 'react'
import PropTypes from 'prop-types'
import { Link, NavLink } from 'react-router-dom'


class Navigation extends React.Component {
	constructor(props) {
		super(props)
		this.renderSection = this.renderSection.bind(this)
		this.handleScroll = this.handleScroll.bind(this)

		this.state = { visible: true }
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll)
	}

	handleScroll() {
		const visible = (document.body.scrollTop === 0 && document.body.scrollLeft === 0)
		if (this.state.visible !== visible) {
			this.setState({ visible })
		}
	}

	renderSection(section) {
		if (section.protected && !this.props.authorized.includes(section.slug)) return null
		if (section.displayindex) {
			return (
				<div key={`nav-${section.slug}`} className="nav__section">
					<h3>
						<NavLink to={`/${section.slug}`}>
							{section.title}
						</NavLink>
					</h3>
				</div>
			)
		}

		return (
			<div key={`nav-${section.slug}`} className="nav__section">
				<h3 className="nav__sectionTitle">{section.title}</h3>
				<div className="nav__subnav">
					{section.children.map(project => (
						<h3 key={`nav-${section.slug}/${project.slug}`} className="nav__item">
							<NavLink activeClassName="active" to={`/${section.slug}/${project.slug}`}>
								{project.title}
							</NavLink>
						</h3>
					))}
				</div>
			</div>
		)
	}

	render() {
		const navClass = (this.state.visible) ? 'visible' : ''
		return (
			<nav className={navClass}>
				<h1 className="nav__title">
					<Link to="/">Vicente Munoz</Link>
				</h1>
				{this.props.sections.map(this.renderSection)}
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
