import React from 'react'
import PropTypes from 'prop-types'

import { markdownToJSX } from '../utils/text'

import { cn } from '../utils/helpers'

class ResponsiveImage extends React.Component {
	constructor(props) {
		super(props)
		const sizes = props.sizes || '100vw'
		const maxWidth = props.srcset.reduce((previous, current) => {
			if (current.width > previous.width) {
				return current
			}
			return previous
		}, []).width
		const alt = props.meta.caption || props.parentTitle
		const figcaption = (props.meta.caption) ? (
			<figcaption>
				{markdownToJSX(props.meta.caption)}
			</figcaption>
		) : null

		const initialState = {
			alt,
			classNames: [],
			figcaption,
			loaded: false,
			maxWidth,
			sizes,
		}

		// if (!this.props.delay) {
		const { src, srcsetString } = this.getSrc()
		initialState.src = src
		initialState.srcsetString = srcsetString
		// }

		initialState.dataURI = this.makeCanvas()

		this.state = initialState
		this.renderPlaceholder = this.renderPlaceholder.bind(this)
		this.handleImageLoaded = this.handleImageLoaded.bind(this)
	}


	componentWillReceiveProps(nextProps) {
		if (this.props.noLoad && !nextProps.noLoad || this.props.url !== nextProps.url) {
			const { src, srcsetString } = this.getSrc(nextProps)
			const newState = { src, srcsetString }
			if (this.props.url !== nextProps.url) newState.dataURI = this.makeCanvas(nextProps)
			this.setState(newState)
		}
	}

	getSrc(props = this.props) {
		const src = (props.noLoad) ? '' : props.url
		const srcsetString = (props.noLoad) ? '' : props.srcset.reduce((acc, current) => {
			const commaSpace = (acc.length) ? ', ' : ''
			return `${current.url} ${current.width}w${commaSpace}${acc}`
		}, '')
		return { src, srcsetString }
	}

	makeCanvas(props = this.props) {
		// get the ratio and generate a data URI for the placeholder
		const original = props.srcset.find(img => img.height) || false
		const ratio = (original.width && original.height) ? original.height / original.width : 0.56
		// generate a canvas and get its data URI to use as a placeholder
		const canvas = window.document.createElement('canvas')
		canvas.setAttribute('width', 1000)
		canvas.setAttribute('height', 1000 * ratio)
		const ctx = canvas.getContext('2d')
		ctx.beginPath()
		ctx.rect(0, 0, 1000, 1000 * ratio)
		ctx.fillStyle = 'rgb(220, 220, 220)'
		ctx.fill()
		// this.dataURI = canvas.toDataURL()
		// initialState.dataURI = canvas.toDataURL()
		return canvas.toDataURL()
	}
	// shouldComponentUpdate(nextProps, nextState) {
	// 	if (isEqual(nextProps, this.props) && isEqual(nextState, this.state)) return false
	// 	return true
	// }

	handleImageLoaded() {
		setTimeout(() => {
			this.setState({
				loaded: true,
				classNames: [...this.state.classNames, 'loaded'],
			})
		}, (Math.random() * 200) + 100)
	}

	renderPlaceholder() {
		if (this.state.dataURI) {
			return (
				<img src={this.state.dataURI} alt="" className="loading-placeholder" />
			)
		}
		return (<div className="loading-placeholder loading-placeholder--bare" />)
	}

	render() {
		return (
			<figure
				style={{ maxWidth: this.state.maxWidth }}
				className={cn(this.props.classNames, this.state.classNames)}
			>
				<img
					className="fullImage"
					onLoad={this.handleImageLoaded}
					src={this.state.src}
					srcSet={this.state.srcsetString}
					sizes={this.state.sizes}
					alt={this.state.alt}
				/>
				{this.renderPlaceholder()}
				{ this.state.figCaption }
			</figure>
		)
	}
}

ResponsiveImage.propTypes = {
	// placeholder: PropTypes.boolean,
	url: PropTypes.string,
	classNames: PropTypes.string,
	parentTitle: PropTypes.string,
	sizes: PropTypes.string,
	srcset: PropTypes.arrayOf(PropTypes.object),
	meta: PropTypes.shape(),
	noLoad: PropTypes.bool,
	makeCanvas: PropTypes.bool,
}

ResponsiveImage.defaultProps = {
	// placeholder: false,
	url: '',
	classNames: '',
	sizes: '100vw',
	parentTitle: '',
	srcset: [],
	meta: {},
	noLoad: false,
	makeCanvas: false,
}

export default ResponsiveImage
