from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base

engine = create_engine("sqlite:///shop.db", echo=False)

Base = declarative_base()

class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    category = Column(String, nullable=True)
    count = Column(Integer, nullable=False, default=0)


class Cart(Base):
    __tablename__ = "cart"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    count = Column(Integer, nullable=False, default=1)


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(String, nullable=False)
    username = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)


def init_db():
    Base.metadata.create_all(engine)


SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_session():
    """
    Генератор сессии для Depends в FastAPI.
    Автоматически закрывает сессию после запроса.

    ИНТЕГРАЦИЯ С FASTAPI:

    ```python
    from fastapi import FastAPI, Depends
    from sqlalchemy.orm import Session
    import db

    app = FastAPI()

    @app.on_event("startup")
    def startup():
        db.init_db()

    @app.get("/products")
    def get_products(session: Session = Depends(db.get_session)):
        return session.query(db.Product).all()

    @app.post("/products")
    def create_product(product: ProductCreate, session: Session = Depends(db.get_session)):
        new_product = db.Product(**product.model_dump())
        session.add(new_product)
        session.commit()
        session.refresh(new_product)
        return new_product

    @app.delete("/products/{product_id}")
    def delete_product(product_id: int, session: Session = Depends(db.get_session)):
        product = session.query(db.Product).filter(db.Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Не найден")
        session.delete(product)
        session.commit()
        return {"message": "Удалено"}

    # Пагинация с limit и offset:
    @app.get("/products")
    def get_products(limit: int = 10, offset: int = 0, session: Session = Depends(db.get_session)):
        return session.query(db.Product).limit(limit).offset(offset).all()

    # Возврат кастомного JSON-ответа:
    from fastapi.responses import JSONResponse

    @app.post("/products")
    def create_product(product: ProductCreate, session: Session = Depends(db.get_session)):
        new_product = db.Product(**product.model_dump())
        session.add(new_product)
        session.commit()
        session.refresh(new_product)
        return JSONResponse(
            status_code=201,
            content={"id": new_product.id, "name": new_product.name}
        )
    ```
    """
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()