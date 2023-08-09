import { Request, Response } from "express";
import pataShambaService from "../service/index.js";
import { IAdmin } from "../interface/index.js";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
function gen_token(data: IAdmin) {
  const token = jwt.sign({ id: data.email }, "kkrninieinien==", {
    expiresIn: "1d",
  });
  return token;
}
const pataShamba = {
  api: {
    auth: {
      signup_admin: async (req: Request, res: Response) => {
        try {
          const data = req.body as IAdmin;
          const hashPassword = await hash(data.password, 10);
          data.password = hashPassword;
          const create_account = await pataShambaService.api.create_admin(data);
          if (!create_account.success) {
            return res.status(400).json(create_account);
          }
          const token = gen_token(create_account.data!);
          return res.status(200).json({
            success: true,
            message: "signup succesfull",
            data: { user: create_account.data, token },
          });
        } catch (error) {
          const err = error as Error;
          return res.status(500).json({
            success: false,
            message: err.message,
            data: null,
          });
        }
      },
      admin_login: async (req: Request, res: Response) => {
        try {
          const data = req.body as IAdmin;
          const account = await pataShambaService.api.login_admin(data);
          if (!account.success) {
            return res.status(400).json(account);
          }
          const token = gen_token(account.data!);
          return res.status(200).json({
            success: true,
            message: "Login succesfull",
            data: { user: account.data, token },
          });
        } catch (error) {
          const err = error as Error;
          return res.status(500).json({
            success: false,
            message: err.message,
            data: null,
          });
        }
      },
    },
    dashbord: {
      fetch_lands: async (req: Request, res: Response) => {
        try {
          const lands = await pataShambaService.api.fetch_lands();
          if (!lands.success) {
            return res.status(400).json(lands);
          }
          return res.status(200).json(lands);
        } catch (error) {
          const err = error as Error;
          return res.status(500).json({
            success: false,
            message: err.message,
            data: null,
          });
        }
      },
      fetch_land: async (req: Request, res: Response) => {
        try {
          const land = await pataShambaService.api.fetch_land(req.params.id);
          if (!land.success) {
            return res.status(400).json(land);
          }
          return res.status(200).json(land);
        } catch (error) {
          const err = error as Error;
          return res.status(500).json({
            success: false,
            message: err.message,
            data: null,
          });
        }
      },
      search_land: async (req: Request, res: Response) => {
        try {
          const price = req.query.price as string;
          const location = req.query.location as string;
          const lands = await pataShambaService.api.search_land(
            price,
            location
          );
          if (!lands.success) {
            return res.status(400).json(lands);
          }
          return res.status(200).json(lands);
        } catch (error) {
          const err = error as Error;
          return res.status(500).json({
            success: false,
            message: err.message,
            data: null,
          });
        }
      },
      aprrove: async (req: Request, res: Response) => {
        try {
          const land = await pataShambaService.api.approve(req.params.id);
          if (!land.success) {
            return res.status(400).json(land);
          }
          return res.status(200).json(land);
        } catch (error) {
          const err = error as Error;
          return res.status(500).json({
            success: false,
            message: err.message,
            data: null,
          });
        }
      },
      reject: async (req: Request, res: Response) => {
        try {
          const land = await pataShambaService.api.reject(req.params.id);
          if (!land.success) {
            return res.status(400).json(land);
          }
          return res.status(200).json(land);
        } catch (error) {
          const err = error as Error;
          return res.status(500).json({
            success: false,
            message: err.message,
            data: null,
          });
        }
      },
    },
  },
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
