import axios from 'axios';
import st    from 'ryscott-st';

const header = {headers: {auth: process.env.SERVER_AUTH}};

var ax = {
  createUser: function(user) {
    axios.post(process.env.URL + 'api/users', user, header)
      .then(function(response) {
        console.log(response.data);

        st.setUser(response.data);
      })
  },
  getUser: function(uid) {
    axios.get(process.env.URL + 'api/users/' + uid, header)
      .then(function(response) {
        var user = response.data;

        st.setUser(user);
        document.cookie = `user=${uid}`;
      })
  },
  checkUsername: async function(username) {
    const response = await axios.get(process.env.URL + 'api/users/checkUsername/' + username, header);

    return response.data;
  },
  searchForUsers: async function(username) {
    const response = await axios.get(process.env.URL + 'api/users/searchForUsers/' + username, header);

    st.setSearch(response.data);
  },
  addFriend: function(sender, sendee) {
    axios.post(process.env.URL + 'api/users/addFriend/', {sender, sendee}, header)
      .then(function(response) {
        ax.getUser(st.user.uid);
      })
  },
  cancelFriend: function(sender, sendee) {
    axios.post(process.env.URL + 'api/users/cancelFriend/', {sender, sendee}, header)
      .then(function(response) {
        st.setView('home');
        st.setMessageWith(null);
        ax.getUser(st.user.uid);
      })
  },
  acceptFriend: function(sender, sendee) {
    axios.post(process.env.URL + 'api/users/acceptFriend/', {sender, sendee}, header)
      .then(function(response) {
        ax.getUser(st.user.uid);
      })
  },
  sendMessage: function(message) {
    axios.post(process.env.URL + 'api/messages/', message, header)
      .then(function(response) {
        ax.getUser(st.user.uid);
      })
  }
};

export default ax;
