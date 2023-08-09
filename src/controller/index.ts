import { Request, Response } from "express";
import pataShambaService from "../service/index.js";

const pataShamba = {
  api: {},
  ussd: {
    save_data: async (req: Request, res: Response) => {
      try {
        const data = req.body;
        console.log(data);
        const save_data = {
          phone: data.phoneNumber,
          ownerName: data.ownerName,
          status: false,
          land: {
            size: data.size,
            description: data.description,
            fenced: data.fenced === "1" ? true : false,
            tittled: data.tittled === "1" ? true : false,
            price: data.charges,
            rate: "Monthly",
            location: {
              county: data.county,
              ward: data.ward,
            },
          },
        } as any;
        console.log(save_data);
        const land = await pataShambaService.ussd.save(save_data);
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
