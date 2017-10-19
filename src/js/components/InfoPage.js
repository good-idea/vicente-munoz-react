import React from 'react'
import PropTypes from 'prop-types'

import ResponsiveImage from './ResponsiveImage'
import { markdownToJSX } from '../utils/text'

/**
 * InfoPage
 */

const InfoPage = (props) => {
	console.log(props)
	const text = (props.text.length > 0) ?
		(<div className="infoPage__text">
			{markdownToJSX(props.text)}
		</div>) :
		null
	const cover = (props.cover) ?
		<ResponsiveImage {...props.cover} classNames={'info__cover'} /> :
		null
	return (
		<main className="info">
			<div className="column">

				<div className="column--narrow">
					{cover}
				</div>
				{text}
			</div>
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
