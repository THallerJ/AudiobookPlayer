const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    rootId: String,
    accessToken: String,
    refreshToken: String,
    notifyFlag: Boolean,
    rootUpdatedAt: Date,
  },
  {
    timestamps: {
      createdAt: false,
      updatedAt: true,
    },
  }
);

module.exports = mongoose.model('User', userSchema);
