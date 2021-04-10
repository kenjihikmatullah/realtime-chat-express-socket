const users = [];

// Join
const userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);

  return user;
};

const getCurrentUser = id => {
  return users.find(u => u.id === id);
};

// Leave
const userLeave = id => {
  const users = users.filter(u => u.id !== id);
  return users;
};

module.exports = { userJoin, getCurrentUser, userLeave };