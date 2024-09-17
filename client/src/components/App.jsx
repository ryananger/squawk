import React, {useEffect, useState} from 'react';

import '../styles/style.css';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

import Alert from './Alert.jsx';
import Login from './Login.jsx';
import Landing from './Landing.jsx';
import Home from './Home.jsx';
import Nav from './Nav.jsx';

const cookie = helpers.cookieParse();

const App = function() {
  const [view, setView] = st.newState('view', useState('landing'));
  const [user, setUser] = st.newState('user', useState(null));

  const views = {
    landing: <Landing/>,
    login: <Login/>,
    home: <Home/>
  };

  var handleCookie = function() {
    if (cookie.user) {
      ax.getUser(cookie.user);
    }
  };

  useEffect(handleCookie, []);

  return (
    <div id='app' className='app texture v'>
      <Alert/>
      {view !== 'landing' && <Nav/>}
      {views[view]}
    </div>
  );
};

export default App;

