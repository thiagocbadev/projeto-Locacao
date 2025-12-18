# 🚀 Sistema de Gerenciamento de Locação de Espaços (Jovem Tech)

Este projeto implementa um sistema de gerenciamento de espaços para coworking/eventos, utilizando uma arquitetura MERN (MongoDB, Express, React, Node.js). O foco principal é no gerenciamento de recursos (Espaços, Clientes) e na lógica de negócio complexa das Reservas, incluindo verificação de conflito de horário e cálculo de orçamento.

---

### ⚙️ 1. Instruções de Instalação e Configuração

#### 1.1. Pré-requisitos

Certifique-se de ter instalado:
* **Node.js** (versão 18 ou superior)
* **MongoDB** (Servidor local ou conta no MongoDB Atlas)

#### 1.2. Configuração do Backend

1.  Navegue até a pasta `backend`:
    ```bash
    cd backend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  **Configurar o Banco de Dados:** Crie um arquivo `.env` na raiz do diretório `backend` e adicione sua string de conexão com o MongoDB:
    ```
    MONGO_URI=mongodb+srv://<USUARIO>:<SENHA>@<CLUSTER>.mongodb.net/<NOME_DO_BANCO>
    ```

4.  Inicie o servidor Backend:
    ```bash
    node src/server.js
    ```

O servidor estará rodando em `http://localhost:3333`.

#### 1.3. Configuração do Frontend

1.  Navegue até a pasta `frontend`:
    ```bash
    cd ../frontend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Inicie a aplicação React:
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173`.

---

### ✨ 2. Funcionalidades Implementadas (CRUD Completo e Regras de Negócio)

O sistema foi desenvolvido seguindo os critérios obrigatórios do edital, com suporte completo às operações de Edição (`Update`):

| Funcionalidade | Endpoint | Operações CRUD | Descrição |
| :--- | :--- | :--- | :--- |
| **Gestão de Espaços** | `/spaces` | **C, R, U, D** | Cadastro, listagem, **edição** e exclusão de espaços. |
| **Gestão de Clientes** | `/users` | **C, R, U, D** | Cadastro, listagem, **edição** e exclusão de clientes. |
| **Criação de Reservas** | `/reservations/new` | **C** | Criação de uma nova reserva com validações. |
| **Regras de Reserva** | N/A | N/A | Verifica **Conflito de Horário** e calcula o **Custo Total (Orçamento)** por hora. |
| **Agenda e Gestão de Reservas** | `/agenda` | **R, U, D** | Visualização, **edição** e exclusão de todas as reservas confirmadas. |

---

### 🖼️ 3. Instruções de Uso e Teste

Após iniciar o Backend e o Frontend, siga a ordem de teste para garantir que as regras de negócio e as funcionalidades de edição funcionem corretamente:

1.  **Cadastrar um Espaço:** Navegue para `/spaces/new`. Defina o **Preço por Hora**.
2.  **Cadastrar um Cliente:** Navegue para `/users/new`.
3.  **Criar uma Reserva:** Navegue para `/reservations/new`.
    * **Teste 1 (Sucesso):** Escolha um espaço, cliente e defina um período. O orçamento deve ser calculado e a reserva criada.
    * **Teste 2 (Conflito):** Tente criar uma nova reserva para o **mesmo espaço** no **mesmo período** do Teste 1. O sistema deve retornar o erro de conflito.
4.  **Verificar a Agenda:** Acesse `/agenda` para visualizar as reservas criadas.
5.  **Testar Edição (Update):**
    * Na tela de Gerenciamento de Clientes (`/users`), use o botão **Editar** para modificar os dados de um cliente.
    * Na tela da Agenda (`/agenda`), use o botão **Editar** para alterar os detalhes de uma reserva existente (ex: data ou cliente).
6.  **Testar Exclusão (Delete):** Use os botões Deletar na Home (espaços), Gerenciar Clientes (usuários) e Agenda (reservas).
