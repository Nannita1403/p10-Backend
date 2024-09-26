const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema( 
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: {type: String, require: true, unique: true },
    profilePic: { type: String, require: false },
    favArtist: [ 
      { 
        type: mongoose.Types.ObjectId, 
        ref: "Artist", require: false }
      ],
    events: [ 
      { 
        type: mongoose.Types.ObjectId, 
        ref: "Event", require: false } 
      ],
    role: { 
      type: String,
      trim: true,
      lowercase: true,
      default: "user",
      enum: ["user", "admin"],
      required: true
    }
  },  {
    timestamps: true,
    collection: "users"
  }
);
userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 10);
});

const User = mongoose.model("User", userSchema);
module.exports = User;

