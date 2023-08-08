import mongoose from "mongoose";

export default async (dbUri: string) => {
  try {
    await mongoose.connect(dbUri);
    return { success: true, message: "DB connected successfully" };
  } catch (error) {
    const err = error as Error;
    return { success: false, message: err.message };
  }
};
