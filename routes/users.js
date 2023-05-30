const express = require("express");
const {
  saveUser,
  findUserbyEmail,
  findUserbyID,
} = require("../database/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const z = require("zod");
const EmailAlreadyBeenUsed = require("../errors/EmailAlreadyBeenUsed");
const router = express.Router();

const userSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email().max(70),
  password: z.string().min(6).max(25),
  age: z.number().optional(),
});

router.post("/register", async (req, res, next) => {
  try {
    const user = userSchema.parse(req.body);
    const isEmailAlreadyUsed = await findUserbyEmail(user.email);
    if (isEmailAlreadyUsed) throw new EmailAlreadyBeenUsed();
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    user.password = hashedPassword;
    const savedUser = await saveUser(user);
    delete savedUser.password;
    res.status(201).json({
      user: savedUser,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await findUserbyEmail(email);

  if (!user) return res.status(401).json("Email ou senha inválidos");

  const isSamePassword = bcrypt.compareSync(password, user.password);

  if (!isSamePassword) return res.status(401).json("Email ou senha inválidos");

  const token = jwt.sign(
    {
      userId: user.id,
      name: user.name,
    },
    process.env.SECRET
  );

  res.json({
    succes: true,
    token,
  });
});

router.get("/profile", auth, async (req, res) => {
  const user = await findUserbyID(req.user.userId);
  res.json({
    user,
  });
});

router.get("/history", auth, async (req, res) => {
  const user = await findUserbyID(req.user.userId);
  res.json(user);
});

module.exports = {
  router,
};
