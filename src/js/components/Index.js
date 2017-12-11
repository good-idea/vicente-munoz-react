import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import R from 'ramda'

import ResponsiveImage from './ResponsiveImage'
import { cn } from '../utils/helpers'


/**
 * IndexImages
 */

const IndexImages = (props) => {
	const images = R.pipe(
		R.sortBy(p => R.prop('pinned', p) !== true),
		R.take(3),
	)(props.images)
	const classNames = ['index__images']
	const layout = (props.index % 6) + 1
	classNames.push(`index__images--layout-${layout}`)
	return (
		<div className={cn(classNames)}>
			{images.map(i => <ResponsiveImage sizes={'20vw'} key={i.filename} {...i} />)}
		</div>
	)
}

IndexImages.propTypes = {
	id: PropTypes.string.isRequired,
	images: PropTypes.arrayOf(PropTypes.shape()),
}

IndexImages.defaultProps = {
	images: [],
}


/**
 * IndexTitle
 */

const IndexTitle = (props) => {
	return (
		<div className="index__title">
			<h1>
				<Link to={`/${props.id}`}>
					{props.title}
				</Link>
			</h1>
			<IndexImages id={props.id} index={props.index} images={props.images} />
		</div>
	)
}

IndexTitle.propTypes = {
	index: PropTypes.number.isRequired,
	images: PropTypes.arrayOf(PropTypes.shape()),
	title: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
}

IndexTitle.defaultProps = {
	images: [],
}


/**
 * Index
 */

const Index = props => (
	<main className="index">
		{props.children.map((s, i) => <IndexTitle key={`indexTitle-${s.slug}`} index={i} {...s} />)}
	</main>
)


Index.propTypes = {
	children: PropTypes.arrayOf(PropTypes.shape()),
}

Index.defaultProps = {
	children: [],
}

export default Index
