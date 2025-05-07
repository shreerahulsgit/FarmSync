import numpy as np
import sys
import os
import pickle
import warnings

warnings.filterwarnings("ignore")

model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
with open(model_path, "rb") as f:
    model = pickle.load(f)

labelencoder_path = os.path.join(os.path.dirname(__file__), "labelencoder.pkl")
with open(labelencoder_path, "rb") as f:
    le = pickle.load(f)

try:
    # Ensure at least some input is given
    if len(sys.argv) < 2:
        print("Usage: python predict.py <feature1> <feature2> ... <featureN>")
        sys.exit(1)

    # Convert command-line arguments to float
    args = [float(x) for x in sys.argv[1:]]
    input_data = np.array([args])

    # Predict
    output = model.predict(input_data)
    predicted_crop = le.inverse_transform(output)[0]  # Convert label index back to crop name

    print(predicted_crop)
except Exception as e:
    print(f"Error: {str(e)}")