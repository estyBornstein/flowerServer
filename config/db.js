import { connect } from "mongoose";
export const connectToDb = async (req, res) => {
    try {
        let dbConnect = await connect(process.env.DB_URL)
        console.log("mongo db connected")
    }
    catch (err) {
        console.log("cannot connect", err)
        process.exit(1)
    }
}