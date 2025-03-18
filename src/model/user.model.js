const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    recipes: [
      {
        // ObjectId is a special type in MongoDB, which is used for referencing documents in other collections.
        type: ObjectId, // the use of ObjectId
        ref: 'Recipe',
      },
    ],
  },
  {
    timestamps: { createdAt: 'Date_Created', updatedAt: 'Date_Updated' },
  },
)


const User = mongoose.model("User", userSchema);

module.exports = User;
// module.exports = mongoose.model('User', userSchema);
