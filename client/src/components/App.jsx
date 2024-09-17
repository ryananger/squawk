import React, {useState} from 'react';

import '../styles/style.css';
import st from 'ryscott-st';

import Alert from './Alert.jsx';
import Login from './Login.jsx';

const App = function() {
  const [view, setView] = st.newState('view', useState('login'));
  const [user, setUser] = st.newState('user', useState(null));

  const views = {
    login: <Login/>
  };

  return (
    <div id='app' className='app texture v'>
      <Alert/>
      {views[view]}
    </div>
  );
};

export default App;

