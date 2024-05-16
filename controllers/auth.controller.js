const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { generateHash, compareHash } = require('../libs/bcrypt');
const { sendEmail } = require('./mailer.controller');
const { renderHtml } = require('../libs/ejs');
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

    const { id, name } = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true }
    });

    const token = jwt.sign({ id }, process.env.JWT_SECRET);
    const html = renderHtml('forgot-password/email', {
      name,
      token
    });

    await sendEmail({
      to: email,
      subject: 'Binar Challenge 7 - Reset Password',
      html
    });

    req.flash('info', `Email sent to ${email}`);
    res.redirect('/forgot-password');
  },
  resetPassword: async (req, res, next) => {
    try {
      const { token } = req.query;
      if (!token) {
        res.status(400).json({
          status: false,
          message: 'Token must be provided',
          data: null
        });
      }

      const { password } = req.body;
      if (!password) {
        res.status(400).json({
          status: false,
          message: `Field 'password' is required`,
          data: null
        });
      }

      jwt.verify(token, process.env.JWT_SECRET, async (error, data) => {
        if (error) {
          return res.status(401).json({
            status: false,
            message: 'Unauthorized',
            data: null
          });
        }

        const { email } = await prisma.user.findFirst({
          where: { id: data.id },
          select: { email: true }
        });

        if (!email) {
          return res.status(400).json({
            status: false,
            message: 'Invalid token',
            data: null
          });
        }

        const hashedPassword = await generateHash(password);
        await prisma.user.update({
          data: { password: hashedPassword },
          where: { email },
          select: {
            id: true,
            name: true,
            email: true
          }
        });

        req.flash('info', 'success');
        res.redirect(`/reset-password?token=${token}`);
      });
    } catch (error) {
      next(error);
    }
  }
};
