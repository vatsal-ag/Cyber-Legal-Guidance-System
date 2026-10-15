// Comprehensive test for CyberSahayakChatbot informational query classification & response generation

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

const CASE_CITATIONS_DATA = {
  "SHREYA_SINGHAL_2015": {
    title: "Shreya Singhal v. Union of India",
    citation: "(2015) 5 SCC 1 · AIR 2015 SC 1523",
    court: "Supreme Court of India",
    year: 2015,
    provisions: ["IT Act §66A", "IT Act §79"],
    holding: "Struck down Section 66A in its entirety as unconstitutionally vague.",
    impact: "Established the constitutional bedrock of digital free speech in India."
  },
  "ARJUN_KHOTKAR_2020": {
    title: "Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal",
    citation: "(2020) 7 SCC 1 · AIR 2020 SC 4917",
    court: "Supreme Court of India (3-Judge Bench)",
    year: 2020,
    provisions: ["BSA 2023 §63", "IEA §65B(4)"],
    holding: "Section 65B(4) certificate is an absolute mandatory condition precedent.",
    impact: "Universal standard for criminal electronic evidence admissibility."
  },
  "VINOD_KUMAR_2024": {
    title: "Vinod Kumar v. State of Haryana [Digital Arrest Syndicate]",
    citation: "2024 SCC OnLine P&H 1520",
    court: "Punjab and Haryana High Court",
    year: 2024,
    provisions: ["IT Act §66D", "BNS §308", "BNS §319"],
    holding: "Denied bail to Digital Arrest syndicate operators.",
    impact: "Strict judicial refusal of bail for fake police extortion schemes."
  }
};

const IT_ACT_DATA = {
  "66D": { title: "Cheating by Personation via Computer", desc: "Cheating by personating someone using computer.", penalty: "Imprisonment up to 3 years and fine up to ₹1 Lakh." }
};

const CyberSahayakChatbot = {
  isInformationalOrLegalQuery(text) {
    if (!text || typeof text !== 'string') return false;
    const lower = text.toLowerCase().trim();

    const hasLossOrTransfer = /\b(lost|debited|transferred|paid|sent|cut|debit|hazar|rupees|lakh|crore|₹|\brs\.?|\binr\b)\b/i.test(lower) && /\d+/.test(lower);
    const hasVictimCries = /\b(help me|save me|calling me now|on call now|fraud happened with me|scammed me|cheated me|mere sath (?:dhokha|fraud|scam)|paise (?:kat|chale|lut)|paisa kat gaya)\b/i.test(lower);

    const hasQuestionOrEduIntent = (
      /\b(tell me about|what is|what are|explain|describe|who is|can you tell me|details of|details on|information on|info on|guide me on|meaning of|definition of|how does .* work|is there any law|which section|what section|show me|list of|cases on|case law|case citation|citations|judgments?|judgements?|rulings?|precedents?|precedent|supreme court|high court|overview|history of|provision|provisions|punishment for|penalty for|laws for|sections for|tell me)\b/i.test(lower) ||
      /(?:के बारे में बताओ|के बारे में बताइए|क्या है|क्या होता है|की धारा|केस लॉ|जजमेंट|फैसले|नियम क्या है|समझाइए|विस्तार से|जानकारी दो|जानकारी दें|कानून क्या है|केस बताओ)/i.test(text)
    );

    const mentionsLegalTopic = (
      /\b(digital arrest|digital arrest cases|shreya singhal|arjun khotkar|anvar|puttaswamy|suhas katti|bazee|avnish bajaj|pooran singh|vinod kumar|sanjeev kumar|mc joshi|louboutin|asifuddin|prajwala|visaka|smc pneumatics|kunal bahl|dr prakash|ratan tata|fatima riswana)\b/i.test(lower) ||
      /\b(section 66|section 66d|section 66c|section 43|section 67|section 79|section 63|section 106|section 318|section 308|section 319|dpdp|bsa 63|it act|bns)\b/i.test(lower) ||
      /\b(cases|case law|citations?|precedents?|judgments?|judgements?|sc rulings?)\b/i.test(lower)
    );

    if (hasQuestionOrEduIntent) return true;
    if (mentionsLegalTopic && !hasLossOrTransfer && !hasVictimCries && !lower.includes('extortion (digital arrest)')) return true;
    return false;
  },

  findCaseCitationMatch(text) {
    const lower = text.toLowerCase();
    const keywordMap = {
      'shreya': 'SHREYA_SINGHAL_2015',
      'arjun': 'ARJUN_KHOTKAR_2020',
      'vinod kumar': 'VINOD_KUMAR_2024'
    };
    for (const [kw, key] of Object.entries(keywordMap)) {
      if (lower.includes(kw) && CASE_CITATIONS_DATA[key]) return CASE_CITATIONS_DATA[key];
    }
    return null;
  },

  getInformationalReply(text, isHi) {
    const lower = text.toLowerCase().trim();
    if (/(?:\bdigital\s*arrest\b|डिजिटल\s*अरेस्ट)/i.test(lower)) {
      return isHi ? "HINDI DIGITAL ARREST BRIEF" : "ENGLISH DIGITAL ARREST BRIEF";
    }
    const matchedCase = this.findCaseCitationMatch(text);
    if (matchedCase) {
      return `CASE MATCH: ${matchedCase.title}`;
    }
    if (/(?:\bcases?\b|\bcitations?\b|फैसले|केस)/i.test(lower)) {
      return "GENERAL CASE LAW OVERVIEW";
    }
    return null;
  }
};

const tests = [
  { q: "Tell me about Digital Arrest cases", expect: "ENGLISH DIGITAL ARREST BRIEF" },
  { q: "digital arrest cases", expect: "ENGLISH DIGITAL ARREST BRIEF" },
  { q: "डिजिटल अरेस्ट के बारे में बताओ", expect: "HINDI DIGITAL ARREST BRIEF", isHi: true },
  { q: "Tell me about Shreya Singhal case", expect: "CASE MATCH: Shreya Singhal v. Union of India" },
  { q: "show me case citations", expect: "GENERAL CASE LAW OVERVIEW" },
  { q: "₹75,000 debited from my bank without authorization", expect: null }
];

let allPassed = true;
tests.forEach(({ q, expect, isHi }) => {
  const isInfo = CyberSahayakChatbot.isInformationalOrLegalQuery(q);
  const reply = isInfo ? CyberSahayakChatbot.getInformationalReply(q, isHi || false) : null;
  const passed = (reply === expect);
  console.log(`${passed ? '✓ PASS' : '✗ FAIL'}: "${q}" => ${reply}`);
  if (!passed) allPassed = false;
});

if (allPassed) {
  console.log("\nALL TESTS PASSED SUCCESSFULLY!");
} else {
  console.error("\nSOME TESTS FAILED!");
  process.exit(1);
}
