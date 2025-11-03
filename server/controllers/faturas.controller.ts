import { Response } from "express";
import { storage } from "../storage";
import { insertFaturaSchema, updateFaturaSchema } from "@shared/schema";
import { z } from "zod";

export const getFaturas = async (req: any, res: Response) => {
  try {
    const filters = {
      status: req.query.status,
      contatoId: req.query.contatoId,
    };
    
    const faturas = await storage.getFaturas(req.user.id, filters);
    res.json({ faturas });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar faturas" });
  }
};

export const getFatura = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const fatura = await storage.getFatura(id, req.user.id);
    
    if (!fatura) {
      return res.status(404).json({ message: "Fatura não encontrada" });
    }
    
    res.json({ fatura });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar fatura" });
  }
};

export const createFatura = async (req: any, res: Response) => {
  try {
    const data = insertFaturaSchema.parse(req.body);
    const fatura = await storage.createFatura(req.user.id, data);
    res.status(201).json({ fatura });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao criar fatura" });
  }
};

export const updateFatura = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const updates = updateFaturaSchema.parse(req.body);
    
    const fatura = await storage.updateFatura(id, req.user.id, updates);
    if (!fatura) {
      return res.status(404).json({ message: "Fatura não encontrada" });
    }
    
    res.json({ fatura });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao atualizar fatura" });
  }
};

export const deleteFatura = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteFatura(id, req.user.id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Fatura não encontrada" });
    }
    
    res.json({ message: "Fatura deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar fatura" });
  }
};

export const getFaturasStats = async (req: any, res: Response) => {
  try {
    const faturas = await storage.getFaturas(req.user.id);
    
    const stats = {
      total: faturas.length,
      emitidas: faturas.filter(f => f.status === "emitida").length,
      pagas: faturas.filter(f => f.status === "paga").length,
      vencidas: faturas.filter(f => f.status === "vencida").length,
      valorTotal: faturas.reduce((sum, f) => sum + parseFloat(f.valorTotal), 0),
      valorPago: faturas.filter(f => f.status === "paga").reduce((sum, f) => sum + parseFloat(f.valorTotal), 0),
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estatísticas" });
  }
};
