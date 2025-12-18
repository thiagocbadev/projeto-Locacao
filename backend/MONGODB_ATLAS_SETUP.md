# 🚀 Guia: Configurando MongoDB Atlas (Banco de Dados na Nuvem)

Este guia vai te ajudar a configurar o MongoDB Atlas, que é o serviço de MongoDB na nuvem, gratuito e perfeito para seu projeto.

## 📋 Pré-requisitos

- Conta no MongoDB Atlas (gratuita)
- Acesso à internet

---

## 🔧 Passo a Passo

### 1️⃣ Criar Conta no MongoDB Atlas

1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Clique em **"Try Free"** ou **"Sign Up"**
3. Preencha o formulário de cadastro
4. Confirme seu email

### 2️⃣ Criar um Cluster Gratuito

1. Após fazer login, você verá a tela de criação de cluster
2. Escolha a opção **"M0 Free"** (tier gratuito)
3. Selecione uma região próxima ao Brasil (ex: `São Paulo` ou `us-east-1`)
4. Clique em **"Create Cluster"**
5. Aguarde alguns minutos enquanto o cluster é criado (pode levar 3-5 minutos)

### 3️⃣ Configurar Acesso ao Banco de Dados

#### 3.1 Criar Usuário do Banco

1. No menu lateral, vá em **"Database Access"** (Acesso ao Banco)
2. Clique em **"Add New Database User"**
3. Escolha **"Password"** como método de autenticação
4. Crie um usuário e senha (ANOTE BEM! Você vai precisar depois)
   - Exemplo de usuário: `admin-espacos`
   - Exemplo de senha: `MinhaSenhaSegura123!`
5. Em **"Database User Privileges"**, selecione **"Atlas admin"**
6. Clique em **"Add User"**

#### 3.2 Configurar Whitelist de IPs (Permitir Conexões)

1. No menu lateral, vá em **"Network Access"** (Acesso à Rede)
2. Clique em **"Add IP Address"**
3. Para desenvolvimento local, você tem duas opções:

   **Opção A - Permitir apenas seu IP atual:**
   - Clique em **"Add Current IP Address"**
   - Clique em **"Confirm"**

   **Opção B - Permitir de qualquer lugar (apenas para testes):**
   - Clique em **"Allow Access from Anywhere"**
   - Digite: `0.0.0.0/0`
   - ⚠️ **ATENÇÃO:** Isso permite acesso de qualquer IP. Use apenas para testes!
   - Clique em **"Confirm"**

### 4️⃣ Obter a String de Conexão

1. No menu lateral, vá em **"Database"** (ou clique em **"Connect"** no card do cluster)
2. Clique no botão **"Connect"**
3. Selecione **"Connect your application"** (Conectar sua aplicação)
4. Escolha:
   - **Driver:** Node.js
   - **Version:** 5.5 or later (ou a versão mais recente)
5. Copie a **Connection String** que aparece
   - Ela vai parecer com: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### 5️⃣ Configurar no Projeto

1. No projeto, dentro da pasta `backend`, crie um arquivo `.env` (se não existir)
2. Cole a connection string no arquivo `.env`:

```env
MONGO_URI=mongodb+srv://seu-usuario:sua-senha@cluster0.xxxxx.mongodb.net/gerenciamento-espacos?retryWrites=true&w=majority
```

**IMPORTANTE:**
- Substitua `<username>` pelo usuário que você criou (ex: `admin-espacos`)
- Substitua `<password>` pela senha que você criou
- Substitua `cluster0.xxxxx` pela URL do seu cluster
- Adicione o nome do banco após `.net/` (ex: `gerenciamento-espacos`)

**Exemplo completo:**
```env
MONGO_URI=mongodb+srv://admin-espacos:MinhaSenhaSegura123!@cluster0.abc123.mongodb.net/gerenciamento-espacos?retryWrites=true&w=majority
```

### 6️⃣ Testar a Conexão

1. Certifique-se de que o arquivo `.env` está na pasta `backend`
2. Inicie o servidor:
   ```bash
   cd backend
   npm start
   # ou
   node src/server.js
   ```
3. Se tudo estiver correto, você verá:
   ```
   ✅ MongoDB conectado com sucesso!
   📊 Database: gerenciamento-espacos
   Servidor rodando na porta 3333
   ```

---

## 🔒 Segurança

### ⚠️ NUNCA faça commit do arquivo `.env` no Git!

O arquivo `.env` contém informações sensíveis. Certifique-se de que ele está no `.gitignore`:

```gitignore
# .gitignore
.env
node_modules/
```

### ✅ Boas Práticas

1. Use senhas fortes para o usuário do banco
2. Limite o acesso por IP quando possível
3. Use variáveis de ambiente para todas as configurações sensíveis
4. Faça backup regular dos dados importantes

---

## 🆘 Troubleshooting (Solução de Problemas)

### Erro: "MongoServerError: Authentication failed"
- Verifique se o usuário e senha estão corretos no `.env`
- Certifique-se de que o usuário foi criado no MongoDB Atlas

### Erro: "MongoServerError: IP not whitelisted"
- Adicione seu IP atual na whitelist (Network Access)
- Ou use `0.0.0.0/0` temporariamente para testes

### Erro: "Connection timeout"
- Verifique sua conexão com a internet
- Verifique se o cluster está ativo no MongoDB Atlas
- Tente aumentar o `serverSelectionTimeoutMS` no código

### Erro: "MONGO_URI não encontrada no .env"
- Certifique-se de que o arquivo `.env` existe na pasta `backend`
- Verifique se a variável está escrita exatamente como `MONGO_URI` (sem espaços)

---

## 📊 Migrando Dados Locais para a Nuvem

Se você já tem dados no banco local e quer migrar para o Atlas:

### Opção 1: Usando mongodump e mongorestore

```bash
# 1. Fazer backup do banco local
mongodump --uri="mongodb://localhost:27017/gerenciamento-espacos" --out=./backup

# 2. Restaurar no Atlas
mongorestore --uri="mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/gerenciamento-espacos" ./backup/gerenciamento-espacos
```

### Opção 2: Usando MongoDB Compass (Interface Gráfica)

1. Baixe o MongoDB Compass: https://www.mongodb.com/products/compass
2. Conecte ao banco local
3. Exporte as coleções
4. Conecte ao MongoDB Atlas
5. Importe as coleções

---

## 🎉 Pronto!

Agora seu banco de dados está na nuvem e pode ser acessado de qualquer lugar! 

**Vantagens do MongoDB Atlas:**
- ✅ Gratuito (tier M0)
- ✅ Backup automático
- ✅ Escalável
- ✅ Seguro
- ✅ Acessível de qualquer lugar
- ✅ Monitoramento de performance

---

## 📚 Recursos Adicionais

- [Documentação MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [MongoDB University (Cursos Gratuitos)](https://university.mongodb.com/)
- [MongoDB Community Forum](https://developer.mongodb.com/community/forums/)

