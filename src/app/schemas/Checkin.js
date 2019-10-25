import Mongoose from 'mongoose';

const CheckinSchema = new Mongoose.Schema(
  {
    student: {
      type: Number,
      required: true,
    },
    currentPeriod: {
      type: Boolean,
      require: false,
      default: true,
    },
  },
  { timestamps: true }
);

export default Mongoose.model('Checkin', CheckinSchema);
