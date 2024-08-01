import { NextFunction,Request, Response } from "express";
import bancoDeDados from "../bancoDeDados";
import criptografarSenha from "../auxiliares/criptografia";
import fraseSecreta from "../fraseSecreta";



export const intermediarioDeValidacaoDeComprovante = (req:Request, res:Response, next:NextFunction)=>{
    
    const { comprovante } = req.query
    
 
    

    if ( !comprovante ) {
        return res.status(401).json({ mensagem: "Falha na autenticação"})
    }
    const idInvalido = bancoDeDados.usuarios.find((a)=>{
       
        return `${fraseSecreta}/${a.id}` === comprovante 
    })

    if ( !idInvalido ) {
        return res.status(401).json({ mensagem: "Falha na autenticação"})
    }
    


 
    
    next()

}

//   `${fraseSecreta}/${a.id}`