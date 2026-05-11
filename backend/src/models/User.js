import prisma from "../config/db.js";

export const UserModel = {
  async create(data) {
    return prisma.user.create({ data });
  },

  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  },

  async update(id, data) {
    return prisma.user.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.user.delete({ where: { id } });
  },

  async updateRefreshToken(id, refreshToken) {
    return prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  },
};
