# 🚀 Sistema de Gerenciamento de Locação de Espaços (Jovem Tech)

Sistema Backend (Node.js/Express) e Frontend (React/Vite) para gerenciamento de locação de espaços, incluindo cadastro de ambientes, clientes, e registro de reservas com validação de conflito de horários e cálculo de orçamento.

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Node.js, Express, Mongoose (MongoDB)
* **Frontend:** React, Vite, Axios, React Router DOM
* **Banco de Dados:** MongoDB

---

## ⚙️ 1. Instruções de Instalação e Configuração

### 1.1. Pré-requisitos

Certifique-se de ter instalado:
1.  Node.js (versão 18 ou superior)
2.  MongoDB (Servidor local ou conta no MongoDB Atlas)

### 1.2. Configuração do Backend

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
    *O servidor estará rodando em `http://localhost:3333`.*

### 1.3. Configuração do Frontend

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
    *A aplicação estará disponível em `http://localhost:5173`.*

---

## ✨ 2. Funcionalidades Implementadas (CRUD Básico e Regras de Negócio)

O sistema foi desenvolvido seguindo os critérios obrigatórios do edital:

| Funcionalidade | Endpoint | Descrição |
| :--- | :--- | :--- |
| **Cadastro/Listagem de Espaços** | `/spaces` | CRUD (Create, Read, **Delete** com integridade). |
| **Cadastro/Listagem de Clientes** | `/users` | CRUD (Create, Read, **Delete** com integridade). |
| **Criação de Reservas** | `/reservations/new` | Verifica **Conflito de Horário** e calcula o **Custo Total (Orçamento)** por hora. |
| **Agenda de Ocupação** | `/agenda` | Visualização de todas as reservas confirmadas, com dados de Cliente e Espaço populados. |
| **Exclusão de Reservas** | `/agenda` | Permite a remoção de reservas individualmente. |

---

## 🖼️ 3. Instruções de Uso e Teste

Após iniciar o Backend e o Frontend, siga a ordem de teste para garantir que as regras de negócio funcionem:

1.  **Cadastrar um Espaço:** Navegue para `/spaces/new`. Defina o `Preço por Hora`.
2.  **Cadastrar um Cliente:** Navegue para `/users/new`.
3.  **Criar uma Reserva:** Navegue para `/reservations/new`.
    * **Teste 1 (Sucesso):** Escolha um espaço, cliente e defina um período. Ao submeter, o orçamento deve ser calculado.
    * **Teste 2 (Conflito):** Tente criar uma nova reserva para o **mesmo espaço** no **mesmo período** do Teste 1. O sistema deve retornar o erro de conflito.
4.  **Verificar a Agenda:** Acesse `/agenda` para visualizar as reservas criadas.
5.  **Testar Exclusão:** Use os botões Deletar na Home (espaços), Gerenciar Clientes (usuários) e Agenda (reservas).

---