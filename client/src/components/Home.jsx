import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';

import MessageBar from './MessageBar.jsx';

const Home = function() {
  const [messages, setMessages] = st.newState('messages', useState([]));

  var renderMessageWith = function() {
    var rendered = [];

    for (var id in messages) {
      rendered.push(<MessageBar key={id} messages={messages[id]}/>);
    }

    return rendered;
  };

  useEffect(()=>{
    setMessages(st.user?.messages || []);
  }, [st.user]);

  return (
    <div className='messagesView v'>
      {renderMessageWith()}
    </div>
  );
};

export default Home;

