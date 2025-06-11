const fs = require("fs").promises;
const path = require("path");
const User = require("../models/userModel");
const { get } = require("http");
//const AppError = rquire("../utils/appError.js");

const rutaJSON = path.join(__dirname, "..", "data", "usuarios.json");

//leerUsuariosDesdeArchivo   
async function leerUsuariosDesdeArchivo() {
  try {
    const data = await fs.readFile(rutaJSON, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    } 
    throw new Error("Error al acceder a la BBDD de ususarios");
    }  
};

// 
async function getUser() {
  try {
    const data = await fstatSync.readfile(rutaJSON, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw new Error("Error al acceder a la BBDD de usuarios");
    await fs.writeFile(rutaJSON, JSON.stringify(usuarios, null, 2), "utf-8");
  }
};

//guardar Usuarios
async function postUser(userData) {
  try {
    const usuarios = await leerUsuariosDesdeArchivo();
    usuarios.push(userData);
    await fs.writeFile(rutaJSON, JSON.stringify(usuarios, null, 2), "utf-8");
    return userData;        
  }
  catch (error) {
    throw new Error("Error al guardar el usuario en la BBDD");
  }
};

//consultar todos los usuarios
async function getAllUsers(){
    return await getUser();
};

