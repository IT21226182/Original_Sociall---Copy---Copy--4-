# risk_preprocessing.py
from translate import Translator
from langdetect import detect, DetectorFactory
import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Set a seed for consistent language detection
DetectorFactory.seed = 0

def translate_to_english(text):
    """
    Translates Sinhala and Tamil text to English.
    """
    try:
        # Detect the language of the input text
        try:
            lang = detect(text)
        except:
            lang = 'si'  # Fallback to Sinhala
        
        # Translate based on the detected language
        if lang == 'si':  # Sinhala
            translator = Translator(from_lang="si", to_lang="en")
        elif lang == 'ta':  # Tamil
            translator = Translator(from_lang="ta", to_lang="en")
        else:  # If the language is not Sinhala or Tamil, assume it's already in English
            return text
        
        translation = translator.translate(text)
        return translation
    except Exception as e:
        print(f"Translation error: {e}")
        return text  # Return original text if translation fails

def preprocessing_risk(df):
    """
    Preprocesses the input DataFrame for risk prediction.
    """
    label_encoder = LabelEncoder()

    # Apply translation and label encoding for text columns
    for column in df.columns:
        if df[column].dtype == 'object':  # Check if the column contains text data
            # Translate text to English
            df[column] = df[column].apply(translate_to_english)
            # Apply label encoding
            df[column] = label_encoder.fit_transform(df[column])
    
    return df