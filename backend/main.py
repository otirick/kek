from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse
import db
from sqlalchemy.orm import Session
import uvicorn
from pydantic import BaseModel, ConfigDict
from typing import Optional

app = FastAPI()
db.init_db()


# --- Pydantic модели ---

class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category: Optional[str] = None
    count: int

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = ""
    category: Optional[str] = None
    count: int = 0


class CartOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    product_id: int
    count: int

class CartCreate(BaseModel):
    product_id: int
    count: int = 1


class ReviewOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    content: str
    username: str
    rating: int

class ReviewCreate(BaseModel):
    content: str
    username: str
    rating: int


# --- Helper ---

def to_dict(obj):
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}

def not_found():
    raise HTTPException(status_code=404, detail="Не найден")


# ======================== PRODUCTS ========================

@app.get('/products')
def get_products(category: str = None, page: int = 1, limit: int = 10, session: Session = Depends(db.get_session)):
    query = session.query(db.Product)
    if category and category != 'all':
        query = query.filter(db.Product.category == category)
    products = query.limit(limit).offset((page - 1) * limit).all()
    return JSONResponse(status_code=200, content=[to_dict(p) for p in products])

@app.get('/products/{product_id}')
def get_product(product_id: int, session: Session = Depends(db.get_session)):
    product = session.query(db.Product).filter(db.Product.id == product_id).first()
    if not product:
        raise not_found()
    return JSONResponse(status_code=200, content=to_dict(product))

@app.post('/products')
def create_product(data: ProductCreate, session: Session = Depends(db.get_session)):
    product = db.Product(**data.model_dump())
    session.add(product)
    session.commit()
    session.refresh(product)
    return JSONResponse(status_code=201, content=to_dict(product))

@app.put('/products/{product_id}')
def update_product(product_id: int, data: ProductCreate, session: Session = Depends(db.get_session)):
    product = session.query(db.Product).filter(db.Product.id == product_id).first()
    if not product:
        raise not_found()
    for key, value in data.model_dump().items():
        setattr(product, key, value)
    session.commit()
    session.refresh(product)
    return JSONResponse(status_code=200, content=to_dict(product))

@app.delete('/products/{product_id}')
def delete_product(product_id: int, session: Session = Depends(db.get_session)):
    product = session.query(db.Product).filter(db.Product.id == product_id).first()
    if not product:
        raise not_found()
    session.delete(product)
    session.commit()
    return JSONResponse(status_code=200, content={"message": "Удалено"})


# ======================== CART ========================

@app.get('/cart')
def get_cart(session: Session = Depends(db.get_session)):
    items = session.query(db.Cart).all()
    return JSONResponse(status_code=200, content=[to_dict(item) for item in items])

@app.get('/cart/{cart_id}')
def get_cart_item(cart_id: int, session: Session = Depends(db.get_session)):
    item = session.query(db.Cart).filter(db.Cart.id == cart_id).first()
    if not item:
        raise not_found()
    return JSONResponse(status_code=200, content=to_dict(item))

@app.post('/cart')
def add_to_cart(data: CartCreate, session: Session = Depends(db.get_session)):
    # Проверяем существование товара
    product = session.query(db.Product).filter(db.Product.id == data.product_id).first()
    if not product:
        raise not_found()
    item = db.Cart(**data.model_dump())
    session.add(item)
    session.commit()
    session.refresh(item)
    return JSONResponse(status_code=201, content=to_dict(item))

@app.put('/cart/{cart_id}')
def update_cart_item(cart_id: int, data: CartCreate, session: Session = Depends(db.get_session)):
    item = session.query(db.Cart).filter(db.Cart.id == cart_id).first()
    if not item:
        raise not_found()
    item.product_id = data.product_id
    item.count = data.count
    session.commit()
    session.refresh(item)
    return JSONResponse(status_code=200, content=to_dict(item))

@app.delete('/cart/{cart_id}')
def remove_from_cart(cart_id: int, session: Session = Depends(db.get_session)):
    item = session.query(db.Cart).filter(db.Cart.id == cart_id).first()
    if not item:
        raise not_found()
    session.delete(item)
    session.commit()
    return JSONResponse(status_code=200, content={"message": "Удалено"})

@app.delete('/cart')
def clear_cart(session: Session = Depends(db.get_session)):
    session.query(db.Cart).delete()
    session.commit()
    return JSONResponse(status_code=200, content={"message": "Корзина очищена"})


# ======================== REVIEWS ========================

@app.get('/reviews')
def get_reviews(page: int = 1, limit: int = 10, session: Session = Depends(db.get_session)):
    reviews = session.query(db.Review).order_by(db.Review.id.desc()).limit(limit).offset((page - 1) * limit).all()
    return JSONResponse(status_code=200, content=[to_dict(r) for r in reviews])

@app.get('/reviews/{review_id}')
def get_review(review_id: int, session: Session = Depends(db.get_session)):
    review = session.query(db.Review).filter(db.Review.id == review_id).first()
    if not review:
        raise not_found()
    return JSONResponse(status_code=200, content=to_dict(review))

@app.post('/reviews')
def create_review(data: ReviewCreate, session: Session = Depends(db.get_session)):
    if data.rating < 1 or data.rating > 5:
        raise HTTPException(status_code=400, detail="Рейтинг от 1 до 5")
    review = db.Review(**data.model_dump())
    session.add(review)
    session.commit()
    session.refresh(review)
    return JSONResponse(status_code=201, content=to_dict(review))

@app.put('/reviews/{review_id}')
def update_review(review_id: int, data: ReviewCreate, session: Session = Depends(db.get_session)):
    review = session.query(db.Review).filter(db.Review.id == review_id).first()
    if not review:
        raise not_found()
    for key, value in data.model_dump().items():
        setattr(review, key, value)
    session.commit()
    session.refresh(review)
    return JSONResponse(status_code=200, content=to_dict(review))

@app.delete('/reviews/{review_id}')
def delete_review(review_id: int, session: Session = Depends(db.get_session)):
    review = session.query(db.Review).filter(db.Review.id == review_id).first()
    if not review:
        raise not_found()
    session.delete(review)
    session.commit()
    return JSONResponse(status_code=200, content={"message": "Удалено"})


if __name__ == '__main__':
    uvicorn.run(app)
