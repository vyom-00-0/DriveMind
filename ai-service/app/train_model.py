import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split


DATA_PATH = "data/intent_training_data.csv"
MODEL_PATH = "models/intent_model.joblib"


def main():
    df = pd.read_csv(DATA_PATH)

    features = [
        "speed",
        "acceleration",
        "brakePressure",
        "steeringAngle",
        "laneOffset",
        "distanceToFrontVehicle"
    ]

    X = df[features]
    y = df["intent"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        class_weight="balanced"
    )

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)

    print("Intent Prediction Model Trained")
    print(f"Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    joblib.dump(model, MODEL_PATH)
    print(f"\nModel saved to {MODEL_PATH}")


if __name__ == "__main__":
    main()