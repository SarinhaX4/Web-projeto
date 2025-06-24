# 🥦 Hort+  - Sistema de Gerenciamento de Produtos e Pedidos

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="80" alt="Nest Logo" />
  &nbsp; &nbsp; &nbsp;
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="80" alt="React Logo" />
</p>

<p align="center">
  Um sistema full-stack completo para gerenciamento de hortifruti, desenvolvido com <strong>NestJS</strong> para o back-end e <strong>Next.js (React)</strong> para o front-end.
</p>

---

## Sobre o Projeto

O Hort+ é uma aplicação robusta e intuitiva projetada para **otimizar o gerenciamento de produtos, pedidos, carrinhos e usuários em estabelecimentos de hortifruti**. Com uma interface administrativa amigável e uma API eficiente, o sistema facilita as operações diárias, desde o cadastro de novos itens até o acompanhamento detalhado do status de entrega dos pedidos.

### Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

* **Back-end:**
    * **NestJS:** Framework Node.js para aplicações eficientes e escaláveis.
    * **TypeScript:** Linguagem de programação que adiciona tipagem estática ao JavaScript.
    * **TypeORM:** ORM (Object-Relational Mapper) para interagir com o banco de dados.
    * **SQLite3:** Banco de dados leve e embarcado, ideal para desenvolvimento.
    * **Jest:** Framework de testes para garantir a qualidade do código.
* **Front-end:**
    * **Next.js:** Framework React para construir aplicações web modernas.
    * **React:** Biblioteca JavaScript para construção de interfaces de usuário.
    * **TypeScript:** Para um desenvolvimento front-end mais seguro e escalável.
    * **pnpm:** Gerenciador de pacotes rápido e eficiente.
    * **Axios:** Cliente HTTP baseado em Promises para comunicação com a API.
    * **Shadcn UI:** Coleção de componentes de UI reutilizáveis e personalizáveis.

---

## Integrantes do Grupo

* SARA CRISTINA BARROS DE OLIVEIRA - **Matrícula:** UC23102920
* NATÁLIA JESUS BARBOSA CRUZEIRO - **Matrícula:** UC23100451
* PEDRO PAULO SOUSA DO LAGO - **Matrícula:** UC23101313
* RAQUEL PEREIRA DE SOUZA - **Matrícula:** UC23101446

---

## Como Executar a Aplicação Localmente

Para configurar e rodar o Hort+ em sua máquina local, siga as instruções abaixo para o Back-end e o Front-end.

### 1. Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:

* [**Node.js**](https://nodejs.org/) (versão 18.x ou superior recomendada)
* [**pnpm**](https://pnpm.io/installation) (gerenciador de pacotes para o front-end)
    ```bash
    npm install -g pnpm
    ```
* [**npm**](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (gerenciador de pacotes para o back-end, geralmente já incluído com o Node.js)

### 2. Configuração e Execução do Back-end (NestJS)

1.  **Navegue até o diretório do Back-end:**
    Abra seu terminal e acesse a pasta raiz do projeto NestJS:
    ```bash
    cd ./Back-End/
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configuração do Banco de Dados (SQLite):**
    O Hort+ utiliza SQLite. O TypeORM, configurado com `synchronize: true`, irá criar automaticamente o arquivo `hortplus.sqlite` na raiz do projeto na primeira execução bem-sucedida do servidor.
    * **Importante:** Se você encontrar erros de `SQLITE_CONSTRAINT` (ex: `NOT NULL constraint failed`) ao iniciar o back-end, pode ser necessário **deletar manualmente** o arquivo `hortplus.sqlite` (localizado na raiz da pasta `nest-app`) antes de reiniciar o servidor para que o TypeORM possa recriar o esquema do banco de dados corretamente.
4.  **Execute o Back-end em modo de desenvolvimento:**
    ```bash
    npm run start:dev
    ```
    O servidor da API estará disponível em `http://localhost:3001`.

### 3. Configuração e Execução do Front-end (Next.js)

1.  **Navegue até o diretório do Front-end:**
    Em um novo terminal, acesse a pasta raiz do projeto Next.js:
    ```bash
    cd ./Front-end/
    ```
2.  **Instale as dependências:**
    ```bash
    pnpm install
    ```
3.  **Execute o Front-end em modo de desenvolvimento:**
    ```bash
    pnpm dev
    ```
    O aplicativo estará disponível em `http://localhost:3000`.

### 4. Acessando a Aplicação

Com ambos os servidores (back-end na porta `3001` e front-end na porta `3000`) em execução, você pode acessar a aplicação pelo navegador:

* **Front-end:** `http://localhost:3000`
* **Back-end API (Exemplos de Endpoints):**
    * Produtos: `http://localhost:3001/produtos`
    * Pedidos: `http://localhost:3001/pedido`
    * Usuários: `http://localhost:3001/usuario`
    * Carrinhos: `http://localhost:3001/carrinho`

---

## Testes Automatizados (Back-end)

Para executar os testes unitários e e2e do back-end, navegue até o diretório do back-end e utilize os seguintes comandos:

```bash
# Executa os testes unitários
$ npm run test

# Executa os testes e2e (end-to-end)
$ npm run test:e2e

# Gera o relatório de cobertura de testes
$ npm run test:cov
