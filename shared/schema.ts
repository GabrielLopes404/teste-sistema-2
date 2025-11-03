import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, decimal, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  phone: text("phone"),
  company: text("company"),
  cnpj: text("cnpj"),
  position: text("position"),
  department: text("department"),
  address: text("address"),
  addressNumber: text("address_number"),
  complement: text("complement"),
  neighborhood: text("neighborhood"),
  zipCode: text("zip_code"),
  city: text("city"),
  state: text("state"),
  bio: text("bio"),
  avatar: text("avatar"),
  role: text("role").notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login"),
  preferences: text("preferences"),
});

export const contas = pgTable("contas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  tipo: text("tipo").notNull(),
  descricao: text("descricao").notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  dataVencimento: timestamp("data_vencimento").notNull(),
  dataPagamento: timestamp("data_pagamento"),
  status: text("status").notNull().default("pendente"),
  categoria: text("categoria"),
  contatoId: varchar("contato_id"),
  observacoes: text("observacoes"),
  anexo: text("anexo"),
  recorrente: boolean("recorrente").default(false),
  periodicidade: text("periodicidade"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const faturas = pgTable("faturas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  numero: text("numero").notNull(),
  contatoId: varchar("contato_id").notNull(),
  dataEmissao: timestamp("data_emissao").notNull(),
  dataVencimento: timestamp("data_vencimento").notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  desconto: decimal("desconto", { precision: 10, scale: 2 }).default("0"),
  valorTotal: decimal("valor_total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("emitida"),
  observacoes: text("observacoes"),
  itens: text("itens"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contatos = pgTable("contatos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  tipo: text("tipo").notNull(),
  nome: text("nome").notNull(),
  email: text("email"),
  telefone: text("telefone"),
  cpfCnpj: text("cpf_cnpj"),
  empresa: text("empresa"),
  endereco: text("endereco"),
  cidade: text("cidade"),
  estado: text("estado"),
  cep: text("cep"),
  observacoes: text("observacoes"),
  ativo: boolean("ativo").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const fluxoCaixa = pgTable("fluxo_caixa", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  data: timestamp("data").notNull(),
  tipo: text("tipo").notNull(),
  categoria: text("categoria").notNull(),
  descricao: text("descricao").notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  saldo: decimal("saldo", { precision: 10, scale: 2 }).notNull(),
  referencia: text("referencia"),
  referenciaId: varchar("referencia_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const conciliacoes = pgTable("conciliacoes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  dataInicio: timestamp("data_inicio").notNull(),
  dataFim: timestamp("data_fim").notNull(),
  banco: text("banco").notNull(),
  conta: text("conta").notNull(),
  saldoInicial: decimal("saldo_inicial", { precision: 10, scale: 2 }).notNull(),
  saldoFinal: decimal("saldo_final", { precision: 10, scale: 2 }).notNull(),
  totalEntradas: decimal("total_entradas", { precision: 10, scale: 2 }).notNull(),
  totalSaidas: decimal("total_saidas", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("em_progresso"),
  observacoes: text("observacoes"),
  transacoes: text("transacoes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
});

export const updateUserSchema = createInsertSchema(users).partial().omit({
  id: true,
  createdAt: true,
});

export const updateProfileSchema = createInsertSchema(users).partial().omit({
  id: true,
  createdAt: true,
  role: true,
  isActive: true,
  lastLogin: true,
});

export const insertContaSchema = createInsertSchema(contas).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateContaSchema = insertContaSchema.partial();

export const insertFaturaSchema = createInsertSchema(faturas).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateFaturaSchema = insertFaturaSchema.partial();

export const insertContatoSchema = createInsertSchema(contatos).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateContatoSchema = insertContatoSchema.partial();

export const insertFluxoCaixaSchema = createInsertSchema(fluxoCaixa).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertConciliacaoSchema = createInsertSchema(conciliacoes).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateConciliacaoSchema = insertConciliacaoSchema.partial();

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type User = typeof users.$inferSelect;

export type InsertConta = z.infer<typeof insertContaSchema>;
export type UpdateConta = z.infer<typeof updateContaSchema>;
export type Conta = typeof contas.$inferSelect;

export type InsertFatura = z.infer<typeof insertFaturaSchema>;
export type UpdateFatura = z.infer<typeof updateFaturaSchema>;
export type Fatura = typeof faturas.$inferSelect;

export type InsertContato = z.infer<typeof insertContatoSchema>;
export type UpdateContato = z.infer<typeof updateContatoSchema>;
export type Contato = typeof contatos.$inferSelect;

export type InsertFluxoCaixa = z.infer<typeof insertFluxoCaixaSchema>;
export type FluxoCaixa = typeof fluxoCaixa.$inferSelect;

export type InsertConciliacao = z.infer<typeof insertConciliacaoSchema>;
export type UpdateConciliacao = z.infer<typeof updateConciliacaoSchema>;
export type Conciliacao = typeof conciliacoes.$inferSelect;

export type LoginData = z.infer<typeof loginSchema>;
