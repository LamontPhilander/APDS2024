import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'staff', },
});

export default mongoose.model('Staff', staffSchema);
