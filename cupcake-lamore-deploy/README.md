# Cupcake Lamore - Código-Fonte para Deploy

Sistema de e-commerce completo para venda de cupcakes artesanais.

---

## Tecnologias Utilizadas

### Front-end
- React 19
- TypeScript
- Tailwind CSS 4
- tRPC Client
- Wouter (Routing)
- Shadcn/ui (Componentes)

### Back-end
- Node.js 22
- Express 4
- tRPC 11
- Drizzle ORM
- MySQL

### Autenticação
- OAuth 2.0 (Manus)
- JWT para sessões

### Storage
- AWS S3 para imagens de produtos

---

## Estrutura do Projeto

```
cupcake-lamore/
├── client/              # Front-end React
│   ├── public/          # Arquivos estáticos
│   └── src/
│       ├── components/  # Componentes reutilizáveis
│       ├── pages/       # Páginas da aplicação
│       ├── hooks/       # Custom hooks
│       └── lib/         # Utilitários e configurações
├── server/              # Back-end Node.js
│   ├── _core/           # Configurações do framework
│   ├── db.ts            # Helpers de banco de dados
│   └── routers.ts       # Rotas tRPC
├── drizzle/             # Schema e migrations do banco
│   └── schema.ts        # Definição das tabelas
├── shared/              # Código compartilhado
└── package.json         # Dependências do projeto
```

---

## Instalação Local

### Pré-requisitos
- Node.js 22+ instalado
- pnpm instalado (`npm install -g pnpm`)
- Banco de dados MySQL configurado
- Conta AWS S3 (opcional, para upload de imagens)

### Passo 1: Instalar Dependências
```bash
pnpm install
```

### Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL=mysql://usuario:senha@localhost:3306/cupcake_lamore

# JWT Secret (gere com: openssl rand -base64 32)
JWT_SECRET=sua_chave_secreta_aqui

# OAuth Manus (opcional, para autenticação)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
VITE_APP_ID=seu_app_id

# AWS S3 (opcional, para upload de imagens)
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=seu_bucket

# Ambiente
NODE_ENV=production
```

### Passo 3: Executar Migrations
```bash
pnpm db:push
```

### Passo 4: Popular Banco de Dados (Opcional)

Crie um arquivo `seed.ts` ou execute SQL diretamente para adicionar:
- Categorias de produtos
- Produtos iniciais
- Usuário administrador

### Passo 5: Iniciar em Desenvolvimento
```bash
pnpm dev
```

Acesse: http://localhost:3000

---

## Deploy em Produção

### Opção 1: Manus Platform (Recomendado)

O projeto já está hospedado e funcionando em:
**https://cupcake-lamore.manus.space**

Vantagens:
- Hospedagem gerenciada
- Banco de dados incluído
- S3 configurado automaticamente
- SSL/HTTPS automático
- Deploy via Git

### Opção 2: Vercel + PlanetScale

**1. Criar banco no PlanetScale:**
- Acesse planetscale.com
- Crie novo banco "cupcake-lamore"
- Copie connection string

**2. Deploy no Vercel:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**3. Configurar variáveis no Vercel:**
- DATABASE_URL
- JWT_SECRET
- NODE_ENV=production

### Opção 3: Railway

**1. Conectar repositório:**
- Acesse railway.app
- Conecte seu GitHub
- Selecione o repositório

**2. Adicionar MySQL:**
- Clique em "New" > "Database" > "MySQL"
- Copie DATABASE_URL

**3. Configurar variáveis:**
- Adicione todas as env vars necessárias
- Deploy automático

### Opção 4: VPS (DigitalOcean, AWS, etc.)

**1. Preparar servidor:**
```bash
# Instalar Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar pnpm
npm install -g pnpm

# Instalar MySQL
sudo apt-get install mysql-server
```

**2. Clonar e configurar:**
```bash
git clone seu-repositorio
cd cupcake-lamore
pnpm install
# Configurar .env
pnpm db:push
```

**3. Build e iniciar:**
```bash
pnpm build
pnpm start
```

**4. Configurar PM2 (gerenciador de processos):**
```bash
npm install -g pm2
pm2 start npm --name "cupcake-lamore" -- start
pm2 save
pm2 startup
```

**5. Configurar Nginx:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento

# Build
pnpm build            # Compila front-end e back-end

# Produção
pnpm start            # Inicia servidor em produção

# Banco de Dados
pnpm db:push          # Executa migrations

# Testes
pnpm test             # Executa testes unitários

# Verificação
pnpm check            # Verifica erros de TypeScript
```

---

## Banco de Dados

### Tabelas Principais

1. **users** - Usuários do sistema
2. **products** - Produtos (cupcakes)
3. **categories** - Categorias de produtos
4. **orders** - Pedidos realizados
5. **order_items** - Itens de cada pedido
6. **addresses** - Endereços de entrega

### Schema Completo

Consulte `drizzle/schema.ts` para ver a definição completa das tabelas.

---

## Funcionalidades Implementadas

### Área Pública (Cliente)
- Catálogo de produtos com busca e filtros
- Carrinho de compras dinâmico
- Checkout com endereço e forma de pagamento
- Histórico de pedidos
- Interface responsiva (mobile-first)

### Painel Administrativo
- Dashboard com métricas de vendas
- CRUD completo de produtos
- Upload de imagens para S3
- Gerenciamento de pedidos
- Atualização de status de pedidos
- Controle de estoque

### Segurança
- Autenticação OAuth 2.0
- Controle de acesso por roles (admin/user)
- Sessões JWT
- Validação de dados com Zod
- Type-safety end-to-end com tRPC

---

## Troubleshooting

### Erro: Cannot connect to database
**Solução:** Verifique se DATABASE_URL está correta e se o MySQL está rodando.

### Erro: OAuth callback failed
**Solução:** Configure OAUTH_SERVER_URL e VITE_OAUTH_PORTAL_URL corretamente.

### Erro: Images not uploading
**Solução:** Verifique credenciais AWS S3 (ACCESS_KEY, SECRET_KEY, BUCKET).

### Erro: Port 3000 already in use
**Solução:** Mate o processo: `lsof -ti:3000 | xargs kill -9`

---

## Suporte

Para dúvidas ou problemas:
- Consulte a documentação completa em `docs/`
- Abra uma issue no GitHub
- Entre em contato: suporte@cupcakelamore.com

---

## Licença

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso.

---

## Autor

**Shaianne Veloso Ribeiro**  
Desenvolvimento Full-Stack  
2025
