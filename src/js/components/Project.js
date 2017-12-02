import React from 'react'
import PropTypes from 'prop-types'

import Gallery from './Gallery'

import { markdownToJSX } from '../utils/text'

/**
 * Project
 */

class Project extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showAltGallery: false,
		}
	}

	toggleAltGallery = () => {
		this.setState({ showAltGallery: !this.state.showAltGallery })
	}

	render() {
		const altButton = (this.props.altGallery)
			? (
				<button className="project__altGalleryToggle" onClick={this.toggleAltGallery}>
					<h5>See {(this.state.showAltGallery) ? this.props.maingallerytitle : this.props.altGallery.title}</h5>
				</button>
			) : null

		const description = (this.props.description.length > 0 || this.props.altGallery)
			? (
				<div className="project__description project__column">
					{markdownToJSX(this.props.description)}
					{altButton}
				</div>
			) : null


		const gallery = (this.state.showAltGallery)
			? <Gallery images={this.props.altGallery.images} />
			: <Gallery images={this.props.images} />

		return (
			<main className="project">
				<div className="project__intro">
					<h2 className="project__title">{this.props.title}</h2>
					{description}
				</div>
				{gallery}
			</main>
		)
	}
}

Project.propTypes = {
	title: PropTypes.string.isRequired,
	images: PropTypes.arrayOf(PropTypes.shape),
	description: PropTypes.string,
}

Project.defaultProps = {
	description: '',
	images: [],
	protected: false,
	authorized: [],
}

export default Project
