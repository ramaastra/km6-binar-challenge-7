const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { generateHash, compareHash } = require('../libs/bcrypt');
const prisma = new PrismaClient();

module.exports = {
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          status: false,
          message: `Field 'name', 'email', and 'password' are required`,
          data: null
        });
      }

      const hashedPassword = await generateHash(password);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      });

      res.status(201).json({
        status: true,
        message: 'User created',
        data: user
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({
          status: false,
          message: 'Email already registered',
          data: null
        });
      }
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          status: false,
          message: `Field 'email' and 'password' are required`,
          data: null
        });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: 'Invalid email or password',
          data: null
        });
      }

      const isPasswordCorrect = await compareHash(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          status: false,
          message: 'Invalid email or password',
          data: null
        });
      }

      delete user.password;
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

      res.status(200).json({
        status: true,
        message: 'Successfully logged in',
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  },
  whoami: async (req, res, next) => {
    try {
      res.status(200).json({
        status: true,
        message: 'Successfully authenticated',
        data: req.user
      });
    } catch (error) {
      next(error);
    }
  },
  sendResetPasswordLink: async (req, res, next) => {
    const { email } = req.body;
    req.flash('info', `Email sent to ${email}`);
    res.redirect('/forgot-password');
  }
};
