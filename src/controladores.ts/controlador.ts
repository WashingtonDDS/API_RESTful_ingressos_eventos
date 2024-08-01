import { Request, Response } from "express";
import bancoDeDados from "../bancoDeDados";
import criptografarSenha from "../auxiliares/criptografia";
import TUsuario from "../tipos/Usuario";
import { v4 as uuidv4 } from 'uuid'
import fraseSecreta from "../fraseSecreta";


const id = uuidv4()



export const teste = (req:Request, res:Response) => {
    return res.status(200).json({ mensagem:"API de vendas de ingressos"})
}

// Listar os eventos cadastrados e filtrar
export const listarEventos = (req:Request, res:Response)=>{
    const { maxPreco } = req.query

    
    if (maxPreco) {
        const precoMaximo = Number(maxPreco);
    if (isNaN(precoMaximo) || precoMaximo <= 0) {
      return res.status(400).json({ mensagem: "O preço máximo do evento deve conter apenas números e deve ser positivo"} )
    }
    const eventosFiltrados = bancoDeDados.eventos.filter(item => item.preco <= precoMaximo)
    return res.status(200).json(eventosFiltrados)
     }
     res.status(200).json(bancoDeDados.eventos)
}

export const cadastradoDeconta = (req:Request, res:Response)=>{
    const { nome,email,senha } = req.body

    
    if (!nome || !email || !senha ) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios"})
    }
    const usuariosCadastrado = bancoDeDados.usuarios.find((usuario)=>{
        return usuario.email === email
    })
    if (usuariosCadastrado) {
        return res.status(400).json({mensagem: "E-mail já cadastrado"})
    }

    const novaConta:TUsuario  ={
        id,
        nome,
        email,
        senha:criptografarSenha(senha)
    }
   
    type TUsuarioSemSenha = Omit<TUsuario, 'senha'>
    
    const novaContaSemSenha : TUsuarioSemSenha  = {
        id,
        nome,
        email
    }
    
    bancoDeDados.usuarios.push(novaConta)


    
    
    return res.status(201).json(novaContaSemSenha)
}


export const login = (req:Request, res:Response) => {
    const {  email, senha } = req.body
    

    if ( !email || !senha  ) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios"})
    }
    const senhaCriptografada = req.body = 'zz'+senha.split("").reverse().join("")+'yy'

    const usuarios =bancoDeDados.usuarios.find((usuario)=>{
        return usuario.email === email && usuario.senha === senhaCriptografada})

       if (!usuarios) {

            return res.status(400).json({mensagem:"E-mail ou senha inválidos"})
        }

     
        
        const comprovante = `${fraseSecreta}/${usuarios.id}`
           
        return res.status(200).json({comprovante: comprovante }) 
}



