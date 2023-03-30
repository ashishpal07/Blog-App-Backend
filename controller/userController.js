const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwtToken = require("../config/jwt");

module.exports = {
  getAllUser: async (req, res) => {
    let users = await User.find();
    if (users.length >= 0) {
      return res.status(200).json({ users });
    } else if (users == "undefined" || users == null) {
      return res.status(404).json({ message: "User not nound" });
    }
  },

  signUp: async (req, res) => {
    let { name, email, password } = req.body;
    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User Already Exist! Login Instead" });
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    let createUser = new User({
      name,
      email,
      password: hashPassword,
    });
    await createUser.save();

    return res.status(201).json({ createUser });
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found By This Email" });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Email / Password" });
    }

    let token = jwtToken.generateToken(existingUser?._id);

    return res.status(200).json({
      existingUser,
      token,
      message: "Login Successfully",
    });
  }
};
