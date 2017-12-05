import React from 'react'
import PropTypes from 'prop-types'

import Gallery from './Gallery'

import { markdownToJSX } from '../utils/text'


/**
 * GallerySwitcher
 */

const GallerySwitcher = ({
	label, slug, changeGallery, active,
}) => {
	const handleClick = () => {
		changeGallery(slug)
	}
	const className = (active) ? 'project__gallerySwitcherItem project__gallerySwitcherItem--active' : 'project__gallerySwitcherItem'
	return (
		<h5 className={className}>
			<button onClick={handleClick}>
				{label}
			</button>
		</h5>
	)
}

GallerySwitcher.propTypes = {
	active: PropTypes.bool.isRequired,
	label: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired,
	changeGallery: PropTypes.func.isRequired,
}


/**
 * Project
 */

class Project extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			gallery: 'main',
		}
	}

	changeGallery = (slug) => {
		this.setState({ gallery: slug })
	}

	toggleLanguage = () => {
		const newLanguage = (this.props.language === 'en') ? 'es' : 'en'
		console.log(newLanguage)
		this.props.changeLanguage(newLanguage)
	}

	renderDescription() {
		console.log(this.props.language)
		return (this.props.language === 'en')
			? markdownToJSX(this.props.description)
			: markdownToJSX(this.props.esdescription)
	}

	renderGallerySwitcher() {
		if (this.props.children.length === 0) return null
		return (
			<div className="project__gallerySwitcher">
				<GallerySwitcher
					key="main"
					active={this.state.gallery === 'main'}
					changeGallery={this.changeGallery}
					label={this.props.maingallerytitle}
					slug="main"
				/>
				{this.props.children.map(c => (
					<GallerySwitcher
						key={c.slug}
						active={this.state.gallery === c.slug}
						changeGallery={this.changeGallery}
						label={c.title}
						slug={c.slug}
					/>
				))}
			</div>
		)
	}

	renderLanguageSwitcher() {
		return (
			<div className={`project__languageSwitcher lang--${this.props.language}`}>
				<h5>
					<button className="languageButton" onClick={this.toggleLanguage}>
						<span className="languageButton--en">EN</span>
						&nbsp;/&nbsp;
						<span className="languageButton--es">ES</span>
					</button>
				</h5>
			</div>
		)
	}

	render() {
		const description = (this.props.description.length > 0)
			? (
				<div className="project__description project__column">
					{markdownToJSX(this.props.description)}
				</div>
			) : null

		const images = (this.state.gallery === 'main')
			? this.props.images
			: this.props.children.find(c => c.slug === this.state.gallery).images

		return (
			<main className="project">
				<div className="project__intro">
					<h2 className="project__title">{this.props.title}</h2>
					<div className="project__description project__column">
						{this.renderDescription()}
						{this.renderLanguageSwitcher()}
						{this.renderGallerySwitcher()}
					</div>
				</div>
				<Gallery images={images} />
			</main>
		)
	}
}

Project.propTypes = {
	title: PropTypes.string.isRequired,
	images: PropTypes.arrayOf(PropTypes.shape),
	description: PropTypes.string,
	esdescription: PropTypes.string,
	language: PropTypes.string.isRequired,
	changeLanguage: PropTypes.func.isRequired,
}

Project.defaultProps = {
	description: '',
	esdescription: '',
	images: [],
	protected: false,
	authorized: [],
}

export default Project
