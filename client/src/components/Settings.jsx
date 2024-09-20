import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';
import icons from 'icons';
import {ax, firebase, helpers} from '../util';

const Settings = function() {
  var handleClose = function(e) {
    if (e.target.id === 'settingsModal') {
      st.setView('home');
    }
  };

  var handleSubmit = function() {
    var currentPass = document.getElementById('currentPass').value;
    var newPass1 = document.getElementById('newPass1').value;
    var newPass2 = document.getElementById('newPass2').value;

    if (newPass1 !== newPass2) {
      helpers.alert('Passwords do not match!');
      return;
    }

    if (newPass1.length < 6) {
      helpers.alert('New password is not long enough!');
      return;
    }

    firebase.updatePass(currentPass, newPass1);
  };

  return (
    <div id='settingsModal' className='settingsModal v' onClick={handleClose}>
      <div className='settings v anchor'>        
        <icons.CloseIcon className='closeIcon' onClick={()=>{st.setView('home')}}/>
        update password
        <input id='currentPass' type='password' placeholder='current password?'/>
        <input id='newPass1' type='password' placeholder='new password?'/>
        <input id='newPass2' type='password' placeholder='confirm new password?'/>
        <button onClick={handleSubmit}>save</button>
        <br/>
        for support, 
        <br/>contact ry@earthpunk.art
      </div>
    </div>
  );
};

export default Settings;