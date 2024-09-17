import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';
import icons from 'icons';
import {firebase} from '../util';

const Nav = function() {
  var logOut = function() {
    firebase.logOut();
    st.setUser(null);
    st.setView('landing');
    document.cookie = 'user=';
  };

  return (
    <div className='nav h'>
      <h3>squawk</h3>
      {st.user && <icons.LogoutIcon className='icon' size={32} onClick={logOut}/>}
      {!st.user && <icons.LoginIcon className='icon' size={32} onClick={()=>{st.setView('login')}}/>}
    </div>
  );
};

export default Nav;

