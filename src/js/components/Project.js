import React from 'react'
import PropTypes from 'prop-types'

import ResponsiveImage from './ResponsiveImage'
import { markdownToJSX } from '../utils/text'

const Project = (props) => {
	const description = (props.description.length > 0) ?
		(<div className="project__description project__column">
			{markdownToJSX(props.description)}
		</div>) :
		null
	return (
		<main className="project">
			<div className="project__intro">
				<h2 className="project__title">{props.title}</h2>
				{description}
			</div>
			<div className="project__gallery">
				{props.images.map(item => (
					<ResponsiveImage key={`${item.filename}`} {...item} />
				))}
			</div>
		</main>
	)
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
