class DataTransformer:
    @staticmethod
    def transform_trades(rows):
        trades = []
        for row in rows[1:]:  # Skip header row
            if len(row) >= 7:
                trade = {
                    "timestamp": row[0],
                    "symbol": row[1],
                    "closePrice": float(row[2]) if row[2] else 0,
                    "position": row[3],
                    "entryPrice": float(row[4]) if row[4] else 0,
                    "pnlPercentage": float(row[5]) if row[5] else 0,
                    "cumulativeROI": float(row[6]) if row[6] else 0
                }
                trades.append(trade)
        return trades

    @staticmethod
    def transform_metrics(last_row):
        return {
            "winRate": float(last_row[7]) if len(last_row) > 7 else 0,
            "totalTrades": int(last_row[8]) if len(last_row) > 8 else 0,
            "accountValue": float(last_row[9]) if len(last_row) > 9 else 0,
            "stopLoss": float(last_row[10]) if len(last_row) > 10 else 0,
            "largestWin": float(last_row[11]) if len(last_row) > 11 else 0,
            "largestLoss": float(last_row[12]) if len(last_row) > 12 else 0,
            "averageWin": float(last_row[13]) if len(last_row) > 13 else 0,
            "averageLoss": float(last_row[14]) if len(last_row) > 14 else 0,
            "profitFactor": float(last_row[15]) if len(last_row) > 15 else 0,
            "sharpeRatio": float(last_row[16]) if len(last_row) > 16 else 0
        }