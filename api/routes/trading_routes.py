from flask import Blueprint, jsonify
from ..services.supabase_manager import SupabaseManager

trading_bp = Blueprint('trading', __name__)

@trading_bp.route('/api/trading-data')
async def get_trading_data():
    try:
        # Initialize Supabase manager
        supabase = SupabaseManager()
        
        # Fetch trades
        trades = await supabase.get_trade_history(limit=100)
        
        if not trades:
            return jsonify({"error": "No data found"}), 404
            
        # Get latest trade for metrics
        latest_trade = trades[0]
        
        # Calculate metrics
        winning_trades = [t for t in trades if t['pnl_percent'] > 0]
        win_rate = (len(winning_trades) / len(trades)) * 100
        
        metrics = {
            'accountValue': latest_trade['account_value'],
            'totalTrades': len(trades),
            'winRate': win_rate,
            'averageWin': sum(t['pnl_percent'] for t in winning_trades) / len(winning_trades) if winning_trades else 0,
            'averageLoss': sum(t['pnl_percent'] for t in trades if t['pnl_percent'] < 0) / len([t for t in trades if t['pnl_percent'] < 0]) if any(t['pnl_percent'] < 0 for t in trades) else 0,
            'largestWin': max(t['pnl_percent'] for t in trades),
            'largestLoss': min(t['pnl_percent'] for t in trades),
            'profitFactor': sum(t['pnl_percent'] for t in winning_trades) / abs(sum(t['pnl_percent'] for t in trades if t['pnl_percent'] < 0)) if any(t['pnl_percent'] < 0 for t in trades) else float('inf'),
            'sharpeRatio': calculate_sharpe_ratio(trades),
            'stopLoss': 2.5
        }
        
        return jsonify({
            "trades": trades,
            "metrics": metrics
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def calculate_sharpe_ratio(trades):
    """Calculate Sharpe Ratio from trade history"""
    if not trades:
        return 0
        
    returns = [t['pnl_percent'] for t in trades]
    avg_return = sum(returns) / len(returns)
    
    # Calculate standard deviation
    variance = sum((r - avg_return) ** 2 for r in returns) / len(returns)
    std_dev = variance ** 0.5
    
    # Annualized Sharpe Ratio (assuming daily trading)
    if std_dev == 0:
        return 0
    return (avg_return / std_dev) * (252 ** 0.5)  # Annualized