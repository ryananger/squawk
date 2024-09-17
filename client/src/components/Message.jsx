import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';

const Message = function({message}) {
  const userMessage = st.user._id === message.user;

  var handleType = function() {
    if (message.type === 'pendFriend') {
      return (
        <div className='friendHandle'>cancel</div>
      )
    }

    if (message.type === 'acceptFriend') {
      return (
        <div className='h'>
          <div className='friendHandle'>accept</div>
          <div className='friendHandle'>deny</div>
        </div>
      )
    }
  };

  return (
    <div className='message v c' style={{alignSelf: userMessage ? 'end' : 'start'}}>
      {message.text}
      {handleType()}
    </div>
  );
};

export default Message;

