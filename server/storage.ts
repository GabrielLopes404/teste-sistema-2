import { 
  type User, type InsertUser, type UpdateUser,
  type Conta, type InsertConta, type UpdateConta,
  type Fatura, type InsertFatura, type UpdateFatura,
  type Contato, type InsertContato, type UpdateContato,
  type FluxoCaixa, type InsertFluxoCaixa,
  type Conciliacao, type InsertConciliacao, type UpdateConciliacao,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, updates: UpdateUser): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  updateLastLogin(id: string): Promise<void>;
  
  getContas(userId: string, filters?: any): Promise<Conta[]>;
  getConta(id: string, userId: string): Promise<Conta | undefined>;
  createConta(userId: string, conta: InsertConta): Promise<Conta>;
  updateConta(id: string, userId: string, updates: UpdateConta): Promise<Conta | undefined>;
  deleteConta(id: string, userId: string): Promise<boolean>;
  
  getFaturas(userId: string, filters?: any): Promise<Fatura[]>;
  getFatura(id: string, userId: string): Promise<Fatura | undefined>;
  createFatura(userId: string, fatura: InsertFatura): Promise<Fatura>;
  updateFatura(id: string, userId: string, updates: UpdateFatura): Promise<Fatura | undefined>;
  deleteFatura(id: string, userId: string): Promise<boolean>;
  
  getContatos(userId: string, filters?: any): Promise<Contato[]>;
  getContato(id: string, userId: string): Promise<Contato | undefined>;
  createContato(userId: string, contato: InsertContato): Promise<Contato>;
  updateContato(id: string, userId: string, updates: UpdateContato): Promise<Contato | undefined>;
  deleteContato(id: string, userId: string): Promise<boolean>;
  
  getFluxoCaixa(userId: string, dataInicio: Date, dataFim: Date): Promise<FluxoCaixa[]>;
  createFluxoCaixa(userId: string, fluxo: InsertFluxoCaixa): Promise<FluxoCaixa>;
  
  getConciliacoes(userId: string): Promise<Conciliacao[]>;
  getConciliacao(id: string, userId: string): Promise<Conciliacao | undefined>;
  createConciliacao(userId: string, conciliacao: InsertConciliacao): Promise<Conciliacao>;
  updateConciliacao(id: string, userId: string, updates: UpdateConciliacao): Promise<Conciliacao | undefined>;
  deleteConciliacao(id: string, userId: string): Promise<boolean>;
  
  getDashboardStats(userId: string): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contas: Map<string, Conta>;
  private faturas: Map<string, Fatura>;
  private contatos: Map<string, Contato>;
  private fluxoCaixa: Map<string, FluxoCaixa>;
  private conciliacoes: Map<string, Conciliacao>;

  constructor() {
    this.users = new Map();
    this.contas = new Map();
    this.faturas = new Map();
    this.contatos = new Map();
    this.fluxoCaixa = new Map();
    this.conciliacoes = new Map();
    
    const adminId = randomUUID();
    const adminUser: User = {
      id: adminId,
      username: "admin",
      password: "$2b$10$u/psTKcbB3xIx6yj.YWlKeZ.QA8NYlA0kTQtTlEi3RJOHi0faNwOS",
      email: "admin@lucrei.com",
      fullName: "Administrador",
      phone: null,
      company: null,
      cnpj: null,
      position: null,
      department: null,
      address: null,
      addressNumber: null,
      complement: null,
      neighborhood: null,
      zipCode: null,
      city: null,
      state: null,
      bio: null,
      avatar: null,
      role: "admin",
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
      preferences: null,
    };
    this.users.set(adminId, adminUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email || null,
      fullName: insertUser.fullName || null,
      phone: null,
      company: null,
      cnpj: null,
      position: null,
      department: null,
      address: null,
      addressNumber: null,
      complement: null,
      neighborhood: null,
      zipCode: null,
      city: null,
      state: null,
      bio: null,
      avatar: null,
      role: insertUser.role || "user",
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
      preferences: null,
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: string, updates: UpdateUser): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.lastLogin = new Date();
      this.users.set(id, user);
    }
  }

  async getContas(userId: string, filters?: any): Promise<Conta[]> {
    let contas = Array.from(this.contas.values()).filter(c => c.userId === userId);
    
    if (filters?.tipo) {
      contas = contas.filter(c => c.tipo === filters.tipo);
    }
    if (filters?.status) {
      contas = contas.filter(c => c.status === filters.status);
    }
    if (filters?.categoria) {
      contas = contas.filter(c => c.categoria === filters.categoria);
    }
    
    return contas.sort((a, b) => new Date(b.dataVencimento).getTime() - new Date(a.dataVencimento).getTime());
  }

  async getConta(id: string, userId: string): Promise<Conta | undefined> {
    const conta = this.contas.get(id);
    if (!conta || conta.userId !== userId) return undefined;
    return conta;
  }

  async createConta(userId: string, insertConta: InsertConta): Promise<Conta> {
    const id = randomUUID();
    const now = new Date();
    const conta: Conta = {
      id,
      userId,
      tipo: insertConta.tipo,
      descricao: insertConta.descricao,
      valor: insertConta.valor,
      dataVencimento: insertConta.dataVencimento,
      dataPagamento: insertConta.dataPagamento || null,
      status: insertConta.status || "pendente",
      categoria: insertConta.categoria || null,
      contatoId: insertConta.contatoId || null,
      observacoes: insertConta.observacoes || null,
      anexo: insertConta.anexo || null,
      recorrente: insertConta.recorrente || null,
      periodicidade: insertConta.periodicidade || null,
      createdAt: now,
      updatedAt: now,
    };
    this.contas.set(id, conta);
    return conta;
  }

  async updateConta(id: string, userId: string, updates: UpdateConta): Promise<Conta | undefined> {
    const conta = this.contas.get(id);
    if (!conta || conta.userId !== userId) return undefined;
    
    const updatedConta = { ...conta, ...updates, updatedAt: new Date() };
    this.contas.set(id, updatedConta);
    return updatedConta;
  }

  async deleteConta(id: string, userId: string): Promise<boolean> {
    const conta = this.contas.get(id);
    if (!conta || conta.userId !== userId) return false;
    return this.contas.delete(id);
  }

  async getFaturas(userId: string, filters?: any): Promise<Fatura[]> {
    let faturas = Array.from(this.faturas.values()).filter(f => f.userId === userId);
    
    if (filters?.status) {
      faturas = faturas.filter(f => f.status === filters.status);
    }
    if (filters?.contatoId) {
      faturas = faturas.filter(f => f.contatoId === filters.contatoId);
    }
    
    return faturas.sort((a, b) => new Date(b.dataEmissao).getTime() - new Date(a.dataEmissao).getTime());
  }

  async getFatura(id: string, userId: string): Promise<Fatura | undefined> {
    const fatura = this.faturas.get(id);
    if (!fatura || fatura.userId !== userId) return undefined;
    return fatura;
  }

  async createFatura(userId: string, insertFatura: InsertFatura): Promise<Fatura> {
    const id = randomUUID();
    const now = new Date();
    const fatura: Fatura = {
      id,
      userId,
      numero: insertFatura.numero,
      valor: insertFatura.valor,
      dataVencimento: insertFatura.dataVencimento,
      contatoId: insertFatura.contatoId,
      dataEmissao: insertFatura.dataEmissao,
      valorTotal: insertFatura.valorTotal,
      status: insertFatura.status || "emitida",
      observacoes: insertFatura.observacoes || null,
      desconto: insertFatura.desconto || null,
      itens: insertFatura.itens || null,
      createdAt: now,
      updatedAt: now,
    };
    this.faturas.set(id, fatura);
    return fatura;
  }

  async updateFatura(id: string, userId: string, updates: UpdateFatura): Promise<Fatura | undefined> {
    const fatura = this.faturas.get(id);
    if (!fatura || fatura.userId !== userId) return undefined;
    
    const updatedFatura = { ...fatura, ...updates, updatedAt: new Date() };
    this.faturas.set(id, updatedFatura);
    return updatedFatura;
  }

  async deleteFatura(id: string, userId: string): Promise<boolean> {
    const fatura = this.faturas.get(id);
    if (!fatura || fatura.userId !== userId) return false;
    return this.faturas.delete(id);
  }

  async getContatos(userId: string, filters?: any): Promise<Contato[]> {
    let contatos = Array.from(this.contatos.values()).filter(c => c.userId === userId);
    
    if (filters?.tipo) {
      contatos = contatos.filter(c => c.tipo === filters.tipo);
    }
    if (filters?.ativo !== undefined) {
      contatos = contatos.filter(c => c.ativo === filters.ativo);
    }
    
    return contatos.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  async getContato(id: string, userId: string): Promise<Contato | undefined> {
    const contato = this.contatos.get(id);
    if (!contato || contato.userId !== userId) return undefined;
    return contato;
  }

  async createContato(userId: string, insertContato: InsertContato): Promise<Contato> {
    const id = randomUUID();
    const now = new Date();
    const contato: Contato = {
      id,
      userId,
      tipo: insertContato.tipo,
      nome: insertContato.nome,
      email: insertContato.email || null,
      telefone: insertContato.telefone || null,
      cpfCnpj: insertContato.cpfCnpj || null,
      empresa: insertContato.empresa || null,
      endereco: insertContato.endereco || null,
      cidade: insertContato.cidade || null,
      estado: insertContato.estado || null,
      cep: insertContato.cep || null,
      observacoes: insertContato.observacoes || null,
      ativo: insertContato.ativo !== undefined ? insertContato.ativo : true,
      createdAt: now,
      updatedAt: now,
    };
    this.contatos.set(id, contato);
    return contato;
  }

  async updateContato(id: string, userId: string, updates: UpdateContato): Promise<Contato | undefined> {
    const contato = this.contatos.get(id);
    if (!contato || contato.userId !== userId) return undefined;
    
    const updatedContato = { ...contato, ...updates, updatedAt: new Date() };
    this.contatos.set(id, updatedContato);
    return updatedContato;
  }

  async deleteContato(id: string, userId: string): Promise<boolean> {
    const contato = this.contatos.get(id);
    if (!contato || contato.userId !== userId) return false;
    return this.contatos.delete(id);
  }

  async getFluxoCaixa(userId: string, dataInicio: Date, dataFim: Date): Promise<FluxoCaixa[]> {
    return Array.from(this.fluxoCaixa.values())
      .filter(f => 
        f.userId === userId &&
        new Date(f.data) >= dataInicio &&
        new Date(f.data) <= dataFim
      )
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }

  async createFluxoCaixa(userId: string, insertFluxo: InsertFluxoCaixa): Promise<FluxoCaixa> {
    const id = randomUUID();
    const fluxo: FluxoCaixa = {
      id,
      userId,
      ...insertFluxo,
      referencia: insertFluxo.referencia || null,
      referenciaId: insertFluxo.referenciaId || null,
      createdAt: new Date(),
    };
    this.fluxoCaixa.set(id, fluxo);
    return fluxo;
  }

  async getConciliacoes(userId: string): Promise<Conciliacao[]> {
    return Array.from(this.conciliacoes.values())
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime());
  }

  async getConciliacao(id: string, userId: string): Promise<Conciliacao | undefined> {
    const conciliacao = this.conciliacoes.get(id);
    if (!conciliacao || conciliacao.userId !== userId) return undefined;
    return conciliacao;
  }

  async createConciliacao(userId: string, insertConciliacao: InsertConciliacao): Promise<Conciliacao> {
    const id = randomUUID();
    const now = new Date();
    const conciliacao: Conciliacao = {
      id,
      userId,
      dataInicio: insertConciliacao.dataInicio,
      dataFim: insertConciliacao.dataFim,
      banco: insertConciliacao.banco,
      conta: insertConciliacao.conta,
      saldoInicial: insertConciliacao.saldoInicial,
      saldoFinal: insertConciliacao.saldoFinal,
      totalEntradas: insertConciliacao.totalEntradas,
      totalSaidas: insertConciliacao.totalSaidas,
      status: insertConciliacao.status || "em_progresso",
      observacoes: insertConciliacao.observacoes || null,
      transacoes: insertConciliacao.transacoes || null,
      createdAt: now,
      updatedAt: now,
    };
    this.conciliacoes.set(id, conciliacao);
    return conciliacao;
  }

  async updateConciliacao(id: string, userId: string, updates: UpdateConciliacao): Promise<Conciliacao | undefined> {
    const conciliacao = this.conciliacoes.get(id);
    if (!conciliacao || conciliacao.userId !== userId) return undefined;
    
    const updatedConciliacao = { ...conciliacao, ...updates, updatedAt: new Date() };
    this.conciliacoes.set(id, updatedConciliacao);
    return updatedConciliacao;
  }

  async deleteConciliacao(id: string, userId: string): Promise<boolean> {
    const conciliacao = this.conciliacoes.get(id);
    if (!conciliacao || conciliacao.userId !== userId) return false;
    return this.conciliacoes.delete(id);
  }

  async getDashboardStats(userId: string): Promise<any> {
    const contas = await this.getContas(userId);
    const faturas = await this.getFaturas(userId);
    const contatos = await this.getContatos(userId);
    
    const now = new Date();
    const mesAtual = new Date(now.getFullYear(), now.getMonth(), 1);
    const proximoMes = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const contasReceber = contas.filter(c => c.tipo === "receber");
    const contasPagar = contas.filter(c => c.tipo === "pagar");
    
    const receberMes = contasReceber.filter(c => 
      new Date(c.dataVencimento) >= mesAtual && 
      new Date(c.dataVencimento) < proximoMes
    ).reduce((sum, c) => sum + parseFloat(c.valor), 0);
    
    const pagarMes = contasPagar.filter(c => 
      new Date(c.dataVencimento) >= mesAtual && 
      new Date(c.dataVencimento) < proximoMes
    ).reduce((sum, c) => sum + parseFloat(c.valor), 0);
    
    const contasVencidas = contas.filter(c => 
      c.status === "pendente" && 
      new Date(c.dataVencimento) < now
    ).length;
    
    const faturasEmitidas = faturas.filter(f => f.status === "emitida").length;
    
    return {
      totalReceberMes: receberMes,
      totalPagarMes: pagarMes,
      saldoProjetado: receberMes - pagarMes,
      contasVencidas,
      faturasEmitidas,
      totalContatos: contatos.length,
      totalContas: contas.length,
      totalFaturas: faturas.length,
    };
  }
}

export const storage = new MemStorage();
