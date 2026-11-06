export interface QuestionSeed {
  topicSlug: string;
  questionEn: string;
  questionNe: string;
  optionAEn: string;
  optionANe: string;
  optionBEn: string;
  optionBNe: string;
  optionCEn: string;
  optionCNe: string;
  optionDEn: string;
  optionDNe: string;
  correctOption: "A" | "B" | "C" | "D";
  explanationEn: string;
  explanationNe: string;
  difficulty: "easy" | "medium" | "hard";
  commission: string;
  examLevel: string;
  isPreviousYear?: boolean;
  previousYearInfo?: string | null;
  isImportant?: boolean;
  isDailyChallenge?: boolean;
}

export const GK_QUESTION_SEEDS: QuestionSeed[] = [
  // 1. Geography of Nepal
  {
    topicSlug: "geography-of-nepal",
    questionEn:
      "What is the total area of Nepal including the Kalapani-Limpiyadhura-Lipulekh territory published in Nepal's updated political and administrative map (2077 BS)?",
    questionNe:
      "वि.सं. २०७७ मा प्रकाशित नेपालको अद्यावधिक राजनीतिक तथा प्रशासनिक नक्सा अनुसार लिम्पियाधुरा, लिपुलेक र कालापानी समेत गरी नेपालको कुल क्षेत्रफल कति रहेको छ?",
    optionAEn: "1,47,181 sq. km",
    optionANe: "१,४७,१८१ वर्ग कि.मि.",
    optionBEn: "1,47,516 sq. km",
    optionBNe: "१,४७,५१६ वर्ग कि.मि.",
    optionCEn: "1,48,060 sq. km",
    optionCNe: "१,४८,०६० वर्ग कि.मि.",
    optionDEn: "1,47,641 sq. km",
    optionDNe: "१,४७,६४१ वर्ग कि.मि.",
    correctOption: "B",
    explanationEn:
      "On Jestha 7, 2077 BS, the Government of Nepal published the updated political and administrative map incorporating 335 sq. km of Kalapani, Lipulekh, and Limpiyadhura, bringing the total area from 1,47,181 sq. km to 1,47,516 sq. km.",
    explanationNe:
      "वि.सं. २०७७ जेठ ७ गते नेपाल सरकारले लिम्पियाधुरा, लिपुलेक र कालापानी क्षेत्रको ३३५ वर्ग कि.मि. भूभाग समेटी अद्यावधिक नक्सा जारी गरेपछि नेपालको कुल क्षेत्रफल १,४७,५१६ वर्ग कि.मि. कायम भएको हो।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Nayab Subba 2079 BS",
    isImportant: true,
    isDailyChallenge: true,
  },
  {
    topicSlug: "geography-of-nepal",
    questionEn:
      "Which is the lowest altitude point in Nepal, located in Jhapa district?",
    questionNe:
      "झापा जिल्लामा अवस्थित नेपालको सबैभन्दा होचो भूभाग कुन हो?",
    optionAEn: "Kechana Kawal (58 m)",
    optionANe: "केचना कवल (५८ मिटर)",
    optionBEn: "Mukhiyapatti Musharniya (59 m)",
    optionBNe: "मुखियापट्टी मुसहरनिया (५९ मिटर)",
    optionCEn: "Biratnagar (65 m)",
    optionCNe: "विराटनगर (६५ मिटर)",
    optionDEn: "Jaleshwar (61 m)",
    optionDNe: "जलेश्वर (६१ मिटर)",
    correctOption: "A",
    explanationEn:
      "Kechana Kawal in Jhapa district (Koshi Province) at 58 meters above sea level is officially recognized as the lowest elevation point in Nepal.",
    explanationNe:
      "समुद्री सतहबाट ५८ मिटर उचाइमा रहेको कोशी प्रदेशको झापा जिल्लास्थित केचना कवल नेपालको सबैभन्दा होचो स्थान हो।",
    difficulty: "easy",
    commission: "Koshi PPSC",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Koshi PPSC 5th Level 2080 BS",
    isImportant: true,
  },
  // 2. History of Nepal
  {
    topicSlug: "history-of-nepal",
    questionEn:
      "Which Lichhavi King introduced the 'Mananka' coin and built the Managriha palace?",
    questionNe:
      "'मानाङ्क' मुद्रा प्रचलनमा ल्याउने र 'मानगृह' दरबार निर्माण गर्ने लिच्छवि राजा को हुन्?",
    optionAEn: "Amshuverma",
    optionANe: "अंशुवर्मा",
    optionBEn: "Mandev I",
    optionBNe: "मानदेव प्रथम",
    optionCEn: "Narendradev",
    optionCNe: "नरेन्द्रदेव",
    optionDEn: "Shiva Dev I",
    optionDNe: "शिवदेव प्रथम",
    correctOption: "B",
    explanationEn:
      "King Mandev I (464–505 AD) was the first historical king of Nepal with epigraphic evidence (Changu Narayan pillar inscription of 464 AD). He minted 'Mananka' coins and built Managriha.",
    explanationNe:
      "वि.सं. ५२१ को चाँगुनारायण अभिलेख राख्ने प्रमाणित प्रथम ऐतिहासिक राजा मानदेव प्रथमले 'मानाङ्क' मुद्रा प्रचलनमा ल्याएका र 'मानगृह' निर्माण गरेका थिए।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Kharidar 2078 BS",
    isImportant: true,
  },
  // 3. Political history
  {
    topicSlug: "political-history",
    questionEn:
      "On which date was the historic Delhi Compromise (Dilli Samjhauta) signed, ending the 104-year Rana oligarchy in Nepal?",
    questionNe:
      "नेपालमा १०४ वर्षे जहानियाँ राणा शासन अन्त्य गर्ने ऐतिहासिक 'दिल्ली सम्झौता' कहिले भएको थियो?",
    optionAEn: "2007 Falgun 1 BS",
    optionANe: "वि.सं. २००७ फागुन १",
    optionBEn: "2007 Falgun 7 BS",
    optionBNe: "वि.सं. २००७ फागुन ७",
    optionCEn: "2007 Magh 18 BS",
    optionCNe: "वि.सं. २००७ माघ १८",
    optionDEn: "2007 Poush 24 BS",
    optionDNe: "वि.सं. २००७ पुस २४",
    correctOption: "A",
    explanationEn:
      "The tripartite Delhi Compromise between King Tribhuvan, the Ranas, and the Nepali Congress was signed on Falgun 1, 2007 BS (12 February 1951), and King Tribhuvan proclaimed democracy on Falgun 7, 2007 BS.",
    explanationNe:
      "राजा त्रिभुवन, राणा पक्ष र नेपाली कांग्रेसबीच त्रिपक्षीय दिल्ली सम्झौता वि.सं. २००७ फागुन १ गते भएको थियो भने फागुन ७ गते प्रजातन्त्र घोषणा गरिएको थियो।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Nayab Subba 2080 BS",
    isImportant: true,
  },
  // 4. Constitution of Nepal (GK)
  {
    topicSlug: "gk-constitution-of-nepal",
    questionEn:
      "How many Parts, Articles, and Schedules are there in the Constitution of Nepal (promulgated on 2072 Ashwin 3)?",
    questionNe:
      "वि.सं. २०७२ असोज ३ गते जारी भएको नेपालको संविधानमा कति भाग, धारा र अनुसूची रहेका छन्?",
    optionAEn: "35 Parts, 308 Articles, 9 Schedules",
    optionANe: "३५ भाग, ३०८ धारा र ९ अनुसूची",
    optionBEn: "34 Parts, 302 Articles, 8 Schedules",
    optionBNe: "३४ भाग, ३०२ धारा र ८ अनुसूची",
    optionCEn: "35 Parts, 306 Articles, 9 Schedules",
    optionCNe: "३५ भाग, ३०६ धारा र ९ अनुसूची",
    optionDEn: "33 Parts, 308 Articles, 7 Schedules",
    optionDNe: "३३ भाग, ३०८ धारा र ७ अनुसूची",
    correctOption: "A",
    explanationEn:
      "The Constitution of Nepal 2072 BS consists of 35 Parts, 308 Articles, and 9 Schedules, promulgated by the Constituent Assembly on Ashwin 3, 2072 BS (20 September 2015).",
    explanationNe:
      "नेपालको संविधान २०७२ मा ३५ भाग, ३०८ धारा र ९ अनुसूची रहेका छन्। यो संविधानसभाबाट वि.सं. २०७२ असोज ३ गते जारी भएको हो।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
    isDailyChallenge: true,
  },
  // 5. Federal structure
  {
    topicSlug: "federal-structure",
    questionEn:
      "How many total local levels (Rural Municipalities, Municipalities, Sub-Metropolitan & Metropolitan Cities) exist in Nepal?",
    questionNe:
      "नेपालमा हाल कुल कति वटा स्थानीय तह (गाउँपालिका, नगरपालिका, उपमहानगरपालिका र महानगरपालिका) रहेका छन्?",
    optionAEn: "744",
    optionANe: "७४४",
    optionBEn: "753",
    optionBNe: "७५३",
    optionCEn: "761",
    optionCNe: "७६१",
    optionDEn: "776",
    optionDNe: "७७६",
    correctOption: "B",
    explanationEn:
      "Nepal has 753 local levels comprising 6 Metropolitan Cities, 11 Sub-Metropolitan Cities, 276 Municipalities, and 460 Rural Municipalities.",
    explanationNe:
      "नेपालमा ६ महानगरपालिका, ११ उपमहानगरपालिका, २७६ नगरपालिका र ४६० गाउँपालिका गरी कुल ७५३ स्थानीय तह रहेका छन्।",
    difficulty: "easy",
    commission: "Bagmati PPSC",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Bagmati PPSC 5th Level 2080 BS",
    isImportant: true,
  },
  // 6. Provinces and districts
  {
    topicSlug: "provinces-and-districts",
    questionEn:
      "Which province of Nepal has the highest number of districts (14 districts) and which has the lowest (8 districts)?",
    questionNe:
      "नेपालको कुन प्रदेशमा सबैभन्दा बढी जिल्ला (१४ जिल्ला) र कुन प्रदेशमा सबैभन्दा कम जिल्ला (८ जिल्ला) रहेका छन्?",
    optionAEn: "Koshi (14) and Madhesh (8)",
    optionANe: "कोशी (१४) र मधेश (८)",
    optionBEn: "Bagmati (14) and Karnali (8)",
    optionBNe: "बागमती (१४) र कर्णाली (८)",
    optionCEn: "Lumbini (14) and Sudurpashchim (8)",
    optionCNe: "लुम्बिनी (१४) र सुदूरपश्चिम (८)",
    optionDEn: "Gandaki (14) and Madhesh (8)",
    optionDNe: "गण्डकी (१४) र मधेश (८)",
    correctOption: "A",
    explanationEn:
      "Koshi Province has 14 districts (highest), Bagmati has 13, Lumbini has 12, Gandaki has 11, Karnali has 10, Sudurpashchim has 9, and Madhesh Province has 8 districts (lowest) — totaling 77 districts.",
    explanationNe:
      "कोशी प्रदेशमा सबैभन्दा बढी १४ जिल्ला र मधेश प्रदेशमा सबैभन्दा कम ८ जिल्ला रहेका छन् (बागमती १३, लुम्बिनी १२, गण्डकी ११, कर्णाली १०, सुदूरपश्चिम ९ गरी कुल ७७ जिल्ला)।",
    difficulty: "easy",
    commission: "Madhesh PPSC",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
    isDailyChallenge: true,
  },
  // 7. Rivers and lakes
  {
    topicSlug: "rivers-and-lakes",
    questionEn:
      "Which is the deepest lake in Nepal and in which district is it situated?",
    questionNe:
      "नेपालको सबैभन्दा गहिरो ताल कुन हो र यो कुन जिल्लामा अवस्थित छ?",
    optionAEn: "Rara Lake, Mugu",
    optionANe: "रारा ताल, मुगु",
    optionBEn: "Shey Phoksundo Lake, Dolpa",
    optionBNe: "शे-फोक्सुण्डो ताल, डोल्पा",
    optionCEn: "Tilicho Lake, Manang",
    optionCNe: "तिलिचो ताल, मनाङ",
    optionDEn: "Gosaikunda Lake, Rasuwa",
    optionDNe: "गोसाइँकुण्ड ताल, रसुवा",
    correctOption: "B",
    explanationEn:
      "Shey Phoksundo Lake in Dolpa district (Karnali Province) is Nepal's deepest lake (145 meters deep according to DHM survey, historically cited as 650 m), whereas Rara is the largest lake.",
    explanationNe:
      "कर्णाली प्रदेशको डोल्पा जिल्लामा रहेको शे-फोक्सुण्डो ताल नेपालको सबैभन्दा गहिरो ताल हो भने मुगुको रारा ताल सबैभन्दा ठूलो ताल हो।",
    difficulty: "easy",
    commission: "Karnali PPSC",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Karnali PPSC 5th Level 2080 BS",
  },
  // 8. Mountains and peaks
  {
    topicSlug: "mountains-and-peaks",
    questionEn:
      "What is the revised official height of Mount Everest (Sagarmatha) jointly announced by Nepal and China on December 8, 2020 (2077 Mangsir 23 BS)?",
    questionNe:
      "वि.सं. २०७७ मंसिर २३ गते नेपाल र चीनद्वारा संयुक्त रूपमा घोषणा गरिएको सगरमाथाको नयाँ उचाइ कति हो?",
    optionAEn: "8,848.00 meters",
    optionANe: "८,८४८.०० मिटर",
    optionBEn: "8,848.86 meters",
    optionBNe: "८,८४८.८६ मिटर",
    optionCEn: "8,850.00 meters",
    optionCNe: "८,८५०.०० मिटर",
    optionDEn: "8,844.43 meters",
    optionDNe: "८,८४४.४३ मिटर",
    correctOption: "B",
    explanationEn:
      "On Mangsir 23, 2077 BS (8 December 2020), Nepal and China jointly announced the snow-height of Mount Everest as 8,848.86 meters (an increase of 0.86 m over 8,848 m).",
    explanationNe:
      "वि.सं. २०७७ मंसिर २३ गते नेपाल र चीनले संयुक्त रूपमा सगरमाथाको उचाइ ८,८४८.८६ मिटर घोषणा गरेका हुन्।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
  },
  // 9. National parks and conservation areas
  {
    topicSlug: "national-parks-and-conservation-areas",
    questionEn:
      "Which is the first National Park of Nepal and in which year (BS) was it established?",
    questionNe:
      "नेपालको पहिलो राष्ट्रिय निकुञ्ज कुन हो र यसको स्थापना कहिले भएको थियो?",
    optionAEn: "Sagarmatha National Park (2033 BS)",
    optionANe: "सगरमाथा राष्ट्रिय निकुञ्ज (वि.सं. २०३३)",
    optionBEn: "Chitwan National Park (2030 BS)",
    optionBNe: "चितवन राष्ट्रिय निकुञ्ज (वि.सं. २०३०)",
    optionCEn: "Bardiya National Park (2032 BS)",
    optionCNe: "बर्दिया राष्ट्रिय निकुञ्ज (वि.सं. २०३२)",
    optionDEn: "Langtang National Park (2032 BS)",
    optionDNe: "लाङटाङ राष्ट्रिय निकुञ्ज (वि.सं. २०३२)",
    correctOption: "B",
    explanationEn:
      "Chitwan National Park was established in 2030 BS (1973 AD) as Nepal's first National Park and was enlisted as a UNESCO World Heritage Site in 1984 AD.",
    explanationNe:
      "चितवन राष्ट्रिय निकुञ्जको स्थापना वि.सं. २०३० (सन् १९७३) मा भएको हो। यो नेपालको पहिलो राष्ट्रिय निकुञ्ज हो।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Kharidar 2080 BS",
  },
  // 10. Natural resources
  {
    topicSlug: "natural-resources",
    questionEn:
      "What is the theoretical hydropower generation capacity of Nepal estimated by Dr. Hari Man Shrestha?",
    questionNe:
      "डा. हरिमान श्रेष्ठको अध्ययन अनुसार नेपालको सैद्धान्तिक जलविद्युत उत्पादन क्षमता कति मेगावाट रहेको छ?",
    optionAEn: "42,000 MW",
    optionANe: "४२,००० मेगावाट",
    optionBEn: "83,000 MW",
    optionBNe: "८३,००० मेगावाट",
    optionCEn: "65,000 MW",
    optionCNe: "६५,००० मेगावाट",
    optionDEn: "1,14,000 MW",
    optionDNe: "१,१४,००० मेगावाट",
    correctOption: "B",
    explanationEn:
      "Nepal's theoretical hydropower potential is widely cited as 83,000 MW (with ~42,000 MW economically feasible), with Koshi basin holding 22,000 MW, Gandaki 21,000 MW, and Karnali/Mahakali 36,000+ MW.",
    explanationNe:
      "नेपालको कुल सैद्धान्तिक जलविद्युत क्षमता ८३,००० मेगावाट र आर्थिक तथा प्राविधिक रूपमा सम्भाव्य क्षमता करिब ४२,००० मेगावाट रहेको छ।",
    difficulty: "easy",
    commission: "Gandaki PPSC",
    examLevel: "Fifth Level - General Administration",
  },
  // 11. Population and census
  {
    topicSlug: "population-and-census",
    questionEn:
      "According to the National Population and Housing Census 2078 BS (2021 AD) final report, what is Nepal's total population and annual population growth rate?",
    questionNe:
      "राष्ट्रिय जनगणना २०७८ को अन्तिम नतिजा अनुसार नेपालको कुल जनसंख्या र वार्षिक जनसंख्या वृद्धिदर कति रहेको छ?",
    optionAEn: "2,91,64,578 and 0.92%",
    optionANe: "२,९१,६४,५७८ र ०.९२%",
    optionBEn: "2,91,92,480 and 0.93%",
    optionBNe: "२,९१,९२,४८० र ०.९३%",
    optionCEn: "2,64,94,504 and 1.35%",
    optionCNe: "२,६४,९४,५०४ र १.३५%",
    optionDEn: "2,96,09,623 and 1.05%",
    optionDNe: "२,९६,०९,६२३ र १.०५%",
    correctOption: "A",
    explanationEn:
      "Per the final results of Nepal's 12th National Census 2078 BS published by the National Statistics Office, total population is 2,91,64,578 with an annual growth rate of 0.92% and literacy rate of 76.2%.",
    explanationNe:
      "राष्ट्रिय तथ्यांक कार्यालयले सार्वजनिक गरेको बाह्रौं राष्ट्रिय जनगणना २०७८ को अन्तिम प्रतिवेदन अनुसार नेपालको कुल जनसंख्या २,९१,६४,५७८ र वार्षिक वृद्धिदर ०.९२% रहेको छ।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Nayab Subba 2080 BS",
    isImportant: true,
    isDailyChallenge: true,
  },
  // 12. Economy and development
  {
    topicSlug: "economy-and-development",
    questionEn:
      "What is the headline vision/motto of Nepal's 16th Five-Year Periodic Plan (2081/82 – 2085/86 BS)?",
    questionNe:
      "नेपालको सोह्रौं आवधिक योजना (आ.व. २०८१/८२ – २०८५/८६) को मुख्य सोच (Vision) के रहेको छ?",
    optionAEn: "Prosperous Nepal, Happy Nepali",
    optionANe: "समृद्ध नेपाल, सुखी नेपाली",
    optionBEn: "Good Governance, Social Justice and Prosperity",
    optionBNe: "सुशासन, सामाजिक न्याय र समृद्धि",
    optionCEn: "Sustainable Development and Federal Prosperity",
    optionCNe: "दिगो विकास र संघीय समृद्धि",
    optionDEn: "Self-Reliant Economy and Employment",
    optionDNe: "आत्मनिर्भर अर्थतन्त्र र रोजगारी",
    correctOption: "B",
    explanationEn:
      "Nepal's 16th Plan (FY 2081/82 – 2085/86) approved by the National Development Council has the headline vision 'Good Governance, Social Justice and Prosperity' (सुशासन, सामाजिक न्याय र समृद्धि).",
    explanationNe:
      "राष्ट्रिय विकास परिषद्बाट स्वीकृत सोह्रौं योजना (आ.व. २०८१/८२ – २०८५/८६) को मुख्य सोच 'सुशासन, सामाजिक न्याय र समृद्धि' रहेको छ।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
    isDailyChallenge: true,
  },
  // 13. Culture, festivals and traditions
  {
    topicSlug: "culture-festivals-and-traditions",
    questionEn:
      "In which community of Nepal is the 'Gaura Parva' primarily celebrated in Sudurpashchim and Karnali provinces?",
    questionNe:
      "सुदूरपश्चिम र कर्णाली प्रदेशमा विशेष उल्लासका साथ मनाइने 'गौरा पर्व' कुन समुदायको प्रमुख सांस्कृतिक पर्व हो?",
    optionAEn: "Tharu community",
    optionANe: "थारु समुदाय",
    optionBEn: "Khas-Arya (Doteli/Kumaoni cultural) community",
    optionBNe: "खस-आर्य (डोटेली/कर्णाली) समुदाय",
    optionCEn: "Limbu community",
    optionCNe: "लिम्बू समुदाय",
    optionDEn: "Newar community",
    optionDNe: "नेवार समुदाय",
    correctOption: "B",
    explanationEn:
      "Gaura Parva is celebrated predominantly in Sudurpashchim and parts of Karnali province during Bhadra, featuring Biruda Panchami and traditional Deuda dance.",
    explanationNe:
      "गौरा पर्व विशेषगरी सुदूरपश्चिम र कर्णाली प्रदेशमा भाद्र महिनामा बिरुडा पञ्चमी र देउडा नृत्यसहित मनाइने प्रमुख पर्व हो।",
    difficulty: "easy",
    commission: "Sudurpashchim PPSC",
    examLevel: "Fifth Level - General Administration",
  },
  // 14. Heritage sites
  {
    topicSlug: "heritage-sites",
    questionEn:
      "How many UNESCO World Heritage Sites are located in Nepal (combining cultural and natural sites)?",
    questionNe:
      "नेपालमा युनेस्को (UNESCO) विश्व सम्पदा सूचीमा सूचीकृत सांस्कृतिक र प्राकृतिक सम्पदा क्षेत्रहरू जम्मा कति वटा रहेका छन्?",
    optionAEn: "8 sites (6 Cultural, 2 Natural)",
    optionANe: "८ वटा (६ सांस्कृतिक, २ प्राकृतिक)",
    optionBEn: "10 sites (8 Cultural, 2 Natural)",
    optionBNe: "१० वटा (८ सांस्कृतिक, २ प्राकृतिक)",
    optionCEn: "4 sites (2 Cultural, 2 Natural)",
    optionCNe: "४ वटा (२ सांस्कृतिक, २ प्राकृतिक)",
    optionDEn: "9 sites (7 Cultural, 2 Natural)",
    optionDNe: "९ वटा (७ सांस्कृतिक, २ प्राकृतिक)",
    correctOption: "B",
    explanationEn:
      "Nepal has 10 UNESCO World Heritage Sites: 7 monument zones of Kathmandu Valley + Lumbini (8 cultural sites) and Chitwan National Park + Sagarmatha National Park (2 natural sites).",
    explanationNe:
      "नेपालमा काठमाडौं उपत्यकाका ७ स्मारक क्षेत्र र लुम्बिनी गरी ८ सांस्कृतिक तथा चितवन र सगरमाथा राष्ट्रिय निकुञ्ज गरी २ प्राकृतिक गरी कुल १० विश्व सम्पदा स्थल छन्।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Lumbini PPSC 5th Level 2079 BS",
  },
  // 15. Literature and personalities
  {
    topicSlug: "literature-and-personalities",
    questionEn:
      "Who was honored with the title 'Yugakavi' (Poet of the Era) in Nepali literature?",
    questionNe:
      "नेपाली साहित्यमा 'युगकवि' उपाधिबाट विभूषित साहित्यकार को हुन्?",
    optionAEn: "Laxmi Prasad Devkota",
    optionANe: "लक्ष्मीप्रसाद देवकोटा",
    optionBEn: "Siddhicharan Shrestha",
    optionBNe: "सिद्धिचरण श्रेष्ठ",
    optionCEn: "Lekhnath Paudyal",
    optionCNe: "लेखनाथ पौड्याल",
    optionDEn: "Madhav Prasad Ghimire",
    optionDNe: "माधवप्रसाद घिमिरे",
    correctOption: "B",
    explanationEn:
      "Siddhicharan Shrestha (author of 'Mero Pyaro Okhaldhunga') is known as Yugakavi, Laxmi Prasad Devkota is Mahakavi, Lekhnath Paudyal is Kavi Shiromani, and Madhav Prasad Ghimire is Rashtrakavi.",
    explanationNe:
      "सिद्धिचरण श्रेष्ठलाई 'युगकवि', लक्ष्मीप्रसाद देवकोटालाई 'महाकवि', लेखनाथ पौड्याललाई 'कविशिरोमणि' र माधवप्रसाद घिमिरेलाई 'राष्ट्रकवि' भनिन्छ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  // 16. Awards and honours
  {
    topicSlug: "awards-and-honours",
    questionEn:
      "Which literary work won the Madan Puraskar for the year 2080 BS?",
    questionNe:
      "वि.सं. २०८० सालको मदन पुरस्कार कुन कृतिलाई प्रदान गरियो?",
    optionAEn: "Ainthaan by Bibek Ojha",
    optionANe: "ऐंठन (विवेक ओझा)",
    optionBEn: "Mukaam Ranamaidan by Mohan Mainali",
    optionBNe: "मुकाम रणमैदान (मोहन मैनाली)",
    optionCEn: "Agni by Nabaraj Lamsal",
    optionCNe: "अग्नि (नवराज लम्साल)",
    optionDEn: "Maharani by Chandra Prakash Baniya",
    optionDNe: "महारानी (चन्द्रप्रकाश बानियाँ)",
    correctOption: "B",
    explanationEn:
      "Madan Puraskar Guthi awarded the Madan Puraskar 2080 BS to Mohan Mainali for his historical non-fiction book 'Mukaam Ranamaidan', while Jagadamba-Shree 2080 was awarded to Prof. Dr. Yogendra Prasad Yadav.",
    explanationNe:
      "मदन पुरस्कार गुठीले वि.सं. २०८० को मदन पुरस्कार मोहन मैनालीको कृति 'मुकाम रणमैदान' लाई र जगदम्बाश्री पुरस्कार प्रा.डा. योगेन्द्रप्रसाद यादवलाई प्रदान गरेको हो।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
  },
  // 17. Important national events
  {
    topicSlug: "important-national-events",
    questionEn:
      "When did Nepal officially graduate from the UN Least Developed Countries (LDC) category scheduled date take effect after the 5-year transition period approved by UNGA in Nov 2021?",
    questionNe:
      "संयुक्त राष्ट्रसंघीय महासभाले सन् २०२१ नोभेम्बरमा अनुमोदन गरेअनुसार ५ वर्षे संक्रमणकालीन अवधिपछि नेपाल अतिकम विकसित राष्ट्र (LDC) बाट विकासशील राष्ट्रमा स्तरोन्नति हुने मिति कुन हो?",
    optionAEn: "24 November 2026",
    optionANe: "२४ नोभेम्बर २०२६",
    optionBEn: "1 January 2025",
    optionBNe: "१ जनवरी २०२५",
    optionCEn: "15 July 2026",
    optionCNe: "१५ जुलाई २०२६",
    optionDEn: "31 December 2027",
    optionDNe: "३१ डिसेम्बर २०२७",
    correctOption: "A",
    explanationEn:
      "The UN General Assembly resolution of 24 November 2021 approved Nepal's graduation from the LDC category with a 5-year preparatory transition period ending on 24 November 2026.",
    explanationNe:
      "संयुक्त राष्ट्रसंघीय महासभाले २४ नोभेम्बर २०२१ मा पारित गरेको प्रस्ताव अनुसार ५ वर्षको तयारी अवधिपछि २४ नोभेम्बर २०२६ मा नेपाल LDC बाट स्तरोन्नति हुने तय भएको छ।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
  },
  // 18. World geography
  {
    topicSlug: "world-geography",
    questionEn:
      "Which strait separates Asia from North America and connects the Pacific Ocean with the Arctic Ocean?",
    questionNe:
      "एसिया र उत्तर अमेरिकालाई छुट्याउने तथा प्रशान्त महासागर र आर्कटिक महासागरलाई जोड्ने जलसन्धि (Strait) कुन हो?",
    optionAEn: "Strait of Malacca",
    optionANe: "मलाक्का जलसन्धि",
    optionBEn: "Bering Strait",
    optionBNe: "बेरिङ जलसन्धि",
    optionCEn: "Strait of Gibraltar",
    optionCNe: "जिब्राल्टर जलसन्धि",
    optionDEn: "Bosporus Strait",
    optionDNe: "बोस्फोरस जलसन्धि",
    correctOption: "B",
    explanationEn:
      "The Bering Strait separates Russia (Asia) and Alaska, USA (North America) by about 85 km and connects the Pacific and Arctic oceans.",
    explanationNe:
      "बेरिङ जलसन्धिले एसिया (रुस) र उत्तर अमेरिका (अलास्का) लाई छुट्याउँछ र प्रशान्त तथा आर्कटिक महासागरलाई जोड्छ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  // 19. Countries and capitals
  {
    topicSlug: "countries-and-capitals",
    questionEn:
      "Which city is the administrative capital of South Africa (alongside legislative Cape Town and judicial Bloemfontein)?",
    questionNe:
      "दक्षिण अफ्रिकाको कार्यपालिका (प्रशासनिक) राजधानी कुन सहर हो?",
    optionAEn: "Johannesburg",
    optionANe: "जोहानेसबर्ग",
    optionBEn: "Pretoria",
    optionBNe: "प्रिटोरिया",
    optionCEn: "Durban",
    optionCNe: "डर्बन",
    optionDEn: "Cape Town",
    optionDNe: "केप टाउन",
    correctOption: "B",
    explanationEn:
      "South Africa has three capitals: Pretoria (Administrative/Executive), Cape Town (Legislative), and Bloemfontein (Judicial).",
    explanationNe:
      "दक्षिण अफ्रिकाका तीन राजधानी छन्: प्रिटोरिया (कार्यपालिका/प्रशासनिक), केप टाउन (व्यवस्थापिका) र ब्लोमफोन्टेन (न्यायपालिका)।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  // 20. Currencies
  {
    topicSlug: "currencies",
    questionEn: "What is the official currency of Japan and South Korea respectively?",
    questionNe: "जापान र दक्षिण कोरियाको आधिकारिक मुद्रा क्रमशः के-के हुन्?",
    optionAEn: "Yuan and Won",
    optionANe: "युआन र वोन",
    optionBEn: "Yen and Won",
    optionBNe: "येन र वोन",
    optionCEn: "Yen and Ringgit",
    optionCNe: "येन र रिङ्गिट",
    optionDEn: "Baht and Yen",
    optionDNe: "बाह्त र येन",
    correctOption: "B",
    explanationEn:
      "Japan uses the Japanese Yen (JPY) and South Korea uses the South Korean Won (KRW).",
    explanationNe:
      "जापानको मुद्रा येन (Yen) हो भने दक्षिण कोरियाको मुद्रा वोन (Won) हो।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  // 21. International organizations
  {
    topicSlug: "international-organizations",
    questionEn:
      "Where is the permanent Secretariat of SAARC (South Asian Association for Regional Cooperation) located, and when was it established?",
    questionNe:
      "सार्क (SAARC) को स्थायी सचिवालय कहाँ रहेको छ र यसको स्थापना कहिले भएको थियो?",
    optionAEn: "Dhaka, 8 December 1985",
    optionANe: "ढाका, ८ डिसेम्बर १९८५",
    optionBEn: "Kathmandu, 16 January 1987",
    optionBNe: "काठमाडौं, १६ जनवरी १९८७",
    optionCEn: "New Delhi, 10 December 1985",
    optionCNe: "नयाँ दिल्ली, १० डिसेम्बर १९८५",
    optionDEn: "Colombo, 14 January 1986",
    optionDNe: "कोलम्बो, १४ जनवरी १९८६",
    correctOption: "B",
    explanationEn:
      "SAARC was founded in Dhaka on 8 December 1985, and its permanent Secretariat was established in Kathmandu, Nepal on 16 January 1987 (inaugurated by King Birendra).",
    explanationNe:
      "सार्कको स्थापना ८ डिसेम्बर १९८५ मा बंगलादेशको ढाकामा भएको थियो भने यसको स्थायी सचिवालय १६ जनवरी १९८७ मा नेपालको काठमाडौंमा स्थापना भएको हो।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Nayab Subba 2079 BS",
    isImportant: true,
  },
  // 22. World history
  {
    topicSlug: "world-history",
    questionEn:
      "In which year was the Magna Carta signed by King John of England, laying a foundation for constitutional rule of law?",
    questionNe:
      "विश्व संवैधानिक इतिहासमा महत्त्वपूर्ण मानिने 'म्याग्ना कार्टा' (Magna Carta) बेलायतका राजा जोनद्वारा कहिले हस्ताक्षर गरिएको थियो?",
    optionAEn: "1215 AD",
    optionANe: "सन् १२१५",
    optionBEn: "1688 AD",
    optionBNe: "सन् १६८८",
    optionCEn: "1776 AD",
    optionCNe: "सन् १७७६",
    optionDEn: "1789 AD",
    optionDNe: "सन् १७८९",
    correctOption: "A",
    explanationEn:
      "Magna Carta Libertatum was sealed by King John at Runnymede on 15 June 1215 AD, establishing that the monarch is also subject to the law.",
    explanationNe:
      "सन् १२१५ जुन १५ मा बेलायतका राजा जोनले हस्ताक्षर गरेको म्याग्ना कार्टाले राजा पनि कानुनको अधीनमा रहने संवैधानिक सिद्धान्तको जग बसालेको थियो।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  // 23. International relations
  {
    topicSlug: "international-relations",
    questionEn:
      "Which five principles form the core of Nepal's foreign policy under Article 51(m) of the Constitution of Nepal?",
    questionNe:
      "नेपालको संविधानको धारा ५१(ड) अनुसार नेपालको परराष्ट्र नीति केमा आधारित रहने व्यवस्था छ?",
    optionAEn: "Panchasheel, UN Charter, Non-Alignment, International Law & World Peace",
    optionANe: "पञ्चशील, संयुक्त राष्ट्रसंघको बडापत्र, असंलग्नता, अन्तर्राष्ट्रिय कानुन र विश्वशान्ति",
    optionBEn: "Regional Military Alliance & Bilateral Trade",
    optionBNe: "क्षेत्रीय सैन्य गठबन्धन र द्विपक्षीय व्यापार",
    optionCEn: "Commonwealth Charter & BIMSTEC Protocol",
    optionCNe: "कमनवेल्थ बडापत्र र बिम्स्टेक प्रोटोकल",
    optionDEn: "OECD Guidelines & G20 Consensus",
    optionDNe: "ओईसीडी मार्गनिर्देशन र जी-२० सहमति",
    correctOption: "A",
    explanationEn:
      "Article 51(m)(1) of the Constitution of Nepal mandates an independent foreign policy based on the UN Charter, non-alignment, principles of Panchasheel, international law, and norms of world peace.",
    explanationNe:
      "नेपालको संविधानको धारा ५१(ड)(१) ले संयुक्त राष्ट्रसंघको बडापत्र, असंलग्नता, पञ्चशीलको सिद्धान्त, अन्तर्राष्ट्रिय कानुन र विश्वशान्तिको मान्यतामा आधारित स्वतन्त्र परराष्ट्र नीति सञ्चालन गर्ने व्यवस्था गरेको छ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
  },
  // 24. Famous personalities
  {
    topicSlug: "famous-personalities",
    questionEn:
      "Who was the first woman Secretary-General of BIMSTEC or first South Asian woman President of UN General Assembly?",
    questionNe:
      "संयुक्त राष्ट्रसंघीय महासभाको पहिलो महिला अध्यक्ष को हुन्?",
    optionAEn: "Vijaya Lakshmi Pandit",
    optionANe: "विजयालक्ष्मी पण्डित",
    optionBEn: "Sirimavo Bandaranaike",
    optionBNe: "सिरिमाभो बन्दरानाइके",
    optionCEn: "Indira Gandhi",
    optionCNe: "इन्दिरा गान्धी",
    optionDEn: "Golda Meir",
    optionDNe: "गोल्डा मेयर",
    correctOption: "A",
    explanationEn:
      "Vijaya Lakshmi Pandit of India became the first woman President of the UN General Assembly (8th session) in 1953.",
    explanationNe:
      "भारतकी विजयालक्ष्मी पण्डित सन् १९५३ मा संयुक्त राष्ट्रसंघीय महासभाको आठौं अधिवेशनमा पहिलो महिला अध्यक्ष निर्वाचित भएकी थिइन्।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  // 25. Discoveries and inventions
  {
    topicSlug: "discoveries-and-inventions",
    questionEn: "Who invented the World Wide Web (WWW) in 1989 at CERN?",
    questionNe: "सन् १९८९ मा सर्न (CERN) मा वर्ल्ड वाइड वेब (WWW) को आविष्कार कसले गरेका हुन्?",
    optionAEn: "Vint Cerf",
    optionANe: "भिन्ट सर्फ",
    optionBEn: "Tim Berners-Lee",
    optionBNe: "टिम बर्नर्स-ली",
    optionCEn: "Alan Turing",
    optionCNe: "एलन ट्युरिङ",
    optionDEn: "Charles Babbage",
    optionDNe: "चार्ल्स ब्याबेज",
    correctOption: "B",
    explanationEn:
      "British computer scientist Sir Tim Berners-Lee invented the World Wide Web (HTTP, HTML, URL) in 1989 while working at CERN.",
    explanationNe:
      "बेलायती कम्प्युटर वैज्ञानिक सर टिम बर्नर्स-लीले सन् १९८९ मा सर्न (CERN) मा कार्यरत रहँदा वर्ल्ड वाइड वेब (WWW) को आविष्कार गरेका हुन्।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  // 26. Important international days
  {
    topicSlug: "important-international-days",
    questionEn:
      "On which date is United Nations Day observed annually around the world?",
    questionNe:
      "विश्वभर हरेक वर्ष 'संयुक्त राष्ट्रसंघ दिवस' (United Nations Day) कुन मितिमा मनाइन्छ?",
    optionAEn: "October 24",
    optionANe: "अक्टोबर २४",
    optionBEn: "December 10",
    optionBNe: "डिसेम्बर १०",
    optionCEn: "June 5",
    optionCNe: "जुन ५",
    optionDEn: "September 28",
    optionDNe: "सेप्टेम्बर २८",
    correctOption: "A",
    explanationEn:
      "United Nations Day is celebrated on October 24 every year, marking the entry into force of the UN Charter on 24 October 1945.",
    explanationNe:
      "सन् १९४५ अक्टोबर २४ मा संयुक्त राष्ट्रसंघको बडापत्र लागू भएको दिनको सम्झनामा हरेक वर्ष अक्टोबर २४ मा संयुक्त राष्ट्रसंघ दिवस मनाइन्छ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  // 27. World records
  {
    topicSlug: "world-records",
    questionEn:
      "Which Nepali mountaineer holds the Guinness World Record for the most summits of Mount Everest (30 summits)?",
    questionNe:
      "सबैभन्दा बढी पटक (३० पटक) सगरमाथाको सफल आरोहण गरी विश्व कीर्तिमान कायम गर्ने नेपाली आरोही को हुन्?",
    optionAEn: "Apa Sherpa",
    optionANe: "आपा शेर्पा",
    optionBEn: "Kami Rita Sherpa",
    optionBNe: "कामी रिता शेर्पा",
    optionCEn: "Pasang Dawa Sherpa",
    optionCNe: "पासाङ दावा शेर्पा",
    optionDEn: "Nirmal Purja",
    optionDNe: "निर्मल पुर्जा",
    correctOption: "B",
    explanationEn:
      "Kami Rita Sherpa reached the summit of Mount Everest for the 29th and 30th times in May 2024, extending his own world record.",
    explanationNe:
      "सोलुखुम्बुका कामी रिता शेर्पाले सन् २०२४ मे महिनामा ३० औं पटक सगरमाथा आरोहण गरी आफ्नै विश्व कीर्तिमान भंग गरेका हुन्।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
  },
  // 28. Sports and tournaments
  {
    topicSlug: "sports-and-tournaments",
    questionEn:
      "In which year did Nepal's men's national cricket team make its debut in the ICC Men's T20 World Cup, and when did they play their second T20 World Cup?",
    questionNe:
      "नेपालको राष्ट्रिय पुरुष क्रिकेट टोलीले आईसीसी टी-२० विश्वकपमा पहिलो पटक कहिले सहभागिता जनाएको थियो?",
    optionAEn: "2014 (Bangladesh) and 2024 (USA/West Indies)",
    optionANe: "सन् २०१४ (बंगलादेश) र सन् २०२४ (अमेरिका/वेस्ट इन्डिज)",
    optionBEn: "2016 (India) and 2022 (Australia)",
    optionBNe: "सन् २०१६ (भारत) र सन् २०२२ (अस्ट्रेलिया)",
    optionCEn: "2012 (Sri Lanka) and 2024 (USA)",
    optionCNe: "सन् २०१२ (श्रीलंका) र सन् २०२४ (अमेरिका)",
    optionDEn: "2014 (Bangladesh) and 2021 (UAE)",
    optionDNe: "सन् २०१४ (बंगलादेश) र सन् २०२१ (युएई)",
    correctOption: "A",
    explanationEn:
      "Nepal debuted in the ICC Men's T20 World Cup in 2014 in Bangladesh (under captain Paras Khadka) and returned after 10 years in the 2024 edition in the USA and West Indies.",
    explanationNe:
      "नेपालले सन् २०१४ मा बंगलादेशमा आयोजित टी-२० विश्वकपमा पहिलो पटक र १० वर्षपछि सन् २०२४ मा दोस्रो पटक सहभागिता जनाएको हो।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  // 29. Physics
  {
    topicSlug: "physics",
    questionEn: "What is the SI unit of Electric Current and Luminous Intensity?",
    questionNe: "विद्युत धारा (Electric Current) र ज्योति तीव्रता (Luminous Intensity) को एस.आई. (SI) एकाइ क्रमशः के हुन्?",
    optionAEn: "Volt and Watt",
    optionANe: "भोल्ट र वाट",
    optionBEn: "Ampere and Candela",
    optionBNe: "एम्पियर र क्यान्डेला",
    optionCEn: "Ohm and Lumen",
    optionCNe: "ओम र लुमेन",
    optionDEn: "Coulomb and Lux",
    optionDNe: "कुलम्ब र लक्स",
    correctOption: "B",
    explanationEn:
      "Among the 7 base SI units, Ampere (A) is the unit of electric current and Candela (cd) is the unit of luminous intensity.",
    explanationNe:
      "७ आधारभूत SI एकाइहरूमध्ये विद्युत धाराको एकाइ एम्पियर (Ampere) र ज्योति तीव्रताको एकाइ क्यान्डेला (Candela) हो।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  // 30. Chemistry
  {
    topicSlug: "chemistry",
    questionEn: "Which gas is primarily responsible for the depletion of the stratospheric ozone layer?",
    questionNe: "वायुमण्डलको ओजोन तह (Ozone Layer) विनाश गर्न प्रमुख भूमिका खेल्ने ग्यास कुन हो?",
    optionAEn: "Chlorofluorocarbons (CFCs)",
    optionANe: "क्लोरोफ्लोरोकार्बन (CFCs)",
    optionBEn: "Nitrogen Dioxide",
    optionBNe: "नाइट्रोजन डाइअक्साइड",
    optionCEn: "Carbon Monoxide",
    optionCNe: "कार्बन मोनोअक्साइड",
    optionDEn: "Argon",
    optionDNe: "आर्गन",
    correctOption: "A",
    explanationEn:
      "Chlorofluorocarbons (CFCs) release chlorine atoms in the stratosphere that catalytically destroy ozone (O3) molecules; regulated globally by the 1987 Montreal Protocol.",
    explanationNe:
      "क्लोरोफ्लोरोकार्बन (CFCs) बाट निस्कने क्लोरिन परमाणुले समतापमण्डलमा रहेको ओजोन तह नष्ट गर्दछ। यसलाई सन् १९८७ को मोन्ट्रियल प्रोटोकलले नियन्त्रण गरेको छ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  // 31. Biology
  {
    topicSlug: "biology",
    questionEn: "Which organelle of a eukaryotic cell is known as the 'Powerhouse of the Cell'?",
    questionNe: "कोष (Cell) को कुन अङ्गलाई 'कोषको शक्ति गृह' (Powerhouse of the Cell) भनिन्छ?",
    optionAEn: "Ribosome",
    optionANe: "राइबोसोम",
    optionBEn: "Mitochondria",
    optionBNe: "माइटोकोन्ड्रिया",
    optionCEn: "Golgi apparatus",
    optionCNe: "गल्गी बडी",
    optionDEn: "Lysosome",
    optionDNe: "लाइसोसोम",
    correctOption: "B",
    explanationEn:
      "Mitochondria generate most of the cell's supply of adenosine triphosphate (ATP) through cellular respiration, hence called the powerhouse of the cell.",
    explanationNe:
      "माइटोकोन्ड्रियाले कोषीय श्वासप्रश्वासमार्फत ATP का रूपमा ऊर्जा उत्पादन गर्ने भएकाले यसलाई कोषको शक्ति गृह भनिन्छ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  // 32. Human body
  {
    topicSlug: "human-body",
    questionEn: "Which is the largest internal organ and gland in the human body?",
    questionNe: "मानव शरीरको सबैभन्दा ठूलो आन्तरिक अङ्ग तथा ग्रन्थि कुन हो?",
    optionAEn: "Pancreas",
    optionANe: "प्यान्क्रियाज (अग्न्याशय)",
    optionBEn: "Liver",
    optionBNe: "कलेजो (Liver)",
    optionCEn: "Thyroid gland",
    optionCNe: "थाइराइड ग्रन्थि",
    optionDEn: "Kidney",
    optionDNe: "मिर्गौला",
    correctOption: "B",
    explanationEn:
      "The liver is both the largest internal organ and the largest gland in the human body, producing bile and performing vital metabolic detoxification.",
    explanationNe:
      "कलेजो (Liver) मानव शरीरको सबैभन्दा ठूलो आन्तरिक अङ्ग र सबैभन्दा ठूलो ग्रन्थि हो।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  // 33. Environment
  {
    topicSlug: "environment",
    questionEn:
      "How many Ramsar wetland sites are designated in Nepal (including Koshi Tappu, Rara, Phewa, Gosaikunda, etc.)?",
    questionNe:
      "नेपालमा रामसार (Ramsar) सूचीमा सूचीकृत सिमसार क्षेत्रहरूको संख्या कति रहेको छ?",
    optionAEn: "8",
    optionANe: "८",
    optionBEn: "10",
    optionBNe: "१०",
    optionCEn: "12",
    optionCNe: "१२",
    optionDEn: "9",
    optionDNe: "९",
    correctOption: "B",
    explanationEn:
      "Nepal has 10 Ramsar wetlands of international importance: Koshi Tappu (first, 1987), Beeshazar, Ghodaghodi, Jagadishpur, Gosaikunda, Gokyo, Phoksundo, Rara, Mai Pokhari, and Lake Cluster of Pokhara Valley (2016).",
    explanationNe:
      "नेपालमा कोशीटप्पु (सन् १९८७) देखि पोखरा उपत्यकाका ताल समूह (सन् २०१६) सम्म गरी जम्मा १० वटा सिमसार क्षेत्र रामसार सूचीमा सूचीकृत छन्।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Nayab Subba 2079 BS",
  },
  // 34. Information technology
  {
    topicSlug: "information-technology",
    questionEn:
      "Which mobile application was launched by the Government of Nepal as an integrated digital platform to deliver public services to citizens?",
    questionNe:
      "नेपाल सरकारले नागरिकलाई सरकारी सेवाहरू एकीकृत रूपमा डिजिटल माध्यमबाट प्रदान गर्न सञ्चालनमा ल्याएको मोबाइल एप कुन हो?",
    optionAEn: "Nagarik App",
    optionANe: "नागरिक एप (Nagarik App)",
    optionBEn: "e-Sewa Sewa",
    optionBNe: "ई-सेवा पोर्टल",
    optionCEn: "Mero Sarkar App",
    optionCNe: "मेरो सरकार एप",
    optionDEn: "Loksewa Connect",
    optionDNe: "लोकसेवा कनेक्ट",
    correctOption: "A",
    explanationEn:
      "Nagarik App was launched (beta in Magh 2077 BS) under the Digital Nepal Framework to integrate PAN, Citizenship, Passport, Voter ID, Social Security Fund, and Loksewa services.",
    explanationNe:
      "डिजिटल नेपाल फ्रेमवर्क अन्तर्गत नागरिकता, प्यान, राहदानी, मतदाता परिचयपत्र लगायत सरकारी सेवा एकै स्थानबाट दिन 'नागरिक एप' सञ्चालनमा ल्याइएको हो।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
  },
  // 35. Computer fundamentals
  {
    topicSlug: "computer-fundamentals",
    questionEn: "In computer memory hierarchy, 1 Gigabyte (GB) equals how many Megabytes (MB) in binary standard?",
    questionNe: "कम्प्युटर मेमोरीको बाइनरी मानक अनुसार १ गिगाबाइट (1 GB) बराबर कति मेगाबाइट (MB) हुन्छ?",
    optionAEn: "1000 MB",
    optionANe: "१००० MB",
    optionBEn: "1024 MB",
    optionBNe: "१०२४ MB",
    optionCEn: "512 MB",
    optionCNe: "५१२ MB",
    optionDEn: "2048 MB",
    optionDNe: "२०४८ MB",
    correctOption: "B",
    explanationEn:
      "In binary computing standards (2^10), 1 Kilobyte = 1024 Bytes, 1 Megabyte = 1024 KB, and 1 Gigabyte = 1024 MB.",
    explanationNe:
      "बाइनरी गणना प्रणाली (२^१०) अनुसार १ मेगाबाइट = १०२४ किलोबाइट र १ गिगाबाइट = १०२४ मेगाबाइट हुन्छ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  // 36. Space and astronomy
  {
    topicSlug: "space-and-astronomy",
    questionEn:
      "What was the name of Nepal's first nanosatellite launched into space in April 2019 (2076 Baisakh 5 BS)?",
    questionNe:
      "वि.सं. २०७६ वैशाख ५ गते (सन् २०१९ अप्रिल) अन्तरिक्षमा प्रक्षेपण गरिएको नेपालको पहिलो भू-उपग्रह (नानो स्याटेलाइट) को नाम के हो?",
    optionAEn: "NepaliSat-1",
    optionANe: "नेपालीस्याट-१ (NepaliSat-1)",
    optionBEn: "SagarmathaSat-1",
    optionBNe: "सगरमाथास्याट-१",
    optionCEn: "Munal-1",
    optionCNe: "मुनाल-१",
    optionDEn: "Danphe-1",
    optionDNe: "डाँफे-१",
    correctOption: "A",
    explanationEn:
      "NepaliSat-1, developed by Nepali scientists Abhas Maskey and Hariram Shrestha under NAST & Kyushu Institute of Technology (BIRDS-3 project), was launched on 18 April 2019.",
    explanationNe:
      "नास्ट (NAST) को पहलमा नेपाली वैज्ञानिक आभास मास्के र हरिराम श्रेष्ठले निर्माण गरेको 'नेपालीस्याट-१' वि.सं. २०७६ वैशाख ५ गते प्रक्षेपण गरिएको थियो।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Kharidar 2079 BS",
  },
  // 37. Recent scientific developments
  {
    topicSlug: "recent-scientific-developments",
    questionEn:
      "Which space telescope, launched by NASA, ESA, and CSA, operates primarily in the infrared spectrum at Sun-Earth Lagrange Point 2 (L2)?",
    questionNe:
      "नासा (NASA), युरोपेली अन्तरिक्ष एजेन्सी र क्यानडाली अन्तरिक्ष एजेन्सीद्वारा संयुक्त रूपमा प्रक्षेपित कुन टेलिस्कोपले सूर्य-पृथ्वी ल्याग्रान्ज बिन्दु २ (L2) बाट इन्फ्रारेड तरङ्गमा ब्रह्माण्डको अवलोकन गर्दछ?",
    optionAEn: "Hubble Space Telescope",
    optionANe: "हबल स्पेस टेलिस्कोप",
    optionBEn: "James Webb Space Telescope (JWST)",
    optionBNe: "जेम्स वेब स्पेस टेलिस्कोप (JWST)",
    optionCEn: "Chandra X-ray Observatory",
    optionCNe: "चन्द्र एक्स-रे अब्जर्भेटरी",
    optionDEn: "Kepler Space Telescope",
    optionDNe: "केप्लर स्पेस टेलिस्कोप",
    correctOption: "B",
    explanationEn:
      "The James Webb Space Telescope (JWST), launched in December 2021, orbits around L2 (~1.5 million km from Earth) and observes the early universe in infrared light.",
    explanationNe:
      "सन् २०२१ डिसेम्बरमा प्रक्षेपण गरिएको जेम्स वेब स्पेस टेलिस्कोप (JWST) पृथ्वीबाट करिब १५ लाख कि.मि. टाढा L2 बिन्दुमा रहेर इन्फ्रारेड प्रविधिबाट ब्रह्माण्डको अध्ययन गर्दछ।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
];
