import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';
import { Link } from 'react-router';
const logo = require('../../../style/images/chat.svg');

class Signin extends Component {
  handleFormSubmit({email, password}) {
    this.props.signinUser({email, password})
  }
  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      )
    }
  }
  render () {
    const { handleSubmit, fields: {email, password }} = this.props
    return (
      <div className="splashPage">
        <div id='background'></div>
        <div id='midground'></div>
        <div className='signPage col-xs-12 col-sm-12 col-md-6 col-md-offset-3 nopadding'>
          <div className='iconSide hidden-xs hidden-sm col-md-4'>
            <img src={logo}/>
            <h3 className="text-md-center">MODULO</h3>
          </div>
          <div className='logSide col-xs-12 col-sm-12 col-md-8'>
            <h3 className='text-center'>Welcome Back!</h3>
            <p className='text-center'>please Sign in...</p>
            <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
              <fieldset className='form-group'>
                <input {...email} className='form-control' placeholder='Email' />
              </fieldset>
              <fieldset className='form-group'>
                <input {...password} type='password' className='form-control' placeholder='Password' />
              </fieldset>
              {this.renderAlert()}
              <button action='submit' className='btn btn-block btn-theme'>Sign In</button>
              <small className="text-muted">Need an Account? <Link to="/signup">Register</Link></small>
            </form>
          </div>
        </div>
      </div>

    )
  }
}
function mapStateToProps (state) {
  return {errorMessage: state.auth.error}
}

export default reduxForm ({
  form: 'signin',
  fields: ['email', 'password']
}, mapStateToProps, actions)(Signin);
