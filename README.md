# CRUD de Alunos - PDMO

Aplicativo de **Cadastro de Alunos (CRUD)** desenvolvido para a disciplina de **Programação para Dispositivos Móveis (PDMO)**.

## 📱 Funcionalidades

O aplicativo contempla os quatro recursos do CRUD:

- **CREATE (Cadastrar):** Cadastro de novos alunos informando nome e curso com validação de campos obrigatórios e geração de ID único.
- **READ (Consultar):** Exibição da lista de alunos matriculados com identificador (`#id`), nome e curso.
- **UPDATE (Editar):** Seleção de um aluno para carregar seus dados no formulário, alteração e salvamento usando `map()`.
- **DELETE (Excluir):** Remoção do aluno selecionado da lista utilizando `filter()`.

## 🚀 Modos de Operação

1. **Fase 1 (CRUD Local):** Gerenciamento de estado na memória local utilizando `useState`, ideal para ambientes de laboratório sem conexão com internet/servidor.
2. **Fase 2 (Modo API HTTP):** Simulação de requisições assíncronas com `fetch`, `async/await`, indicador de carregamento (*ActivityIndicator*) e verbos HTTP:
   - `POST` /api/alunos (Cadastrar)
   - `GET` /api/alunos (Consultar)
   - `PUT` /api/alunos/:id (Editar)
   - `DELETE` /api/alunos/:id (Excluir)

## 🎨 Identidade Visual

- Estilização moderna e clean com Tailwind CSS.
- Paleta personalizada com a cor principal `#341539`.
- Tipografia configurada com *Plus Jakarta Sans* e *JetBrains Mono*.

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Lucide React** (Ícones)

## 💻 Como Executar

```bash
# Instalar as dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```
