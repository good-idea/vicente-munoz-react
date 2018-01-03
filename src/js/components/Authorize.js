import React from 'react'
import PropTypes from 'prop-types'

import { cn } from '../utils/helpers'

/**
 * Authorize
 */

class Authorize extends React.Component {
	constructor(props) {
		super(props)
		this.handleChange = this.handleChange.bind(this)
		this.state = {
			value: '',
			classNames: [],
			success: false,
		}
	}

	handleChange(e) {
		const value = e.target.value
		const newState = { value }
		if (value === this.props.password) {
			this.inputElement.blur()
			newState.success = true
			setTimeout(() => {
				if (!this.props.displayindex) this.props.history.push('/')
				this.props.authorizeSection(this.props.slug)
			}, 1100)
		}
		this.setState(newState)
	}

	render() {
		const authClassNames = ['authorize__field']
		if (this.state.success) authClassNames.push('authorize__field--success')

		return (
			<main className="authorize">
				<div className={cn(authClassNames)}>
					<label htmlFor="password">Password</label>
					<input
						ref={element => {
							this.inputElement = element
						}}
						type="password"
						name="password"
						onChange={this.handleChange}
						value={this.state.value}
					/>
					<h4 className="authorize__checkmark">✔</h4>
				</div>
			</main>
		)
	}
}

Authorize.propTypes = {
	slug: PropTypes.string.isRequired,
	password: PropTypes.string.isRequired,
	authorizeSection: PropTypes.func.isRequired,
	history: PropTypes.shape().isRequired,
	displayindex: PropTypes.bool,
}

Authorize.defaultProps = {
	displayindex: false,
}

export default Authorize
