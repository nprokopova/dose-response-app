from flask import request, jsonify
import pandas as pd
from typing import List
import numpy as np

def upload_csv():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    try:
        df = pd.read_csv(file)
    except Exception as e:
        return jsonify({"error": f"Invalid CSV: {str(e)}"}), 400

    if 'x' not in df.columns or 'y' not in df.columns:
        return jsonify({"error": "CSV must contain 'x' and 'y' columns"}), 400

    df['x'] = df['x'].apply(lambda val: np.log(val) if val > 0 else 0)
    x = df['x'].astype(float).tolist()
    y = df['y'].astype(float).tolist()

    return perform_regression(x, y, df)

def regress():
    data = request.get_json()
    points = data.get("points", [])
    if not points:
        return jsonify({"error": "No points provided"}), 400

    x = [p["x"] for p in points]
    y = [p["y"] for p in points]

    return perform_regression(x, y)

def perform_regression(x: List[float], y: List[float], df=None):
    slope, intercept = linear_regression(x, y)
    points = [{"x": xi, "y": yi} for xi, yi in zip(x, y)] if df is None else [
        {"x": row["x"], "y": row["y"]} for _, row in df.iterrows()
    ]

    return jsonify({
        "points": points,
        "slope": slope,
        "intercept": intercept
    })

def linear_regression(x: List[float], y: List[float]):
    n = len(x)
    if n == 0:
        return 0.0, 0.0

    sum_x = sum(x)
    sum_y = sum(y)
    sum_xy = sum(x[i] * y[i] for i in range(n))
    sum_x2 = sum(xi * xi for xi in x)

    denominator = n * sum_x2 - sum_x ** 2
    if denominator == 0:
        return 0.0, 0.0

    slope = (n * sum_xy - sum_x * sum_y) / denominator
    intercept = (sum_y - slope * sum_x) / n

    return slope, intercept