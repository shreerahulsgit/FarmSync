import pandas as pd
import pickle
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split

df = pd.read_csv("Crop_recommendation.csv")

X = df.iloc[:, :-1]  # Features
y = df.iloc[:, -1]   # Target (Crop type)


le = LabelEncoder()
y = le.fit_transform(y)

with open("labelencoder.pkl", "wb") as f:
    pickle.dump(le, f)


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


model = DecisionTreeClassifier()
model.fit(X_train, y_train)

with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model training complete. Saved model and label encoder.")

import pandas as pd
import pickle
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split

df = pd.read_csv("Crop_recommendation.csv")

X = df.iloc[:, :-1]  # Features
y = df.iloc[:, -1]   # Target (Crop type)


le = LabelEncoder()
y = le.fit_transform(y)

with open("labelencoder.pkl", "wb") as f:
    pickle.dump(le, f)


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


model = DecisionTreeClassifier()
model.fit(X_train, y_train)

with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model training complete. Saved model and label encoder.")



