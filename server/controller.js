const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {User, Message} = require('./db.js');

var controller = {
  createUser: function(req, res) {
    User.create(req.body)
      .then(function(user) {
        res.json(user);
      })
  },
  getUser: function(req, res) {
    User.findOne({uid: req.params.uid})
      .then(async function(user) {
        res.json(user);
      })
  },

  fix: async function(req, res) {
    // Post.deleteMany({})
    //   .then(function() {
    //     console.log('Posts deleted.');
    //   })

    // await User.updateMany({}, {messages: {}});
    // await Community.updateMany({}, {messages: []});
    // await Message.deleteMany({});

    // res.send('yay');
  }
};

module.exports = controller;