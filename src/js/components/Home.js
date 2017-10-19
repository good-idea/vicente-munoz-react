import React from 'react'
import PropTypes from 'prop-types'
import R from 'ramda'
import seedrandom from 'seedrandom'
import { Link } from 'react-router-dom'

import Warp from './Warp'
import ResponsiveImage from './ResponsiveImage'
import { shuffleArray, cn } from '../utils/helpers'

let mod
if (window.outerWidth > 820) mod = 1
else if (window.outerWidth > 650) mod = 0.5
else mod = 0.31

const GridImage = (props) => {
	const rand = seedrandom(`${props.url}-${props.index}`)()
	const containerWidth = Math.ceil((Math.floor(rand * 8) + 1) / 2)
	const padding = [
		0,
		mod * (Math.floor(rand * 10 * (5 - containerWidth)) + 5 + ((4 - containerWidth) * 2)),
		mod * (Math.floor(rand * 10 * (5 - containerWidth)) + 5 + ((4 - containerWidth) * 2)),
		mod * (Math.floor(rand * 10 * (4 - containerWidth)) + 15),
	].reduce((acc, current) => (
		`${acc} ${current}%`
	), '')

	const classNames = [
		'imageGrid__item',
		`w-${containerWidth}`,
	]

	const style = { padding }

	let sizes
	switch (containerWidth) {
	case 2:
	case 3:
		sizes = '40vw'
		break
	case 4:
		sizes = '25vw'
		break
	default:
		sizes = '80vw'
	}

	return (
		<div className={cn(classNames)}>
			<div style={style} className="gridImage__inner">
				<Link to={`/${props.parentId}`}>
					<ResponsiveImage sizes={sizes} {...props} />
					<h4 className="gridImage__title">{props.parentTitle}</h4>
				</Link>
			</div>
		</div>
	)
}

GridImage.propTypes = {
	parentTitle: PropTypes.string.isRequired,
	parentId: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	index: PropTypes.number.isRequired,
}


class Home extends React.Component {
	constructor(props) {
		super(props)
		this.handleHover = this.handleHover.bind(this)
	}

	handleHover() {
		console.log(this.state)
	}

	render() {
		const imageCount = 3
		const randomImages = R.pipe(
			R.filter(section => !section.protected),
			R.pluck('children'),
			R.flatten,
			R.map(project => ({
				images: R.pipe(
					shuffleArray,
					R.slice(0, imageCount),
				)(project.images),
			})),
			R.pluck('images'),
			R.flatten,
			shuffleArray,
		)(this.props.sections)

		// const button = (this.props.showSplash)
		// 	? (
		// 		<Warp
		// 			className="home__splash"
		// 			onClick={this.props.disableSplash}
		// 			imageUrl={this.props.home.warpImage.url}
		// 			alt="Vicente Muñoz"
		// 		/>
		// 	) : null

		// const className = (this.props.showSplash) ? 'home withSplash' : 'home'

		return (
			<main className="home">
				{/* {button} */}
				<div className="imageGrid">
					{randomImages.map((image, index) => (
						<GridImage key={`image-${image.parentId}-${image.filename}`} index={index} {...image} />
					))}
				</div>
			</main>
		)
	}
}

Home.propTypes = {
	sections: PropTypes.arrayOf(PropTypes.shape),
}

Home.defaultProps = {
	sections: [],
}


export default Home
