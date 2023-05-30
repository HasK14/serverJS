const prisma = require("./prisma");

const findUserbyEmail = (email) => {
  return prisma.users.findUnique({
    where: {
      email,
    },
  });
};

const findUserbyID = (id) => {
  return prisma.users.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      password: false,
      BoughtMany: {
        select: {
          quantity: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    where: {
      id,
    },
  });
};

const saveUser = (user) => {
  return prisma.users.create({
    data: user,
  });
};

module.exports = {
  saveUser,
  findUserbyEmail,
  findUserbyID,
};
