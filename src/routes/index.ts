import { Router } from "express";
import pataShamba from "../controller/index.js";

const route = Router();

route.post("/ussd", pataShamba.ussd.save_data);
route.post("/admin/signup", pataShamba.api.auth.signup_admin);
route.post("/admin/login", pataShamba.api.auth.admin_login);
route.get("/lands", pataShamba.api.dashbord.fetch_lands);
route
  .route("/lands/:id")
  .get(pataShamba.api.dashbord.fetch_land)
  .patch(pataShamba.api.dashbord.aprrove)
  .delete(pataShamba.api.dashbord.reject);
route.get("/search", pataShamba.api.dashbord.search_land);

const api = route;
export default api;
