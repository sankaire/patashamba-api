import { Schema, model } from "mongoose";
import { ILand } from "../interface/index.js";

const landSchema = new Schema<ILand>({
  phone: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  land: {
    size: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fenced: {
      type: String,
      required: true,
    },
    tittled: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rate: {
      type: String,
      required: true,
    },
    location: {
      county: {
        type: String,
        required: true,
      },
      ward: {
        type: String,
        required: true,
      },
    },
  },
});
const Land = model("Land", landSchema);
export default Land;
