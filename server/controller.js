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
        var messages = await controller.getMessagesForUser(user._id);

        user.messages = messages;

        res.json(user);
      })
  },
  getMessagesForUser: async function(_id) {
    var sentMessages = await Message.find({ user: _id }).populate('sentTo');
    var receivedMessages = await Message.find({ sentTo: _id }).populate('user');
  
    let newMessages = {};
  
    // Combine both sent and received messages
    const allMessages = [...sentMessages, ...receivedMessages];
  
    allMessages.forEach(function(message) {
      // Determine who the conversation is with
      let otherUserId;
      
      if (message.sentTo._id.toString() === _id.toString()) {
        otherUserId = message.user._id; // Received message, so other person is the sender
  
        // Exclude the message if it was sent by the other user AND has a 'type' key
        if (message.type) {
          return; // Skip this message
        }
      } else {
        otherUserId = message.sentTo._id; // Sent message, so other person is the recipient
      }
  
      // Initialize array if it doesn't exist
      if (!newMessages[otherUserId]) {
        newMessages[otherUserId] = [];
      }

      if (!message.type) {
        const decrypted = decrypt(message.text);

        message.text = decrypted;
      }
  
      // Push message into the corresponding array
      newMessages[otherUserId].push(message);
    });
  
    // Sort messages by createdOn date for each user
    Object.keys(newMessages).forEach(userId => {
      newMessages[userId].sort((a, b) => new Date(a.createdOn) - new Date(b.createdOn));
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

    await Message.create(req.body);

    io.to(req.body.chatId).emit('newMessage');

    res.sendStatus(201);
  },

  fix: async function(req, res) {
    await Message.delete({});
  }
};

module.exports = controller;