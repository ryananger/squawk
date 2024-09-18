import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';

import Message from './Message.jsx';

const MessageView = function() {
  const messages = st.user.messages[st.messageWith];

  var handleSubmit = function() {

  };

  return (
    <div className='messageView v c'>
      <Message message={messages[0]}/>
      <div id='messageInputContainer' className='h'>
        <textarea id='messageInput' className='h'/>
        <div className='v c'>send</div>
      </div>
    </div>
  );
};

export default MessageView;

