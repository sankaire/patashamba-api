import { Schema, model } from "mongoose";
import { ITenant } from "../interface/index.js";

const tenantSchema = new Schema<ITenant>(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Tenant = model("Tenant", tenantSchema);
export default Tenant;
