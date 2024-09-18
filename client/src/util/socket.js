import {io} from 'socket.io-client';

import st from 'ryscott-st';
import {ax} from 'util';

const socket = io('http://localhost:4001/');

socket.on('newMessage', ()=>{
  ax.getUser(st.user.uid);
})

export default socket;