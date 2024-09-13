const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    date: { type: Date, require: true },
    location: { type: String, trim: true },
    price: {type: Number, require: true },
    description: { type: String, trim: false },
    img: { type: String, trim: true },
    assistants: [{ type: mongoose.Types.ObjectId, ref:"User"}],
    artist: { type: mongoose.Types.ObjectId, ref: "Artist" },
    organizer: { type: mongoose.Types.ObjectId, ref: "User" , require: false},
    category: {
      type:String, require: true, 
      enum: [ "Pop", "Rock", "Indie", "Electronica", "Reggae", "Metal", "Mix"]
        }
  },
  {
    timestamps: true,
    collection: 'events',
  }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
