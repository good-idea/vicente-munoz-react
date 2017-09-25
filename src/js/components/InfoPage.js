import React from 'react'
import PropTypes from 'prop-types'

import ResponsiveImage from './ResponsiveImage'

/**
 * InfoPage
 */

const InfoPage = (props) => {
	const cover = (props.cover) ?
		<ResponsiveImage {...props.cover} classNames={['info__cover']} /> :
		null
	return (
		<main className="info">
			{cover}
		</main>
	)
}

InfoPage.propTypes = {
	// title: PropTypes.string
}

InfoPage.defaultProps = {
	// title: 'My Title'
}

export default InfoPage
