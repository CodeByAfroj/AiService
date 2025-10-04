// import dotenv  from "dotenv";
// import mongoose, { model,Schema } from "mongoose";

// dotenv.config()
// const url=process.env.MONGO_URL

// if (!url) {
//   throw new Error("❌ MONGO_URL is missing in .env file");
// }
// await mongoose.connect(url)
// .then(()=>{
//     console.log("database Connected")
// })
// const DataSchema = new Schema(
//   {
//     title: { type: String, unique: true, required: true, trim: true },
//     desc: { type: String, required: true },
//     link: { type: String, },
//      userId: { type: Schema.Types.ObjectId, ref: "User" }
//   },
//   { timestamps: true } // adds createdAt & updatedAt
// );
// export const DataModel = model('Data',DataSchema)

// this is used to make your schema and here we used userid means
// user has access of its own data