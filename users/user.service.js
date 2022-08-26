import dotenv from "dotenv";
import path from "path";

const result = dotenv.config({ path: path.resolve(".env") });

if (result.error) {
  throw result.error;
}

const users = [
  { id: 1, username: process.env.USER, password: process.env.PASSWORD },
];

async function authenticate({ username, password }) {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

async function getAll() {
  return users.map((u) => {
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });
}
export { authenticate, getAll };
