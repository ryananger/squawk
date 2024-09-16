import React, {useState} from 'react';

import '../styles/style.css';
import st from 'ryscott-st';

import Alert from './Alert.jsx';

const App = function() {
  return (
    <div id='app' className='app texture v'>
      <Alert/>
    </div>
  );
};

export default App;

