const { Schema, model } = require('mongoose');

const {handleMongooseErr} = require("../helpers");

const contactSchema = new Schema({ 
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
})

contactSchema.post("save", handleMongooseErr);

const ContactModel = model("contact", contactSchema);

module.exports = ContactModel;