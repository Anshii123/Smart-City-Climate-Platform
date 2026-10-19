import bcrypt from 'bcryptjs';

// In-memory development store active when MongoDB Atlas credentials are not yet verified
const devUsers = new Map();
const devPredictions = [];

export const getDevUserById = (id) => {
  return devUsers.get(id) || null;
};

export const getDevUserByEmail = (email) => {
  if (!email) return null;
  for (const user of devUsers.values()) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return user;
    }
  }
  return null;
};

export const createDevUser = (name, email, password, role = 'user') => {
  const id = 'dev_' + Date.now();
  const newUser = {
    _id: id,
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    role,
    createdAt: new Date()
  };
  devUsers.set(id, newUser);
  return newUser;
};

export const verifyDevPassword = (password, passwordHash) => {
  return bcrypt.compareSync(password, passwordHash);
};

export const addDevPrediction = (doc) => {
  const record = { ...doc, _id: 'dev_pred_' + Date.now(), createdAt: new Date() };
  devPredictions.unshift(record);
  return record;
};

export const getDevPredictions = () => devPredictions;

export const deleteDevPrediction = (id) => {
  const idx = devPredictions.findIndex(p => p._id === id);
  if (idx !== -1) {
    devPredictions.splice(idx, 1);
    return true;
  }
  return false;
};
