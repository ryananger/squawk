import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';

const Message = function({message}) {
  var handleType = function() {
    if (message.type === 'pendFriend') {
      return (
        <div className='friendHandle'>cancel</div>
      )
    }

    if (message.type === 'acceptFriend') {
      return (
        <div className='friendHandle h'>
          <div>accept</div>
          <div>deny</div>
        </div>
      )
    }
  };

  return (
    <div className='messagePreview'>
      {message.text}
      {handleType()}
    </div>
  );
};

export default Message;

