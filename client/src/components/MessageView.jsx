import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';
import {ax} from 'util';

import Message from './Message.jsx';

const MessageView = function() {
  const messages = st.user.messages[st.messageWith];
  const chatId = st.user.messages[st.messageWith][0].chatId;
  const username = messages[0].sentTo.username;

  var renderMessages = function() {
    var rendered = [];

    messages.map(function(message, i) {
      rendered.push(<Message key={'message' + i} message={message}/>);
    })

    return rendered;
  };

  var handleKey = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      handleSubmit();
    }
  };

  var handleSubmit = function() {
    var input = document.getElementById('messageInput').value;

    if (!input) {return};

    var message = {
      user: st.user._id,
      sentTo: st.messageWith,
      text: input,
      chatId: chatId
    };

    ax.sendMessage(message);
    document.getElementById('messageInput').value = '';
  };

  useEffect(scrollToBottom, [st.user]);

  return (
    <div className='messageView v c'>
      <div className='messageViewHead h'>
        {username}
      </div>
      <div id='messages' className='messages v'>
        {renderMessages()}
      </div>
      <div id='messageInputContainer' className='h'>
        <textarea id='messageInput' className='h' onKeyDown={handleKey}/>
        <div className='v c' onClick={handleSubmit}>send</div>
      </div>
    </div>
  );
};

var scrollToBottom = function() {
  const messages = document.getElementById('messages');
  
  if (messages) {
    messages.scrollTo({
      top: messages.scrollHeight,
      behavior: 'smooth'
    });
  }
};

export default MessageView;

