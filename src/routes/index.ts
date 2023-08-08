import { Router } from "express";
import pataShamba from "../controller";

const route = Router();

route.post("/ussd", pataShamba.ussd.save_data);

const api = route;
export default api;
