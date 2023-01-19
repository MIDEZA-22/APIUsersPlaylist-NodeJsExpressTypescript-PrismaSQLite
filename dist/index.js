"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Importando Prisma Client
const client_1 = require("@prisma/client");
dotenv_1.default.config();
// Iniciando el cliente
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = process.env.PORT;
const nodeEnv = process.env.TOKEN_SECRET;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.status(200).send("Proyecto de la Unidad 7 - ZAVALA LLANCO Mijail Denis");
});
app.post("/api/v1/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    const user = yield prisma.user.create({
        data: {
            email: email,
            name: name,
            password: bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync()),
        },
    });
    const expiresIn = "1800s";
    const token = jsonwebtoken_1.default.sign({ name: user.name }, nodeEnv, {
        expiresIn: expiresIn,
    });
    res.status(200).send({
        "user": user, "access_token": token, "expires_in": expiresIn
    });
}));
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
//   if(!existingUser) return res.json({ msg: "No se encontró ninguna cuenta con este correo electrónico" });
//   //Si se encuentra el usuario, es decir, si el usuario está en nuestra base de datos, compare la contraseña del formulario de inicio de sesión con la contraseña hash en nuestra base de datos para ver si las contraseñas coinciden (bcrypt lo hará por nosotros)
//   const doesPasswordMatch = bcrypt.compareSync(password, existingUser.hashedPassword); //Le dará un booleano, por lo que el valor de doesPasswordMatch será un booleano
//   //Si las contraseñas no coinciden
//   if(!doesPasswordMatch) return res.json({ msg: "Las contraseñas no coinciden" });
//   //Si las contraseñas coinciden, devuelve el usuario existente al frentend
//   res.json(existingUser);
// });
app.listen(port, () => {
    console.log(`El servidor se ejecuta en http://localhost:${port}`);
});
