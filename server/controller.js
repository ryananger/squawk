const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {User, Message} = require('./db.js');
const {encrypt, decrypt} = require('./encryption.js');
const {getIO} = require('./io.js');
const io = getIO();

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
        var messages = await controller.getMessagesForUser(user._id, user.messages);

        user.messages = messages;

        res.json(user);
      })
  },
  getMessagesForUser: async function(_id, messages) {
    var sentFriendMessages = await Message.find({user: _id, type: {$exists: true}}).populate('user sentTo');
  
    let allMessages = [...sentFriendMessages];

    if (!messages) {
      messages = [];
    }

    for (var i = 0; i < messages.length; i++) {
      var msg = await Message.findOne({_id: messages[i]}).populate('sentTo user');
      
      msg.text = decrypt(msg.text);
      
      allMessages.push(msg);
    }

    // Create a new messages object and sort the messages by who the conversation is with
    let newMessages = {};

    allMessages.forEach((message) => {
      let otherUserId;

      // Determine if it's a sent or received message to figure out the other user
      if (message.sentTo._id.toString() === _id.toString()) {
          otherUserId = message.user._id; // Received message, the sender is the other person
      } else {
          otherUserId = message.sentTo._id; // Sent message, the recipient is the other person
      }

      // Initialize a new array if it doesn't exist for this user
      if (!newMessages[otherUserId]) {
          newMessages[otherUserId] = [];
      }

      // Push the message into the corresponding array
      newMessages[otherUserId].push(message);
    });

    // Sort each set of messages by 'createdOn' date for each user
    Object.keys(newMessages).forEach((userId) => {
        newMessages[userId].sort((a, b) => new Date(a.createdOn) - new Date(b.createdOn)); // Ascending order by createdOn
    });

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

    const chatId = sender._id + sendee._id;

    var senderMessage = {user: sender._id, sentTo: sendee._id, chatId: chatId, text: `you have added ${sendee.username}.`, type: 'pendFriend'};
    var sendeeMessage = {user: sendee._id, sentTo: sender._id, chatId: chatId, text: `${sender.username} has added you.`, type: 'acceptFriend'};

    await Message.create(senderMessage);
    await Message.create(sendeeMessage);

    const user = await User.findOneAndUpdate({_id: sender._id}, {$push: {friendsPending: sendee._id}}, {new: true});

    await User.updateOne({_id: sendee._id}, {$push: {friendsPending: sender._id}});

    res.json(user);
  },
  cancelFriend: async function(req, res) {
    const sender = await User.findOne({_id: req.body.sender});
    const sendee = await User.findOne({_id: req.body.sendee});

    await Message.deleteOne({user: sender._id, sentTo: sendee._id});
    await Message.deleteOne({user: sendee._id, sentTo: sender._id});

    await User.updateOne({_id: sender._id}, {$pull: {friendsPending: sendee._id}});
    await User.updateOne({_id: sendee._id}, {$pull: {friendsPending: sender._id}});

    res.sendStatus(201);
  },
  acceptFriend: async function(req, res) {
    const sender = await User.findOne({_id: req.body.sender});
    const sendee = await User.findOne({_id: req.body.sendee});

    const chatId = sender._id + sendee._id;

    await Message.deleteOne({user: sender._id, sentTo: sendee._id});
    await Message.deleteOne({user: sendee._id, sentTo: sender._id});

    var senderMessage = {user: sender._id, sentTo: sendee._id, chatId: chatId, text: `${sendee.username} has accepted your friend request.`, type: 'friend'};
    var sendeeMessage = {user: sendee._id, sentTo: sender._id, chatId: chatId, text: `you have accepted the friend request from ${sender.username}.`, type: 'friend'};

    await Message.create(senderMessage);
    await Message.create(sendeeMessage);

    await User.updateOne({_id: sender._id}, {$pull: {friendsPending: sendee._id}, $push: {friends: sendee._id}});
    await User.updateOne({_id: sendee._id}, {$pull: {friendsPending: sender._id}, $push: {friends: sender._id}});

    res.sendStatus(201);
  },
  sendMessage: async function(req, res) {
    const encrypted = encrypt(req.body.text);

    req.body.text = encrypted;

    var msg = await Message.create(req.body);

    await User.updateOne({_id: req.body.user}, {$push: {messages: msg._id}});
    await User.updateOne({_id: req.body.sentTo}, {$push: {messages: msg._id}});

    io.to(req.body.chatId).emit('newMessage');

    res.sendStatus(201);
  },
  clearConversation: async function(req, res) {
    const chatId = req.body.chatId;
    const user = req.body.user;

    var chatMessages = await Message.find({chatId: chatId});

    for (var i = 0; i < chatMessages.length; i++) {
      var idToPull = chatMessages[i]._id;

      await User.updateOne({_id: user}, {$pull: {messages: idToPull}});
    }

    res.sendStatus(201);
  },

  fix: async function(req, res) {
    await Message.deleteMany({type: {$exists: false }});

    var users = await User.find({});

    users.map(function(user) {
      user.messages = {};
      user.save();
    })

    res.send('yay');
  }
};

module.exports = controller;