const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
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
  ipAddress: {
    type: String,
    required: true,
  },
});

//static signup mathod
userSchema.statics.signup = async function (
  name,
  username,
  email,
  password,
  ipAddress
) {
  //validation
  if (!name || !username || !email || !password || !ipAddress) {
    throw Error("all fields are required");
  }

  if (!validator.isEmail(email)) {
    throw Error("invalid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "password must be 8+ cars, with uppercase,lowercase, number and symble"
    );
  }

  const existEmail = await this.findOne({ email });
  if (existEmail) {
    throw Error("email already used");
  }

  //hasing password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  //creating user
  const user = await this.create({
    name,
    username,
    email,
    password: hashPassword,
    ipAddress,
  });

  return user;
};

//static login mathod
userSchema.statics.login = async function (email, password, ipAddress) {
  //validation
  if (!email || !password || !ipAddress) {
    throw Error("all fields are required");
  }

  const user = await this.findOne({ email, ipAddress });

  if (!user) {
    throw Error("incorrect email or restricted ip address");
  }

  //compair password
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
