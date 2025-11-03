import { Response } from "express";
import { storage } from "../storage";
import { insertConciliacaoSchema, updateConciliacaoSchema } from "@shared/schema";
import { z } from "zod";

export const getConciliacoes = async (req: any, res: Response) => {
  try {
    const conciliacoes = await storage.getConciliacoes(req.user.id);
    res.json({ conciliacoes });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar conciliações" });
  }
};

export const getConciliacao = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const conciliacao = await storage.getConciliacao(id, req.user.id);
    
    if (!conciliacao) {
      return res.status(404).json({ message: "Conciliação não encontrada" });
    }
    
    res.json({ conciliacao });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar conciliação" });
  }
};

export const createConciliacao = async (req: any, res: Response) => {
  try {
    const data = insertConciliacaoSchema.parse(req.body);
    const conciliacao = await storage.createConciliacao(req.user.id, data);
    res.status(201).json({ conciliacao });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao criar conciliação" });
  }
};

export const updateConciliacao = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const updates = updateConciliacaoSchema.parse(req.body);
    
    const conciliacao = await storage.updateConciliacao(id, req.user.id, updates);
    if (!conciliacao) {
      return res.status(404).json({ message: "Conciliação não encontrada" });
    }
    
    res.json({ conciliacao });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao atualizar conciliação" });
  }
};

export const deleteConciliacao = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteConciliacao(id, req.user.id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Conciliação não encontrada" });
    }
    
    res.json({ message: "Conciliação deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar conciliação" });
  }
};
