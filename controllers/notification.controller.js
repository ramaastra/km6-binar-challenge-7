const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  page: async (req, res, next) => {
    try {
      const userId = parseInt(req.query['user_id']);
      if (!userId) {
        req.flash('error', 'invalid');
        return res.render('notification');
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        req.flash('error', 'notFound');
        return res.render('notification');
      }

      const notifications = await prisma.notification.findMany({
        where: { userId }
      });

      res.render('notification', { name: user.name, notifications });
    } catch (error) {
      next(error);
    }
  }
};
