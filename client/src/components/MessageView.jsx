import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';

const MessageView = function() {
  const messages = st.user.messages[st.messageWith];
  
  return (
    <div className='messageView v c'>
      {messages[0].text}
    </div>
  );
};

export default MessageView;

