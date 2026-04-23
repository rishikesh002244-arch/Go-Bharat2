import os
os.chdir(r'c:\Users\rishi\OneDrive\Desktop\health\healthcare-chatbot')

import streamlit as st
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
import numpy as np
import pickle

# Load saved data
with open('models.pkl', 'rb') as f:
    clf, model, le, cols, reduced_data, description_list, precautionDictionary, severityDictionary = pickle.load(f)

# Symptoms list
symptoms = list(cols)

# Function to predict
def sec_predict(symptoms_exp):
    df = pd.read_csv('Data/Training.csv')
    X = df.iloc[:, :-1]
    y = df['prognosis']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=20)
    rf_clf = DecisionTreeClassifier()
    rf_clf.fit(X_train, y_train)

    symptoms_dict = {symptom: index for index, symptom in enumerate(X)}
    input_vector = np.zeros(len(symptoms_dict))
    for item in symptoms_exp:
        if item in symptoms_dict:
            input_vector[symptoms_dict[item]] = 1

    return rf_clf.predict([input_vector])[0]

# Streamlit app
st.title("Healthcare ChatBot")

st.write("Select the symptoms you are experiencing:")

selected_symptoms = st.multiselect("Symptoms", symptoms)

if st.button("Diagnose"):
    if selected_symptoms:
        prediction = sec_predict(selected_symptoms)
        st.write(f"You may have: {prediction}")
        if prediction in description_list:
            st.write(f"Description: {description_list[prediction]}")
        if prediction in precautionDictionary:
            st.write("Precautions:")
            for i, prec in enumerate(precautionDictionary[prediction], 1):
                st.write(f"{i}. {prec}")
    else:
        st.write("Please select at least one symptom.")