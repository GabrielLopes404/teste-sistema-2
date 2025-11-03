import { Response } from "express";
import { storage } from "../storage";
import { insertFluxoCaixaSchema } from "@shared/schema";
import { z } from "zod";

export const getFluxoCaixa = async (req: any, res: Response) => {
  try {
    const dataInicio = req.query.dataInicio ? new Date(req.query.dataInicio as string) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const dataFim = req.query.dataFim ? new Date(req.query.dataFim as string) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    
    const fluxo = await storage.getFluxoCaixa(req.user.id, dataInicio, dataFim);
    res.json({ fluxo });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar fluxo de caixa" });
  }
};

export const createFluxoCaixa = async (req: any, res: Response) => {
  try {
    const data = insertFluxoCaixaSchema.parse(req.body);
    const fluxo = await storage.createFluxoCaixa(req.user.id, data);
    res.status(201).json({ fluxo });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao criar entrada no fluxo de caixa" });
  }
};

export const getFluxoCaixaStats = async (req: any, res: Response) => {
  try {
    const now = new Date();
    const mesAtual = new Date(now.getFullYear(), now.getMonth(), 1);
    const proximoMes = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const fluxo = await storage.getFluxoCaixa(req.user.id, mesAtual, proximoMes);
    
    const entradas = fluxo.filter(f => f.tipo === "entrada");
    const saidas = fluxo.filter(f => f.tipo === "saida");
    
    const totalEntradas = entradas.reduce((sum, f) => sum + parseFloat(f.valor), 0);
    const totalSaidas = saidas.reduce((sum, f) => sum + parseFloat(f.valor), 0);
    
    const saldoAtual = fluxo.length > 0 ? parseFloat(fluxo[fluxo.length - 1].saldo) : 0;
    
    const stats = {
      saldoAtual,
      totalEntradas,
      totalSaidas,
      saldo: totalEntradas - totalSaidas,
      transacoes: fluxo.length,
      mediaEntradas: entradas.length > 0 ? totalEntradas / entradas.length : 0,
      mediaSaidas: saidas.length > 0 ? totalSaidas / saidas.length : 0,
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estatísticas" });
  }
};
