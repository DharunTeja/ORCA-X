"""
ORCA-X Regional Language Translation and Localization Engine
Supported Languages: English (en), Telugu (te), Hindi (hi), Tamil (ta), Kannada (kn), Malayalam (ml)
"""

from typing import Dict, Any, Optional

LANGUAGE_NAMES = {
    "en": "English",
    "te": "తెలుగు (Telugu)",
    "hi": "हिन्दी (Hindi)",
    "ta": "தமிழ் (Tamil)",
    "kn": "ಕನ್ನಡ (Kannada)",
    "ml": "മലയാളം (Malayalam)"
}

# Core maritime terminology dictionary across the 6 regional languages
LOCALIZED_TERMS: Dict[str, Dict[str, str]] = {
    "pfz_safe": {
        "en": "Potential Fishing Zone (PFZ) advisory is active. Favorable ocean front detected with high chlorophyll concentration.",
        "te": "సంభావ్య మత్స్య జోన్ (PFZ) సలహా క్రియాశీలకంగా ఉంది. అధిక క్లోరోఫిల్ ఏకాగ్రతతో అనుకూలమైన సముద్ర ముఖభాగం కనుగొనబడింది.",
        "hi": "संभावित मत्स्य पालन क्षेत्र (PFZ) परामर्श सक्रिय है। उच्च क्लोरोफिल सांद्रता वाला अनुकूल समुद्री मोर्चा पाया गया।",
        "ta": "சாத்தியமான மீன்பிடி மண்டல (PFZ) ஆலோசனை செயல்பாட்டில் உள்ளது. அதிக குளோரோபில் செறிவுடன் சாதகமான கடல் பகுதி கண்டறியப்பட்டுள்ளது.",
        "kn": "ಸಂಭಾವ್ಯ ಮೀನುಗಾರಿಕೆ ವಲಯ (PFZ) ಸಲಹೆ ಸಕ್ರಿಯವಾಗಿದೆ. ಹೆಚ್ಚಿನ ಕ್ಲೋರೊಫಿಲ್ ಸಾಂದ್ರತೆಯೊಂದಿಗೆ ಅನುಕೂಲಕರ ಸಾಗರ ಮುಂಭಾಗ ಕಂಡುಬಂದಿದೆ.",
        "ml": "സാധ്യതയുള്ള മത്സ്യബന്ധന മേഖല (PFZ) ഉപദേശം സജീവമാണ്. ഉയർന്ന ക്ലോറോഫിൽ സാന്ദ്രതയുള്ള അനുകൂലമായ സമുദ്ര മുൻഭാഗം കണ്ടെത്തി."
    },
    "cyclone_warning": {
        "en": "CRITICAL CYCLONE ALERT: Deep depression detected in marine sector. Fishermen are strictly advised not to venture into deep sea.",
        "te": "తీవ్ర తుఫాను హెచ్చరిక: సముద్ర రంగంలో తీవ్ర వాయుగుండం గుర్తించబడింది. మత్స్యకారులు లోతైన సముద్రంలోకి వెళ్లవద్దని ఖచ్చితంగా సూచించబడింది.",
        "hi": "गंभीर चक्रवात चेतावनी: समुद्री क्षेत्र में गहरा अवसाद देखा गया। मछुआरों को गहरे समुद्र में न जाने की सख्त सलाह दी जाती है।",
        "ta": "தீவிர புயல் எச்சரிக்கை: கடல் பகுதியில் ஆழ்ந்த காற்றழுத்த தாழ்வு மண்டலம் உருவாகியுள்ளது. மீனவர்கள் ஆழ்கடலுக்குச் செல்ல வேண்டாம் என்று எச்சரிக்கப்படுகிறார்கள்.",
        "kn": "ತೀವ್ರ ಚಂಡಮಾರುತ ಎಚ್ಚರಿಕೆ: ಸಮುದ್ರ ವಲಯದಲ್ಲಿ ತೀವ್ರ ವಾಯುಭಾರ ಕುಸಿತ ಪತ್ತೆಯಾಗಿದೆ. ಮೀನುಗಾರರು ಆಳ ಸಮುದ್ರಕ್ಕೆ ಇಳಿಯದಂತೆ ಕಟ್ಟುನಿಟ್ಟಿನ ಸಲಹೆ ನೀಡಲಾಗಿದೆ.",
        "ml": "തീവ്ര ചുഴലിക്കാറ്റ് മുന്നറിയിപ്പ്: സമുദ്ര മേഖലയിൽ തീവ്ര ന്യൂനമർദ്ദം കണ്ടെത്തി. മത്സ്യത്തൊഴിലാളികൾ ആഴക്കടലിൽ പോകരുതെന്ന് കർശന നിർദ്ദേശം."
    },
    "high_wave_alert": {
        "en": "HIGH WAVE ALERT: Swell waves between 3.2m to 4.5m forecasted by INCOIS. Exercise extreme caution near shore and rocky shoals.",
        "te": "అధిక అలల హెచ్చరిక: INCOIS ద్వారా 3.2మీ నుండి 4.5మీ ఎత్తు అలలు అంచనా వేయబడ్డాయి. తీరం మరియు రాతి ప్రాంతాల వద్ద తీవ్ర జాగ్రత్త వహించండి.",
        "hi": "ऊंची लहरों की चेतावनी: INCOIS द्वारा 3.2m से 4.5m की लहरों का पूर्वानुमान। तट और चट्टानी उथले स्थानों के पास अत्यधिक सावधानी बरतें।",
        "ta": "உயர் அலை எச்சரிக்கை: INCOIS மூலம் 3.2 மீ முதல் 4.5 மீ வரை அலைகள் முன்னறிவிப்பு. கடற்கரை மற்றும் பாறைப் பகுதிகளில் தீவிர எச்சரிக்கையுடன் இருக்கவும்.",
        "kn": "ಹೆಚ್ಚಿನ ಅಲೆಗಳ ಎಚ್ಚರಿಕೆ: INCOIS ನಿಂದ 3.2m ನಿಂದ 4.5m ವರೆಗಿನ ಅಲೆಗಳ ಮುನ್ಸೂಚನೆ. ತೀರ ಪ್ರದೇಶದಲ್ಲಿ ತೀವ್ರ ಮುನ್ನೆಚ್ಚರಿಕೆ ವಹಿಸಿ.",
        "ml": "ഉയർന്ന തിരമാല മുന്നറിയിപ്പ്: 3.2 മീറ്റർ മുതൽ 4.5 മീറ്റർ വരെ തിരമാലകൾ INCOIS പ്രവചിക്കുന്നു. തീരപ്രദേശങ്ങളിൽ ജാഗ്രത പാലിക്കുക."
    },
    "boundary_warning": {
        "en": "INTERNATIONAL MARITIME BOUNDARY ALERT: Approaching restricted boundary or Marine Protected Area. Please navigate within authorized Indian EEZ.",
        "te": "అంతర్జాతీయ సముద్ర సరిహద్దు హెచ్చరిక: నిషేధిత సరిహద్దు లేదా రక్షిత ప్రాంతానికి చేరుకుంటున్నారు. దయచేసి భారతీయ EEZ లోపల ప్రయాణించండి.",
        "hi": "अंतर्राष्ट्रीय समुद्री सीमा चेतावनी: प्रतिबंधित सीमा या समुद्री संरक्षित क्षेत्र के करीब। कृपया अधिकृत भारतीय ईईजेड के भीतर नेविगेट करें।",
        "ta": "சர்வதேச கடல் எல்லை எச்சரிக்கை: தடைசெய்யப்பட்ட எல்லை அல்லது கடல்சார் பாதுகாக்கப்பட்ட பகுதியை நெருங்குகிறது. இந்திய EEZ எல்லைக்குள் செல்லவும்.",
        "kn": "ಅಂತರರಾಷ್ಟ್ರೀಯ ಸಮುದ್ರ ಗಡಿ ಎಚ್ಚರಿಕೆ: ನಿರ್ಬಂಧಿತ ಗಡಿ ಅಥವಾ ಸಂರಕ್ಷಿತ ಪ್ರದೇಶವನ್ನು ಸಮೀಪಿಸುತ್ತಿದ್ದೀರಿ. ದಯವಿಟ್ಟು ಭಾರತೀಯ EEZ ಒಳಗೆ ಪ್ರಯಾಣಿಸಿ.",
        "ml": "അന്താരാഷ്ട്ര സമുദ്ര അതിർത്തി മുന്നറിയിപ്പ്: നിയന്ത്രിത അതിർത്തിയോട് അടുക്കുന്നു. ദയവായി ഇന്ത്യൻ EEZ-ൽ മാത്രം സഞ്ചരിക്കുക."
    }
}

def detect_language(text: str) -> str:
    """
    Detect the script and language of the given query.
    Returns: 'te', 'hi', 'ta', 'kn', 'ml', or 'en'
    """
    if not text:
        return "en"
    
    for char in text:
        code = ord(char)
        # Telugu Unicode range: 0C00–0C7F
        if 0x0C00 <= code <= 0x0C7F:
            return "te"
        # Devanagari (Hindi) Unicode range: 0900–097F
        if 0x0900 <= code <= 0x097F:
            return "hi"
        # Tamil Unicode range: 0B80–0BFF
        if 0x0B80 <= code <= 0x0BFF:
            return "ta"
        # Kannada Unicode range: 0C80–0CFF
        if 0x0C80 <= code <= 0x0CFF:
            return "kn"
        # Malayalam Unicode range: 0D00–0D7F
        if 0x0D00 <= code <= 0x0D7F:
            return "ml"
            
    return "en"

def get_localized_message(key: str, lang: str = "en") -> str:
    """Retrieve localized maritime advisory message with fallback to English."""
    entry = LOCALIZED_TERMS.get(key, {})
    return entry.get(lang, entry.get("en", key))
