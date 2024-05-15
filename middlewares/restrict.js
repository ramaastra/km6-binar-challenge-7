const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.split(' ')[1]) {
    return res.status(401).json({
      status: false,
      message: 'Unauthorized',
      data: null
    });
  }

  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, async (error, data) => {
    if (error) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        data: null
      });
    }

    const user = await prisma.user.findFirst({
      where: { id: data.id },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    req.user = user;
    next();
  });
};
