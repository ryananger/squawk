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
      squawk
    </div>
  );
};

export default Landing;

