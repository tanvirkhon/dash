from flask import Flask
from flask_cors import CORS
from routes.trading_routes import trading_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(trading_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(port=3001, debug=True)