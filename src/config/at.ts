import { Client } from "africastalking-ts";
import { config } from "dotenv";
config();

export default {
  client: new Client({
    apiKey: process.env.API_KEY as string,
    username: process.env.USERNAME as string,
  }),
};
