const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
    name: {type: String, require: true },
    img: [{type: String, require: false }],
    description: {type: String, require: true },
    events: { type: mongoose.Types.ObjectId, ref: "Event" }
}, {
    timestamps: true,
    collection: "artists"
});

const Artist = mongoose.model("Artist", artistSchema);
module.exports = Artist;
