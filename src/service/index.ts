import { ILand } from "../interface";
import Land from "../models/land";

const pataShambaService = {
  api: {},
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
