import dotenv from "dotenv";
dotenv.config();


console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_SERVICE_KEY:", process.env.SUPABASE_SERVICE_KEY);
console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);
console.log("NEXT_PUBLIC_DOMAIN:", process.env.NEXT_PUBLIC_DOMAIN);
