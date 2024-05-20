// set up environment variables
import {config} from "dotenv";

config();

if (!process.env.REACT_APP_WLD_CLIENT_ID) throw new Error("REACT_APP_WLD_CLIENT_ID is required");
if (!process.env.REACT_APP_WLD_CLIENT_SECRET) throw new Error("REACT_APP_WLD_CLIENT_SECRET is required");
if (!process.env.REACT_APP_REDIRECT_URL) throw new Error("REACT_APP_REDIRECT_URL is required");

export const REACT_APP_WLD_CLIENT_ID = process.env.REACT_APP_WLD_CLIENT_ID;
export const REACT_APP_WLD_CLIENT_SECRET = process.env.REACT_APP_WLD_CLIENT_SECRET;
export const REACT_APP_REDIRECT_URL = process.env.REACT_APP_REDIRECT_URL;
export const PORT = 8080;
