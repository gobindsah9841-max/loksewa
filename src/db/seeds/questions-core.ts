import type { QuestionSeed } from "./questions-gk";

export interface CurrentAffairSeed {
  titleEn: string;
  titleNe: string;
  summaryEn: string;
  summaryNe: string;
  keyPointsEn: string[];
  keyPointsNe: string[];
  category: string;
  publishedDateBs: string;
  publishedDateAd: string;
  linkedTopicSlug: string;
  isImportant: boolean;
}

export const CORE_QUESTION_SEEDS: QuestionSeed[] = [
  // B. Constitution and Governance (13 topics)
  {
    topicSlug: "const-constitution-of-nepal",
    questionEn:
      "Under which Article of the Constitution of Nepal 2072 is the provision for amendment of the Constitution laid down?",
    questionNe:
      "नेपालको संविधान २०७२ को कुन धारामा संविधान संशोधन सम्बन्धी व्यवस्था गरिएको छ?",
    optionAEn: "Article 272",
    optionANe: "धारा २७२",
    optionBEn: "Article 274",
    optionBNe: "धारा २७४",
    optionCEn: "Article 276",
    optionCNe: "धारा २७६",
    optionDEn: "Article 304",
    optionDNe: "धारा ३०४",
    correctOption: "B",
    explanationEn:
      "Article 274 (Part 31) of the Constitution of Nepal governs Constitutional Amendment, requiring a two-thirds majority of all existing members of both Houses of the Federal Parliament, while sovereignty, territorial integrity, independence, and sovereignty vested in the people cannot be amended.",
    explanationNe:
      "नेपालको संविधानको भाग ३१ को धारा २७४ मा संविधान संशोधन सम्बन्धी व्यवस्था छ। नेपालको सार्वभौमिकता, भौगोलिक अखण्डता, स्वाधीनता र जनतामा निहित सार्वभौमसत्ता बाहेक अन्य विषय संघीय संसदको दुवै सदनको तत्काल कायम रहेको सम्पूर्ण सदस्य संख्याको कम्तीमा दुई तिहाइ बहुमतले संशोधन गर्न सक्ने व्यवस्था छ।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Nayab Subba 2080 BS",
    isImportant: true,
    isDailyChallenge: true,
  },
  {
    topicSlug: "fundamental-rights",
    questionEn:
      "Which Fundamental Rights under Part 3 of the Constitution of Nepal (Articles 16–46) CANNOT be suspended even during a Proclamation of Emergency under Article 273(10)?",
    questionNe:
      "नेपालको संविधानको धारा २७३(१०) बमोजिम संकटकालीन अवस्था घोषणा भएको बखत समेत निलम्बन नहुने मौलिक हक कुन-कुन हुन्?",
    optionAEn: "Right to Freedom of Expression (Art 17) and Right to Property (Art 25)",
    optionANe: "विचार र अभिव्यक्ति स्वतन्त्रता (धारा १७) र सम्पत्तिको हक (धारा २५)",
    optionBEn: "Right to Live with Dignity (Art 16), Right to Justice (Art 20(9)), Right against Torture (Art 22), Habeas Corpus (Art 46), etc.",
    optionBNe: "सम्मानपूर्वक बाँच्न पाउने हक (धारा १६), स्वच्छ सुनुवाइ (धारा २०(९)), यातना विरुद्धको हक (धारा २२), बन्दीप्रत्यक्षीकरण (धारा ४६) आदि",
    optionCEn: "Right to Information (Art 27) and Right to Privacy (Art 28)",
    optionCNe: "सूचनाको हक (धारा २७) र गोपनीयताको हक (धारा २८)",
    optionDEn: "Right to Employment (Art 33) and Right to Labour (Art 34)",
    optionDNe: "रोजगारीको हक (धारा ३३) र श्रमको हक (धारा ३४)",
    correctOption: "B",
    explanationEn:
      "Under the proviso to Article 273(10), Articles 16, 17(2)(a)-(d) (except assembly/movement restrictions), 18, 19(2), 20, 21, 22, 24, 26(1), 29, 30, 31, 32, 35, 36, 38, 39, 40, 42, 43, 45, and the right to constitutional remedy (Art 46) for habeas corpus cannot be suspended during an emergency.",
    explanationNe:
      "संविधानको धारा २७३(१०) को प्रतिबन्धात्मक वाक्यांश अनुसार संकटकालमा पनि धारा १६, १८, २०, २१, २२, २४, २९, ३०, ३१, ३२, ३५, ३६, ३८, ३९, ४०, ४२, ४३, ४५ र बन्दीप्रत्यक्षीकरणको उपचारको हक निलम्बन हुँदैनन्।",
    difficulty: "hard",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Section Officer 2079 BS",
    isImportant: true,
  },
  {
    topicSlug: "directive-principles",
    questionEn:
      "Which Article of the Constitution of Nepal explicitly states that no question shall be raised in any court as to whether any matter contained in Part 4 (Directive Principles, Policies and Obligations of the State) has been implemented?",
    questionNe:
      "नेपालको संविधानको कुन धारामा भाग ४ (राज्यका निर्देशक सिद्धान्त, नीति तथा दायित्व) मा लेखिएका विषय कार्यान्वयन भए वा नभएको सम्बन्धमा कुनै अदालतमा प्रश्न उठाउन नसकिने व्यवस्था छ?",
    optionAEn: "Article 50",
    optionANe: "धारा ५०",
    optionBEn: "Article 54",
    optionBNe: "धारा ५४",
    optionCEn: "Article 55",
    optionCNe: "धारा ५५",
    optionDEn: "Article 53",
    optionDNe: "धारा ५३",
    correctOption: "C",
    explanationEn:
      "Article 55 ('Questions not to be raised in court') states that no question shall be raised in any court as to whether any matter contained in Part 4 has been implemented, while Article 54 provides for a Parliamentary Monitoring Committee.",
    explanationNe:
      "संविधानको धारा ५५ मा भाग ४ मा लेखिएका कुनै विषय कार्यान्वयन भए वा नभएको सम्बन्धमा कुनै अदालतमा प्रश्न उठाउन नसकिने व्यवस्था छ भने धारा ५४ मा संसदीय अनुगमन समितिको व्यवस्था छ।",
    difficulty: "medium",
    commission: "Bagmati PPSC",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Bagmati PPSC 5th Level 2080 BS",
  },
  {
    topicSlug: "federalism",
    questionEn:
      "In the Constitution of Nepal 2072, which Schedules list the Exclusive Powers of the Federation, Provinces, and Local Level respectively?",
    questionNe:
      "नेपालको संविधान २०७२ को कुन-कुन अनुसूचीमा क्रमशः संघ, प्रदेश र स्थानीय तहको एकल अधिकार सूची उल्लेख गरिएको छ?",
    optionAEn: "Schedules 5, 6, and 8",
    optionANe: "अनुसूची ५, ६ र ८",
    optionBEn: "Schedules 4, 5, and 6",
    optionBNe: "अनुसूची ४, ५ र ६",
    optionCEn: "Schedules 5, 7, and 9",
    optionCNe: "अनुसूची ५, ७ र ९",
    optionDEn: "Schedules 6, 7, and 8",
    optionDNe: "अनुसूची ६, ७ र ८",
    correctOption: "A",
    explanationEn:
      "Schedule 5 = Exclusive Powers of Federation (35 items); Schedule 6 = Exclusive Powers of Province (21 items); Schedule 7 = Concurrent Powers of Federation & Province (25 items); Schedule 8 = Exclusive Powers of Local Level (22 items); Schedule 9 = Concurrent Powers of Federation, Province & Local Level (15 items).",
    explanationNe:
      "अनुसूची ५ मा संघको एकल अधिकार (३५), अनुसूची ६ मा प्रदेशको एकल अधिकार (२१), अनुसूची ७ मा संघ र प्रदेशको साझा अधिकार (२५), अनुसूची ८ मा स्थानीय तहको एकल अधिकार (२२) र अनुसूची ९ मा तीनै तहको साझा अधिकार (१५) रहेको छ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Nayab Subba 2081 BS",
    isImportant: true,
    isDailyChallenge: true,
  },
  {
    topicSlug: "legislative-structure",
    questionEn:
      "What is the total composition of the Federal Parliament of Nepal (House of Representatives + National Assembly) under Articles 84 and 86?",
    questionNe:
      "नेपालको संविधानको धारा ८४ र ८६ बमोजिम संघीय संसद (प्रतिनिधिसभा र राष्ट्रिय सभा) को कुल सदस्य संख्या कति हुन्छ?",
    optionAEn: "275 + 59 = 334 members",
    optionANe: "२७५ + ५९ = ३३४ सदस्य",
    optionBEn: "265 + 59 = 324 members",
    optionBNe: "२६५ + ५९ = ३२४ सदस्य",
    optionCEn: "275 + 60 = 335 members",
    optionCNe: "२७५ + ६० = ३३५ सदस्य",
    optionDEn: "240 + 59 = 299 members",
    optionDNe: "२४० + ५९ = २९९ सदस्य",
    correctOption: "A",
    explanationEn:
      "The House of Representatives has 275 members (165 FPTP + 110 Proportional Representation) and the National Assembly has 59 members (56 elected from 7 provinces — 8 each — plus 3 nominated by the President), totaling 334 members.",
    explanationNe:
      "प्रतिनिधिसभामा २७५ सदस्य (१६५ प्रत्यक्ष र ११० समानुपातिक) र राष्ट्रिय सभामा ५९ सदस्य (प्रत्येक प्रदेशबाट ८ जनाका दरले ५६ निर्वाचित र राष्ट्रपतिबाट ३ मनोनित) गरी संघीय संसदमा कुल ३३४ सदस्य रहन्छन्।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
  },
  {
    topicSlug: "executive-structure",
    questionEn:
      "Under Article 76(9) of the Constitution of Nepal, what is the maximum number of Ministers (including the Prime Minister) in the Federal Council of Ministers?",
    questionNe:
      "नेपालको संविधानको धारा ७६(९) बमोजिम संघीय मन्त्रिपरिषद्मा प्रधानमन्त्री सहित बढीमा कति जना मन्त्री रहन सक्ने व्यवस्था छ?",
    optionAEn: "21 Ministers",
    optionANe: "२१ जना",
    optionBEn: "25 Ministers",
    optionBNe: "२५ जना",
    optionCEn: "29 Ministers",
    optionCNe: "२९ जना",
    optionDEn: "31 Ministers",
    optionDNe: "३१ जना",
    correctOption: "B",
    explanationEn:
      "Article 76(9) stipulates that the President shall, on the recommendation of the Prime Minister, constitute a Council of Ministers comprising a maximum of twenty-five Ministers including the Prime Minister.",
    explanationNe:
      "संविधानको धारा ७६(९) अनुसार राष्ट्रपतिले प्रधानमन्त्रीको सिफारिसमा संघीय संसदका सदस्यमध्येबाट समावेशी सिद्धान्त बमोजिम प्रधानमन्त्री सहित बढीमा २५ जना मन्त्री रहेको मन्त्रिपरिषद् गठन गर्ने व्यवस्था छ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Kharidar 2080 BS",
  },
  {
    topicSlug: "judiciary",
    questionEn:
      "Which tier of court in Nepal exercises the jurisdiction to hear and settle writ petitions (Habeas Corpus, Mandamus, Certiorari, Prohibition, Quo Warranto) under Article 133 and Article 144?",
    questionNe:
      "नेपालको संविधानको धारा १३३ र १४४ बमोजिम असाधारण अधिकारक्षेत्र अन्तर्गत रिट (बन्दीप्रत्यक्षीकरण, परमादेश, उत्प्रेषण, प्रतिषेध, अधिकारपृच्छा) जारी गर्ने अधिकार कुन अदालतलाई छ?",
    optionAEn: "Supreme Court only",
    optionANe: "सर्वोच्च अदालतलाई मात्र",
    optionBEn: "Supreme Court (Art 133) and High Courts (Art 144)",
    optionBNe: "सर्वोच्च अदालत (धारा १३३) र उच्च अदालत (धारा १४४) दुवैलाई",
    optionCEn: "Supreme Court, High Courts, and District Courts",
    optionCNe: "सर्वोच्च, उच्च र जिल्ला अदालत तीनै तहलाई",
    optionDEn: "Constitutional Bench only",
    optionDNe: "संवैधानिक इजलासलाई मात्र",
    correctOption: "B",
    explanationEn:
      "Both the Supreme Court (under Article 133(2)/(3)) and the High Courts (under Article 144(1)/(2)) possess extraordinary writ jurisdiction to issue writs of habeas corpus, mandamus, certiorari, prohibition, and quo warranto.",
    explanationNe:
      "संविधानको धारा १३३ बमोजिम सर्वोच्च अदालत र धारा १४४ बमोजिम उच्च अदालतलाई मौलिक हकको प्रचलन वा कानुनी हकको उपचारका लागि पाँच प्रकारका रिट जारी गर्ने असाधारण अधिकारक्षेत्र रहेको छ।",
    difficulty: "medium",
    commission: "Gandaki PPSC",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
  },
  {
    topicSlug: "constitutional-bodies",
    questionEn:
      "How many Constitutional Bodies are provisioned in Parts 21 to 27 of the Constitution of Nepal 2072?",
    questionNe:
      "नेपालको संविधान २०७२ को भाग २१ देखि भाग २७ सम्म जम्मा कति वटा संवैधानिक निकायहरूको व्यवस्था गरिएको छ?",
    optionAEn: "10 Constitutional Bodies",
    optionANe: "१० वटा संवैधानिक निकाय",
    optionBEn: "13 Constitutional Bodies",
    optionBNe: "१३ वटा संवैधानिक निकाय",
    optionCEn: "11 Constitutional Bodies",
    optionCNe: "११ वटा संवैधानिक निकाय",
    optionDEn: "15 Constitutional Bodies",
    optionDNe: "१५ वटा संवैधानिक निकाय",
    correctOption: "B",
    explanationEn:
      "There are 13 Constitutional Bodies in the Constitution of Nepal 2072: CIAA (Part 21), Auditor General (22), Public Service Commission (23), Election Commission (24), NHRC (25), National Natural Resources & Fiscal Commission (26), and 7 Commissions under Part 27 (Women, Dalit, Inclusion, Indigenous Nationalities, Madhesi, Tharu, Muslim).",
    explanationNe:
      "नेपालको संविधानको भाग २१ देखि २७ सम्म अख्तियार, महालेखापरीक्षक, लोकसेवा आयोग, निर्वाचन आयोग, राष्ट्रिय मानव अधिकार आयोग, राष्ट्रिय प्राकृतिक स्रोत तथा वित्त आयोग र भाग २७ अन्तर्गतका ७ आयोग गरी कुल १३ संवैधानिक निकाय छन्।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Nayab Subba 2080 BS",
    isImportant: true,
    isDailyChallenge: true,
  },
  {
    topicSlug: "election-system",
    questionEn:
      "What is the minimum percentage of total valid votes required for a political party to secure proportional representation seats in the House of Representatives (Election Threshold)?",
    questionNe:
      "प्रतिनिधिसभाको समानुपातिक निर्वाचन प्रणालीतर्फ सिट प्राप्त गर्न राजनीतिक दलले कुल सदर मतको कति प्रतिशत मत (थ्रेसहोल्ड) प्राप्त गर्नुपर्दछ?",
    optionAEn: "1.5% of valid votes",
    optionANe: "१.५ प्रतिशत मत",
    optionBEn: "3% of valid votes",
    optionBNe: "३ प्रतिशत मत",
    optionCEn: "5% of valid votes",
    optionCNe: "५ प्रतिशत मत",
    optionDEn: "2% of valid votes",
    optionDNe: "२ प्रतिशत मत",
    correctOption: "B",
    explanationEn:
      "Under the House of Representatives Member Election Act 2074, a party must win at least 3% of total valid proportional votes (and at least 1 FPTP seat to get national party status), while for Provincial Assembly the PR threshold is 1.5%.",
    explanationNe:
      "प्रतिनिधिसभा सदस्य निर्वाचन ऐन २०७४ अनुसार समानुपातिक सिट पाउन कुल सदर मतको कम्तीमा ३ प्रतिशत मत (र राष्ट्रिय दल बन्न प्रत्यक्षमा कम्तीमा १ सिट) प्राप्त गर्नुपर्छ। प्रदेशसभामा थ्रेसहोल्ड १.५ प्रतिशत छ।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "public-policy",
    questionEn:
      "Which apex policy-making body chaired by the Prime Minister formulates Nepal's periodic development plans and national policy frameworks?",
    questionNe:
      "प्रधानमन्त्रीको अध्यक्षतामा रहने कुन सर्वोच्च निकायले नेपालको आवधिक विकास योजना र राष्ट्रिय नीति तर्जुमा तथा स्वीकृति गर्दछ?",
    optionAEn: "National Planning Commission & National Development Council",
    optionANe: "राष्ट्रिय योजना आयोग र राष्ट्रिय विकास परिषद्",
    optionBEn: "Policy Research Institute",
    optionBNe: "नीति अनुसन्धान प्रतिष्ठान",
    optionCEn: "Public Expenditure Review Commission",
    optionCNe: "सार्वजनिक खर्च पुनरावलोकन आयोग",
    optionDEn: "Inter-Provincial Council",
    optionDNe: "अन्तरप्रदेश परिषद्",
    correctOption: "A",
    explanationEn:
      "The National Planning Commission (NPC) prepares periodic plans and national development policies, which are reviewed and approved by the National Development Council (NDC), both chaired by the Prime Minister.",
    explanationNe:
      "प्रधानमन्त्री अध्यक्ष रहने राष्ट्रिय योजना आयोगले आवधिक योजनाको मस्यौदा तर्जुमा गर्छ र राष्ट्रिय विकास परिषद्ले स्वीकृत गर्दछ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "local-government",
    questionEn:
      "Under the Local Government Operation Act 2074 (स्थानीय सरकार सञ्चालन ऐन २०७४), within which date must a Rural Municipality or Municipality table its annual budget before the Village/Municipal Assembly?",
    questionNe:
      "स्थानीय सरकार सञ्चालन ऐन २०७४ बमोजिम गाउँपालिका वा नगरपालिकाले आगामी आर्थिक वर्षको राजस्व र व्ययको अनुमान (बजेट) कहिलेभित्र सभामा पेश गरिसक्नुपर्ने व्यवस्था छ?",
    optionAEn: "Ashadh 10",
    optionANe: "असार १० गतेभित्र",
    optionBEn: "Jestha 15",
    optionBNe: "जेठ १५ गतेभित्र",
    optionCEn: "Ashadh 1",
    optionCNe: "असार १ गतेभित्र",
    optionDEn: "Ashadh 25",
    optionDNe: "असार २५ गतेभित्र",
    correctOption: "A",
    explanationEn:
      "Budget calendar in Nepal: Federal Budget on Jestha 15 (Constitutional Art 119), Provincial Budget on Ashadh 1 (Inter-Governmental Fiscal Management Act), and Local Level Budget by Ashadh 10 (Local Government Operation Act 2074, Sec 71).",
    explanationNe:
      "संघीय बजेट जेठ १५ गते (संविधानको धारा ११९), प्रदेश बजेट असार १ गते र स्थानीय तहको बजेट असार १० गतेभित्र (स्थानीय सरकार सञ्चालन ऐन २०७४ को दफा ७१) पेश गर्नुपर्ने कानुनी व्यवस्था छ।",
    difficulty: "easy",
    commission: "Lumbini PPSC",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Lumbini PPSC 5th Level 2080 BS",
    isImportant: true,
  },
  {
    topicSlug: "provincial-government",
    questionEn:
      "Under Article 168(9) of the Constitution of Nepal, the size of a Provincial Council of Ministers cannot exceed what percentage of the total number of members of the Provincial Assembly?",
    questionNe:
      "नेपालको संविधानको धारा १६८(९) बमोजिम प्रदेश मन्त्रिपरिषद्को सदस्य संख्या प्रदेशसभाको कुल सदस्य संख्याको कति प्रतिशतभन्दा बढी नहुने गरी गठन गर्नुपर्ने व्यवस्था छ?",
    optionAEn: "10%",
    optionANe: "१० प्रतिशत",
    optionBEn: "15%",
    optionBNe: "१५ प्रतिशत",
    optionCEn: "20%",
    optionCNe: "२० प्रतिशत",
    optionDEn: "25%",
    optionDNe: "२५ प्रतिशत",
    correctOption: "C",
    explanationEn:
      "Article 168(9) mandates that the Chief Minister and Ministers in a Provincial Council of Ministers shall not exceed twenty percent (20%) of the total number of members of the concerned Provincial Assembly.",
    explanationNe:
      "नेपालको संविधानको धारा १६८(९) अनुसार प्रदेश मन्त्रिपरिषद्मा मुख्यमन्त्री सहित प्रदेशसभाको कुल सदस्य संख्याको २० प्रतिशतभन्दा बढी नहुने गरी मन्त्री रहने व्यवस्था छ।",
    difficulty: "easy",
    commission: "Koshi PPSC",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Koshi PPSC 5th Level 2081 BS",
  },
  {
    topicSlug: "governance-and-accountability",
    questionEn:
      "Which body is constitutionally mandated under Article 234 of the Constitution of Nepal to resolve political disputes arising between the Federation and a Province, or between Provinces?",
    questionNe:
      "संघ र प्रदेशबीच तथा प्रदेश-प्रदेशबीच उत्पन्न हुने राजनीतिक विवाद समाधान गर्न नेपालको संविधानको धारा २३४ मा कुन निकायको व्यवस्था गरिएको छ?",
    optionAEn: "Inter-Provincial Council (अन्तरप्रदेश परिषद्)",
    optionANe: "अन्तरप्रदेश परिषद् (Inter-Provincial Council)",
    optionBEn: "National Coordination Council",
    optionBNe: "राष्ट्रिय समन्वय परिषद्",
    optionCEn: "Constitutional Bench of Supreme Court",
    optionCNe: "सर्वोच्च अदालतको संवैधानिक इजलास",
    optionDEn: "Inter-Governmental Fiscal Council",
    optionDNe: "अन्तरसरकारी वित्त परिषद्",
    correctOption: "A",
    explanationEn:
      "Article 234 establishes the Inter-Provincial Council chaired by the Prime Minister, with the Federal Home Minister, Federal Finance Minister, and Chief Ministers of the concerned Provinces as members.",
    explanationNe:
      "संविधानको धारा २३४ बमोजिम संघ र प्रदेशबीच तथा प्रदेश-प्रदेशबीचको राजनीतिक विवाद समाधान गर्न प्रधानमन्त्रीको अध्यक्षतामा अन्तरप्रदेश परिषद् रहने व्यवस्था छ।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
  },

  // C. Public Administration (12 topics)
  {
    topicSlug: "principles-of-administration",
    questionEn:
      "Who coined the famous acronym 'POSDCORB' summarizing the seven core functions of management and administration?",
    questionNe:
      "व्यवस्थापन र प्रशासनका सात प्रमुख कार्यहरूलाई समेट्ने प्रसिद्ध सूत्र 'POSDCORB' का प्रतिपादक को हुन्?",
    optionAEn: "Henri Fayol",
    optionANe: "हेनरी फेयोल",
    optionBEn: "Luther Gulick (with Lyndall Urwick)",
    optionBNe: "लुथर गुलिक",
    optionCEn: "Frederick Winslow Taylor",
    optionCNe: "एफ.डब्लु. टेलर",
    optionDEn: "Woodrow Wilson",
    optionDNe: "उड्रो विल्सन",
    correctOption: "B",
    explanationEn:
      "Luther Gulick (in his 1937 paper 'Notes on the Theory of Organization' with Lyndall Urwick) coined POSDCORB: Planning, Organizing, Staffing, Directing, Coordinating, Reporting, and Budgeting.",
    explanationNe:
      "लुथर गुलिकले सन् १९३७ मा 'POSDCORB' (Planning, Organizing, Staffing, Directing, Coordinating, Reporting, Budgeting) को अवधारणा प्रतिपादन गरेका हुन्।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Nayab Subba 2079 BS",
    isImportant: true,
  },
  {
    topicSlug: "bureaucracy",
    questionEn:
      "According to German sociologist Max Weber, modern bureaucracy is primarily based on which type of authority?",
    questionNe:
      "जर्मन समाजशास्त्री म्याक्स वेबर (Max Weber) का अनुसार आधुनिक कर्मचारीतन्त्र कुन प्रकारको अख्तियारी (Authority) मा आधारित हुन्छ?",
    optionAEn: "Traditional Authority",
    optionANe: "परम्परागत अख्तियारी",
    optionBEn: "Charismatic Authority",
    optionBNe: "चमत्कारिक अख्तियारी",
    optionCEn: "Legal-Rational Authority",
    optionCNe: "कानुनी-तार्किक अख्तियारी (Legal-Rational Authority)",
    optionDEn: "Patrimonial Authority",
    optionDNe: "पैतृक अख्तियारी",
    correctOption: "C",
    explanationEn:
      "Max Weber classified authority into Traditional, Charismatic, and Legal-Rational. Ideal-type bureaucracy rests on Legal-Rational authority characterized by hierarchy, division of labor, written rules, impersonality, and merit selection.",
    explanationNe:
      "म्याक्स वेबरका अनुसार आधुनिक कर्मचारीतन्त्र लिखित नियम, पदसोपान, श्रम विभाजन र योग्यता प्रणालीमा आधारित 'कानुनी-तार्किक अख्तियारी' (Legal-Rational Authority) मा आधारित हुन्छ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "civil-service",
    questionEn:
      "Under the Civil Service Act 2049 (निजामती सेवा ऐन २०४९) of Nepal, what is the compulsory retirement age for civil servants?",
    questionNe:
      "निजामती सेवा ऐन २०४९ बमोजिम निजामती कर्मचारीको अनिवार्य अवकाश हुने उमेर हद कति वर्ष रहेको छ?",
    optionAEn: "58 years",
    optionANe: "५८ वर्ष",
    optionBEn: "60 years",
    optionBNe: "६० वर्ष",
    optionCEn: "62 years",
    optionCNe: "६२ वर्ष",
    optionDEn: "55 years",
    optionDNe: "५५ वर्ष",
    correctOption: "A",
    explanationEn:
      "Under Section 33 of the Civil Service Act 2049, the compulsory retirement age for civil servants in Nepal is 58 years (whereas Health Service Act 2053 sets 60 years for health service personnel).",
    explanationNe:
      "निजामती सेवा ऐन २०४९ को दफा ३३ अनुसार निजामती कर्मचारीको अनिवार्य अवकाश उमेर ५८ वर्ष रहेको छ (स्वास्थ्य सेवा ऐन २०५३ अन्तर्गत ६० वर्ष छ)।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Kharidar 2080 BS",
    isImportant: true,
  },
  {
    topicSlug: "public-service-delivery",
    questionEn:
      "In which year was the Citizen Charter (नागरिक बडापत्र) first introduced globally by Prime Minister John Major in the UK, and when was it formally initiated in Nepal's public administration?",
    questionNe:
      "विश्वमा सर्वप्रथम सन् १९९१ मा बेलायतबाट सुरु भएको 'नागरिक बडापत्र' (Citizen Charter) नेपालको सार्वजनिक प्रशासनमा कहिलेदेखि लागू गरिएको हो?",
    optionAEn: "2056 BS (1999 AD)",
    optionANe: "वि.सं. २०५६",
    optionBEn: "2061 BS (2004 AD)",
    optionBNe: "वि.सं. २०६१",
    optionCEn: "2064 BS (2007 AD)",
    optionCNe: "वि.सं. २०६४",
    optionDEn: "2052 BS (1995 AD)",
    optionDNe: "वि.सं. २०५२",
    correctOption: "A",
    explanationEn:
      "Citizen Charter was pioneered in the UK in 1991, introduced in Nepal in 2056 BS (1999 AD) via administrative directives, and legally institutionalized under Section 25 of the Good Governance (Management and Operation) Act 2064.",
    explanationNe:
      "नेपालमा वि.सं. २०५६ देखि सरकारी कार्यालयहरूमा नागरिक बडापत्र राख्न थालिएको हो र सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन २०६४ को दफा २५ ले यसलाई कानुनी रूपमा अनिवार्य बनाएको छ।",
    difficulty: "medium",
    commission: "Bagmati PPSC",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
  },
  {
    topicSlug: "good-governance",
    questionEn:
      "Under the Good Governance (Management and Operation) Act 2064 (सुशासन ऐन २०६४), within how many days must a decision be made if no specific time limit is prescribed by law for a public service application?",
    questionNe:
      "सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन २०६४ बमोजिम कुनै विषयमा निर्णय गर्न कानुनमा निश्चित अवधि नतोकिएकोमा सम्बन्धित अधिकारीले कति दिनभित्र निर्णय गरिसक्नुपर्ने व्यवस्था छ?",
    optionAEn: "Within 7 days",
    optionANe: "७ दिनभित्र",
    optionBEn: "Within 15 days",
    optionBNe: "१५ दिनभित्र",
    optionCEn: "Within 30 days",
    optionCNe: "३० दिनभित्र",
    optionDEn: "Within 45 days",
    optionDNe: "४५ दिनभित्र",
    correctOption: "B",
    explanationEn:
      "Under Section 15(2) of the Good Governance (Management and Operation) Act 2064, where no time period is specified by prevailing law, the responsible officer must make a decision within 15 days.",
    explanationNe:
      "सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन २०६४ को दफा १५(२) बमोजिम प्रचलित कानुनमा अवधि नतोकिएको विषयमा सम्बन्धित अधिकारीले १५ दिनभित्र निर्णय गरिसक्नुपर्ने व्यवस्था छ।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Nayab Subba 2080 BS",
    isDailyChallenge: true,
  },
  {
    topicSlug: "administrative-law",
    questionEn:
      "What are the two foundational Latin maxims of the Principles of Natural Justice (प्राकृतिक न्यायको सिद्धान्त) in administrative law?",
    questionNe:
      "प्रशासकीय कानुनमा 'प्राकृतिक न्यायको सिद्धान्त' (Principles of Natural Justice) का दुई मुख्य आधारभूत स्तम्भ के-के हुन्?",
    optionAEn: "Nemo judex in causa sua (No one judge in own cause) & Audi alteram partem (Hear the other side)",
    optionANe: "आफ्नो मुद्दामा आफैं न्यायाधीश हुन नहुने र अर्को पक्षको कुरा पनि सुन्नुपर्ने",
    optionBEn: "Ultra vires & Intra vires",
    optionBNe: "अधिकारक्षेत्र बाहिर र अधिकारक्षेत्र भित्र",
    optionCEn: "Res judicata & Sub judice",
    optionCNe: "प्राङ्न्याय र विचाराधीन मुद्दा",
    optionDEn: "Locus standi & Bona fide",
    optionDNe: "हकदैया र असल नियत",
    correctOption: "A",
    explanationEn:
      "Natural Justice rests on two pillars: (1) Rule against bias — 'Nemo judex in causa sua' (no one should be a judge in their own cause) and (2) Fair hearing — 'Audi alteram partem' (hear the other side before deciding).",
    explanationNe:
      "प्राकृतिक न्यायको सिद्धान्तका दुई मुख्य आधारहरू: १) पूर्वाग्रह विरुद्धको नियम (आफ्नो मुद्दामा आफैं न्यायाधीश बन्न नहुने) र २) स्वच्छ सुनुवाइको नियम (अर्को पक्षको सफाइ/भनाइ सुनेर मात्र निर्णय गर्नुपर्ने) हुन्।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "human-resource-management",
    questionEn:
      "In Human Resource Management, which four sequential functions represent the core cycle of managing public personnel?",
    questionNe:
      "सार्वजनिक मानव संसाधन व्यवस्थापन (HRM) का चार प्रमुख क्रमबद्ध प्रक्रियाहरू कुन-कुन हुन्?",
    optionAEn: "Acquisition, Development, Motivation, and Maintenance",
    optionANe: "प्राप्ति (Acquisition), विकास (Development), उत्प्रेरणा (Motivation) र सम्भार (Maintenance)",
    optionBEn: "Planning, Budgeting, Auditing, and Reporting",
    optionBNe: "योजना, बजेट, लेखापरीक्षण र प्रतिवेदन",
    optionCEn: "Registration, Dispatch, Filing, and Indexing",
    optionCNe: "दर्ता, चलानी, फाइलिङ र अनुक्रमणिका",
    optionDEn: "Centralization, Delegation, Devolution, and Privatization",
    optionDNe: "केन्द्रीकरण, प्रत्यायोजन, निक्षेपण र निजीकरण",
    correctOption: "A",
    explanationEn:
      "DeCenzo & Robbins define HRM through four core processes: Acquisition (recruitment/selection), Development (training/career), Motivation (compensation/appraisal), and Maintenance (safety/welfare/retention).",
    explanationNe:
      "मानव संसाधन व्यवस्थापनका चार मुख्य प्रक्रियाहरू प्राप्ति (भर्ना/छनौट), विकास (तालिम/वृति विकास), उत्प्रेरणा (तलब/मूल्यांकन) र सम्भार (सुरक्षा/कल्याण) हुन्।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "financial-administration",
    questionEn:
      "Under the Financial Procedure and Fiscal Accountability Act 2076 (आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन २०७६), who is designated as the Chief Accounting Officer (प्रमुख लेखा उत्तरदायी अधिकृत) of a Ministry?",
    questionNe:
      "आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन २०७६ बमोजिम मन्त्रालयको 'प्रमुख लेखा उत्तरदायी अधिकृत' (Chief Accounting Officer) को हुने व्यवस्था छ?",
    optionAEn: "The Minister of the concerned Ministry",
    optionANe: "सम्बन्धित मन्त्रालयको मन्त्री",
    optionBEn: "The Secretary of the concerned Ministry",
    optionBNe: "सम्बन्धित मन्त्रालयको सचिव",
    optionCEn: "The Financial Comptroller General",
    optionCNe: "महालेखा नियन्त्रक",
    optionDEn: "The Chief of Accounts Section",
    optionDNe: "लेखा शाखा प्रमुख",
    correctOption: "B",
    explanationEn:
      "Under the Financial Procedure and Fiscal Accountability Act 2076, the Secretary of the respective Ministry/Secretariat is the Chief Accounting Officer (प्रमुख लेखा उत्तरदायी अधिकृत) responsible for financial discipline, internal control, and audit clearance.",
    explanationNe:
      "आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन २०७६ अनुसार सम्बन्धित मन्त्रालयको सचिव नै सो मन्त्रालयको 'प्रमुख लेखा उत्तरदायी अधिकृत' हुने व्यवस्था छ।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Nayab Subba 2081 BS",
    isImportant: true,
  },
  {
    topicSlug: "public-accountability",
    questionEn:
      "Which parliamentary committee in Nepal's House of Representatives examines the annual audit report submitted by the Auditor General to ensure public financial accountability?",
    questionNe:
      "महालेखापरीक्षकको वार्षिक प्रतिवेदनमाथि छलफल गरी सार्वजनिक वित्तीय उत्तरदायित्व सुनिश्चित गर्ने प्रतिनिधिसभाको संसदीय समिति कुन हो?",
    optionAEn: "Finance Committee (अर्थ समिति)",
    optionANe: "अर्थ समिति",
    optionBEn: "Public Accounts Committee (सार्वजनिक लेखा समिति)",
    optionBNe: "सार्वजनिक लेखा समिति (Public Accounts Committee)",
    optionCEn: "State Affairs and Good Governance Committee",
    optionCNe: "राज्य व्यवस्था तथा सुशासन समिति",
    optionDEn: "Development and Technology Committee",
    optionDNe: "विकास तथा प्रविधि समिति",
    correctOption: "B",
    explanationEn:
      "The Public Accounts Committee (सार्वजनिक लेखा समिति) of the House of Representatives examines the Auditor General's report and government financial irregularities (Beruju).",
    explanationNe:
      "महालेखापरीक्षकले राष्ट्रपतिमार्फत संसदमा पेश गरेको वार्षिक प्रतिवेदन र बेरुजु उपर छानबिन तथा निर्देशन दिने कार्य प्रतिनिधिसभाको 'सार्वजनिक लेखा समिति' ले गर्दछ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "office-management",
    questionEn:
      "In Nepal's government office management, what are the two primary registers used to record incoming letters and outgoing letters respectively?",
    questionNe:
      "नेपालको सरकारी कार्यालय व्यवस्थापनमा कार्यालयमा प्राप्त हुने पत्र र कार्यालयबाट पठाइने पत्र अभिलेख राख्न प्रयोग गरिने प्रमुख पुस्तिकाहरू क्रमशः के-के हुन्?",
    optionAEn: "Darta Kitab (दर्ता किताब) and Chalani Kitab (चलानी किताब)",
    optionANe: "दर्ता किताब (Darta) र चलानी किताब (Chalani)",
    optionBEn: "Jinsi Kitab and Shresta Kitab",
    optionBNe: "जिन्सी किताब र श्रेस्ता किताब",
    optionCEn: "Tippani Register and Haziri Register",
    optionCNe: "टिप्पणी पुस्तिका र हाजिरी पुस्तिका",
    optionDEn: "Dakhila Report and Kharcha Report",
    optionDNe: "दाखिला प्रतिवेदन र खर्च प्रतिवेदन",
    correctOption: "A",
    explanationEn:
      "Darta (दर्ता) records all incoming correspondence/documents with a unique registration number and date, while Chalani (चलानी) records all outgoing correspondence dispatched from the office.",
    explanationNe:
      "कार्यालयमा बाहिरबाट प्राप्त हुने चिठीपत्र अभिलेख राख्ने पुस्तिकालाई 'दर्ता किताब' र कार्यालयबाट बाहिर पठाइने पत्र अभिलेख राख्ने पुस्तिकालाई 'चलानी किताब' भनिन्छ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Kharidar 2079 BS",
  },
  {
    topicSlug: "corruption-control",
    questionEn:
      "Under Article 239 of the Constitution of Nepal, which constitutional body is empowered to investigate and file corruption cases against persons holding public office?",
    questionNe:
      "नेपालको संविधानको धारा २३९ बमोजिम सार्वजनिक पद धारण गरेको व्यक्तिले भ्रष्टाचार गरी अख्तियारको दुरुपयोग गरेको सम्बन्धमा अनुसन्धान र अभियोजन गर्ने संवैधानिक निकाय कुन हो?",
    optionAEn: "National Vigilance Centre (राष्ट्रिय सतर्कता केन्द्र)",
    optionANe: "राष्ट्रिय सतर्कता केन्द्र",
    optionBEn: "Commission for the Investigation of Abuse of Authority (CIAA)",
    optionBNe: "अख्तियार दुरुपयोग अनुसन्धान आयोग (CIAA)",
    optionCEn: "Office of the Attorney General",
    optionCNe: "महान्यायाधिवक्ताको कार्यालय",
    optionDEn: "Department of Money Laundering Investigation",
    optionDNe: "सम्पत्ति शुद्धीकरण अनुसन्धान विभाग",
    correctOption: "B",
    explanationEn:
      "Article 239 empowers the Commission for the Investigation of Abuse of Authority (अख्तियार दुरुपयोग अनुसन्धान आयोग) to investigate and file cases in the Special Court against public officials involved in corruption.",
    explanationNe:
      "संविधानको धारा २३९ अनुसार सार्वजनिक पद धारण गरेका व्यक्तिले गरेको भ्रष्टाचार उपर अनुसन्धान गरी विशेष अदालतमा मुद्दा दायर गर्ने अधिकार अख्तियार दुरुपयोग अनुसन्धान आयोगलाई छ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "right-to-information",
    questionEn:
      "Under the Right to Information Act 2064 (सूचनाको हक सम्बन्धी ऐन २०६४), within how many days must an Information Officer provide requested general information (when not immediately available)?",
    questionNe:
      "सूचनाको हक सम्बन्धी ऐन २०६४ बमोजिम निवेदकले माग गरेको सामान्य सूचना तत्काल दिन नसकिने भएमा सूचना अधिकारीले बढीमा कति दिनभित्र सूचना उपलब्ध गराउनुपर्दछ?",
    optionAEn: "Within 7 days",
    optionANe: "७ दिनभित्र",
    optionBEn: "Within 15 days",
    optionBNe: "१५ दिनभित्र",
    optionCEn: "Within 24 hours",
    optionCNe: "२४ घण्टाभित्र",
    optionDEn: "Within 30 days",
    optionDNe: "३० दिनभित्र",
    correctOption: "B",
    explanationEn:
      "Under Section 7 of the Right to Information Act 2064, if the information cannot be provided immediately, the Information Officer must provide it within 15 days (and within 24 hours if it concerns the life and security of a person).",
    explanationNe:
      "सूचनाको हक सम्बन्धी ऐन २०६४ को दफा ७ अनुसार तत्काल दिन नसकिने सूचना १५ दिनभित्र उपलब्ध गराउनुपर्छ (तर कसैको जिउज्यानको सुरक्षासँग सम्बन्धित सूचना २४ घण्टाभित्र दिनुपर्छ)।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Nayab Subba 2079 BS",
    isImportant: true,
  },

  // D. Mental Ability / IQ (15 topics)
  {
    topicSlug: "number-series",
    questionEn: "Find the missing number in the series: 2, 6, 12, 20, 30, 42, ?",
    questionNe: "तलको संख्या श्रेणीमा प्रश्नवाचक चिन्ह (?) को स्थानमा कुन संख्या आउँछ? 2, 6, 12, 20, 30, 42, ?",
    optionAEn: "52",
    optionANe: "५२",
    optionBEn: "56",
    optionBNe: "५६",
    optionCEn: "54",
    optionCNe: "५४",
    optionDEn: "60",
    optionDNe: "६०",
    correctOption: "B",
    explanationEn:
      "Differences between consecutive terms are +4, +6, +8, +10, +12, so the next difference is +14: 42 + 14 = 56 (also n(n+1): 1×2, 2×3, 3×4, 4×5, 5×6, 6×7, 7×8 = 56).",
    explanationNe:
      "यहाँ क्रमशः +४, +६, +८, +१०, +१२ को अन्तर छ। त्यसैले पछिल्लो अन्तर +१४ हुन्छ: ४२ + १४ = ५६ (अथवा ७ × ८ = ५६)।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isDailyChallenge: true,
  },
  {
    topicSlug: "alphabet-series",
    questionEn: "Complete the alphabet series: AZ, CX, FU, JQ, ?",
    questionNe: "वर्णमाला श्रेणी पूरा गर्नुहोस्: AZ, CX, FU, JQ, ?",
    optionAEn: "OL",
    optionANe: "OL",
    optionBEn: "OM",
    optionBNe: "OM",
    optionCEn: "NM",
    optionCNe: "NM",
    optionDEn: "PK",
    optionDNe: "PK",
    correctOption: "A",
    explanationEn:
      "First letters: A(1) +2 -> C(3) +3 -> F(6) +4 -> J(10) +5 -> O(15). Second letters are opposite pairs (sum = 27): A-Z, C-X, F-U, J-Q, so opposite of O(15) is L(12) -> OL.",
    explanationNe:
      "पहिलो अक्षर: A(+2)=C, C(+3)=F, F(+4)=J, J(+5)=O। दोस्रो अक्षर विपरीत जोडी (योगफल २७) भएकाले O(15) को विपरीत L(12) हुन्छ। उत्तर: OL।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "coding-and-decoding",
    questionEn:
      "If in a certain code language, 'NEPAL' is written as 'OFQBM', how is 'LOKSEWA' written in that code?",
    questionNe:
      "कुनै सांकेतिक भाषामा 'NEPAL' लाई 'OFQBM' लेखिन्छ भने सोही भाषामा 'LOKSEWA' लाई के लेखिन्छ?",
    optionAEn: "MPLTFXB",
    optionANe: "MPLTFXB",
    optionBEn: "MPLTFYB",
    optionBNe: "MPLTFYB",
    optionCEn: "MQLTFXB",
    optionCNe: "MQLTFXB",
    optionDEn: "MPKTFXB",
    optionDNe: "MPKTFXB",
    correctOption: "A",
    explanationEn:
      "Each letter is shifted forward by +1 (+1 pattern: N->O, E->F, P->Q, A->B, L->M). Applying +1 to LOKSEWA gives M-P-L-T-F-X-B.",
    explanationNe:
      "प्रत्येक अक्षरमा +१ अगाडि बढाइएको छ (N+1=O, E+1=F...)। त्यसैले LOKSEWA मा +१ गर्दा MPLTFXB हुन्छ।",
    difficulty: "easy",
    commission: "Bagmati PPSC",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "analogy",
    questionEn: "Constitution : Country :: Bylaws : ?",
    questionNe: "संविधान : देश :: नियमावली / विधान : ?",
    optionAEn: "Organization / Institution",
    optionANe: "संस्था / संगठन",
    optionBEn: "Parliament",
    optionBNe: "संसद",
    optionCEn: "Court",
    optionCNe: "अदालत",
    optionDEn: "Citizen",
    optionDNe: "नागरिक",
    correctOption: "A",
    explanationEn:
      "A Constitution is the supreme governing document of a Country, just as Bylaws (विधान/नियमावली) are the governing rules of an Organization/Institution.",
    explanationNe:
      "जसरी संविधानले देशको शासन सञ्चालन गर्दछ, त्यसैगरी विधान वा नियमावलीले संस्था वा संगठनको कार्य सञ्चालन गर्दछ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "classification",
    questionEn: "Find the odd one out among the following districts of Nepal:",
    questionNe: "तलकामध्ये समूहमा नमिल्ने (भिन्न) जिल्ला कुन हो पहिचान गर्नुहोस्:",
    optionAEn: "Mustang",
    optionANe: "मुस्ताङ",
    optionBEn: "Manang",
    optionBNe: "मनाङ",
    optionCEn: "Dolpa",
    optionCNe: "डोल्पा",
    optionDEn: "Rupandehi",
    optionDNe: "रुपन्देही",
    correctOption: "D",
    explanationEn:
      "Mustang, Manang, and Dolpa are Mountain (Himalayan) districts, whereas Rupandehi is a Terai district.",
    explanationNe:
      "मुस्ताङ, मनाङ र डोल्पा हिमाली जिल्ला हुन् भने रुपन्देही तराईको जिल्ला भएकाले भिन्न छ।",
    difficulty: "easy",
    commission: "Gandaki PPSC",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "blood-relations",
    questionEn:
      "Pointing to a photograph, Hari said, 'He is the only son of the daughter of my father.' How is the person in the photograph related to Hari?",
    questionNe:
      "एउटा तस्बिरतर्फ देखाउँदै हरिले भन्यो, 'ऊ मेरो बुबाकी छोरीको एकमात्र छोरा हो।' तस्बिरमा भएको व्यक्ति हरिको को पर्छ?",
    optionAEn: "Brother",
    optionANe: "भाइ / दाजु",
    optionBEn: "Nephew (Sister's son / Bhanja)",
    optionBNe: "भान्जा (Nephew)",
    optionCEn: "Son",
    optionCNe: "छोरा",
    optionDEn: "Cousin",
    optionDNe: "काकाको छोरा",
    correctOption: "B",
    explanationEn:
      "Daughter of Hari's father = Hari's sister. Only son of Hari's sister = Hari's nephew (भान्जा).",
    explanationNe:
      "हरिको बुबाकी छोरी = हरिकी दिदी वा बहिनी। दिदी वा बहिनीको एकमात्र छोरा = हरिको भान्जा पर्छ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "direction-and-distance",
    questionEn:
      "Sita walks 10 km North, then turns right and walks 6 km, then turns right again and walks 10 km. How far and in which direction is she from her starting point?",
    questionNe:
      "सीता उत्तरतर्फ १० कि.मि. हिँड्छिन्, त्यसपछि दायाँ फर्केर ६ कि.मि. हिँड्छिन् र पुनः दायाँ फर्केर १० कि.मि. हिँड्छिन्। उनी सुरुको बिन्दुबाट कति टाढा र कुन दिशामा छिन्?",
    optionAEn: "6 km East",
    optionANe: "६ कि.मि. पूर्व",
    optionBEn: "6 km West",
    optionBNe: "६ कि.मि. पश्चिम",
    optionCEn: "16 km North-East",
    optionCNe: "१६ कि.मि. उत्तर-पूर्व",
    optionDEn: "10 km South",
    optionDNe: "१० कि.मि. दक्षिण",
    correctOption: "A",
    explanationEn:
      "Walking 10 km North, then 6 km East (right), then 10 km South (right) brings her horizontally aligned with the starting point at 6 km East.",
    explanationNe:
      "१० कि.मि. उत्तर, त्यसपछि दायाँ (पूर्व) ६ कि.मि. र पुनः दायाँ (दक्षिण) १० कि.मि. हिँड्दा उत्तर र दक्षिण दूरी बराबर भई सुरुको बिन्दुबाट ६ कि.मि. पूर्व दिशामा पुग्छिन्।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "ranking",
    questionEn:
      "In a row of 45 candidates appearing for a Loksewa interview, Ram ranks 18th from the top. What is his rank from the bottom?",
    questionNe:
      "लोकसेवा अन्तर्वार्तामा सहभागी ४५ जना उम्मेदवारहरूको पंक्तिमा राम माथिबाट १८ औं स्थानमा छन् भने तलबाट उनको स्थान कति औं हुन्छ?",
    optionAEn: "27th",
    optionANe: "२७ औं",
    optionBEn: "28th",
    optionBNe: "२८ औं",
    optionCEn: "29th",
    optionCNe: "२९ औं",
    optionDEn: "26th",
    optionDNe: "२६ औं",
    correctOption: "B",
    explanationEn:
      "Rank from bottom = (Total candidates - Rank from top) + 1 = (45 - 18) + 1 = 27 + 1 = 28th.",
    explanationNe:
      "तलबाट स्थान = (कुल संख्या - माथिबाट स्थान) + १ = (४५ - १८) + १ = २८ औं स्थान।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "mathematical-reasoning",
    questionEn:
      "The sum of ages of a father and his son is 56 years. Four years ago, the father's age was three times the son's age. What is the present age of the son?",
    questionNe:
      "बुबा र छोराको हालको उमेरको योगफल ५६ वर्ष छ। ४ वर्ष अगाडि बुबाको उमेर छोराको उमेरको ३ गुणा थियो भने छोराको हालको उमेर कति वर्ष हो?",
    optionAEn: "14 years",
    optionANe: "१४ वर्ष",
    optionBEn: "16 years",
    optionBNe: "१६ वर्ष",
    optionCEn: "18 years",
    optionCNe: "१८ वर्ष",
    optionDEn: "12 years",
    optionDNe: "१२ वर्ष",
    correctOption: "B",
    explanationEn:
      "4 years ago, sum of their ages = 56 - 8 = 48 years. Ratio was 3:1 -> 4 parts = 48 -> 1 part = 12 years (son's age 4 years ago). Present age of son = 12 + 4 = 16 years.",
    explanationNe:
      "४ वर्ष अगाडि दुवैको उमेरको योगफल = ५६ - ८ = ४८ वर्ष। अनुपात ३:१ भएकाले ४ भाग = ४८ -> १ भाग = १२ वर्ष। तसर्थ छोराको हालको उमेर = १२ + ४ = १६ वर्ष।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "percentage",
    questionEn:
      "If the salary of an employee is first increased by 20% and then decreased by 20%, what is the net percentage change in salary?",
    questionNe:
      "कुनै कर्मचारीको तलब पहिले २० प्रतिशतले बढाएर पछि पुनः २० प्रतिशतले घटाइयो भने तलबमा कति प्रतिशत परिवर्तन हुन्छ?",
    optionAEn: "0% (No change)",
    optionANe: "०% (कुनै परिवर्तन हुँदैन)",
    optionBEn: "4% decrease",
    optionBNe: "४% घट्छ",
    optionCEn: "4% increase",
    optionCNe: "४% बढ्छ",
    optionDEn: "2% decrease",
    optionDNe: "२% घट्छ",
    correctOption: "B",
    explanationEn:
      "Net change = (+20) + (-20) + (20 × -20)/100 = -400/100 = -4% (a net 4% decrease).",
    explanationNe:
      "सफल परिवर्तन सूत्र: x + y + (xy/100) = +२० - २० - (४००/१००) = -४% अर्थात् ४ प्रतिशतले घट्छ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Kharidar 2080 BS",
  },
  {
    topicSlug: "ratio-and-proportion",
    questionEn:
      "If A : B = 3 : 4 and B : C = 8 : 9, what is the combined ratio A : B : C?",
    questionNe: "यदि A : B = ३ : ४ र B : C = ८ : ९ छ भने A : B : C को मान कति हुन्छ?",
    optionAEn: "3 : 4 : 9",
    optionANe: "३ : ४ : ९",
    optionBEn: "6 : 8 : 9",
    optionBNe: "६ : ८ : ९",
    optionCEn: "8 : 6 : 9",
    optionCNe: "८ : ६ : ९",
    optionDEn: "6 : 9 : 8",
    optionDNe: "६ : ९ : ८",
    correctOption: "B",
    explanationEn:
      "Multiply A:B by 2 to equalize B to 8 -> A:B = 6:8. Since B:C = 8:9, the combined ratio A:B:C = 6:8:9.",
    explanationNe:
      "A:B = ३:४ लाई २ ले गुणन गर्दा ६:८ हुन्छ। अब B बराबर भएकाले A:B:C = ६:८:९ हुन्छ।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "profit-and-loss",
    questionEn:
      "A shopkeeper sells an article for Rs. 1,200 making a profit of 20%. What was the cost price (CP) of the article?",
    questionNe:
      "एक पसलेले कुनै सामान रु. १,२०० मा बेच्दा २० प्रतिशत नाफा भयो भने सो सामानको क्रयमूल्य (Cost Price) कति थियो?",
    optionAEn: "Rs. 960",
    optionANe: "रु. ९६०",
    optionBEn: "Rs. 1,000",
    optionBNe: "रु. १,०००",
    optionCEn: "Rs. 1,050",
    optionCNe: "रु. १,०५०",
    optionDEn: "Rs. 900",
    optionDNe: "रु. ९००",
    correctOption: "B",
    explanationEn:
      "Selling Price (SP) = 120% of CP = Rs. 1,200. Therefore, CP = (1200 × 100) / 120 = Rs. 1,000.",
    explanationNe:
      "विक्रयमूल्य = क्रयमूल्यको १२०% = रु. १,२००। त्यसैले क्रयमूल्य = (१२०० × १००) / १२० = रु. १,०००।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "time-and-work",
    questionEn:
      "A can complete a piece of office work in 12 days and B can complete the same work in 24 days. In how many days can A and B complete it working together?",
    questionNe:
      "A ले कुनै काम १२ दिनमा र B ले सोही काम २४ दिनमा पूरा गर्न सक्छ। दुवै जना मिलेर काम गरेमा सो काम कति दिनमा सकिन्छ?",
    optionAEn: "8 days",
    optionANe: "८ दिन",
    optionBEn: "9 days",
    optionBNe: "९ दिन",
    optionCEn: "10 days",
    optionCNe: "१० दिन",
    optionDEn: "6 days",
    optionDNe: "६ दिन",
    correctOption: "A",
    explanationEn:
      "1 day work of (A + B) = 1/12 + 1/24 = 3/24 = 1/8. Hence, working together they finish in 8 days.",
    explanationNe:
      "A र B को १ दिनको काम = १/१२ + १/२४ = ३/२४ = १/८ भाग। तसर्थ दुवै मिलेर ८ दिनमा काम पूरा गर्छन्।",
    difficulty: "easy",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Loksewa Nayab Subba 2080 BS",
  },
  {
    topicSlug: "logical-reasoning",
    questionEn:
      "Statements: All civil servants are graduates. Some graduates are researchers. Conclusions: I. Some civil servants are researchers. II. All researchers are graduates. Which conclusion logically follows?",
    questionNe:
      "कथन: सबै निजामती कर्मचारी स्नातक छन्। केही स्नातक अनुसन्धानकर्ता छन्। निष्कर्ष: I. केही निजामती कर्मचारी अनुसन्धानकर्ता छन्। II. सबै अनुसन्धानकर्ता स्नातक छन्। कुन निष्कर्ष तार्किक रूपमा सही छ?",
    optionAEn: "Only Conclusion I follows",
    optionANe: "निष्कर्ष I मात्र सही छ",
    optionBEn: "Only Conclusion II follows",
    optionBNe: "निष्कर्ष II मात्र सही छ",
    optionCEn: "Both I and II follow",
    optionCNe: "दुवै I र II सही छन्",
    optionDEn: "Neither I nor II follows",
    optionDNe: "कुनै पनि निष्कर्ष सही छैन",
    correctOption: "D",
    explanationEn:
      "Neither conclusion necessarily follows because 'some graduates are researchers' does not guarantee overlap with civil servants (I fails), nor does 'some A are B' imply 'all B are A' (II fails).",
    explanationNe:
      "दुवै निष्कर्ष निश्चित रूपमा सही छैनन् किनकि 'केही स्नातक अनुसन्धानकर्ता छन्' बाट निजामती कर्मचारीसँग प्रत्यक्ष सम्बन्ध र सबै अनुसन्धानकर्ता स्नातक हुन् भन्ने प्रमाणित हुँदैन।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
  },
  {
    topicSlug: "data-interpretation",
    questionEn:
      "In a provincial budget of Rs. 40 Arba, 35% is allocated to Infrastructure, 25% to Education & Health, 20% to Agriculture, and the rest to Administration. How much amount (in Rs. Arba) is allocated to Administration?",
    questionNe:
      "रु. ४० अर्बको प्रदेश बजेटमा ३५% पूर्वाधार, २५% शिक्षा तथा स्वास्थ्य र २०% कृषिमा विनियोजन गरिएको छ भने बाँकी प्रशासनिक खर्चमा कति रकम (रु. अर्बमा) विनियोजन गरिएको छ?",
    optionAEn: "Rs. 8 Arba",
    optionANe: "रु. ८ अर्ब",
    optionBEn: "Rs. 10 Arba",
    optionBNe: "रु. १० अर्ब",
    optionCEn: "Rs. 6 Arba",
    optionCNe: "रु. ६ अर्ब",
    optionDEn: "Rs. 12 Arba",
    optionDNe: "रु. १२ अर्ब",
    correctOption: "A",
    explanationEn:
      "Remaining share for Administration = 100% - (35% + 25% + 20%) = 20%. 20% of Rs. 40 Arba = Rs. 8 Arba.",
    explanationNe:
      "प्रशासनिक खर्चको प्रतिशत = १००% - (३५% + २५% + २०%) = २०%। रु. ४० अर्बको २०% = रु. ८ अर्ब।",
    difficulty: "easy",
    commission: "Bagmati PPSC",
    examLevel: "Fifth Level - General Administration",
  },

  // E. Current Affairs (4 topics)
  {
    topicSlug: "national-current-affairs",
    questionEn:
      "What is the target economic growth rate and per capita GNI goal by the end of Nepal's 16th Periodic Plan (FY 2085/86 BS)?",
    questionNe:
      "नेपालको सोह्रौं आवधिक योजना (आ.व. २०८५/८६ को अन्त्यसम्म) ले आर्थिक वृद्धिदर र प्रतिव्यक्ति कुल राष्ट्रिय आय (GNI) कति पुऱ्याउने लक्ष्य राखेको छ?",
    optionAEn: "7.3% growth rate and USD 2,351 per capita GNI",
    optionANe: "७.३% आर्थिक वृद्धिदर र अमेरिकी डलर २,३५१ प्रतिव्यक्ति आय",
    optionBEn: "6.0% growth rate and USD 1,800 per capita GNI",
    optionBNe: "६.०% आर्थिक वृद्धिदर र अमेरिकी डलर १,८०० प्रतिव्यक्ति आय",
    optionCEn: "8.5% growth rate and USD 3,000 per capita GNI",
    optionCNe: "८.५% आर्थिक वृद्धिदर र अमेरिकी डलर ३,००० प्रतिव्यक्ति आय",
    optionDEn: "6.5% growth rate and USD 2,100 per capita GNI",
    optionDNe: "६.५% आर्थिक वृद्धिदर र अमेरिकी डलर २,१०० प्रतिव्यक्ति आय",
    correctOption: "A",
    explanationEn:
      "The 16th Five-Year Plan (2081/82 – 2085/86) targets an average annual economic growth rate of 7.3%, reducing absolute poverty from 20.27% to 12%, and raising per capita GNI to USD 2,351.",
    explanationNe:
      "सोह्रौं योजना (२०८१/८२ – २०८५/८६) ले योजना अवधिको अन्त्यसम्म आर्थिक वृद्धिदर ७.३%, गरिबी दर १२% मा झार्ने र प्रतिव्यक्ति आय २,३५१ अमेरिकी डलर पुऱ्याउने लक्ष्य राखेको छ।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
    isDailyChallenge: true,
  },
  {
    topicSlug: "provincial-local-governance-updates",
    questionEn:
      "Which province of Nepal was the first to declare itself a 'Fully Literate Province' (पूर्ण साक्षर प्रदेश)?",
    questionNe:
      "नेपालको कुन प्रदेश सर्वप्रथम 'पूर्ण साक्षर प्रदेश' (Fully Literate Province) घोषणा भएको हो?",
    optionAEn: "Bagmati Province",
    optionANe: "बागमती प्रदेश",
    optionBEn: "Gandaki Province",
    optionBNe: "गण्डकी प्रदेश",
    optionCEn: "Koshi Province",
    optionCNe: "कोशी प्रदेश",
    optionDEn: "Lumbini Province",
    optionDNe: "लुम्बिनी प्रदेश",
    correctOption: "B",
    explanationEn:
      "Gandaki Province was declared Nepal's first 'Fully Literate Province' on Ashwin 24, 2078 BS (with 96.57% literacy across all 11 districts), followed by Bagmati and Koshi provinces.",
    explanationNe:
      "गण्डकी प्रदेश वि.सं. २०७८ असोज २४ गते नेपालको पहिलो 'पूर्ण साक्षर प्रदेश' घोषणा भएको थियो।",
    difficulty: "easy",
    commission: "Gandaki PPSC",
    examLevel: "Fifth Level - General Administration",
    isPreviousYear: true,
    previousYearInfo: "Gandaki PPSC 5th Level 2080 BS",
  },
  {
    topicSlug: "economic-survey-budget-planning",
    questionEn:
      "According to the Nepal Living Standards Survey IV (NLSS-IV 2079/80 BS), what percentage of Nepal's population lives below the absolute poverty line?",
    questionNe:
      "नेपाल जीवनस्तर सर्वेक्षण चौथो (NLSS-IV, २०७९/८०) अनुसार नेपालमा निरपेक्ष गरिबीको रेखामुनि रहेको जनसंख्या प्रतिशत कति रहेको छ?",
    optionAEn: "18.7%",
    optionANe: "१८.७%",
    optionBEn: "20.27%",
    optionBNe: "२०.२७%",
    optionCEn: "15.1%",
    optionCNe: "१५.१%",
    optionDEn: "21.6%",
    optionDNe: "२१.६%",
    correctOption: "B",
    explanationEn:
      "The Fourth Nepal Living Standards Survey (NLSS-IV) released by the National Statistics Office reported that 20.27% of Nepal's population lives below the updated poverty line (Rs. 72,908 per person per year).",
    explanationNe:
      "राष्ट्रिय तथ्यांक कार्यालयले सार्वजनिक गरेको चौथो नेपाल जीवनस्तर सर्वेक्षण अनुसार नेपालको २०.२७% जनसंख्या गरिबीको रेखामुनि रहेको छ।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
    isDailyChallenge: true,
  },
  {
    topicSlug: "international-affairs-summits-awards",
    questionEn:
      "Where was the 19th Non-Aligned Movement (NAM) Summit held in January 2024, where Nepal was represented at the Prime Ministerial level?",
    questionNe:
      "सन् २०२४ जनवरीमा आयोजित १९ औं असंलग्न आन्दोलन (NAM) को शिखर सम्मेलन कहाँ सम्पन्न भएको थियो?",
    optionAEn: "Baku, Azerbaijan",
    optionANe: "बाकु, अजरबैजान",
    optionBEn: "Kampala, Uganda",
    optionBNe: "कम्पाला, युगान्डा",
    optionCEn: "Nairobi, Kenya",
    optionCNe: "नैरोबी, केन्या",
    optionDEn: "Jakarta, Indonesia",
    optionDNe: "जाकार्ता, इन्डोनेसिया",
    correctOption: "B",
    explanationEn:
      "The 19th Summit of Heads of State and Government of the Non-Aligned Movement (NAM) was held in Kampala, Uganda in January 2024 under the theme 'Deepening Cooperation for Shared Global Affluence'.",
    explanationNe:
      "१९ औं असंलग्न राष्ट्रहरूको शिखर सम्मेलन सन् २०२४ जनवरीमा युगान्डाको कम्पालामा सम्पन्न भएको थियो।",
    difficulty: "medium",
    commission: "Federal",
    examLevel: "Fifth Level - General Administration",
    isImportant: true,
  },
];

export const CURRENT_AFFAIRS_SEEDS: CurrentAffairSeed[] = [
  {
    titleEn: "Nepal's 16th Five-Year Periodic Plan (FY 2081/82 – 2085/86 BS)",
    titleNe: "नेपालको सोह्रौं आवधिक योजना (आ.व. २०८१/८२ – २०८५/८६)",
    summaryEn:
      "Approved by the National Development Council, the 16th Plan sets a structural transformation roadmap focusing on good governance, social justice, and economic prosperity ahead of Nepal's 2026 LDC graduation.",
    summaryNe:
      "राष्ट्रिय विकास परिषद्बाट स्वीकृत सोह्रौं योजनाले सन् २०२६ मा हुने LDC स्तरोन्नतिलाई दृष्टिगत गर्दै 'सुशासन, सामाजिक न्याय र समृद्धि' को सोचसहित आर्थिक रूपान्तरणको मार्गचित्र तय गरेको छ।",
    keyPointsEn: [
      "Headline Vision: Good Governance, Social Justice and Prosperity",
      "Target Economic Growth Rate: 7.3% by FY 2085/86 BS",
      "Per Capita GNI Target: USD 2,351 (up from USD 1,456)",
      "Absolute Poverty Reduction: From 20.27% down to 12.0%",
      "Life Expectancy at Birth Target: 73 years; Literacy (15+ yrs): 85%",
    ],
    keyPointsNe: [
      "मुख्य सोच: सुशासन, सामाजिक न्याय र समृद्धि",
      "आर्थिक वृद्धिदर लक्ष्य: योजनाको अन्त्यमा ७.३ प्रतिशत",
      "प्रतिव्यक्ति आय लक्ष्य: २,३५१ अमेरिकी डलर",
      "निरपेक्ष गरिबी दर: २०.२७% बाट १२.०% मा झार्ने",
      "अपेक्षित आयु ७३ वर्ष र साक्षरता दर ८५% पुऱ्याउने लक्ष्य",
    ],
    category: "Economy & Budget",
    publishedDateBs: "2081 Jestha",
    publishedDateAd: "2024-05-20",
    linkedTopicSlug: "national-current-affairs",
    isImportant: true,
  },
  {
    titleEn: "Nepal Living Standards Survey IV (NLSS-IV) Poverty & Inequality Metrics",
    titleNe: "चौथो नेपाल जीवनस्तर सर्वेक्षण (NLSS-IV) र गरिबीको नयाँ मापदण्ड",
    summaryEn:
      "The National Statistics Office released NLSS-IV updating the national poverty line basket for the first time in 12 years, establishing critical macroeconomic indicators frequently tested in Loksewa exams.",
    summaryNe:
      "राष्ट्रिय तथ्यांक कार्यालयले १२ वर्षपछि गरिबीको रेखा पुनरावलोकन गरी चौथो नेपाल जीवनस्तर सर्वेक्षणको नतिजा सार्वजनिक गरेको छ, जुन लोकसेवा परीक्षाका लागि अति महत्त्वपूर्ण छ।",
    keyPointsEn: [
      "National Poverty Rate: 20.27% of total population",
      "Updated National Poverty Line: Rs. 72,908 per person per year",
      "Urban vs Rural Poverty: 18.34% in Urban areas, 24.66% in Rural areas",
      "Highest Provincial Poverty: Sudurpashchim (34.16%), Karnali (26.69%)",
      "Lowest Provincial Poverty: Gandaki Province (11.88%)",
    ],
    keyPointsNe: [
      "राष्ट्रिय गरिबी दर: २०.२७ प्रतिशत जनसंख्या",
      "गरिबीको रेखा: प्रतिव्यक्ति प्रतिवर्ष रु. ७२,९०८",
      "सहरी गरिबी १८.३४% र ग्रामीण गरिबी २४.६६%",
      "सबैभन्दा बढी गरिबी: सुदूरपश्चिम प्रदेश (३४.१६%)",
      "सबैभन्दा कम गरिबी: गण्डकी प्रदेश (११.८८%)",
    ],
    category: "Economy & Budget",
    publishedDateBs: "2081 Falgun",
    publishedDateAd: "2025-02-15",
    linkedTopicSlug: "economic-survey-budget-planning",
    isImportant: true,
  },
  {
    titleEn: "19th Non-Aligned Movement (NAM) Summit & Nepal's Multilateral Diplomacy",
    titleNe: "१९ औं असंलग्न आन्दोलन (NAM) शिखर सम्मेलन र नेपालको कूटनीति",
    summaryEn:
      "Nepal reaffirmed its commitment to Panchasheel, sovereign equality, climate justice for mountainous nations, and Least Developed Countries' smooth transition at the 19th NAM Summit in Kampala.",
    summaryNe:
      "युगान्डाको कम्पालामा सम्पन्न १९ औं NAM शिखर सम्मेलनमा नेपालले पञ्चशील, असंलग्नता, हिमाली राष्ट्रहरूको जलवायु न्याय र LDC स्तरोन्नतिमा सहकार्यको विषय प्रमुखताका साथ उठाएको छ।",
    keyPointsEn: [
      "Host City & Date: Kampala, Uganda (January 19–20, 2024)",
      "Theme: Deepening Cooperation for Shared Global Affluence",
      "Chairmanship: Uganda assumed NAM Chair (2024–2027) from Azerbaijan",
      "Nepal is a founding participant of the Belgrade Summit (1961)",
    ],
    keyPointsNe: [
      "आयोजक स्थान र मिति: कम्पाला, युगान्डा (सन् २०२४ जनवरी १९–२०)",
      "नारा: Deepening Cooperation for Shared Global Affluence",
      "अध्यक्षता: अजरबैजानबाट युगान्डाले सन् २०२४–२०२७ का लागि अध्यक्षता ग्रहण",
      "नेपाल सन् १९६१ को बेलग्रेड सम्मेलनदेखि नै संस्थापक सहभागी राष्ट्र हो",
    ],
    category: "International",
    publishedDateBs: "2081 Magh",
    publishedDateAd: "2025-01-20",
    linkedTopicSlug: "international-affairs-summits-awards",
    isImportant: true,
  },
  {
    titleEn: "Constitutional & Provincial Governance Milestones Across All 7 Provinces",
    titleNe: "सातै प्रदेशका संवैधानिक तथा प्रादेशिक सुशासनका महत्त्वपूर्ण तथ्यहरू",
    summaryEn:
      "Comparative provincial facts—capitals, district counts, local level counts, and literacy declarations—are staple questions in both Federal and Provincial Public Service Commission (PPSC) examinations.",
    summaryNe:
      "संघीय लोकसेवा र सातै प्रदेश लोकसेवा आयोगका परीक्षामा प्रदेशका राजधानी, जिल्ला संख्या, स्थानीय तह संख्या र प्रादेशिक उपलब्धिहरू नियमित सोधिन्छन्।",
    keyPointsEn: [
      "Koshi (14 districts, 137 local levels, Capital: Biratnagar)",
      "Madhesh (8 districts, 136 local levels, Capital: Janakpurdham)",
      "Bagmati (13 districts, 119 local levels, Capital: Hetauda)",
      "Gandaki (11 districts, 85 local levels, Capital: Pokhara — 1st Literate Province)",
      "Lumbini (12 districts, 109 local levels, Capital: Deukhuri, Dang)",
      "Karnali (10 districts, 79 local levels, Capital: Birendranagar)",
      "Sudurpashchim (9 districts, 88 local levels, Capital: Godawari, Kailali)",
    ],
    keyPointsNe: [
      "कोशी: १४ जिल्ला, १३७ स्थानीय तह, राजधानी: विराटनगर",
      "मधेश: ८ जिल्ला, १३६ स्थानीय तह, राजधानी: जनकपुरधाम",
      "बागमती: १३ जिल्ला, ११९ स्थानीय तह, राजधानी: हेटौंडा",
      "गण्डकी: ११ जिल्ला, ८५ स्थानीय तह, राजधानी: पोखरा (प्रथम साक्षर प्रदेश)",
      "लुम्बिनी: १२ जिल्ला, १०९ स्थानीय तह, राजधानी: देउखुरी, दाङ",
      "कर्णाली: १० जिल्ला, ७९ स्थानीय तह, राजधानी: वीरेन्द्रनगर",
      "सुदूरपश्चिम: ९ जिल्ला, ८८ स्थानीय तह, राजधानी: गोदावरी, कैलाली",
    ],
    category: "Province & Local",
    publishedDateBs: "2081 Chaitra",
    publishedDateAd: "2025-03-25",
    linkedTopicSlug: "provincial-local-governance-updates",
    isImportant: true,
  },
];
