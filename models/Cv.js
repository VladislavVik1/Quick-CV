import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  age: String,
  phone: String,
  email: String,
  about: String,
  skills: [String],
  position: String,
  years: String,
  noExperience: Boolean,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CV', cvSchema);
