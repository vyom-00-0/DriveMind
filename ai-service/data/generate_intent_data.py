import random
import pandas as pd


def generate_sample():
    speed = random.uniform(0, 100)
    acceleration = random.uniform(-4, 3)
    brake_pressure = random.uniform(0, 1)
    steering_angle = random.uniform(-35, 35)
    lane_offset = random.uniform(-1, 1)
    distance_to_front_vehicle = random.uniform(2, 80)

    intent = "normal"

    if brake_pressure > 0.7 and acceleration < -1:
        intent = "brake"
    elif steering_angle > 15 and speed > 20:
        intent = "turn_right"
    elif steering_angle < -15 and speed > 20:
        intent = "turn_left"
    elif abs(lane_offset) > 0.6 and abs(steering_angle) > 8:
        intent = "lane_change"
    elif acceleration > 1.5 and brake_pressure < 0.3:
        intent = "accelerate"

    return {
        "speed": round(speed, 2),
        "acceleration": round(acceleration, 2),
        "brakePressure": round(brake_pressure, 2),
        "steeringAngle": round(steering_angle, 2),
        "laneOffset": round(lane_offset, 2),
        "distanceToFrontVehicle": round(distance_to_front_vehicle, 2),
        "intent": intent
    }


def main():
    samples = [generate_sample() for _ in range(5000)]
    df = pd.DataFrame(samples)
    df.to_csv("data/intent_training_data.csv", index=False)
    print("Generated data/intent_training_data.csv")
    print(df["intent"].value_counts())


if __name__ == "__main__":
    main()