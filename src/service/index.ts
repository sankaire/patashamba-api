import { compare } from "bcrypt";
import { IAdmin, ILand, ITenant } from "../interface/index.js";
import Admin from "../models/admin.js";
import Land from "../models/land.js";

const pataShambaService = {
  api: {
    create_admin: async (data: IAdmin) => {
      const account = await Admin.create(data);
      if (!account) {
        return {
          success: false,
          message: "Admin not created succesfully",
          data: null,
        };
      }
      return {
        success: true,
        message: "Admin  created succesfully",
        data: data,
      };
    },
    login_admin: async (data: { email: string; password: string }) => {
      const account = await Admin.findOne({ email: data.email });
      if (!account) {
        return {
          success: false,
          message: "Invalid credentials",
          data: null,
        };
      }
      const password = account.password;
      const passwordIsValid = await compare(data.password, password);
      if (!passwordIsValid) {
        return {
          success: false,
          message: "Invalid credentials",
          data: null,
        };
      }
      return {
        success: true,
        message: "Login succesfull",
        data: account,
      };
    },
    fetch_lands: async () => {
      const lands = await Land.find();
      if (lands.length === 0) {
        return { success: false, message: "Land not found", data: null };
      }
      return {
        success: true,
        message: "Land fetched succefully",
        data: lands,
      };
    },
    fetch_land: async (id: string) => {
      const land = await Land.findOne({ _id: id });
      if (!land) {
        return { success: false, message: "Land not found", data: null };
      }
      return {
        success: true,
        message: "Land fetched succefully",
        data: land,
      };
    },
    search_land: async (price: string, location: string) => {
      const search = await Land.find({})
        .where("land.price")
        .equals(price)
        .where("location.county")
        .equals(location);
      if (search.length === 0) {
        return { success: false, message: "Land not found", data: null };
      }
      return {
        success: true,
        message: "Land fetched succefully",
        data: search,
      };
    },
    approve: async (id: string) => {
      const land = await pataShambaService.api.fetch_land(id);
      if (!land.success) {
        return { success: false, message: "Land not found", data: null };
      }
      const phoneNumber = land.data?.phone;
      await Land.findOneAndUpdate(
        { _id: id },
        { $set: { status: "true" } },
        { new: true }
      );
      //TODO:send sms
      return {
        success: true,
        message: "Land approved for listing",
        data: land.data,
      };
    },
    reject: async (id: string) => {
      const land = await pataShambaService.api.fetch_land(id);
      if (!land.success) {
        return { success: false, message: "Land not found", data: null };
      }
      const phoneNumber = land.data?.phone;
      await Land.findOneAndRemove({ _id: id });
      //TODO:send sms
      return {
        success: true,
        message: "Land removed from listing",
        data: land.data,
      };
    },
  },
  ussd: {
    save: async (data: ILand) => {
      const land = await Land.create(data);
      if (!land) {
        return { success: false, message: "Data not saved", data: null };
      }
      return { success: true, message: "Data saved", data };
    },
  },
};
export default pataShambaService;
