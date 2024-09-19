import React, {useEffect, useState} from 'react';

import '../styles/style.css';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

import Alert from './Alert.jsx';
import Login from './Login.jsx';
import Landing from './Landing.jsx';
import Home from './Home.jsx';
import Nav from './Nav.jsx';
import Search from './Search.jsx';
import MessageView from './MessageView.jsx';
import AdsterraAd from './AdsterraAd.jsx';

const cookie = helpers.cookieParse();

const App = function() {
  const [view, setView] = st.newState('view', useState('landing'));
  const [user, setUser] = st.newState('user', useState(null));
  const [search, setSearch] = st.newState('search', useState(null));
  const [messageWith, setMessageWith] = st.newState('messageWith', useState(null));

  window.st = st;

  const views = {
    landing: <Landing/>,
    login:   <Login/>,
    home:    <Home/>,
    search:  <Search/>,
    messageView: <MessageView/>
  };

  var handleCookie = function() {
    if (cookie.user) {
      ax.getUser(cookie.user);
    }
  };

  var handleSearch = function() {
    if (search !== null) {
      setView('search');
    } 
  };

  var handleMessageView = function() {
    if (messageWith) {
      setView('messageView');
    }
  };

  var handleView = function() {
    if (view !== 'messageView') {
      setMessageWith(null);
    }
  };

  useEffect(handleCookie, []);
  useEffect(handleSearch, [search]);
  useEffect(handleView, [view]);
  useEffect(handleMessageView, [messageWith]);

  return (
    <div id='app' className='app texture v'>
      <Alert/>
      {view !== 'landing' && <Nav/>}
      <div className='main h'>
        <AdsterraAd/>
        {views[view]}
        <AdsterraAd/>
      </div>
    </div>
  );
};

export default App;

