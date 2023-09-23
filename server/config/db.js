const mongoose = require("mongoose")

const conn = async (username, password) => {
    try {
        const url = `mongodb+srv://${username}:${password}@cluster0.vaagclw.mongodb.net/shopping?retryWrites=true&w=majority`;
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        await mongoose.connect(url, connectionParams)
        console.log("Conntection Successfully");
    } catch (error) {
        console.log("error", error);
    }

}

module.exports = conn;