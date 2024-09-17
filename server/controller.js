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
        var messages = await controller.getMessagesForUser(user._id);

        user.messages = messages;

        res.json(user);
      })
  },
  getMessagesForUser: async function(_id) {
    var messages = await Message.find({user: _id}).populate('sentTo');

    newMessages = {};

    messages.map(function(message) {
      if (!newMessages[message.sentTo._id]) {
        newMessages[message.sentTo._id] = [];
      }

      newMessages[message.sentTo._id].push(message);
    })

    console.log(newMessages);

    return newMessages;
  },
  checkUsername: function(req, res) {
    User.findOne({username: req.params.username})
      .then(function(user) {
        if (user) {
          res.json(true);
        } else {
          res.json(false);
        }
      })
  },
  searchForUsers: function(req, res) {
    User.find({username: {$regex: req.params.username, $options: 'i'}})
      .select('_id username')
      .then(function(users) {
        res.json(users);
      })
  },
  addFriend: async function(req, res) {
    const sender = await User.findOne({_id: req.body.sender});
    const sendee = await User.findOne({_id: req.body.sendee});

    var senderMessage = {user: sender._id, sentTo: sendee._id, text: `you have added ${sendee.username}.`, type: 'pendFriend'};
    var sendeeMessage = {user: sendee._id, sentTo: sender._id, text: `${sendee.username} has added you.`, type: 'acceptFriend'};

    await Message.create(senderMessage);
    await Message.create(sendeeMessage);

    const user = await User.findOneAndUpdate({_id: req.body.sender}, {$push: {friendsPending: req.body.sendee}}, {new: true});

    await User.updateOne({_id: req.body.sendee}, {$push: {friendsPending: req.body.sender}});

    res.json(user);
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