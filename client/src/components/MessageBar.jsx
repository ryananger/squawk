import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';

const MessageBar = function({messages}) {
  return (
    <div className='messageWith bar h' onClick={()=>{st.setMessageWith(messages[0].sentTo._id)}}>
      {messages[0].sentTo.username}
    </div>
  );
};

export default MessageBar;

