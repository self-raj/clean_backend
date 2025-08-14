import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['headOffice', 'branchOffice'],
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: Number,
    required: true
  },
  mapUrl: {                // पहला Google Map Embed URL
    type: String,
    required: true,
    trim: true
  },

}, { timestamps: true });

const contactSchema = new mongoose.Schema({
  phone: { type: String, required: true, trim: true },
   phone_2: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  landline: { type: String, trim: true },
  addresses: {
    type: [addressSchema],
    // validate: [arr => arr.length > 0, 'At least one address required']
  }
}, { timestamps: true });

const contactModel = mongoose.model('Contact', contactSchema);
export default contactModel;
