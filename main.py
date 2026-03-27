from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Simulando banco de dados
users = []
user_id_counter = 1


class User(BaseModel):
    name: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str


# Criar usuário
@app.post("/users", response_model=UserResponse)
def create_user(user: User):
    global user_id_counter

    new_user = {
        "id": user_id_counter,
        "name": user.name,
        "email": user.email,
        "password": user.password
    }

    users.append(new_user)
    user_id_counter += 1

    return {"id": new_user["id"], "name": new_user["name"], "email": new_user["email"]}


# Listar usuários
@app.get("/users", response_model=List[UserResponse])
def list_users():
    return [{"id": u["id"], "name": u["name"], "email": u["email"]} for u in users]


# Buscar usuário por id
@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int):
    for user in users:
        if user["id"] == user_id:
            return {"id": user["id"], "name": user["name"], "email": user["email"]}

    raise HTTPException(status_code=404, detail="User not found")


# Atualizar usuário
@app.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: User):
    for u in users:
        if u["id"] == user_id:
            u["name"] = user.name
            u["email"] = user.email
            u["password"] = user.password

            return {"id": u["id"], "name": u["name"], "email": u["email"]}

    raise HTTPException(status_code=404, detail="User not found")


# Deletar usuário
@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    for index, user in enumerate(users):
        if user["id"] == user_id:
            users.pop(index)
            return {"message": "User deleted"}

    raise HTTPException(status_code=404, detail="User not found")