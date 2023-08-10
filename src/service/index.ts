import { compare } from "bcrypt";
import { IAdmin, ILand, ITenant } from "../interface/index.js";
import Admin from "../models/admin.js";
import Land from "../models/land.js";
import at from "../config/at.js";

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
      const phoneNumber = land.data?.phone!;
      const name = land.data?.ownerName;
      await Land.findOneAndUpdate(
        { _id: id },
        { $set: { status: "true" } },
        { new: true }
      );
      await at.client.sendSms({
        to: phoneNumber,
        message: `Habari ${name}. Nakufahamisha kwamba ardhi yako imeidhinishwa kwa ajili ya kuorodheshwa kwenye jukwaa na sasa watu wanaweza kukodisha wakati wowote. `,
      });
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
      const phoneNumber = land.data?.phone!;
      const name = land.data?.ownerName;
      await Land.findOneAndRemove({ _id: id });
      await at.client.sendSms({
        to: phoneNumber,
        message: `Habari ${name}. Nachukua nafasi hii kukujulisha kwamba ardhi yako haikupitishwa kwa ajili ya kuorodheshwa kwenye jukwaa, na kwa sasa watu hawawezi kukodisha. `,
      });
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
      await at.client.sendSms({
        to: land.phone,
        message: `Asante kwa kujiandikisha, maombi yako yatakaguliwa hivi punde. Wasiliana na 0794979175 kwa msaada`,
      });
      return { success: true, message: "Data saved", data };
    },
  },
};
export default pataShambaService;
