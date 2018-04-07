import React from 'react'
import PropTypes from 'prop-types'

import ResponsiveImage from './ResponsiveImage'

/**
 * Gallery
 */

const Gallery = props => {
	return (
		<div className="project__gallery">
			{props.images.map(item => (
				<ResponsiveImage key={`${item.filename}`} {...item} />
			))}
		</div>
	)
}

Gallery.propTypes = {
	// title: PropTypes.string
}

Gallery.defaultProps = {
	// title: 'My Title'
}

export default Gallery
