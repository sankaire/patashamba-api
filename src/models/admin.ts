import { Schema, model } from "mongoose";
import { IAdmin } from "../interface/index.js";

const adminAcount = new Schema<IAdmin>(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
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
const Admin = model("Admin", adminAcount);
export default Admin;
