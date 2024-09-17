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
  }
};

export default ax;
