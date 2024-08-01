import { Router } from "express";
import { cadastradoDeconta, listarEventos, login, teste } from "./controladores.ts/controlador";
import { intermediarioDeValidacaoDeComprovante } from "./intermediarios/intermediario-comprovante";
import { cancelarUmaCompra, fazerCompra, listarCompra } from "./controladores.ts/compra";




const rotas = Router();

rotas.get('/',teste)
// Listar os eventos cadastrados
rotas.get('/eventos',listarEventos)
// Criar uma conta
rotas.post('/usuarios', cadastradoDeconta)
// Fazer login
rotas.post('/login', login)

rotas.use(intermediarioDeValidacaoDeComprovante)
// Fazer uma compra
rotas.post('/compras',fazerCompra)
// Listar compras
rotas.get('/compras', listarCompra)
// Cancelar uma compra
rotas.delete('/compras/:id', cancelarUmaCompra)


export default rotas;
