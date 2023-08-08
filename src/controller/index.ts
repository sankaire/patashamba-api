import { Request, Response } from "express";
import { ILand } from "../interface/index.js";
import pataShambaService from "../service/index.js";

const pataShamba = {
  api: {},
  ussd: {
    save_data: async (req: Request, res: Response) => {
      try {
        const data = req.body as ILand;
        const land = await pataShambaService.ussd.save(data);
        if (!land.success) {
          return res.status(400).json(data);
        }
        return res.status(200).json(data);
      } catch (error) {
        const err = error as Error;
        return res.status(200).json({ success: false, message: err.message });
      }
    },
  },
};
export default pataShamba;
