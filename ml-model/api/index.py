import os
import sys

# Add parent directory to sys.path so server module can be loaded
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from server import PredictionHandler

# Vercel Python Serverless Function entry point
handler = PredictionHandler
