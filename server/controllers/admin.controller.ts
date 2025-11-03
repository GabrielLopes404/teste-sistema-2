import { Response } from "express";
import bcrypt from "bcryptjs";
import { storage } from "../storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

export const getAllUsers = async (req: any, res: Response) => {
  try {
    const users = await storage.getAllUsers();
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json({ users: usersWithoutPasswords });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
};

export const createUser = async (req: any, res: Response) => {
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
      role: data.role || "user"
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
};

export const updateUser = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    const user = await storage.updateUser(id, updates);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
};

export const deleteUser = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    if (req.user && id === req.user.id) {
      return res.status(400).json({ message: "Você não pode deletar sua própria conta" });
    }

    const deleted = await storage.deleteUser(id);
    if (!deleted) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar usuário" });
  }
};

export const getAdminStats = async (req: any, res: Response) => {
  try {
    const users = await storage.getAllUsers();
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      admins: users.filter(u => u.role === "admin").length,
      recentLogins: users.filter(u => u.lastLogin && 
        new Date().getTime() - new Date(u.lastLogin).getTime() < 7 * 24 * 60 * 60 * 1000
      ).length,
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estatísticas" });
  }
};
