import React from 'react'
import PropTypes from 'prop-types'
import R from 'ramda'
import seedrandom from 'seedrandom'
import { Link } from 'react-router-dom'

import ResponsiveImage from './ResponsiveImage'
import { shuffleArray, cn } from '../utils/helpers'

let mod
if (window.outerWidth > 820) mod = 1
else if (window.outerWidth > 650) mod = 0.5
else mod = 0.31

const widths = [
	{ width: 1, chance: 0.1 },
	{ width: 2, chance: 0.2 },
	{ width: 3, chance: 0.3 },
	{ width: 4, chance: 0.15 },
	{ width: 5, chance: 0.25 },
].reduce(
	(acc, current) => [
		...acc,
		{
			width: current.width,
			chance:
				Math.ceil(
					(acc.length
						? acc[acc.length - 1].chance + current.chance
						: current.chance) * 100,
				) / 100,
		},
	],
	{},
)

const GridImage = props => {
	const wRand = seedrandom(`${props.url}-${props.index}`)()
	const pRand = seedrandom(wRand)()
	const containerWidth = widths.find(a => a.chance >= wRand).width
	const padding = [wRand * 35 + 5, pRand * 25, pRand * 40, wRand * 25].reduce(
		(acc, current) => `${acc} ${current * mod}%`,
		'',
	)

	const classNames = ['imageGrid__item', `w-${containerWidth}`]

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
				<Link to={`/${props.parentId}`} href={`/${props.parentId}`}>
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

	handleHover() {}

	render() {
		const imageCount = 3

		const randomImages = R.pipe(
			R.filter(
				section => !section.protected && section.usethumbnails !== false,
			),
			R.pluck('children'),
			R.flatten,
			R.map(project => ({
				images: R.pipe(
					shuffleArray,
					R.sortBy(p => R.prop('pinned', p) !== true),
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
						<GridImage
							key={`image-${image.parentId}-${image.filename}`}
							index={index}
							{...image}
						/>
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
