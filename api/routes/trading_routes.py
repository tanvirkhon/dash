from flask import Blueprint, jsonify
from ..services.sheets_service import SheetsService
from ..services.data_transformer import DataTransformer

trading_bp = Blueprint('trading', __name__)

@trading_bp.route('/api/trading-data')
def get_trading_data():
    try:
        # Fetch data from Google Sheets
        values = SheetsService.get_sheet_data()
        
        if not values:
            return jsonify({"error": "No data found"}), 404
            
        # Transform data
        trades = DataTransformer.transform_trades(values)
        metrics = DataTransformer.transform_metrics(values[-1])
        
        return jsonify({
            "trades": trades,
            "metrics": metrics
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500