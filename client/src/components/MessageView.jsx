import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';

import Message from './Message.jsx';

const MessageView = function() {
  const messages = st.user.messages[st.messageWith];

  return (
    <div className='messageView v c'>
      <Message message={messages[0]}/>
      <input id='messageInput'/>
    </div>
  );
};

export default MessageView;

