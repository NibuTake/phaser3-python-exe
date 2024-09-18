from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
import uvicorn
import multiprocessing

# FastAPIのインスタンスを作成
app = FastAPI()

# データモデルを定義（POSTリクエストで使う）
class Item(BaseModel):
    name: str
    price: float
    description: str | None = None

# ルートエンドポイントを作成 (GETリクエスト)
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

# アイテムを取得するエンドポイントを作成 (GETリクエスト)
@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

# アイテムを作成するエンドポイントを作成 (POSTリクエスト)
@app.post("/items/")
def create_item(item: Item):
    return {"name": item.name, "price": item.price, "description": item.description}

# FastAPIアプリの実行方法
# uvicornを使ってアプリを実行するには、以下のコマンドをターミナルで実行してください。
# uvicorn main:app --reload

origins = [
    "http://localhost",
    "http://localhost:8080",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == '__main__':
    multiprocessing.freeze_support()  # For Windows support
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False, workers=1)