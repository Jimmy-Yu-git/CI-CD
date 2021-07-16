import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  //chatBoxes: [{ type: mongoose.Types.ObjectId, ref: 'ChatBox' }],
});

const messageSchema = new Schema({
  //chatBox: { type: mongoose.Types.ObjectId, ref: 'ChatBox' },
  sender: { type: mongoose.Types.ObjectId, ref: 'User' },
  body: { type: String, required: true },
});

const chatBoxSchema = new Schema({
  name: { type: String, required: true },
  //users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }],
});
const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },

});
const Event = mongoose.model('Event', eventSchema);
const UserModel = mongoose.model('User', userSchema);
const ChatBoxModel = mongoose.model('ChatBox', chatBoxSchema);
const MessageModel = mongoose.model('Message', messageSchema);
const db = {
  UserModel,
  ChatBoxModel,
  MessageModel,
  Event
};
export { db as default };