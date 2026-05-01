# Agent Instructions

## Project Overview
A web application for a specialty and souvenir products store. It consists of a FastAPI backend and a vanilla JavaScript/HTML/CSS frontend.

## Tech Stack
- **Backend**: Python, FastAPI, SQLAlchemy, Uvicorn
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Database**: SQLite (`backend/shop.db`)

## Project Structure
- `backend/`: FastAPI application code.
  - `main.py`: API endpoints and application entry point.
  - `db.py`: Database models and session management.
  - `requirements.txt`: Python dependencies.
- `scripts/`: Client-side JavaScript logic.
  - `catalog.js`: Product filtering and catalog management.
  - `cart.js`: Shopping cart functionality.
  - `product-page.js`: Product detail page logic.
- `style/`: CSS stylesheets.
  - `style.css`: Global styles.
  - `product-page.css`: Styles specific to the product detail page.
- `img/`: Product and UI images.
- `index.html`: Main catalog page (Frontend entry point).
- `product.html`: Product detail page.

## Development Workflow

### Backend Setup & Running
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Start the server: `python main.py`

### Frontend Setup & Running
- Open `index.html` directly in a web browser.

## Key Notes
- The backend uses SQLite. The database file is located at `backend/shop.db`.
- CORS is configured in `backend/main.py` to allow all origins (`["*"]`) for development purposes.
- The frontend communicates with the backend via JSON API calls.
