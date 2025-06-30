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

/* ORIGINAL */

// const mongoose = require("mongoose");
// require("dotenv").config();

// const connectDB = async () => {
//   try {
//     // Elige la URI de conexión basada en el ambiente
//     const dbURI = process.env.NODE_ENV === 'production'
//       ? process.env.DB_URI_ATLAS
//       : process.env.DB_URI_LOCAL;

//     if (!dbURI) {
//       throw new Error("La URI de la base de datos no está definida en el archivo .env");
//     }

//     await mongoose.connect(dbURI);

//     console.log("MongoDB conectado exitosamente.");

//   } catch (error) {
//     console.error("Error al conectar a MongoDB:", error.message);
//     // Salimos del proceso con un código de error si no nos podemos conectar.
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
