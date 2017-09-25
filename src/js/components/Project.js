import React from 'react'
import PropTypes from 'prop-types'

import ResponsiveImage from './ResponsiveImage'
import { markdownToJSX } from '../utils/text'

const Project = (props) => {
	return (
		<main className="project">
			<div className="project__intro">
				<h2 className="project__title">{props.title}</h2>
				<div className="project__description project__column">{markdownToJSX(props.description)}</div>
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
}

Project.defaultProps = {
	images: [],
}

export default Project
