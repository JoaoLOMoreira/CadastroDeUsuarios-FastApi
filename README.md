# Cadastro de Usuarios com FastAPI

Este projeto e uma API simples feita com **FastAPI** para cadastro de usuarios.
Ela implementa um CRUD basico em memoria, ou seja:

- cria usuarios
- lista usuarios
- busca um usuario por ID
- atualiza um usuario
- remove um usuario

Tudo esta concentrado no arquivo [`main.py`](/c:/Users/thorh/CadastroDeUsuarios-FastApi/main.py).

## Sumario

- [Visao geral do projeto](#visao-geral-do-projeto)
- [O que e uma API](#o-que-e-uma-api)
- [O que e REST](#o-que-e-rest)
- [Conceitos importantes](#conceitos-importantes)
- [Como instalar](#como-instalar)
- [Como executar](#como-executar)
- [Como testar](#como-testar)
- [Explicacao completa da main.py](#explicacao-completa-da-mainpy)
- [Rotas da API](#rotas-da-api)
- [Status codes usados](#status-codes-usados)
- [Limites atuais do projeto](#limites-atuais-do-projeto)

## Visao geral do projeto

Essa API simula um pequeno sistema de cadastro de usuarios.
Ela nao usa banco de dados: os dados ficam salvos apenas em uma lista Python enquanto a aplicacao esta rodando.

Isso significa que:

- ao reiniciar o servidor, os usuarios sao perdidos
- os dados nao sao persistidos em disco
- o projeto e otimo para estudo de FastAPI e HTTP

## O que e uma API

**API** significa **Application Programming Interface**.

Na pratica, uma API e uma forma de um sistema conversar com outro sistema por meio de regras bem definidas.
Quando um frontend, app mobile, outro backend ou ferramenta de testes precisa enviar ou buscar dados, ele pode chamar uma API.

Exemplo neste projeto:

- um cliente envia um `POST /users` para cadastrar um novo usuario
- a API processa a requisicao
- a API devolve uma resposta em JSON com os dados do usuario criado

## O que e REST

**REST** e um estilo de arquitetura para criar APIs HTTP de forma organizada.

Em APIs REST, normalmente:

- cada recurso tem uma URL
- cada operacao usa um metodo HTTP apropriado
- os dados costumam trafegar em JSON
- a resposta retorna um status code indicando o resultado

Neste projeto, o recurso principal e:

- `users`

E as operacoes REST sao:

- `GET /users` para listar usuarios
- `GET /users/{user_id}` para buscar um usuario especifico
- `POST /users` para criar um usuario
- `PUT /users/{user_id}` para atualizar um usuario
- `DELETE /users/{user_id}` para remover um usuario

## Conceitos importantes

### GET

Usado para **buscar** dados.

Exemplos nesta API:

- `GET /users`
- `GET /users/1`

### POST

Usado para **criar** um novo recurso.

Exemplo nesta API:

- `POST /users`

### PUT

Usado para **atualizar** um recurso existente.

Exemplo nesta API:

- `PUT /users/1`

### DELETE

Usado para **remover** um recurso.

Exemplo nesta API:

- `DELETE /users/1`

### Request

**Request** e a requisicao que o cliente envia para a API.
Ela normalmente contem:

- o metodo HTTP, como `GET` ou `POST`
- a rota, como `/users`
- os headers
- o body, quando necessario

Exemplo de request desta API:

```http
POST /users
Content-Type: application/json
```

```json
{
  "name": "Ana",
  "email": "ana@example.com",
  "password": "123456"
}
```

### Response

**Response** e a resposta que a API devolve ao cliente depois de processar a request.
Ela normalmente contem:

- um status code, como `200` ou `404`
- um body em JSON

Exemplo de response desta API:

```http
200 OK
Content-Type: application/json
```

```json
{
  "id": 1,
  "name": "Ana",
  "email": "ana@example.com"
}
```

### Body

O **body** e o corpo da requisicao.
Nele enviamos os dados que a API precisa receber.

Exemplo de body JSON para criar um usuario:

```json
{
  "name": "Ana",
  "email": "ana@example.com",
  "password": "123456"
}
```

### JSON

**JSON** e um formato de texto muito usado para troca de dados entre sistemas.
Ele e leve, simples e facil de ler.

Exemplo de resposta JSON desta API:

```json
{
  "id": 1,
  "name": "Ana",
  "email": "ana@example.com"
}
```

### Status Code

O **status code** e o codigo HTTP que informa o resultado da requisicao.

Exemplos importantes:

- `200 OK`: a operacao deu certo
- `201 Created`: recurso criado com sucesso
- `404 Not Found`: recurso nao encontrado
- `422 Unprocessable Entity`: corpo da requisicao invalido
- `500 Internal Server Error`: erro interno no servidor

Observacao importante sobre este projeto:

- as rotas implementadas retornam `200 OK` quando a operacao da certo
- quando o usuario nao existe, a API retorna `404 Not Found`
- quando faltam campos obrigatorios no JSON enviado, o FastAPI retorna `422 Unprocessable Entity`

## Como instalar

### 1. Clonar o repositorio

```bash
git clone <URL_DO_REPOSITORIO>
cd CadastroDeUsuarios-FastApi
```

### 2. Criar um ambiente virtual

No Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

No Linux ou macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Instalar as dependencias

Como o projeto nao possui `requirements.txt` no momento, instale manualmente:

```bash
pip install fastapi uvicorn pydantic
```

## Como executar

Com o ambiente virtual ativado, rode:

```bash
uvicorn main:app --reload
```

Se tudo estiver correto, a API ficara disponivel em:

- `http://127.0.0.1:8000`

Documentacao automatica do FastAPI:

- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/redoc`

## Como testar

Este repositorio **nao possui testes automatizados** neste momento.
Mesmo assim, voce pode testar a API de tres formas bem simples.

### 1. Testar pelo navegador com Swagger

Depois de subir o servidor, acesse:

- `http://127.0.0.1:8000/docs`

La voce consegue:

- abrir cada rota
- preencher os dados
- executar requisicoes
- ver o JSON de resposta

### 2. Testar com cURL

Criar usuario:

```bash
curl -X POST "http://127.0.0.1:8000/users" -H "Content-Type: application/json" -d "{\"name\":\"Ana\",\"email\":\"ana@example.com\",\"password\":\"123456\"}"
```

Listar usuarios:

```bash
curl "http://127.0.0.1:8000/users"
```

Buscar usuario por ID:

```bash
curl "http://127.0.0.1:8000/users/1"
```

Atualizar usuario:

```bash
curl -X PUT "http://127.0.0.1:8000/users/1" -H "Content-Type: application/json" -d "{\"name\":\"Ana Maria\",\"email\":\"ana.maria@example.com\",\"password\":\"654321\"}"
```

Deletar usuario:

```bash
curl -X DELETE "http://127.0.0.1:8000/users/1"
```

### 3. Testar com PowerShell

Criar usuario:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8000/users" `
  -ContentType "application/json" `
  -Body '{"name":"Ana","email":"ana@example.com","password":"123456"}'
```

Listar usuarios:

```powershell
Invoke-RestMethod -Method Get -Uri "http://127.0.0.1:8000/users"
```

## Explicacao completa da main.py

Arquivo: [`main.py`](/c:/Users/thorh/CadastroDeUsuarios-FastApi/main.py)

### Importacoes

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
```

Essas linhas fazem o seguinte:

- `FastAPI`: cria a aplicacao web
- `HTTPException`: permite retornar erros HTTP, como `404`
- `BaseModel`: cria modelos de dados com validacao usando Pydantic
- `List`: informa que uma resposta pode ser uma lista de itens

### Criacao da aplicacao

```python
app = FastAPI()
```

Aqui a aplicacao FastAPI e criada.
O objeto `app` e a instancia principal da API.

### Banco de dados simulado

```python
users = []
user_id_counter = 1
```

Essas variaveis simulam um banco de dados:

- `users`: lista que armazena os usuarios em memoria
- `user_id_counter`: contador usado para gerar IDs unicos

### Modelo de entrada: User

```python
class User(BaseModel):
    name: str
    email: str
    password: str
```

Esse modelo define o que a API espera receber no body quando um usuario e criado ou atualizado.

Campos obrigatorios:

- `name`
- `email`
- `password`

Se algum desses campos nao for enviado, o FastAPI retorna `422`.

### Modelo de saida: UserResponse

```python
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
```

Esse modelo define o que sera devolvido ao cliente.
Repare que a `password` nao e retornada nas respostas, o que e uma boa pratica para nao expor esse dado na saida da API.

## Rotas da API

### 1. Criar usuario

Trecho em [`main.py`](/c:/Users/thorh/CadastroDeUsuarios-FastApi/main.py)

```python
@app.post("/users", response_model=UserResponse)
def create_user(user: User):
```

Funcao:

- recebe um usuario no body
- usa `global user_id_counter` para incrementar o ID fora do escopo da funcao
- gera um ID automatico
- salva o usuario na lista `users`
- retorna apenas `id`, `name` e `email`

Exemplo de requisicao:

```http
POST /users
Content-Type: application/json
```

```json
{
  "name": "Ana",
  "email": "ana@example.com",
  "password": "123456"
}
```

Exemplo de resposta:

```json
{
  "id": 1,
  "name": "Ana",
  "email": "ana@example.com"
}
```

### 2. Listar usuarios

Trecho em [`main.py`](/c:/Users/thorh/CadastroDeUsuarios-FastApi/main.py)

```python
@app.get("/users", response_model=List[UserResponse])
def list_users():
```

Funcao:

- retorna todos os usuarios cadastrados
- remove a senha da resposta

Exemplo de resposta:

```json
[
  {
    "id": 1,
    "name": "Ana",
    "email": "ana@example.com"
  }
]
```

Se nao houver usuarios cadastrados, a resposta esperada e:

```json
[]
```

### 3. Buscar usuario por ID

Trecho em [`main.py`](/c:/Users/thorh/CadastroDeUsuarios-FastApi/main.py)

```python
@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int):
```

Funcao:

- procura um usuario pelo `id`
- se encontrar, retorna os dados desse usuario
- se nao encontrar, retorna erro `404`

Exemplo de sucesso:

```json
{
  "id": 1,
  "name": "Ana",
  "email": "ana@example.com"
}
```

Exemplo quando o usuario nao existe:

```json
{
  "detail": "User not found"
}
```

### 4. Atualizar usuario

Trecho em [`main.py`](/c:/Users/thorh/CadastroDeUsuarios-FastApi/main.py)

```python
@app.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: User):
```

Funcao:

- recebe um novo body com `name`, `email` e `password`
- procura o usuario pelo ID
- atualiza os dados
- retorna os dados atualizados sem a senha

Exemplo de body:

```json
{
  "name": "Ana Maria",
  "email": "ana.maria@example.com",
  "password": "654321"
}
```

Resposta:

```json
{
  "id": 1,
  "name": "Ana Maria",
  "email": "ana.maria@example.com"
}
```

Se o usuario nao existir:

```json
{
  "detail": "User not found"
}
```

### 5. Deletar usuario

Trecho em [`main.py`](/c:/Users/thorh/CadastroDeUsuarios-FastApi/main.py)

```python
@app.delete("/users/{user_id}")
def delete_user(user_id: int):
```

Funcao:

- procura o usuario pelo ID
- remove o usuario da lista
- retorna uma mensagem simples de confirmacao

Resposta em caso de sucesso:

```json
{
  "message": "User deleted"
}
```

Resposta em caso de erro:

```json
{
  "detail": "User not found"
}
```

## Status codes usados

### `200 OK`

Usado quando a operacao foi concluida com sucesso.
Nesta API, isso acontece em:

- `GET /users`
- `GET /users/{user_id}` quando o usuario existe
- `POST /users`
- `PUT /users/{user_id}` quando o usuario existe
- `DELETE /users/{user_id}` quando o usuario existe

Exemplo:

```json
{
  "message": "User deleted"
}
```

### `404 Not Found`

Usado quando o usuario solicitado nao foi encontrado.

Exemplo:

```json
{
  "detail": "User not found"
}
```

### `422 Unprocessable Entity`

Usado quando o JSON enviado nao possui todos os campos obrigatorios.

Exemplo de body invalido:

```json
{
  "name": "SemEmail"
}
```

Exemplo de resposta:

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "email"],
      "msg": "Field required"
    }
  ]
}
```

## Limites atuais do projeto

Apesar de ser um bom exemplo para estudo, esse projeto ainda tem algumas limitacoes importantes:

- os dados ficam apenas em memoria
- nao existe banco de dados real
- a senha e armazenada em texto puro na memoria
- nao ha validacao extra, como checagem de email duplicado
- nao existe suite de testes automatizados
- a rota de criacao retorna `200`, embora em APIs REST seja comum usar `201 Created`

## Melhorias futuras sugeridas

- adicionar `requirements.txt`
- criar testes automatizados com `pytest`
- usar banco de dados real, como SQLite ou PostgreSQL
- armazenar senha com hash
- validar email unico
- retornar `201 Created` na criacao de usuario
