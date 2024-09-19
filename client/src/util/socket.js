import {io} from 'socket.io-client';

import st from 'ryscott-st';
import {ax} from 'util';

const socket = io(process.env.URL);

socket.on('newMessage', ()=>{
  ax.getUser(st.user.uid);
})

export default socket;
