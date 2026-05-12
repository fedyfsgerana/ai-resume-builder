import prisma from "../config/db.js";

export const ResumeModel = {
  async create(data) {
    return prisma.resume.create({ data });
  },

  async findById(id) {
    return prisma.resume.findUnique({ where: { id } });
  },

  async findAllByUser(userId) {
    return prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async update(id, data) {
    return prisma.resume.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.resume.delete({ where: { id } });
  },

  async updateMatchScore(id, matchScore) {
    return prisma.resume.update({
      where: { id },
      data: { matchScore },
    });
  },

  async updateStatus(id, status) {
    return prisma.resume.update({
      where: { id },
      data: { status },
    });
  },

  async duplicate(id, userId) {
    const original = await prisma.resume.findUnique({ where: { id } });
    if (!original) return null;

    return prisma.resume.create({
      data: {
        userId,
        title: `${original.title} (Salinan)`,
        cvBase: original.cvBase,
        jobDesc: original.jobDesc,
        generatedCv: original.generatedCv,
        status: "DRAFT",
        matchScore: null,
      },
    });
  },
};
