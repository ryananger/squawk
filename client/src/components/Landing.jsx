import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';

const Landing = function() {
  var handleEnter = function() {
    if (st.user) {
      st.setView('home');
    } else {
      st.setView('login');
    }
  };

  return (
    <div id='landing' className='v c' onClick={handleEnter}>
      <h2>squawk</h2>
      encrypted text-only messaging
    </div>
  );
};

export default Landing;

