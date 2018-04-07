import React from 'react'
import PropTypes from 'prop-types'

// import startWarp from './warpScript'

/**
 * Warp
 */

class Warp extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		// startWarp(this.canvas)
	}

	render() {
		return (
			<div className={this.props.className}>
				<canvas
					className="warp-canvas"
					ref={element => {
						this.canvas = element
					}}
				/>
				{/* <button className="home__splash" onClick={this.props.onClick}>
					<img src={} alt="Vicente Muñoz" />
				</button> */}
			</div>
		)
	}
}

Warp.propTypes = {
	// title: PropTypes.string
}

Warp.defaultProps = {
	// title: 'My Title'
}

export default Warp
