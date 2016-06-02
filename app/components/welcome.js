import React, { Component } from 'react';
const logo = require('../../style/images/chat.svg');

class Welcome extends Component {

  render() {
    return (
      <div className="splashPage">
        <div id='background'></div>
        <div id='midground'></div>
        <div id='landingSplash'>
          <div className=' text-center mainLogo'>
            <img src={logo} width="40%" height="300px"/>
            <div className="inline">
              <h1 className='title'>Modulo</h1>
              <h1>Communicate, Collaborate & Create</h1>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Welcome;
