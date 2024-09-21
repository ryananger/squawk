import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';
import icons from 'icons';
import {ax} from 'util';

import Message from './Message.jsx';

const ViewMessageOptions = function({chatId, setViewOptions}) {
  const [confirm, setConfirm] = useState(false);

  var handleConfirm = function() {
    if (confirm === 'clear') {
      ax.clearConversation(chatId);
      setViewOptions(false);
    }
  };

  return (
    <div className='viewMessageOptions v'>
      {!confirm && <div className='messageWith bar' onClick={()=>{setConfirm('clear')}}>clear conversation</div>}
      {/* {!confirm && <div className='messageWith bar' onClick={()=>{setConfirm('remove')}}>remove friend</div>} */}
      {confirm && 
      <div className='v'>
        are you sure?
        <div className='h'>
          <div className='confirmButton' onClick={handleConfirm}>yes</div>
          <div className='confirmButton' onClick={()=>{setConfirm(false)}}>no</div>
        </div>
      </div>}
    </div>
  );
};

export default ViewMessageOptions;

