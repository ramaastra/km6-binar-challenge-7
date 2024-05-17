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

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true
        }
      });
      if (!user) {
        req.flash('error', 'notFound');
        return res.render('notification');
      }

      const notifications = await prisma.notification.findMany({
        where: { userId }
      });

      const currentDate = new Date().toLocaleDateString();
      notifications.forEach((notification) => {
        const createdAtDate = new Date(
          notification.createdAt
        ).toLocaleDateString();
        if (currentDate === createdAtDate) {
          notification.createdAt = new Date(
            notification.createdAt
          ).toLocaleTimeString();
        } else {
          notification.createdAt = createdAtDate;
        }
      });

      res.render('notification', { user, notifications });
    } catch (error) {
      next(error);
    }
  }
};
