import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  age: String,
  phone: String,
  email: String,
  github: String,
  city: String,
  languages: String,
  education: String,
  hobbies: String,
  about: String,
  skills: [String],
  photo: String,
  noExperience: Boolean,
  courseExperience: Boolean,
  courses: String,
  position: String,
  years: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CV', cvSchema);
