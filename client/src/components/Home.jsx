import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';
import {ax, socket} from 'util';

import MessageBar from './MessageBar.jsx';

const Home = function() {
  const [messages, setMessages] = st.newState('messages', useState(null));
  const [joined, setJoined] = useState(false);

  var joinChats = function() {
    if (messages && !joined) {
      for (var id in messages) {
        var chatId = messages[id][0].chatId;
        
        socket.emit('joinChat', chatId);
      }
      
      setJoined(true);
      ax.getUser(st.user.uid);
    }
  };

  var renderMessageWith = function() {
    var rendered = [];

    // Convert the messages object to an array of entries (key-value pairs)
    var messageArray = Object.entries(messages);

    // Sort the message array by the 'createdOn' property of the most recent message in each array
    messageArray.sort((a, b) => {
        var lastMessageA = a[1][a[1].length - 1]; // Get the last message in array a
        var lastMessageB = b[1][b[1].length - 1]; // Get the last message in array b

        return new Date(lastMessageB.createdOn) - new Date(lastMessageA.createdOn); // Compare dates
    });

    // Render the sorted messages
    for (var [id, messageGroup] of messageArray) {
        rendered.push(<MessageBar key={id} messages={messageGroup}/>);
    }

    return rendered;
  };

  useEffect(()=>{
    setMessages(st.user?.messages || null);
  }, [st.user]);

  useEffect(joinChats, [messages]);

  return (
    <div className='messagesView v'>
      messages
      {messages && renderMessageWith()}
    </div>
  );
};

export default Home;

