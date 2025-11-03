import { Response } from "express";
import { storage } from "../storage";
import { insertContatoSchema, updateContatoSchema } from "@shared/schema";
import { z } from "zod";

export const getContatos = async (req: any, res: Response) => {
  try {
    const filters = {
      tipo: req.query.tipo,
      ativo: req.query.ativo === "true" ? true : req.query.ativo === "false" ? false : undefined,
    };
    
    const contatos = await storage.getContatos(req.user.id, filters);
    res.json({ contatos });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar contatos" });
  }
};

export const getContato = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const contato = await storage.getContato(id, req.user.id);
    
    if (!contato) {
      return res.status(404).json({ message: "Contato não encontrado" });
    }
    
    res.json({ contato });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar contato" });
  }
};

export const createContato = async (req: any, res: Response) => {
  try {
    const data = insertContatoSchema.parse(req.body);
    const contato = await storage.createContato(req.user.id, data);
    res.status(201).json({ contato });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao criar contato" });
  }
};

export const updateContato = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const updates = updateContatoSchema.parse(req.body);
    
    const contato = await storage.updateContato(id, req.user.id, updates);
    if (!contato) {
      return res.status(404).json({ message: "Contato não encontrado" });
    }
    
    res.json({ contato });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao atualizar contato" });
  }
};

export const deleteContato = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteContato(id, req.user.id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Contato não encontrado" });
    }
    
    res.json({ message: "Contato deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar contato" });
  }
};

export const getContatosStats = async (req: any, res: Response) => {
  try {
    const contatos = await storage.getContatos(req.user.id);
    
    const stats = {
      total: contatos.length,
      clientes: contatos.filter(c => c.tipo === "cliente").length,
      fornecedores: contatos.filter(c => c.tipo === "fornecedor").length,
      ativos: contatos.filter(c => c.ativo).length,
      inativos: contatos.filter(c => !c.ativo).length,
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estatísticas" });
  }
};
