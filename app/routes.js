import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app';
import Welcome from './components/welcome';
import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
import Signup from './components/auth/signup';
import Dashboard from './components/dashboard';
import RequireAuth from './components/auth/require_auth';
import error404 from './components/404';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Welcome}/>
    <Route path='/signout' component={Signout} />
    <Route path='/signin' component={Signin} />
    <Route path='/signup' component={Signup} />
    <Route path='/dashboard' component={RequireAuth(Dashboard)} />
    <Route path="*" component={error404}/>
  </Route>
);
