# 🧁 Cupcake Lamore

Sistema completo de e-commerce para venda de cupcakes artesanais, desenvolvido como Trabalho de Conclusão de Curso.

**🔗 [Ver Demo Online](https://3000-irmmgqexal7zoh9jrk78k-06a59a8b.manusvm.computer)**

---

## Sobre o Projeto

Plataforma digital que permite à confeitaria Cupcake Lamore expandir suas vendas online, oferecendo aos clientes uma experiência moderna de compra e aos administradores ferramentas eficientes de gestão.

---

## Funcionalidades

### Área do Cliente
- Catálogo de produtos com busca e filtros por categoria
- Carrinho de compras com atualização em tempo real
- Checkout com formulário de endereço e seleção de pagamento
- Autenticação segura via OAuth 2.0
- Histórico de pedidos e acompanhamento de status

### Painel Administrativo
- Dashboard com métricas de vendas e estoque
- CRUD completo de produtos com upload de imagens
- Gerenciamento de pedidos com atualização de status
- Controle de acesso por roles (admin/cliente)
- Alertas de estoque baixo

---

## Tecnologias

**Front-end**
- React 19 + TypeScript
- Tailwind CSS 4
- tRPC Client
- Shadcn/ui

**Back-end**
- Node.js 22 + Express 4
- tRPC 11 (API type-safe)
- Drizzle ORM
- MySQL

**Infraestrutura**
- OAuth 2.0 + JWT
- AWS S3 (imagens)
- Hospedagem: Manus Platform

---

## Arquitetura

```
┌─────────────────┐
│   React SPA     │  ← Interface responsiva
├─────────────────┤
│   tRPC Client   │  ← Type-safe API calls
├─────────────────┤
│   Express API   │  ← Lógica de negócio
├─────────────────┤
│   Drizzle ORM   │  ← Acesso ao banco
├─────────────────┤
│   MySQL (6 TB)  │  ← Persistência
└─────────────────┘
```

**Tabelas:** users, products, categories, orders, order_items, addresses

---

## Instalação

### Pré-requisitos
- Node.js 22+
- pnpm
- MySQL

### Passo a Passo

```bash
# 1. Clonar repositório
git clone https://github.com/seu-usuario/cupcake-lamore.git
cd cupcake-lamore

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# 4. Executar migrations
pnpm db:push

# 5. Iniciar desenvolvimento
pnpm dev
```

Acesse: http://localhost:3000

---

## Variáveis de Ambiente

```env
# Obrigatórias
DATABASE_URL=mysql://user:pass@host:3306/db
JWT_SECRET=sua_chave_secreta
NODE_ENV=production

# Opcionais (OAuth)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
VITE_APP_ID=seu_app_id

# Opcionais (S3)
AWS_ACCESS_KEY_ID=sua_key
AWS_SECRET_ACCESS_KEY=sua_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=seu-bucket
```

---

## Scripts

```bash
pnpm dev          # Desenvolvimento (localhost:3000)
pnpm build        # Build para produção
pnpm start        # Iniciar em produção
pnpm db:push      # Executar migrations
pnpm test         # Testes unitários
pnpm check        # Verificar TypeScript
```

---

## Deploy

### Opção 1: Manus Platform (Atual)
Sistema já hospedado em: https://3000-irmmgqexal7zoh9jrk78k-06a59a8b.manusvm.computer

### Opção 2: Vercel + PlanetScale
```bash
npm i -g vercel
vercel --prod
```

### Opção 3: Railway
Conecte o repositório e adicione MySQL via dashboard.

### Opção 4: VPS
```bash
pnpm install
pnpm build
pm2 start npm --name "cupcake" -- start
```

---

## Estrutura do Projeto

```
cupcake-lamore/
├── client/              # Front-end React
│   ├── src/
│   │   ├── components/  # Componentes UI
│   │   ├── pages/       # Páginas
│   │   └── hooks/       # Custom hooks
│   └── public/          # Assets estáticos
├── server/              # Back-end Node.js
│   ├── routers.ts       # Rotas tRPC
│   └── db.ts            # Database helpers
├── drizzle/             # Schema do banco
│   └── schema.ts        # Definição de tabelas
└── shared/              # Código compartilhado
```

---

## Testes

O projeto foi testado com 5 personas fictícias representando diferentes perfis de usuários. Todos os feedbacks foram documentados e melhorias implementadas.

**Cobertura:**
- Testes unitários (Vitest)
- Testes de integração
- Testes de usabilidade

**Score de Qualidade:** 8.63/10

---

## Documentação

- **TCC1 Corrigido**: Documento acadêmico completo com diagramas UML
- **Laudo de Qualidade**: Análise comparativa e correções
- **Manual de Uso**: Guia para clientes e administradores
- **Dicionário de Dados**: Documentação técnica do banco
- **Feedbacks de Testes**: Relatórios de 5 testadores

---

## Diferenciais

- **Type-Safety End-to-End**: TypeScript + tRPC eliminam erros de tipo
- **Arquitetura Escalável**: Separação clara de responsabilidades
- **UX Moderna**: Interface responsiva e feedback visual em todas as ações
- **Segurança**: OAuth 2.0, validação de dados, proteção CSRF
- **Performance**: Carregamento < 2s, otimização de imagens

---

## Roadmap

- [ ] Sistema de avaliações de produtos
- [ ] Programa de fidelidade
- [ ] Cupons de desconto
- [ ] Integração com Stripe/Mercado Pago
- [ ] App mobile (React Native)
- [ ] Notificações push
- [ ] Relatórios avançados para admin

---

## Licença

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso e está disponível para fins educacionais.

---

## Autor

**Shaianne Veloso Ribeiro**  
Desenvolvimento Full-Stack | 2025

📧 shairibeirols@gmail.com  
💼 [LinkedIn](#) | 🐙 [GitHub](#) | 🌐 [Portfolio](#)

---

## Agradecimentos

Agradecimentos especiais aos professores orientadores e colegas que contribuíram com feedbacks durante o desenvolvimento deste projeto.
