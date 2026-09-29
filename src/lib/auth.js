import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URL);
const db = client.db("vyro_task");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),
  account: {
    storeStateStrategy: "cookie",
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  emailAndPassword: { 
    enabled: true, 
  }, 
  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENTID, 
            clientSecret: process.env.GOOGLECLIENT_SECRET, 
        }, 
    },
});