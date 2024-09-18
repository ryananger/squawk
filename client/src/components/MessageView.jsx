import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';
import {socket, ax} from 'util';

import Message from './Message.jsx';

const MessageView = function() {
  const [joined, setJoined] = useState(false);

  const messages = st.user.messages[st.messageWith];
  const chatId = st.user.messages[st.messageWith][0].chatId;

  var renderMessages = function() {
    var rendered = [];

    messages.map(function(message, i) {
      rendered.push(<Message key={'message' + i} message={message}/>);
    })

    return rendered;
  };

  var handleSubmit = function() {
    var input = document.getElementById('messageInput').value;

    var message = {
      user: st.user._id,
      sentTo: st.messageWith,
      text: input,
      chatId: chatId
    };

    ax.sendMessage(message);
  };

  var joinChat = function() {
    if (!joined) {
      socket.emit('joinChat', chatId);

      setJoined(true);
    }
  };

  useEffect(joinChat, []);

  return (
    <div className='messageView v c'>
      {renderMessages()}
      <div id='messageInputContainer' className='h'>
        <textarea id='messageInput' className='h'/>
        <div className='v c' onClick={handleSubmit}>send</div>
      </div>
    </div>
  );
};

export default MessageView;

