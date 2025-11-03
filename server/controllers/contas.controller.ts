import { Response } from "express";
import { storage } from "../storage";
import { insertContaSchema, updateContaSchema } from "@shared/schema";
import { z } from "zod";

export const getContas = async (req: any, res: Response) => {
  try {
    const filters = {
      tipo: req.query.tipo,
      status: req.query.status,
      categoria: req.query.categoria,
    };
    
    const contas = await storage.getContas(req.user.id, filters);
    res.json({ contas });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar contas" });
  }
};

export const getConta = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const conta = await storage.getConta(id, req.user.id);
    
    if (!conta) {
      return res.status(404).json({ message: "Conta não encontrada" });
    }
    
    res.json({ conta });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar conta" });
  }
};

export const createConta = async (req: any, res: Response) => {
  try {
    const data = insertContaSchema.parse(req.body);
    const conta = await storage.createConta(req.user.id, data);
    res.status(201).json({ conta });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao criar conta" });
  }
};

export const updateConta = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const updates = updateContaSchema.parse(req.body);
    
    const conta = await storage.updateConta(id, req.user.id, updates);
    if (!conta) {
      return res.status(404).json({ message: "Conta não encontrada" });
    }
    
    res.json({ conta });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao atualizar conta" });
  }
};

export const deleteConta = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteConta(id, req.user.id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Conta não encontrada" });
    }
    
    res.json({ message: "Conta deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar conta" });
  }
};

export const getContasStats = async (req: any, res: Response) => {
  try {
    const contas = await storage.getContas(req.user.id);
    
    const now = new Date();
    const mesAtual = new Date(now.getFullYear(), now.getMonth(), 1);
    const proximoMes = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const receber = contas.filter(c => c.tipo === "receber");
    const pagar = contas.filter(c => c.tipo === "pagar");
    
    const stats = {
      totalReceber: receber.reduce((sum, c) => sum + parseFloat(c.valor), 0),
      totalPagar: pagar.reduce((sum, c) => sum + parseFloat(c.valor), 0),
      receberMes: receber.filter(c => 
        new Date(c.dataVencimento) >= mesAtual && 
        new Date(c.dataVencimento) < proximoMes
      ).reduce((sum, c) => sum + parseFloat(c.valor), 0),
      pagarMes: pagar.filter(c => 
        new Date(c.dataVencimento) >= mesAtual && 
        new Date(c.dataVencimento) < proximoMes
      ).reduce((sum, c) => sum + parseFloat(c.valor), 0),
      vencidas: contas.filter(c => 
        c.status === "pendente" && 
        new Date(c.dataVencimento) < now
      ).length,
      pagas: contas.filter(c => c.status === "pago").length,
      pendentes: contas.filter(c => c.status === "pendente").length,
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estatísticas" });
  }
};
