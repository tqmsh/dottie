

def assess_symptoms(symptoms):
    # Simple symptom assessment logic (can be expanded)
    normal_symptoms = ["cramps", "headaches", "bloating", "mood swings"]
    
    abnormal_symptoms = ["heavy bleeding", "irregular cycles", "severe pain", "missed periods"]
    
    # Checking if the symptoms fall into the normal or abnormal categories
    normal = [symptom for symptom in symptoms if symptom in normal_symptoms]
    abnormal = [symptom for symptom in symptoms if symptom in abnormal_symptoms]
    
    if abnormal:
        return "Warning: You might want to consult a healthcare provider for the following symptoms: " + ", ".join(abnormal)
    elif normal:
        return "These symptoms seem normal. Continue to track them and monitor any changes."
    else:
        return "It is recommended to track these symptoms and seek advice from a healthcare provider if they persist."
from datetime import datetime

# A simple dictionary to store the period data
period_data = []

def track_period(start_date, symptoms):
    today = datetime.today().strftime('%Y-%m-%d')  # Get today's date
    period_data.append({
        'start_date': start_date,
        'symptoms': symptoms,
        'tracked_on': today
    })

def view_period_history():
    for period in period_data:
        print(f"Period Start: {period['start_date']}, Symptoms: {', '.join(period['symptoms'])}, Tracked On: {period['tracked_on']}")
def provide_education(topic):
    educational_content = {
        "normal_cycle": "A normal menstrual cycle is between 21 to 35 days. Periods typically last from 3 to 7 days.",
        "irregular_cycles": "Irregular cycles can occur due to stress, hormonal imbalances, or conditions like PCOS.",
        "heavy_bleeding": "Heavy bleeding (menorrhagia) could indicate health issues such as fibroids or hormonal imbalance."
    }

    return educational_content.get(topic, "I don't have information on that topic yet.")
def main():
    print("Hello, I am Dottie, your friendly period assistant!")
    
    user_name = input("What's your name? ")
    print(f"Hi, {user_name}! Let's get started with tracking your period.")

    start_date = input("Enter your period start date (YYYY-MM-DD): ")
    symptoms = input("List any symptoms you're experiencing (comma separated): ").split(",")
    
    # Symptom assessment
    assessment = assess_symptoms(symptoms)
    print(assessment)
    
    # Track the period data
    track_period(start_date, symptoms)
    
    # Ask if the user wants to learn about menstrual health
    educate = input("Would you like to learn more about menstrual health? (yes/no): ").lower()
    if educate == "yes":
        topic = input("What would you like to know about? (normal_cycle, irregular_cycles, heavy_bleeding): ").lower()
        print(provide_education(topic))
    
    # Show the tracked period history
    view_period_history()

if __name__ == "__main__":
    main()
