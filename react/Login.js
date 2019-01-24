import React, { Component } from 'react'

import { compose } from 'ramda'
import { withSession } from 'vtex.render-runtime'
import { graphql } from 'react-apollo'
import { injectIntl } from 'react-intl'

import { LoginSchema } from './schema'
import { session } from 'vtex.store-resources/Queries'
import { LoginContainerProptypes } from './propTypes'
import LoginComponent from './components/LoginComponent'

import './global.css'

const DEFAULT_CLASSES = 'white'

/** Canonical login that calls a mutation to retrieve the authentication token */
export default class Login extends Component {
  static propTypes = LoginContainerProptypes

  static defaultProps = {
    labelClasses: DEFAULT_CLASSES,
  }

  state = {
    isBoxOpen: false,
    renderIconAsLink: false,
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const WIDTH_THRESHOLD = 640

    if (window.innerWidth < WIDTH_THRESHOLD && !this.state.renderIconAsLink) {
      this.setState({
        renderIconAsLink: true,
      })
    } else if (
      window.innerWidth >= WIDTH_THRESHOLD &&
      this.state.renderIconAsLink
    ) {
      this.setState({
        renderIconAsLink: false,
      })
    }
  }

  handleProfileIconClick = () => {
    this.setState({ isBoxOpen: !this.state.isBoxOpen })
  }

  handleOutSideBoxClick = () => {
    this.setState({ isBoxOpen: false })
  }

  render() {
    return (
      <LoginWithSession
        {...this.props}
        {...this.state}
        onOutSideBoxClick={this.handleOutSideBoxClick}
        onProfileIconClick={this.handleProfileIconClick}
      />
    )
  }
}

Login.schema = {
  title: 'editor.login.title',
  type: 'object',
  properties: LoginSchema,
}

const options = {
  options: () => ({ ssr: false }),
}

const LoginWithSession = withSession({
  loading: <div />,
})(compose(
  injectIntl,
  graphql(session, options),
)(LoginComponent))
