import dotenv  from "dotenv";
import mongoose, { model,Schema } from "mongoose";

dotenv.config()
const url=process.env.MONGO_URL

if (!url) {
  throw new Error("❌ MONGO_URL is missing in .env file");
}
await mongoose.connect(url)
.then(()=>{
    console.log("database Connected")
})
const UserSchema = new Schema({
     username:{type:String,unique:true},
     password:{type:String}
})

export const UserModel = model('User',UserSchema)

