import mongoose, { Schema } from 'mongoose';



const schema = new Schema(
  {
    ownerUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountNumber: {
      type: String,
      unique: true,
      required: true,
    
    },
    bankName: {
      type: String,
      required: true,
    
    },
    nickName: {
      type: String,
   
    },
  },
  { timestamps: true },
);

const Beneficiary = mongoose.model('Beneficiary', schema);

export default Beneficiary;
