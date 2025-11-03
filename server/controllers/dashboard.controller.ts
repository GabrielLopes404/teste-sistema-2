import { Response } from "express";
import { storage } from "../storage";

export const getDashboardStats = async (req: any, res: Response) => {
  try {
    const stats = await storage.getDashboardStats(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estatísticas do dashboard" });
  }
};

export const getRelatorios = async (req: any, res: Response) => {
  try {
    const periodo = req.query.periodo || "mes";
    const now = new Date();
    let dataInicio: Date;
    let dataFim: Date = now;
    
    switch (periodo) {
      case "semana":
        dataInicio = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "mes":
        dataInicio = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "trimestre":
        dataInicio = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case "ano":
        dataInicio = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        dataInicio = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    const contas = await storage.getContas(req.user.id);
    const faturas = await storage.getFaturas(req.user.id);
    const fluxo = await storage.getFluxoCaixa(req.user.id, dataInicio, dataFim);
    
    const contasPeriodo = contas.filter(c => 
      new Date(c.dataVencimento) >= dataInicio && 
      new Date(c.dataVencimento) <= dataFim
    );
    
    const faturasPeriodo = faturas.filter(f => 
      new Date(f.dataEmissao) >= dataInicio && 
      new Date(f.dataEmissao) <= dataFim
    );
    
    const receber = contasPeriodo.filter(c => c.tipo === "receber");
    const pagar = contasPeriodo.filter(c => c.tipo === "pagar");
    
    const entradas = fluxo.filter(f => f.tipo === "entrada");
    const saidas = fluxo.filter(f => f.tipo === "saida");
    
    const relatorio = {
      periodo,
      dataInicio,
      dataFim,
      contas: {
        total: contasPeriodo.length,
        receber: receber.length,
        pagar: pagar.length,
        valorReceber: receber.reduce((sum, c) => sum + parseFloat(c.valor), 0),
        valorPagar: pagar.reduce((sum, c) => sum + parseFloat(c.valor), 0),
      },
      faturas: {
        total: faturasPeriodo.length,
        valorTotal: faturasPeriodo.reduce((sum, f) => sum + parseFloat(f.valorTotal), 0),
      },
      fluxoCaixa: {
        totalEntradas: entradas.reduce((sum, f) => sum + parseFloat(f.valor), 0),
        totalSaidas: saidas.reduce((sum, f) => sum + parseFloat(f.valor), 0),
        saldo: entradas.reduce((sum, f) => sum + parseFloat(f.valor), 0) - saidas.reduce((sum, f) => sum + parseFloat(f.valor), 0),
      },
    };
    
    res.json(relatorio);
  } catch (error) {
    res.status(500).json({ message: "Erro ao gerar relatório" });
  }
};
