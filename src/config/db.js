const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB conectado");
	} catch (error) {
		console.error("Error al conectar a MongoDB:", error.message);

		// En modo test, no cortar el proceso: lanzar el error
		if (process.env.NODE_ENV === "test") {
			throw error;
		} else {
			process.exit(1);
		}
	}
};

module.exports = connectDB;

module.exports = connectDB;

