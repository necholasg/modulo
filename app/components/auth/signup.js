import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';
const logo = require('../../../style/images/chat.svg');
import { Link } from 'react-router';

class Signup extends Component {
  handleFormSubmit (formProps) {
    this.props.signupUser(formProps);
  }

  renderAlert() {
    if(this.props.errorMessage){
      return (
        <div className='alert alert-danger'>
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      )
    }
  }

  render () {
    const { handleSubmit, fields: {username, email, password, passwordConfirm }} = this.props;

    return (
      <div className="splashPage">
        <div id='background'></div>
        <div id='midground'></div>
        <div className="signPage col-xs-12 col-sm-12 col-md-6 col-md-offset-3 nopadding">
          <div className='iconSide hidden-xs hidden-sm col-md-4'>
            <img src={logo}/>
            <h3 className="hidden-md-down text-md-center">MODULO</h3>
          </div>
          <div className='logSide col-xs-12 col-sm-12 col-md-8'>
            <h3 className='text-center'>Create an Account</h3>
            <p className='text-center'>please Register...</p>
              <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                <fieldset className='form-group'>
                  <input className='form-control' {...username} placeholder='Username'/>
                  {username.touched && username.error && <div className="error">{username.error}</div>}
                </fieldset>
                <fieldset className='form-group'>
                  <input className='form-control' {...email} placeholder='Email'/>
                  {email.touched && email.error && <div className="error">{email.error}</div>}
                </fieldset>
                <fieldset className='form-group'>
                  <input className='form-control' {...password} type='password' placeholder='Password'/>
                  {password.touched && password.error && <div className="error">{password.error}</div>}
                </fieldset>
                <fieldset className='form-group'>
                  <input className='form-control' {...passwordConfirm} type='password' placeholder='Confirm Password'/>
                  {passwordConfirm.touched && passwordConfirm.error && <div className="error">{passwordConfirm.error}</div>}
                </fieldset>
                {this.renderAlert()}
                <button action='submit' className='btn btn-block btn-theme'>Sign Up</button>
                <small className="text-muted">Already have an account? <Link to="/signin">Login</Link></small>
              </form>
          </div>
        </div>
      </div>

    )
  };
};

function validate(formProps) {
  const error = {};

  if(formProps.password !== formProps.passwordConfirm){
    error.password = 'Passwords Must Match!'
  }
  if(!formProps.username){
    error.username = 'Please enter a Username';
  }
  if(!formProps.email){
    error.email = 'Please enter an email';
  }
  if(!formProps.password){
    error.password = 'Please enter an password';
  }
  if(!formProps.passwordConfirm){
    error.passwordConfirm = 'Please enter an password confirmation';
  }
  return error;
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error }
}

export default reduxForm({
  form:'signup',
  fields: ['email', 'username', 'password', "passwordConfirm"],
  validate
}, mapStateToProps, actions)(Signup);
