const express = require("express");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require("path");

const app = express();




// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "src/views")));

app.use(
	methodOverride(function (req, res) {
		if (req.body && typeof req.body === "object" && "_method" in req.body) {
			const method = req.body._method;
			delete req.body._method;
			return method;
		}
		return null;
	})
);

// Configuración de pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "src/views"));

// Logging middleware
app.use((req, res, next) => {
	console.log(`Método: ${req.method} | Ruta: ${req.url}`);
	next();
});

// Middlewares de autenticación y errores

/*const { authMiddleware } = require("./src/middleware/authMiddleware");*/
const { authMiddleware } =
	process.env.NODE_ENV === "test"
		? require("./src/middleware/__mocks__/authMiddleware")
		: require("./src/middleware/authMiddleware");
    
const errorHandler = require("./src/middleware/errorHandler");

// Rutas
const userController = require("./src/controllers/userController");
const consultaTurnosRouter = require("./src/routes/consultaTurnosRouter");
const userRouter = require("./src/routes/userRouter");
const authRouter = require("./src/routes/authRouter");

app.get("/", (req, res) => {
	const token = req.cookies?.token;
	if (token) {
		res.redirect("/dashboard");
	} else {
		res.redirect("/auth/login");
	}
});

app.get("/dashboard", authMiddleware, userController.getDashboard);
app.use("/turnos", consultaTurnosRouter);
app.use("/usuarios", userRouter);
app.use("/auth", authRouter);
app.use(express.static(path.join(__dirname, "public")));
app.use(errorHandler);

// Solo conectar a la DB e iniciar servidor si se ejecuta directamente
if (require.main === module) {
	const connectDB = require("./src/config/db");
	const port = process.env.PORT || 3000;

	connectDB()
		.then(() => {
			app.listen(port, () => {
				console.log(`Server corriendo en http://localhost:${port}`);
			});
		})
		.catch((error) => {
			console.error("Error al conectar a MongoDB:", error.message);
			process.exit(1); // Salida solo en entorno real, no en tests
		});
}

// Exportar app para los tests
module.exports = app;

/* ORIGINAL: */

// const express = require("express");
// const methodOverride = require("method-override");
// const cookieParser = require("cookie-parser");
// require("dotenv").config();
// const path = require("path");
// const connectDB = require("./src/config/db");

// connectDB();

// const app = express();

// // Middlewares
// app.use(express.json()); //para parsear el json del body
// app.use(express.urlencoded({ extended: true })); //para leer los datos del formulario
// app.use(cookieParser()); //para parsear cookies

// // Servir archivos estáticos
// app.use(express.static(path.join(__dirname, "src/views")));

// // Método override para PUT/DELETE desde formularios
// app.use(
//   methodOverride(function (req, res) {
//     if (req.body && typeof req.body === "object" && "_method" in req.body) {
//       const method = req.body._method;
//       delete req.body._method;
//       return method;
//     }
//     return null;
//   })
// );

// // Configuración de pug
// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "src/views"));

// // Determinación del puerto
// const port = process.env.PORT || 3000;

// // Middleware de logging
// app.use((req, res, next) => {
//   console.log(`Método: ${req.method} | Ruta: ${req.url}`);
//   next();
// });

// // Importar middlewares de autenticación
// const { authMiddleware } = require("./src/middleware/authMiddleware");

// // Ruta base - redirigir al login si no está autenticado, al dashboard si está autenticado
// app.get("/", (req, res) => {
//   const token = req.cookies?.token;
//   if (token) {
//     res.redirect("/dashboard");
//   } else {
//     res.redirect("/auth/login");
//   }
// });

// // Ruta del dashboard (protegida)
// const userController = require("./src/controllers/userController");
// app.get("/dashboard", authMiddleware, userController.getDashboard);

// // Importar routers
// const consultaTurnosRouter = require("./src/routes/consultaTurnosRouter");
// const userRouter = require("./src/routes/userRouter");
// const authRouter = require("./src/routes/authRouter");

// // Usar routers
// app.use("/turnos", consultaTurnosRouter);
// app.use("/usuarios", userRouter);
// app.use("/auth", authRouter);

// const errorHandler = require("./src/middleware/errorHandler");

// app.use(errorHandler);

// // Archivos estáticos
// app.use(express.static(path.join(__dirname, "public")));

// // Iniciar servidor local solamente
// app.listen(port, () => {
//   console.log(`Server corriendo en http://localhost:${port}`);
// });

// //Iniciar servidor en Vercel o en local
// // if (process.env.NODE_ENV !== 'production') {
// //     app.listen(port, () => {
// //         console.log(`Server corriendo en http://localhost:${port}`);
// //     });
// // }

// // Solo levantar el servidor si este archivo se ejecuta directamente,
// // para evitar que se inicie al importar 'app' en los tests
// if (require.main === module) {
// 	app.listen(port, () => {
// 		console.log(`Server corriendo en http://localhost:${port}`);
// 	});
// }

// // Exportar app para usarlo en tests con Jest y otras herramientas
// module.exports = app;

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Iniciar servidor
app.listen(port, () => {
  console.log(`Server corriendo en http://localhost:${port}`);
});
