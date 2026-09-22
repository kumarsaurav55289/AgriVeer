// Universal Translation Dictionary & Helper for Agriveer

export const CATEGORY_MAP = {
  All: {
    en: 'All Categories', hi: 'सभी श्रेणियां', pa: 'ਸਭ ਸ਼੍ਰੇਣੀਆਂ', mr: 'सर्व वर्ग', te: 'అన్ని రకాలు', ta: 'அனைத்து பிரிவுகள்', bn: 'সব বিভাগ', gu: 'તમામ શ્રેણીઓ', kn: 'ಎಲ್ಲಾ ವರ್ಗಗಳು'
  },
  Tractor: {
    en: 'Tractor', hi: 'ट्रैक्टर', pa: 'ਟਰੈਕਟਰ', mr: 'ट्रॅक्टर', te: 'ట్రాక్టర్', ta: 'டிராக்டர்', bn: 'ট্রাক্টর', gu: 'ટ્રેક્ટર', kn: 'ಟ್ರಾಕ್ಟರ್'
  },
  Harvester: {
    en: 'Harvester', hi: 'हार्वेस्टर', pa: 'ਹਾਰਵੈਸਟਰ', mr: 'हॉर्वेस्टिंग', te: 'హార్వెస్టర్', ta: 'அறுவடை இயந்திரம்', bn: 'হারভেস্টার', gu: 'હાર્વેસ્ટર', kn: 'ಕೊಯ್ಲು ಯಂತ್ರ'
  },
  'Disc Plough': {
    en: 'Disc Plough', hi: 'डिस्क हल', pa: 'ਡਿਸਕ ਹਲ', mr: 'नांगर', te: 'నాగలి', ta: 'ஏர்', bn: 'লাঙল', gu: 'હળ', kn: 'ನೇಗಿಲು'
  },
  'Drone Sprayer': {
    en: 'Drone Sprayer', hi: 'ड्रोन स्प्रेयर', pa: 'ਡਰੋਨ ਸਪ੍ਰੇਅਰ', mr: 'ड्रोन फवारणी', te: 'డ్రోన్ స్ప్రేయర్', ta: 'ட்ரோன் தெளிப்பான்', bn: 'ড্রোন স্প্রেয়ার', gu: 'ડ્રોન સ્પ્રેયર', kn: 'ಡ್ರೋನ್ ಸ್ಪ್ರೇಯਰ'
  },
  Farmland: {
    en: 'Farmland', hi: 'कृषि जमीन', pa: 'ਖੇਤੀਬਾੜੀ ਜ਼ਮੀਨ', mr: 'शेती जमीन', te: 'వ్యవసాయ భూమి', ta: 'விவசாய நிலம்', bn: 'কৃষি জমি', gu: 'ખેતીની જમીન', kn: 'ಕೃಷಿ ಭೂಮಿ'
  }
};

export const DISTANCE_SUFFIX = {
  en: 'away',
  hi: 'दूर',
  pa: 'ਦੂਰ',
  mr: 'अंतर',
  te: 'పరిధిలో',
  ta: 'தொலைவில்',
  bn: 'দূরে',
  gu: 'દૂર',
  kn: 'ದೂರದಲ್ಲಿದೆ'
};

export const LOCATION_MAP = {
  'Ludhiana, Punjab': {
    en: 'Ludhiana, Punjab', hi: 'लुधियाना, पंजाब', pa: 'ਲੁਧਿਆਣਾ, ਪੰਜਾਬ', mr: 'लुधियाना, पंजाब', te: 'లుధియానా, పంజాబ్', ta: 'லூதியானா, பஞ்சாப்', bn: 'লুধিয়ানা, পাঞ্জাব', gu: 'લુધિયાણા, પંજાબ', kn: 'ಲೂಧಿಯಾನ, ಪಂಜಾಬ್'
  },
  'Karnal, Haryana': {
    en: 'Karnal, Haryana', hi: 'करनाल, हरियाणा', pa: 'ਕਰਨਾਲ, ਹਰਿਆਣਾ', mr: 'करनाल, हरियाणा', te: 'కర్నాల్, హర్యానా', ta: 'கர்னால், ஹரியானா', bn: 'কারনাল, হরিয়ানা', gu: 'કરનાલ, હરિયાણા', kn: 'ಕರ್ನಾಲ್, ಹರಿಯಾಣ'
  },
  'Meerut, Uttar Pradesh': {
    en: 'Meerut, Uttar Pradesh', hi: 'मेरठ, उत्तर प्रदेश', pa: 'ਮੇਰਠ, ਉੱਤਰ ਪ੍ਰਦੇਸ਼', mr: 'मेरठ, उत्तर प्रदेश', te: 'మీరట్, ఉత్తర ప్రదేశ్', ta: 'மீரட், உத்தரப் பிரதேசம்', bn: 'মিরাট, উত্তর প্রদেশ', gu: 'મેરઠ, ઉત્તર પ્રદેશ', kn: 'ਮੀರਟ, ఉత్తర ప్రదేశ్'
  },
  'Nashik, Maharashtra': {
    en: 'Nashik, Maharashtra', hi: 'नाशिक, महाराष्ट्र', pa: 'ਨਾਸਿਕ, ਮਹਾਰਾਸ਼ਟਰ', mr: 'नाशिक, महाराष्ट्र', te: 'నాసిక్, మహారాష్ట్ర', ta: 'நாசிக், மகாராஷ்டிரா', bn: 'নাশিক, পশ্চিমবঙ্গ', gu: 'નાસિક, મહારાષ્ટ્ર', kn: 'ನಾಸಿಕ್, ಮಹಾರಾಷ್ಟ್ರ'
  },
  'Sangareddy, Telangana': {
    en: 'Sangareddy, Telangana', hi: 'संगारेड्डी, तेलंगाना', pa: 'ਸੰਗਾਰੇੱਡੀ, ਤੇਲੰਗਾਨਾ', mr: 'संगारेड्डी, तेलंगणा', te: 'సంగారెడ్డి, తెలంగాణ', ta: 'சங்காரெட்டி, தெலுங்கானா', bn: 'সাঙ্গারেডি, তেলেঙ্গানা', gu: 'સંગારેડ્ડી, તેલંગાણા', kn: 'ಸಂಗಾರೆಡ್ಡಿ, ತೆಲಂಗಾಣ'
  },
  'Thanjavur, Tamil Nadu': {
    en: 'Thanjavur, Tamil Nadu', hi: 'तंजावुर, तमिलनाडु', pa: 'ਤੰਜਾਵੁਰ, ਤਾਮਿਲਨਾਡੂ', mr: 'तंजावुर, तमिळनाडू', te: 'తంజావూరు, తమిళనాడు', ta: 'தஞ்சாவூர், தமிழ்நாடு', bn: 'তাঞ্জাভুর, তামিলনাড়ু', gu: 'તંજાવુર, તમિલનાડુ', kn: 'ತಂಜಾವೂರು, ತಮಿಳುನಾಡು'
  },
  'Burdwan, West Bengal': {
    en: 'Burdwan, West Bengal', hi: 'बर्दवान, पश्चिम बंगाल', pa: 'ਬਰਧਮਾਨ, ਪੱਛਮੀ ਬੰਗਾਲ', mr: 'बर्दवान, पश्चिम बंगाल', te: 'బర్ధమాన్, పశ్చిమ బెంగాల్', ta: 'பர்தவான், மேற்கு வங்கம்', bn: 'বর্ধমান, পশ্চিমবঙ্গ', gu: 'બર્ધમાન, પશ્ચિમ બંગાળ', kn: 'ಬರ್ಧಮಾನ್, ಪಶ್ಚಿಮ ಬಂಗಾಳ'
  },
  'Vadodara, Gujarat': {
    en: 'Vadodara, Gujarat', hi: 'वडोदरा, गुजरात', pa: 'ਵਡੋਦਰਾ, ਗੁਜਰਾਤ', mr: 'वडोदरा, गुजरात', te: 'వడోదర, గుజరాత్', ta: 'வதோதரா, குஜராத்', bn: 'ভদোদরা, গুজরাত', gu: 'વડોદરા, ગુજરાત', kn: 'ವಡೋದರಾ, ಗುಜರಾತ್'
  },
  'Mandya, Karnataka': {
    en: 'Mandya, Karnataka', hi: 'मंड्या, कर्नाटक', pa: 'ਮੰਡਿਆ, ਕਰਨਾਟਕ', mr: 'मंड्या, कर्नाटक', te: 'మండ్య, కర్ణాటక', ta: 'மண்டியா, கர்நாடகா', bn: 'মান্ড্যা, কর্ণাটক', gu: 'મંડ્યા, કર્ણાટક', kn: 'ಮಂಡ್ಯ, ಕರ್ನಾಟಕ'
  }
};

// Translate individual listing item fields dynamically
export function getTranslatedItem(item, lang = 'en') {
  if (!item || lang === 'en') return item;

  const translatedCategory = CATEGORY_MAP[item.category]?.[lang] || item.category;
  const translatedLocation = LOCATION_MAP[item.location]?.[lang] || item.location;
  
  // Format distance suffix
  let translatedDistance = item.distance;
  if (item.distance && item.distance.includes('away')) {
    const numPart = item.distance.replace('away', '').trim();
    const suffix = DISTANCE_SUFFIX[lang] || 'away';
    translatedDistance = `${numPart} ${suffix}`;
  }

  // Basic title & description contextual translation helper
  let translatedTitle = item.title;
  let translatedDesc = item.description;

  if (lang === 'hi') {
    if (item.category === 'Tractor') {
      translatedTitle = item.title.replace('Heavy Tractor', 'ट्रैक्टर').replace('Modern Tractor', 'आधुनिक ट्रैक्टर');
      translatedDesc = 'खेती, जुताई और भारी ढुलाई के लिए शक्तिशाली उच्च-एचपी ट्रैक्टर किराए पर उपलब्ध।';
    } else if (item.category === 'Harvester') {
      translatedTitle = item.title.replace('Combine Harvester', 'कंबाइन हार्वेस्टर');
      translatedDesc = 'गेहूं, धान और मक्का की कटाई के लिए उच्च क्षमता वाली हार्वेस्टर मशीन।';
    } else if (item.category === 'Disc Plough') {
      translatedTitle = item.title.replace('Hydraulic Reversible Disc Plough', 'हाइड्रोलिक डिस्क हल');
      translatedDesc = 'गहरी जुताई और सख्त मिट्टी को तैयार करने के लिए भारी डिस्क हल।';
    } else if (item.category === 'Drone Sprayer') {
      translatedTitle = item.title.replace('Agricultural Drone Sprayer', 'कृषि स्प्रेयर ड्रोन');
      translatedDesc = 'फसलों पर तेज और समान कीटनाशक छिड़काव के लिए आधुनिक ड्रोन स्प्रेयर।';
    } else if (item.category === 'Farmland') {
      translatedTitle = item.title.replace('Acres', 'एकड़').replace('Fertile', 'उपजाऊ').replace('Land Lease', 'जमीन लीज');
      translatedDesc = 'सिंचाई सुविधा के साथ खेती और फसल उत्पादन के लिए तैयार उपजाऊ जमीन।';
    }
  } else if (lang === 'pa') {
    if (item.category === 'Tractor') {
      translatedTitle = item.title.replace('Heavy Tractor', 'ਟਰੈਕਟਰ');
      translatedDesc = 'ਖੇਤੀ ਅਤੇ ਵਾਹੀ ਲਈ ਸ਼ਕਤੀਸ਼ਾਲੀ ਟਰੈਕਟਰ ਕਿਰਾਏ ਲਈ ਉਪਲਬਧ।';
    } else if (item.category === 'Farmland') {
      translatedTitle = item.title.replace('Acres', 'ਏਕੜ').replace('Land Lease', 'ਜ਼ਮੀਨ ਠੇਕਾ');
      translatedDesc = 'ਫ਼ਸਲਾਂ ਦੀ ਬਜਾਈ ਲਈ ਤਿਆਰ ਵਧੀਆ ਉਪਜਾਊ ਜ਼ਮੀਨ।';
    }
  } else if (lang === 'mr') {
    if (item.category === 'Tractor') {
      translatedTitle = item.title.replace('Heavy Tractor', 'ट्रॅक्टर');
      translatedDesc = 'शेतीकामासाठी व नांगरणीसाठी उच्च क्षमतेचा ट्रॅक्टर भाड्याने उपलब्ध.';
    } else if (item.category === 'Farmland') {
      translatedTitle = item.title.replace('Acres', 'एकड').replace('Land Lease', 'शेती जमीन लीज');
      translatedDesc = 'पाण्याची सोय असलेली सुपीक शेती जमीन भाडेतत्त्वावर.';
    }
  } else if (lang === 'te') {
    if (item.category === 'Tractor') {
      translatedTitle = item.title.replace('Heavy Tractor', 'ట్రాక్టర్');
      translatedDesc = 'వ్యవసాయ పనులకు మరియు దుక్కికి శక్తివంతమైన ట్రాక్టర్ అద్దెకు కలదు.';
    } else if (item.category === 'Farmland') {
      translatedTitle = item.title.replace('Acres', 'ఎకరాల').replace('Land Lease', 'వ్యవసాయ భూమి కౌలు');
      translatedDesc = 'సాగునీటి సౌకర్యం ఉన్న సారవంతమైన వ్యవసాయ భూమి.';
    }
  } else if (lang === 'ta') {
    if (item.category === 'Tractor') {
      translatedTitle = item.title.replace('Heavy Tractor', 'டிராக்டர்');
      translatedDesc = 'உழவு மற்றும் விவசாய పనులకు சக்திவாய்ந்த டிராக்டர் வாடகைக்கு.';
    } else if (item.category === 'Farmland') {
      translatedTitle = item.title.replace('Acres', 'ஏக்கர்').replace('Land Lease', 'நில குத்தகை');
      translatedDesc = 'நீர்ப்பாசன வசதியுடன் கூடிய வளமான விவசாய நிலம்.';
    }
  } else if (lang === 'bn') {
    if (item.category === 'Tractor') {
      translatedTitle = item.title.replace('Heavy Tractor', 'ট্রাক্টর');
      translatedDesc = 'চাষবাসের জন্য শক্তিশালী ট্র্যাক্টর ভাড়ায় পাওয়া যাচ্ছে।';
    } else if (item.category === 'Farmland') {
      translatedTitle = item.title.replace('Acres', 'একর').replace('Land Lease', 'জমি লিজ');
      translatedDesc = 'জলসেচ সুবিধাযুক্ত উর্বর কৃষি জমি ভাড়ায় লিজের জন্য প্রস্তুত।';
    }
  } else if (lang === 'gu') {
    if (item.category === 'Tractor') {
      translatedTitle = item.title.replace('Heavy Tractor', 'ટ્રેક્ટર');
      translatedDesc = 'ખેતી અને ખેડાણ માટે શક્તિશાળી ટ્રેક્ટર ભાડે ઉપલબ્ધ.';
    } else if (item.category === 'Farmland') {
      translatedTitle = item.title.replace('Acres', 'એકર').replace('Land Lease', 'જમીન લીઝ');
      translatedDesc = 'સિંચાઈ સુવિધા સાથે ઉપજાવ ખેતીની જમીન લીઝ પર.';
    }
  } else if (lang === 'kn') {
    if (item.category === 'Tractor') {
      translatedTitle = item.title.replace('Heavy Tractor', 'ಟ್ರಾಕ್ಟರ್');
      translatedDesc = 'ಉಳುಮೆ ಮತ್ತು ಕೃಷಿ ಕೆಲಸಗಳಿಗೆ ಶಕ್ತಿಶಾಲಿ ಟ್ರಾಕ್ಟರ್ ಬಾಡಿಗೆಗೆ ಲಭ್ಯವಿದೆ.';
    } else if (item.category === 'Farmland') {
      translatedTitle = item.title.replace('Acres', 'ಎಕರೆ').replace('Land Lease', 'ಭೂಮಿ ಗುತ್ತಿಗೆ');
      translatedDesc = 'ನೀরাವರಿ ಸೌಲಭ್ಯವಿರುವ ಫಲವತ್ತಾದ ಕೃಷಿ ಭೂಮಿ ಬಾಡಿಗೆಗೆ.';
    }
  }

  // Translate specs object if present
  const translatedSpecs = { ...item.specs };
  if (translatedSpecs.landSize) {
    translatedSpecs.landSize = translatedSpecs.landSize
      .replace('Acres', lang === 'hi' ? 'एकड़' : lang === 'pa' ? 'ਏਕੜ' : lang === 'mr' ? 'एकड' : lang === 'te' ? 'ఎకరాలు' : lang === 'ta' ? 'ஏக்கர்' : lang === 'bn' ? 'একর' : lang === 'gu' ? 'એકર' : lang === 'kn' ? 'ಎಕರೆ' : 'Acres');
  }

  return {
    ...item,
    category: translatedCategory,
    location: translatedLocation,
    distance: translatedDistance,
    title: translatedTitle,
    description: translatedDesc,
    specs: translatedSpecs
  };
}
