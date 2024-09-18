import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';
import {ax} from 'util';

const Message = function({message}) {
  const userMessage = st.user._id === message.user;

  var handlePending = function() {
    if (message.type === 'pendFriend') {
      return (
        <div className='friendHandle' onClick={()=>{ax.cancelFriend(st.user._id, message.sentTo)}}>cancel</div>
      )
    }

    if (message.type === 'acceptFriend') {
      return (
        <div className='h'>
          <div className='friendHandle' onClick={()=>{ax.acceptFriend(message.sentTo, st.user._id)}}>accept</div>
          <div className='friendHandle' onClick={()=>{ax.cancelFriend(message.sentTo, st.user._id)}}>deny</div>
        </div>
      )
    }
  };

  return (
    <div className='message v c' style={{alignSelf: userMessage ? 'end' : 'start'}}>
      {message.text}
      {handlePending()}
    </div>
  );
};

export default Message;

