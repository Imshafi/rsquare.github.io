const mongoose = require("mongoose");

const imagesSchema = new mongoose.Schema({
	userId: { type: String, required: true },
    images:{type:[String],required:true}
});

const Image = mongoose.model("image", imagesSchema);

module.exports = Image;
