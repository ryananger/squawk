import React, {useEffect, useState, useRef} from 'react';

import st from 'ryscott-st';
import icons from 'icons';
import {ax, firebase} from '../util';

const Nav = function() {
  const input = useRef(null);

  var logOut = function() {
    firebase.logOut();
    st.setUser(null);
    st.setView('landing');
    document.cookie = 'user=';
  };

  var searchForUsers = function(e) {
    if (e.target.value.length >= 2) {
      ax.searchForUsers(e.target.value);
    }
  };

  var handleView = function() {
    if (st.view !== 'search' && input.current) {
      input.current.value = '';
    }
  };

  useEffect(handleView, [st.view]);

  return (
    <div className='nav h'>
      <h3 className='icon h c' onClick={()=>{st.setView('home')}}>squawk</h3>
      {st.user && ('home search').includes(st.view) && <input ref={input} id='searchInput' placeholder='search for users' onChange={searchForUsers} autoComplete='off'/>}
      <div className='h'>
        <icons.SettingsIcon className='icon' size={32} onClick={()=>{st.setView('settings')}}/>
        {st.user && <icons.LogoutIcon className='icon' size={32} onClick={logOut}/>}
        {!st.user && <icons.LoginIcon className='icon' size={32} onClick={()=>{st.setView('login')}}/>}
      </div>
    </div>
  );
};

export default Nav;

