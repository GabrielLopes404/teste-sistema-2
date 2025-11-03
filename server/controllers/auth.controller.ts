import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { storage } from "../storage";
import { loginSchema, insertUserSchema, updateProfileSchema } from "@shared/schema";
import { z } from "zod";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Usuário inativo" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    await storage.updateLastLogin(user.id);
    (req.session as any).userId = user.id;

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro no servidor" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const data = insertUserSchema.parse(req.body);
    
    const existingUser = await storage.getUserByUsername(data.username);
    if (existingUser) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await storage.createUser({ 
      ...data,
      password: hashedPassword,
      role: "user"
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro no servidor" });
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ message: "Logout realizado" });
  });
};

export const getMe = (req: any, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Não autorizado" });
  }
  const { password: _, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Não autorizado" });
    }

    const updates = updateProfileSchema.parse(req.body);
    
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    const user = await storage.updateUser(req.user.id, updates);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao atualizar perfil" });
  }
};
