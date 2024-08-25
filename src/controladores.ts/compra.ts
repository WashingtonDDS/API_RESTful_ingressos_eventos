import { Request, Response } from "express";
import bancoDeDados from "../bancoDeDados";
import { v4 as uuidv4 } from "uuid";
import TCompra from "../tipos/Compra";

const { eventos, compras } = bancoDeDados;

// Fazer uma compra
export const fazerCompra = (req: Request, res: Response) => {
  const { idEvento } = req.body;
  const { comprovante } = req.query;

  if (!idEvento) {
    return res
      .status(400)
      .json({ mensagem: "O identificador do evento é obrigatório" });
  }

  const id = comprovante as string;

  const idIndex = id.split("/");

  const idValido = idIndex[idIndex.length - 1];

  const idIdentificador = bancoDeDados.usuarios.find((idUsuario) => {
    return idUsuario.id === idValido;
  });

  if (!idIdentificador) {
    return res
      .status(400)
      .json({ mensagem: "O identificador do evento é obrigatório" });
  }

  const eventoEncontrado = bancoDeDados.eventos.find((evento) => {
    return evento.id === idEvento;
  });

  if (!eventoEncontrado) {
    return res.status(404).json({ mensagem: "Evento não encontrado" });
  }

  const novaCompraDoEvento: TCompra = {
    id: uuidv4(),
    id_usuario: idValido,
    id_evento: idEvento,
  };

  bancoDeDados.compras.push(novaCompraDoEvento);

  return res.status(201).json(novaCompraDoEvento);
};
// Listar compras
export const listarCompra = (req: Request, res: Response) => {
  const { comprovante } = req.query;
  const { eventos, compras } = bancoDeDados;

  const id = comprovante as string;

  const idIndex = id.split("/");

  const idlista = idIndex[idIndex.length - 1];

  const listaAtualizada = compras.filter((item) => {
    return item.id_usuario === idlista;
  });

  const lista = listaAtualizada.map((item) => {
    const listarCompras = eventos.find((a) => {
      return a.id === item.id_evento;
    });

    return {
      idCompra: item.id,
      idEvento: item.id_evento,
      nome: listarCompras?.nome,
      endereco: listarCompras?.endereco,
      data: listarCompras?.data,
      preco: listarCompras?.preco,
    };
  });

  if (!lista) {
    return res.status(403).json({
      mensagem: "O usuário não tem permissão de acessar o recurso solicitado",
    });
  }

  return res.status(200).json(lista);
};
// Cancelar uma compra
export const cancelarUmaCompra = (req: Request, res: Response) => {
  const { comprovante } = req.query;
  const { id } = req.params;
  const idUsuario = comprovante as string;
  const idIndex = idUsuario.split("/");
  const idUp = idIndex[idIndex.length - 1];

  const comprasDoUsuario = compras.filter((item) => item.id_usuario === idUp);

  const compraNaoEncontrada = comprasDoUsuario.find((item) => item.id === id);

  if (!compraNaoEncontrada) {
    return res.status(404).json({ mensagem: "Compra não encontrada" });
  }

  const retirarCompraCancelada = compras.filter((item) => item.id !== id);

  bancoDeDados.compras = retirarCompraCancelada;

  return res.status(204).json();
};
// - ### Resposta

//   - Em caso de **sucesso**: sem corpo
//   - Em caso de **erro**:
//     - caso não exista uma compra do usuário logado com o id passado: status code apropriado e a mensagem "Evento não encontrado"
