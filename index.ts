import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// Importando Prisma Client
import { PrismaClient } from '@prisma/client'

dotenv.config();

// Iniciando el cliente
const prisma = new PrismaClient()

const app: Express = express();
const port = process.env.PORT;
const nodeEnv: string = process.env.TOKEN_SECRET as string;

app.use(express.json());

app.get('/', (req, res) => { 
    res.status(200).send("Proyecto de la Unidad 7 - ZAVALA LLANCO Mijail Denis"); 
});

app.post("/api/v1/users", async (req: Request, res: Response) => {
  const { email, name, password } = req.body;
  const user = await prisma.user.create({
    data: {
      email: email,
      name: name,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
    },
  });
  const expiresIn = "1800s";
  const token = jwt.sign({ name: user.name }, nodeEnv, {
    expiresIn: expiresIn,
  });
  res.status(200).send({
    "user": user, "access_token": token, "expires_in": expiresIn 
  }); 
});

// function authenticateToken(req: Request, res: Response, next: NextFunction) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
  
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, nodeEnv, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

// app.get("/api/login", authenticateToken, (req: Request, res: Response) => {
//   res.json({ msg: "Autenticado" });
// });

// app.post("/api/v1/users/login", async (req: Request, res: Response) => {
//   //email y password vienen del frontend
//   const { email, password } = req.body;
//   //Encuentra a un usuario de la base de datos por su email
//   const existingUser = await   prisma.user.findOne({ email: email });
//   //Si no se encuentra ningun usuario
//   if(!existingUser) return res.json({ msg: "No se encontrĂ³ ninguna cuenta con este correo electrĂ³nico" });
//   //Si se encuentra el usuario, es decir, si el usuario estĂ¡ en nuestra base de datos, compare la contraseĂ±a del formulario de inicio de sesiĂ³n con la contraseĂ±a hash en nuestra base de datos para ver si las contraseĂ±as coinciden (bcrypt lo harĂ¡ por nosotros)
//   const doesPasswordMatch = bcrypt.compareSync(password, existingUser.hashedPassword); //Le darĂ¡ un booleano, por lo que el valor de doesPasswordMatch serĂ¡ un booleano
//   //Si las contraseĂ±as no coinciden
//   if(!doesPasswordMatch) return res.json({ msg: "Las contraseĂ±as no coinciden" });
//   //Si las contraseĂ±as coinciden, devuelve el usuario existente al frentend
//   res.json(existingUser);
// });

app.listen(port, () => {
    console.log(`El servidor se ejecuta en http://localhost:${port}`);
  });