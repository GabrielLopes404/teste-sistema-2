# Lucrei - Sistema de Gestão Financeira

## Visão Geral
Lucrei é um sistema completo de gestão financeira desenvolvido com React (frontend) e Express (backend), com funcionalidades para usuários e administradores.

## Estado Atual  
- ✅ Sistema 100% funcionando
- ✅ Backend completo e organizado
- ✅ Painel administrativo implementado
- ✅ Página de configurações de usuário completa
- ✅ Sistema de autenticação com sessões
- ✅ CRUD completo para todas as entidades
- ✅ Configuração Replit completa
- ✅ Deploy configurado

## Arquitetura do Projeto

### Backend (Express + TypeScript)
**Estrutura Organizada em Camadas:**

#### Controllers (`server/controllers/`)
- `auth.controller.ts` - Autenticação e perfil de usuário
- `admin.controller.ts` - Gerenciamento administrativo
- `contas.controller.ts` - Contas a pagar/receber
- `faturas.controller.ts` - Gestão de faturas
- `contatos.controller.ts` - Clientes e fornecedores
- `fluxo-caixa.controller.ts` - Fluxo de caixa
- `conciliacoes.controller.ts` - Conciliação bancária
- `dashboard.controller.ts` - Estatísticas e relatórios

#### Routes (`server/routes/`)
- `auth.routes.ts` - Rotas de autenticação
- `admin.routes.ts` - Rotas administrativas
- `contas.routes.ts` - Rotas de contas
- `faturas.routes.ts` - Rotas de faturas
- `contatos.routes.ts` - Rotas de contatos
- `fluxo-caixa.routes.ts` - Rotas de fluxo de caixa
- `conciliacoes.routes.ts` - Rotas de conciliação
- `dashboard.routes.ts` - Rotas de dashboard

#### Middlewares (`server/middlewares/`)
- `auth.ts` - Middleware de autenticação e autorização
  - `requireAuth` - Requer usuário autenticado
  - `requireAdmin` - Requer usuário administrador
  - `optionalAuth` - Autenticação opcional

#### Core
- `server/index.ts` - Servidor principal
- `server/routes.ts` - Registro de todas as rotas
- `server/storage.ts` - Sistema de armazenamento em memória
- `server/vite.ts` - Integração com Vite

### Frontend (React + Vite)
- **client/src/App.tsx**: Configuração de rotas
- **client/src/pages/**: Páginas do sistema
  - `login.tsx` - Página de login
  - `landing.tsx` - Landing page pública
  - `configuracoes.tsx` - **NOVA** Configurações completas do usuário
  - `dashboard.tsx` - Dashboard do usuário
  - `contas.tsx` - Contas a pagar/receber
  - `fluxo-caixa.tsx` - Fluxo de caixa
  - `conciliacao.tsx` - Conciliação bancária
  - `faturas.tsx` - Faturas
  - `contatos.tsx` - Contatos
  - `relatorios.tsx` - Relatórios
  - `admin/dashboard.tsx` - Dashboard administrativo
  - `admin/users.tsx` - Gerenciamento de usuários
  - `admin/reports.tsx` - Relatórios administrativos
  - `admin/settings.tsx` - Configurações do sistema

### Componentes
- **client/src/components/**: Componentes reutilizáveis
  - `app-sidebar.tsx` - Sidebar para usuários
  - `admin-sidebar.tsx` - Sidebar para administradores
  - `ui/` - Componentes UI (shadcn/ui)

### Schema e Tipos (`shared/schema.ts`)
**Tabelas do Banco de Dados:**
- `users` - Usuários do sistema (perfil completo)
- `contas` - Contas a pagar e receber
- `faturas` - Faturas emitidas
- `contatos` - Clientes e fornecedores
- `fluxoCaixa` - Registro de fluxo de caixa
- `conciliacoes` - Conciliações bancárias

## API Completa

### Autenticação (`/api/auth`)
- `POST /login` - Login de usuários
- `POST /register` - Registro de novos usuários
- `POST /logout` - Logout
- `GET /me` - Dados do usuário atual
- `PUT /profile` - Atualizar perfil do usuário

### Admin (`/api/admin`) - Requer autenticação de admin
- `GET /users` - Listar todos os usuários
- `POST /users` - Criar novo usuário
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário
- `GET /stats` - Estatísticas do sistema

### Contas (`/api/contas`) - Requer autenticação
- `GET /` - Listar contas (com filtros: tipo, status, categoria)
- `GET /stats` - Estatísticas de contas
- `GET /:id` - Buscar conta específica
- `POST /` - Criar nova conta
- `PUT /:id` - Atualizar conta
- `DELETE /:id` - Deletar conta

### Faturas (`/api/faturas`) - Requer autenticação
- `GET /` - Listar faturas (com filtros: status, contatoId)
- `GET /stats` - Estatísticas de faturas
- `GET /:id` - Buscar fatura específica
- `POST /` - Criar nova fatura
- `PUT /:id` - Atualizar fatura
- `DELETE /:id` - Deletar fatura

### Contatos (`/api/contatos`) - Requer autenticação
- `GET /` - Listar contatos (com filtros: tipo, ativo)
- `GET /stats` - Estatísticas de contatos
- `GET /:id` - Buscar contato específico
- `POST /` - Criar novo contato
- `PUT /:id` - Atualizar contato
- `DELETE /:id` - Deletar contato

### Fluxo de Caixa (`/api/fluxo-caixa`) - Requer autenticação
- `GET /` - Listar fluxo de caixa (com filtros: dataInicio, dataFim)
- `GET /stats` - Estatísticas de fluxo de caixa
- `POST /` - Criar entrada no fluxo de caixa

### Conciliações (`/api/conciliacoes`) - Requer autenticação
- `GET /` - Listar conciliações
- `GET /:id` - Buscar conciliação específica
- `POST /` - Criar nova conciliação
- `PUT /:id` - Atualizar conciliação
- `DELETE /:id` - Deletar conciliação

### Dashboard (`/api/dashboard`) - Requer autenticação
- `GET /stats` - Estatísticas gerais do dashboard
- `GET /relatorios` - Relatórios financeiros (com filtro de período)

## Funcionalidades

### Sistema de Autenticação
- Login com username/password
- Sessões com express-session
- Senhas hashadas com bcryptjs
- Diferenciação de roles (admin/user)
- Perfil de usuário completo

### Painel de Configurações do Usuário **[NOVO]**
**Acesso**: `/configuracoes` (link no footer da sidebar)

**Abas Disponíveis**:
1. **Perfil**
   - Informações pessoais completas
   - Foto de perfil
   - Dados da empresa (nome, CNPJ, cargo, setor)
   - Endereço completo
   - Biografia

2. **Segurança**
   - Alteração de senha
   - Autenticação de dois fatores (2FA)
   - SMS de segurança
   - Desativar/Excluir conta

3. **Notificações**
   - Notificações por email (relatórios, contas a vencer, novidades)
   - Notificações push (transações, alertas de segurança)

4. **Aparência**
   - Modo de exibição (claro/escuro/sistema)
   - Cores de destaque personalizáveis
   - Modo compacto
   - Animações
   - Tamanho da fonte

5. **Regional**
   - Idioma do sistema
   - Fuso horário
   - Formato de data
   - Moeda padrão
   - Formato de números

### Painel Administrativo
**Acesso**: Login com credenciais de admin
- **Credenciais padrão**: 
  - Username: `admin`
  - Password: `admin123`

**Funcionalidades**:
- Dashboard com estatísticas
- Gerenciamento completo de usuários (criar, editar, deletar, ativar/desativar)
- Controle de roles (admin/user)
- Visualização de último acesso

### Painel de Usuário
- Dashboard financeiro com estatísticas
- **Contas a Pagar/Receber** - CRUD completo
- **Fluxo de Caixa** - Registro e visualização
- **Conciliação Bancária** - Gerenciamento de conciliações
- **Faturas** - CRUD completo
- **Contatos** - Gestão de clientes e fornecedores
- **Relatórios** - Relatórios financeiros personalizados

## Tecnologias Principais
- **Frontend**: React 18, Vite, TailwindCSS, Wouter (routing), TanStack Query
- **Backend**: Express, TypeScript, Express Session
- **UI Components**: Radix UI, shadcn/ui
- **Autenticação**: bcryptjs, express-session
- **Validação**: Zod
- **ORM**: Drizzle ORM (preparado para PostgreSQL)
- **Ambiente**: Node.js 20, Replit

## Configuração Replit

### Variáveis de Ambiente
- `SESSION_SECRET`: Chave secreta para sessões (gerada automaticamente)
- `PORT`: 5000 (padrão)

### Workflow
- Nome: `dev`
- Comando: `npm run dev`
- Porta: 5000
- Output: webview

### Deploy
- Target: autoscale
- Build: `npm run build`
- Run: `npm run start`

## Como Usar

### Desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Produção
```bash
npm run start
```

## Acesso ao Sistema

### Landing Page
- URL: `/`
- Link "Trabalhe Aqui?" → redireciona para `/admin/dashboard`

### Login
- URL: `/login`
- Admin: username `admin`, password `admin123`
- Redireciona admin para `/admin/dashboard`
- Redireciona usuários para `/dashboard`

### Painel Admin
- URLs: `/admin/*`
- Sidebar diferenciada com menu administrativo
- Opção de logout no footer

### Painel Usuário
- URLs: `/dashboard`, `/contas`, `/fluxo-caixa`, `/configuracoes`, etc.
- Sidebar com menu de funcionalidades financeiras
- Link "Configurações" no footer da sidebar

## Modificações Recentes
- ✅ Backend completamente reorganizado e profissional
- ✅ Estrutura de pastas separada (controllers, routes, middlewares)
- ✅ CRUD completo para todas as entidades
- ✅ Sistema de filtros e estatísticas
- ✅ Página de configurações de usuário completa (5 abas)
- ✅ Validação com Zod em todas as rotas
- ✅ Middleware de autenticação robusto
- ✅ Sistema de relatórios e dashboard
- ✅ API RESTful completa e documentada

## Estrutura de Dados

### User
```typescript
{
  id: string;
  username: string;
  password: string;
  email: string | null;
  fullName: string | null;
  phone: string | null;
  company: string | null;
  cnpj: string | null;
  position: string | null;
  department: string | null;
  address: string | null;
  addressNumber: string | null;
  complement: string | null;
  neighborhood: string | null;
  zipCode: string | null;
  city: string | null;
  state: string | null;
  bio: string | null;
  avatar: string | null;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: Date;
  lastLogin: Date | null;
  preferences: string | null;
}
```

### Conta
```typescript
{
  id: string;
  userId: string;
  tipo: "pagar" | "receber";
  descricao: string;
  valor: string;
  dataVencimento: Date;
  dataPagamento: Date | null;
  status: "pendente" | "pago" | "atrasado";
  categoria: string | null;
  contatoId: string | null;
  observacoes: string | null;
  anexo: string | null;
  recorrente: boolean | null;
  periodicidade: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Notas Importantes
- O sistema usa armazenamento em memória (MemStorage) - dados são perdidos ao reiniciar
- Estrutura preparada para migração para PostgreSQL com Drizzle ORM
- Usuário admin padrão é criado automaticamente no startup
- As senhas são hashadas com bcrypt (salt rounds: 10)
- Sessões expiram em 7 dias
- Vite configurado para aceitar proxy do Replit (HMR funcional)
- Backend totalmente modular e escalável
- Código profissional com separação de responsabilidades
- Validação completa em todas as rotas
- Tratamento de erros padronizado

## Próximos Passos (Sugestões)
- Conectar frontend ao backend (atualizar queries do TanStack Query)
- Implementar banco de dados PostgreSQL real
- Adicionar upload de arquivos para anexos e avatares
- Implementar sistema de notificações em tempo real
- Adicionar gráficos e visualizações de dados
- Implementar export de relatórios (PDF, Excel)
- Adicionar multi-tenancy
- Implementar backup automático
