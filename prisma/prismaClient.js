const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all users
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Add a new user
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
    },
  });
  res.json(newUser);
});

