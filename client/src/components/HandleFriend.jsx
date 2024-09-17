import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';
import icons from 'icons';
import {ax, firebase} from '../util';

const HandleFriend = function({entry}) {
  var isFriend = st.user.friends.indexOf(entry._id) !== -1;
  var pendingFriend = st.user.friendsPending.indexOf(entry._id) !== -1;

  var addFriend = function() {
    ax.addFriend(st.user._id, entry._id);
  };

  return (
    <>
    {!isFriend && !pendingFriend && <icons.AddFriendIcon className='icon' size={24} onClick={addFriend}/>}
    {pendingFriend && <icons.PendFriendIcon className='icon' size={24}/>}
    </>
  );
};

export default HandleFriend;

