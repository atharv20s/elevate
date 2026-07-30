import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { LLM_CONFIG, getOpenRouterHeaders } from "@/config/llm";
import { BNS_LEGAL_SYSTEM_PROMPT } from "@/config/system-prompt";

// Detect if user shared a phone number (10-digit Indian)
const extractPhone = (text: string): string | null => {
  const match = text.match(/\b(\d{10})\b/);
  return match ? match[1] : null;
};

// Detect if user shared an email address
const extractEmail = (text: string): string | null => {
  const match = text.match(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/);
  return match ? match[1] : null;
};

// Extract a name if user says "my name is X" or "I am X"
const extractName = (text: string): string | null => {
  const patterns = [
    /(?:my name is|i am|i'm|this is|name:?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /(?:call me|myself)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
};

// ═══════════════════════════════════════════════════════════════════
// PRACTICE AREA KEYWORD CLASSIFIER — 1000+ keywords
// Maps user language (Hindi-English mix, legal terms, colloquial)
// to the correct BNS Legal practice area.
// ═══════════════════════════════════════════════════════════════════

const PRACTICE_AREA_KEYWORDS: Record<string, string[]> = {
  "Criminal": [
    // Core criminal terms
    "criminal", "crime", "fir", "bail", "arrest", "police", "jail", "prison",
    "chargesheet", "charge sheet", "remand", "custody", "lockup", "lock up",
    // Theft & robbery
    "theft", "stolen", "thief", "robbed", "robbery", "burglary", "burglar",
    "loot", "looted", "snatching", "snatched", "pickpocket", "shoplifting",
    "housebreaking", "house breaking", "dacoity", "dacoit",
    // Fraud & cheating
    "fraud", "cheating", "cheated", "scam", "scammed", "forgery", "forged",
    "fake document", "impersonation", "identity theft", "counterfeit",
    "misappropriation", "embezzlement", "embezzled", "ponzi", "chit fund fraud",
    "online fraud", "cyber fraud", "cyber crime", "cybercrime", "phishing",
    "upi fraud", "bank fraud", "credit card fraud", "loan fraud",
    "investment fraud", "trading fraud", "crypto fraud", "bitcoin fraud",
    // Violence & assault
    "murder", "homicide", "culpable homicide", "manslaughter", "killed",
    "assault", "attacked", "beaten", "beating", "hit me", "slapped",
    "stabbed", "stabbing", "shot", "shooting", "acid attack",
    "grievous hurt", "simple hurt", "bodily harm", "physical assault",
    "sexual assault", "molestation", "molested", "rape", "gang rape",
    "eve teasing", "stalking", "stalker", "harassment", "harassed",
    "threatening", "threatened", "threat", "intimidation", "intimidated",
    "extortion", "extorted", "blackmail", "blackmailed", "ransom",
    // Kidnapping & abduction
    "kidnap", "kidnapped", "kidnapping", "abduction", "abducted",
    "missing person", "missing child", "human trafficking", "trafficking",
    // Property crimes
    "trespassing", "trespass", "encroachment criminal", "arson",
    "vandalism", "vandalized", "damaged property", "mischief",
    // Drug offences
    "drugs", "narcotics", "ndps", "ganja", "marijuana", "cocaine",
    "heroin", "drug dealer", "drug trafficking", "drug possession",
    "contraband", "smuggling", "smuggled",
    // White collar
    "corruption", "bribery", "bribe", "money laundering", "hawala",
    "benami", "black money", "tax evasion criminal", "income tax raid",
    "prevention of corruption", "disproportionate assets",
    // Weapons
    "arms act", "illegal weapon", "pistol", "firearm", "knife attack",
    "explosive", "bomb threat",
    // Defamation & offense
    "defamation", "defamed", "slander", "libel", "character assassination",
    "obscene", "obscenity", "indecent", "public nuisance",
    // Bail types
    "anticipatory bail", "regular bail", "default bail", "interim bail",
    "bail application", "bail rejected", "bail cancelled", "non-bailable",
    "bailable offence",
    // FIR related
    "file fir", "lodge fir", "zero fir", "fir not registered",
    "police complaint", "police not filing", "police refuse",
    "false fir", "fake fir", "false case", "wrongly accused",
    "quashing", "quash fir", "section 482",
    // IPC / BNS sections
    "ipc", "bns", "section 302", "section 304", "section 307",
    "section 376", "section 379", "section 380", "section 384",
    "section 392", "section 395", "section 406", "section 409",
    "section 415", "section 417", "section 418", "section 419",
    "section 420", "section 467", "section 468", "section 471",
    "section 498a", "498a", "section 354", "section 509",
    "section 506", "section 323", "section 324", "section 325",
    "section 326", "section 341", "section 342", "section 363",
    "section 365", "section 366",
    // CrPC / BNSS
    "crpc", "bnss", "section 154", "section 161", "section 164",
    "section 167", "section 173", "section 190", "section 200",
    "section 311", "section 313", "section 438", "section 439",
    // Hindi / colloquial
    "chori", "maar diya", "maara", "dhamki", "gundagardi",
    "jhagda", "ladai", "police case", "thana", "giraftaar",
    "giraftaari", "paisa chori", "paise chori", "danga", "riot",
  ],

  "Family & Matrimonial": [
    // Divorce
    "divorce", "talaq", "triple talaq", "mutual consent divorce",
    "contested divorce", "divorce petition", "divorce case", "divorce notice",
    "divorce lawyer", "separation", "judicial separation", "annulment",
    "marriage dissolved", "want divorce", "need divorce", "seeking divorce",
    "divorce decree", "divorce settlement", "divorce agreement",
    // Custody
    "child custody", "visitation", "visitation rights",
    "guardianship", "guardian", "parental rights", "parenting time",
    "child support", "minor child", "custody battle", "custody case",
    "kids custody", "bachche ki custody", "bachcha",
    // Maintenance & alimony
    "maintenance", "alimony", "spousal support", "wife maintenance",
    "husband maintenance", "interim maintenance", "permanent alimony",
    "section 125", "crpc 125", "maintenance tribunal", "maintenance order",
    "not paying maintenance", "maintenance pending",
    // Marriage issues
    "marriage", "married", "wedding", "shaadi", "nikah", "vivah",
    "engagement", "dowry", "dahej", "stridhan", "mehr",
    "conjugal rights", "restitution of conjugal rights",
    "second marriage", "bigamy", "remarriage", "live-in relationship",
    "live in", "live together", "cohabitation",
    // Family disputes
    "family", "family dispute", "family problem", "family matter",
    "family law", "family court", "matrimonial", "matrimonial dispute",
    "marital", "marital dispute", "husband wife", "pati patni",
    "spouse", "in-laws", "sasural", "saas", "mother in law",
    "father in law", "joint family", "family property dispute",
    // Domestic violence
    "domestic violence", "dv act", "dv case", "protection order",
    "residence order", "beating by husband", "cruelty", "mental cruelty",
    "physical cruelty", "wife beating", "husband beating",
    "verbal abuse", "emotional abuse", "dowry harassment",
    "dowry death", "dowry prohibition",
    "bride burning", "stove burst",
    // Women's rights
    "women rights", "women protection", "mahila", "nari",
    "sexual harassment at workplace", "posh act", "vishakha",
    "maternity benefit",
    // Hindu law
    "hindu marriage act", "hindu succession", "hindu adoption",
    "hindu minority", "ancestral property family", "coparcener",
    "partition family property", "huf", "hindu undivided family",
    // Muslim law
    "muslim law", "shariat", "nikah nama", "mahr", "iddat",
    "khula", "muslim divorce", "muslim marriage", "halala",
    // Special marriage
    "special marriage act", "inter-caste", "inter-religion",
    "court marriage", "register marriage", "registration of marriage",
    // Adoption
    "adoption", "adopt child", "adopted", "foster", "foster care",
    "surrogacy", "surrogate", "juvenile", "juvenile justice",
    // Succession
    "succession", "inheritance", "heir", "legal heir", "nominee",
    "will", "testament", "probate", "letter of administration",
    "intestate", "succession certificate",
    // Hindi / colloquial
    "parivar", "ghar ka jhagda", "pati", "patni", "bibi",
    "talaq de do", "divorce chahiye", "bachche", "nafrat",
  ],

  "Motor Accident / Insurance": [
    // Accidents
    "accident", "road accident", "car accident", "bike accident",
    "truck accident", "bus accident", "auto accident", "scooter accident",
    "pedestrian accident", "hit and run", "hit n run", "rash driving",
    "negligent driving", "drunk driving", "drunken driving",
    "over speeding", "over-speeding", "fatal accident", "death in accident",
    "died in accident", "killed in accident", "injured in accident",
    "serious injury", "permanent disability", "disability",
    "head injury", "spinal injury", "fracture", "broken bone",
    "accident victim", "road rage", "collision", "crashed",
    // Motor vehicle
    "motor vehicle", "motor accident", "mact", "motor tribunal",
    "motor accident claims tribunal", "mv act", "motor vehicle act",
    "vehicle damage", "car damage", "total loss",
    // Insurance
    "insurance", "insurance claim", "claim rejected", "claim denied",
    "claim settlement", "insurance company", "lic", "mediclaim",
    "health insurance", "life insurance", "vehicle insurance",
    "car insurance", "bike insurance", "third party insurance",
    "comprehensive insurance", "policy", "insurance policy",
    "premium", "insurance premium", "policy lapsed",
    "insurance fraud company", "fake insurance", "insurance agent cheated",
    "insurance ombudsman", "irda", "irdai",
    "fire insurance", "marine insurance", "crop insurance",
    "travel insurance", "accident insurance", "personal accident",
    "group insurance", "term insurance", "endowment",
    "claim not paid", "claim pending", "claim delay",
    "death claim", "maturity claim", "surrender value",
    "insurance dispute", "policy dispute", "nomination",
    // Compensation
    "compensation", "damages", "loss of income", "loss of earning",
    "medical expenses", "hospital bill", "treatment cost",
    "no fault liability", "structured settlement",
    // Hindi / colloquial
    "hadsa", "durghatna", "gaadi", "car ka accident",
    "bike ka accident", "bima", "beema", "claim nahi mil raha",
    "insurance wale", "paisa nahi de rahe", "policy reject",
  ],

  "Civil / Property": [
    // Property general
    "property", "property dispute", "land", "land dispute", "plot",
    "agricultural land", "farm land", "na land", "non-agricultural",
    "commercial property", "residential property", "industrial property",
    "ancestral property", "joint property", "partition", "partition suit",
    // Ownership & transfer
    "ownership", "title", "title dispute", "title verification",
    "title deed", "sale deed", "gift deed", "conveyance", "conveyance deed",
    "transfer of property", "registration", "stamp duty",
    "encumbrance", "encumbrance certificate", "7/12 extract", "7/12",
    "property card", "mutation", "mutation entry", "ferfar",
    "khata", "patta", "revenue record", "land record",
    "survey number", "gat number", "cts number",
    // Possession & injunction
    "possession", "illegal possession", "forceful possession",
    "specific performance", "injunction", "stay order", "temporary injunction",
    "permanent injunction", "restraining order", "status quo",
    "suit for possession", "recovery of possession",
    // Rent & tenancy
    "rent", "rent dispute", "rent agreement", "rent control",
    "rent act", "tenant", "tenancy", "landlord", "pagdi",
    "leave and licence", "leave and license",
    "eviction", "illegal eviction", "eviction notice", "eviction suit",
    "notice to quit", "mesne profits", "subletting", "sub-tenant",
    "rent increase", "rent receipt", "security deposit",
    "deposit not returned", "deposit return",
    // Construction & boundary
    "boundary dispute", "boundary wall", "encroachment",
    "illegal construction", "unauthorized construction",
    "building permission", "construction permission",
    "easement", "right of way", "passage", "access road",
    "common wall", "party wall", "setback", "fsi", "fsi violation",
    // Recovery
    "recovery suit", "money recovery", "debt recovery",
    "loan recovery", "cheque bounce", "dishonour of cheque",
    "section 138", "negotiable instruments", "promissory note",
    "loan not returned", "money not returned", "paisa wapas",
    "udhar", "karz", "loan diya", "paisa diya",
    // Agreement & contract
    "agreement", "contract", "breach of contract", "contract dispute",
    "mou", "memorandum of understanding",
    "indemnity", "guarantee", "surety",
    // Misc civil
    "civil suit", "civil case", "civil court", "civil matter",
    "declaratory suit", "declaration suit", "perpetual injunction",
    "mandatory injunction", "suit for damages",
    "tort", "negligence", "nuisance", "trespass civil",
    "defamation civil", "malicious prosecution",
    // Hindi / colloquial
    "zameen", "zamin", "makan", "ghar", "plot ka jhagda",
    "kabza", "kabja", "illegal kabza", "zameen pe kabza",
    "kiraya", "kirayedar", "makan malik", "registry",
    "dakhil kharij", "naksha", "nakshe", "bhu naksha",
    "patwari", "tehsildar", "sdo", "collector",
    "property pe dispute", "zameen ka case",
  ],

  "Consumer Protection": [
    // Consumer basics
    "consumer", "consumer complaint", "consumer case", "consumer court",
    "consumer forum", "consumer commission", "consumer protection",
    "consumer protection act", "consumer rights", "consumer dispute",
    // Deficiency
    "deficiency", "deficiency of service", "deficiency in service",
    "poor service", "bad service", "service complaint",
    "unfair trade practice", "unfair trade", "misleading advertisement",
    "false advertising", "deceptive practice", "restrictive trade",
    // Products
    "product", "defective product", "faulty product", "product liability",
    "product recall", "manufacturing defect", "design defect",
    "warranty", "guarantee claim", "warranty expired",
    "replacement", "refund", "refund not given", "money back",
    "exchange", "return policy",
    // Specific sectors
    "e-commerce", "online shopping", "flipkart", "amazon", "snapdeal",
    "wrong product", "product not delivered", "delivery issue",
    "online order", "order cancelled", "order not received",
    "overcharging", "overcharged", "wrong billing", "extra charge",
    "hidden charges", "gst overcharge",
    // Banking consumer
    "bank complaint", "bank charges", "penalty charged",
    "credit card complaint", "debit card issue",
    "wrong deduction", "unauthorized deduction", "auto debit",
    "bank locker missing", "atm fraud", "atm complaint",
    // Telecom
    "telecom complaint", "mobile complaint", "wrong charges telecom",
    "caller tune charges", "data charges", "roaming charges",
    "number portability", "mnp", "service provider",
    // Medical consumer
    "medical negligence", "doctor negligence", "hospital complaint",
    "wrong treatment", "wrong surgery", "surgical error",
    "excessive billing hospital", "hospital overcharging",
    // Education consumer
    "school fees", "college complaint", "university complaint",
    "fee refund", "admission cancelled", "capitation fee",
    // Utilities
    "electricity complaint", "electricity bill", "water bill",
    "gas complaint", "lpg complaint", "cylinder", "wrong meter reading",
    "excessive bill", "inflated bill", "bill dispute",
    // Travel consumer
    "flight cancelled", "train complaint", "irctc complaint",
    "hotel complaint", "cab complaint", "ola complaint", "uber complaint",
    "travel agent fraud", "visa fraud",
    // District/state/national
    "district consumer commission", "state consumer commission",
    "national consumer commission", "ncdrc", "consumer appeal",
    // Hindi / colloquial
    "upbhokta", "grahak", "cheez kharab", "paisa wapas nahi",
    "fraud company", "thag", "thagi", "dhoka", "nakli product",
    "duplicate", "asli nahi",
  ],

  "RERA": [
    // RERA core
    "rera", "rera complaint", "rera act", "rera authority",
    "maharera", "rera tribunal", "rera appellate",
    "rera registered", "rera registration", "rera number",
    // Builder & developer
    "builder", "developer", "promoter", "builder complaint",
    "builder fraud", "builder cheating", "construction company",
    "real estate developer", "construction delay", "project delayed",
    "builder not responding", "builder absconding",
    // Flat & apartment
    "flat", "apartment", "flat buyer", "flat possession",
    "flat delayed", "flat not given", "flat quality",
    "flat defect", "flat complaint", "apartment issue",
    "penthouse", "duplex", "row house", "villa", "bungalow",
    // Possession delays
    "possession delayed", "flat possession delayed",
    "possession date missed", "occupation certificate",
    "completion certificate", "oc not given", "cc not given",
    "oc delayed", "cc delayed",
    "commencement certificate", "iod", "intimation of disapproval",
    "bhk", "1bhk", "2bhk", "3bhk", "4bhk",
    // Booking & agreement
    "booking amount", "booking cancelled", "allotment letter",
    "agreement for sale", "sale agreement builder",
    "carpet area", "super built up", "built up area",
    "loading", "undisclosed charges builder", "gst on flat",
    "stamp duty flat", "registration charges builder",
    // Payment & refund
    "construction linked payment", "refund from builder", "builder refund",
    "interest on delay", "penalty on builder",
    "compensation from builder", "builder compensation",
    // Quality issues
    "poor construction", "construction defect", "leakage",
    "seepage", "water leakage", "crack in wall", "structural defect",
    "plumbing issue", "electrical fault", "inferior material",
    "not as per plan", "layout change", "amenities not provided",
    "parking not given", "garden not developed",
    // Project issues
    "project stalled", "stuck project", "incomplete project",
    "abandoned project", "bankrupt builder", "insolvency builder",
    // Hindi / colloquial
    "flat nahi mila", "builder ne dhoka", "ghar nahi diya",
    "flat kab milega", "possession kab", "rera mein complaint",
    "builder bhag gaya", "ghar ka paisa", "flat ka paisa",
  ],

  "Redevelopment / Co-operative Society": [
    // Redevelopment
    "redevelopment", "re-development", "redevelop", "redeveloping",
    "redevelopment project", "redevelopment agreement",
    "redevelopment guidelines", "self redevelopment",
    "cluster redevelopment", "slum redevelopment", "sra",
    "transit accommodation", "transit camp", "temporary accommodation",
    "permanent alternate", "area entitlement", "corpus fund",
    "hardship compensation", "rent compensation during redevelopment",
    "shifting allowance", "disturbance compensation",
    // Co-operative society
    "society", "cooperative society", "co-operative society",
    "housing society", "chs", "co-operative housing society",
    "society registration", "society election", "society meeting",
    "agm", "annual general meeting", "sgm", "special general meeting",
    "managing committee", "society chairman", "society secretary",
    "society treasurer", "society committee", "society member",
    "society dispute", "society complaint",
    // Society operations
    "maintenance charges", "society maintenance", "sinking fund",
    "repair fund", "society fund", "society account",
    "society audit", "society noc", "society transfer",
    "share certificate", "membership", "society bylaws",
    "model bylaws", "deemed conveyance", "conveyance deed society",
    "occupation certificate society",
    // Registrar & law
    "registrar of cooperative societies", "deputy registrar",
    "cooperative court", "co-operative court",
    "maharashtra cooperative societies act", "cooperative act",
    "mcs act", "society act", "section 79a", "section 91",
    "section 101", "section 89", "section 73",
    // Election disputes
    "society election dispute", "election officer", "election rigged",
    "nomination rejected society", "illegal election",
    // Builder-society
    "builder society dispute", "occupancy rights", "layout approval",
    // Housing
    "housing", "housing board", "mhada", "cidco", "mmrda",
    "bmc", "municipal corporation", "nagar palika",
    "housing scheme", "pmay", "pradhan mantri awas",
    "affordable housing",
    // Hindi / colloquial
    "society ka jhagda", "society mein problem",
    "committee wale", "chairman ne", "secretary ne",
    "society ka paisa", "maintenance nahi bhara",
    "redevelopment ka agreement", "punarvikas",
  ],

  "High Court": [
    // High court
    "high court", "bombay high court", "hc", "appellate court",
    // Writ petitions
    "writ", "writ petition", "article 226", "article 227",
    "mandamus", "certiorari", "prohibition writ", "quo warranto",
    "habeas corpus",
    // PIL
    "pil", "public interest litigation", "public interest",
    "social cause", "environmental case",
    // Appeals & revisions
    "appeal", "first appeal", "second appeal", "revision",
    "revision application", "leave to appeal", "special leave",
    "slp", "supreme court", "apex court",
    "civil revision", "criminal revision", "criminal appeal",
    "civil appeal", "writ appeal",
    // High court specific
    "division bench", "single bench", "chief justice",
    "interim order", "constitutional", "fundamental rights",
    "article 14", "article 19", "article 21", "article 32",
    "contempt", "contempt of court", "review petition",
    "curative petition",
    // Procedural
    "caveat", "urgency mention", "adjourned", "adjournment",
    "next date", "hearing date", "order copy", "certified copy",
    // Hindi / colloquial
    "high court mein", "upar ki court", "appeal karna hai",
    "writ dalna", "hc mein case",
  ],

  "Corporate / Tribunal": [
    // NCLT
    "nclt", "national company law tribunal", "company tribunal",
    "company law", "companies act", "company dispute",
    "shareholder dispute", "director dispute", "board resolution",
    "oppression", "mismanagement", "section 241", "section 242",
    "winding up", "liquidation", "voluntary liquidation",
    "compulsory liquidation", "liquidator",
    // Insolvency
    "insolvency", "ibc", "insolvency and bankruptcy",
    "corporate insolvency", "cirp", "resolution professional",
    "resolution plan", "committee of creditors", "coc",
    "moratorium", "nclat", "appellate tribunal company",
    "operational creditor", "financial creditor",
    "personal guarantor insolvency",
    // DRT
    "drt", "debt recovery tribunal",
    "bank recovery", "drat", "appellate tribunal debt",
    "sarfaesi", "securitisation act", "npa", "non performing asset",
    "wilful defaulter", "loan default", "bank auction",
    "attachment order", "garnishee order",
    // Arbitration
    "arbitration", "arbitrator", "arbitral tribunal",
    "arbitration agreement", "arbitration clause",
    "arbitration act", "section 9 arbitration", "section 11 arbitration",
    "section 34 arbitration", "section 36 arbitration", "section 37 arbitration",
    "ad hoc arbitration", "institutional arbitration",
    "international arbitration", "domestic arbitration",
    "arbitral award", "enforcement of award", "challenge award",
    "conciliation", "mediation", "adr",
    "alternative dispute resolution", "lok adalat",
    // Corporate general
    "moa", "aoa", "memorandum of association", "articles of association",
    "startup", "partnership", "partnership dispute", "partner dispute",
    "llp", "limited liability partnership", "pvt ltd", "private limited",
    "public limited", "opc", "one person company",
    "roc", "registrar of companies", "company registration",
    "annual filing", "annual return", "compliance",
    "merger", "acquisition", "amalgamation", "demerger",
    "joint venture", "jv dispute", "mou dispute",
    // Intellectual property
    "trademark", "patent", "copyright",
    "ip dispute", "trade secret", "brand copied", "logo copied",
    // Securities
    "sebi", "securities", "stock market", "share market",
    "insider trading", "market manipulation",
    // Hindi / colloquial
    "company ka problem", "partner ne dhoka",
    "share holders", "company band", "company close",
  ],

  "Labour Law": [
    // Employment
    "labour", "labor", "employee", "employment", "employer",
    "worker", "workman", "working conditions",
    "employment contract", "employment agreement", "service agreement",
    "employment dispute", "job dispute",
    // Termination & dismissal
    "termination", "terminated", "fired", "sacked", "dismissed",
    "wrongful termination", "unfair dismissal", "illegal termination",
    "retrenchment", "layoff", "laid off", "suspension",
    "show cause notice", "domestic enquiry", "departmental enquiry",
    // Wages & salary
    "salary", "salary not paid", "salary pending", "salary dispute",
    "wages", "minimum wages", "overtime", "overtime not paid",
    "bonus", "bonus not paid", "gratuity", "gratuity not paid",
    "provident fund", "epf", "epfo", "esic", "esi",
    "full and final", "full final settlement", "fnf",
    "relieving letter", "experience letter",
    "salary deduction", "illegal deduction",
    // Leave & benefits
    "leave denied", "maternity leave", "paternity leave",
    "casual leave", "sick leave", "earned leave",
    "annual leave", "medical leave", "leave encashment",
    // Working conditions
    "workplace", "workplace harassment", "workplace safety",
    "occupational hazard", "industrial accident", "factory",
    "working hours", "night shift",
    "sexual harassment at work", "posh", "icc",
    "hostile work environment", "discrimination",
    // Unions & disputes
    "trade union", "union", "industrial dispute",
    "strike", "lockout", "bandh", "gherao",
    "collective bargaining", "charter of demands",
    "labour court", "industrial tribunal", "cgit",
    // Acts
    "industrial disputes act", "factories act", "shops and establishments",
    "payment of wages act", "minimum wages act", "payment of bonus act",
    "payment of gratuity act", "workmen compensation act",
    "contract labour", "contract labour act",
    "child labour", "equal remuneration",
    "standing orders", "certified standing orders",
    // Government employment
    "government job", "government employee", "public servant",
    "transfer order", "promotion denied", "seniority",
    "service rules", "pension", "retirement benefits",
    "compassionate appointment", "reservation",
    // Hindi / colloquial
    "naukri", "naukri se nikala", "salary nahi mili",
    "company ne nikala", "notice period", "bond penalty",
    "training bond", "service bond", "office mein problem",
    "boss ne", "manager ne", "hr ne",
    "kaam ka paisa", "mazdoor", "mazdoori",
  ],

  "Cyber Crime": [
    // Cyber offences
    "cyber", "cyber attack",
    "hacking", "hacked", "hacker", "data breach", "data theft",
    "identity theft online", "online scam", "internet fraud",
    // Social media
    "social media harassment", "facebook threat", "instagram threat",
    "trolling", "cyber bullying", "cyberbullying", "online harassment",
    "morphed photo", "morphed image", "revenge porn", "deepfake",
    "fake profile", "impersonation online", "catfishing",
    "viral video", "leaked photos", "leaked video",
    "online defamation", "social media defamation",
    // Financial cyber
    "gpay fraud", "paytm fraud", "phonepe fraud",
    "net banking fraud", "online banking fraud",
    "otp fraud", "otp shared", "sim swap", "sim cloning",
    "vishing", "smishing",
    "ransomware", "malware", "virus attack",
    "crypto scam", "bitcoin scam", "nft scam",
    "online loan fraud", "loan app harassment", "loan app",
    // IT Act
    "it act", "information technology act", "section 66",
    "section 66a", "section 66c", "section 66d",
    "section 67", "section 43", "cyber cell",
    "cyber police", "cyber complaint",
    // Hindi / colloquial
    "online thagi", "internet pe dhoka", "account hack",
    "paise kat gaye", "otp de diya", "link click kiya",
    "whatsapp pe fraud", "fake call",
  ],

  "Tax & Revenue": [
    // Income tax
    "income tax", "it return", "itr", "tax assessment",
    "tax notice", "demand notice tax", "tax demand",
    "tax refund", "tax audit", "tax evasion",
    "tax planning", "tax exemption", "tax deduction",
    "section 80c", "section 80d", "tds", "advance tax",
    "capital gains", "capital gains tax", "long term capital",
    "short term capital", "house property income",
    "income tax appellate tribunal", "itat",
    "commissioner of income tax", "cit appeal",
    "reassessment", "reopening of assessment",
    "search and seizure",
    // GST
    "gst", "goods and services tax", "gst registration",
    "gst return", "gst notice", "gst audit", "gst refund",
    "input tax credit", "itc", "e-way bill", "gst appeal",
    "gst tribunal", "anti profiteering",
    // Property tax
    "property tax", "house tax", "municipal tax",
    "property tax notice", "property tax dispute",
    // Customs & excise
    "customs", "customs duty", "import duty", "export duty",
    "customs tribunal", "cestat",
    "excise", "central excise",
    // Hindi / colloquial
    "tax ka notice", "tax bharna hai", "tax dispute",
    "it department", "tax wale", "gst ka problem",
  ],

  "Constitutional & Public Law": [
    // Fundamental rights
    "right to life", "right to equality",
    "right to freedom", "right to education", "rti",
    "right to information", "rti application", "rti appeal",
    "freedom of speech", "freedom of expression",
    "right to privacy", "right to livelihood",
    // Constitutional remedies
    "constitution", "constitutional remedy",
    // Government & administrative
    "government order", "government notification", "gazette",
    "administrative law", "administrative action",
    "natural justice", "audi alteram partem", "speaking order",
    "quasi judicial", "statutory body",
    // Election law
    "election petition", "election commission",
    "election dispute", "representation of people act",
    "disqualification", "electoral fraud", "booth capturing",
    // Environment
    "environment", "environmental clearance", "pollution",
    "ngt", "national green tribunal", "crz",
    "coastal regulation zone", "deforestation",
    "noise pollution", "air pollution", "water pollution",
    // Land acquisition
    "land acquisition", "section 4 notification",
    "collector notice", "compulsory acquisition",
    "right to fair compensation", "rehabilitation",
    "resettlement", "eminent domain",
    // Hindi / colloquial
    "sarkar ka order", "sarkari", "adhikar", "fundamental right",
    "haq", "kanoon", "samvidhan", "constitution se mila",
  ],

  "Banking & Finance": [
    // Loans
    "loan", "home loan", "personal loan", "car loan", "education loan",
    "business loan", "agricultural loan", "crop loan",
    "loan npa", "loan restructuring",
    "one time settlement", "ots", "loan waiver",
    "loan harassment", "recovery agent",
    "cibil", "credit score", "cibil score",
    // Banking
    "bank", "banking", "bank account",
    "bank fraud civil", "bank penalty",
    "savings account", "current account", "fixed deposit",
    "account frozen", "account seized", "account blocked",
    "bank locker issue", "safe deposit",
    "rbi complaint", "rbi ombudsman", "banking ombudsman",
    // Cheque & instruments
    "cheque dishonour", "dishonoured cheque",
    "bounced cheque", "section 138 ni act", "138 case",
    "demand notice cheque", "cheque case", "cheque not cleared",
    "bill of exchange", "demand draft",
    // Mortgage & pledge
    "mortgage", "mortgage dispute", "equitable mortgage",
    "hypothecation", "pledge", "lien",
    "foreclosure", "possession notice sarfaesi",
    // Hindi / colloquial
    "bank ka problem", "loan nahi mil raha", "emi nahi bhar paya",
    "recovery agent aaye", "bank wale pareshaan",
    "cheque bounce hua", "cheque return",
  ],

  "Senior Citizen": [
    "senior citizen", "elderly", "old age", "old parents",
    "parents maintenance", "maintenance and welfare of parents",
    "senior citizen act", "elder abuse", "abandoned parents",
    "old age home", "parent neglect", "son not caring",
    "daughter not caring", "boodhe maa baap", "maa baap ki seva",
    "parents ko chod diya", "property from parents",
    "reverse mortgage", "pension issue senior",
  ],
};

// Build a flat lookup for fast matching
const KEYWORD_AREA_PAIRS: [string, string][] = [];
for (const [area, keywords] of Object.entries(PRACTICE_AREA_KEYWORDS)) {
  for (const kw of keywords) {
    KEYWORD_AREA_PAIRS.push([kw, area]);
  }
}
// Sort by keyword length descending so longer (more specific) phrases match first
KEYWORD_AREA_PAIRS.sort((a, b) => b[0].length - a[0].length);

const classifyPracticeArea = (text: string): string => {
  const lower = text.toLowerCase();
  for (const [keyword, area] of KEYWORD_AREA_PAIRS) {
    if (lower.includes(keyword)) return area;
  }
  return "General Legal Inquiry";
};

// Detect from current message first; fall back to full history only if no specific area found
const detectPracticeArea = (currentMsg: string, allText: string): string => {
  const fromCurrent = classifyPracticeArea(currentMsg);
  if (fromCurrent !== "General Legal Inquiry") return fromCurrent;
  return classifyPracticeArea(allText);
};

// Client-side rate limiting constants
const CLIENT_RATE_LIMITS = {
  MIN_SEND_INTERVAL_MS: 2000,  // 2 seconds between messages
  MAX_MESSAGES_PER_SESSION: 50, // Max messages per chat session
};

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot" | "assistant"; text: string }[]>([
    { role: "bot", text: "Welcome to BNS Legal! 👋\n\nEstablished in 1988 with 35+ years of legal excellence. How can I help you today?\n\nTell me about your legal matter and share your name & phone number — our advocates will reach out for a free consultation.\n\nYou can ask about:\n• Our practice areas & expertise\n• Schedule a free consultation\n• Office locations & contact\n• Any legal matter you're facing" },
  ]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isLoading, setIsLoading] = useState(false);
  const [submittedAreas, setSubmittedAreas] = useState<Set<string>>(new Set());
  const [collectedLead, setCollectedLead] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageCount, setMessageCount] = useState(0);
  const lastSendTimeRef = useRef<number>(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const callOpenRouterAPI = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(`${LLM_CONFIG.baseUrl}/chat/completions`, {
        method: "POST",
        headers: getOpenRouterHeaders(),
        body: JSON.stringify({
          model: LLM_CONFIG.model,
          messages: [
            {
              role: "system",
              content: BNS_LEGAL_SYSTEM_PROMPT,
            },
            ...messages
              .filter((m) => m.role !== "bot")
              .slice(-10) // Keep last 10 messages for better context
              .map((m) => ({
                role: m.role === "user" ? "user" : "assistant",
                content: m.text,
              })),
            {
              role: "user",
              content: userMessage,
            },
          ],
          max_tokens: LLM_CONFIG.maxTokens,
          temperature: LLM_CONFIG.temperature,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("OpenRouter API error:", error);
        throw new Error(`API Error: ${error.error?.message || "Unknown error"}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "Unable to generate response. Please try again.";
    } catch (err) {
      console.error("Failed to call OpenRouter API:", err);
      throw err;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // ── Client-side rate limiting ──
    const now = Date.now();
    const timeSinceLastSend = now - lastSendTimeRef.current;

    if (timeSinceLastSend < CLIENT_RATE_LIMITS.MIN_SEND_INTERVAL_MS) {
      // Too fast — silently ignore (button is already visually disabled during loading)
      return;
    }

    if (messageCount >= CLIENT_RATE_LIMITS.MAX_MESSAGES_PER_SESSION) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "You've reached the maximum number of messages for this session. For further assistance, please call us directly at 9223438655 or email bnslegal01@gmail.com.",
        },
      ]);
      setInput("");
      return;
    }

    lastSendTimeRef.current = now;
    setMessageCount((prev) => prev + 1);
    // ── End rate limiting ──

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    // Detect contact details from user message
    const phone = extractPhone(userMsg);
    const email = extractEmail(userMsg);
    const name = extractName(userMsg);
    const allText = messages.map(m => m.text).join(" ") + " " + userMsg;
    const practiceArea = detectPracticeArea(userMsg, allText);

    // Accumulate lead info across messages
    const updatedLead = { ...collectedLead };
    if (phone) updatedLead.phone = phone;
    if (email) updatedLead.email = email;
    if (name) updatedLead.name = name;
    setCollectedLead(updatedLead);

    try {
      const botResponse = await callOpenRouterAPI(userMsg);
      setMessages((prev) => [...prev, { role: "assistant", text: botResponse }]);

      // Auto-submit lead when we have phone AND this practice area hasn't been reported yet
      const hasPhone = updatedLead.phone;
      const isNewArea = practiceArea !== "General Legal Inquiry" && !submittedAreas.has(practiceArea);
      const neverSubmitted = submittedAreas.size === 0;
      if (hasPhone && (neverSubmitted || isNewArea)) {
        setSubmittedAreas(prev => new Set(prev).add(practiceArea));
        // Build full chat transcript for the lawyer
        const allMessages = [...messages, { role: "user" as const, text: userMsg }, { role: "assistant" as const, text: botResponse }];
        const fullTranscript = allMessages.map(m => `${m.role === "user" ? "Client" : "AI Assistant"}: ${m.text}`).join("\n\n");
        try {
          await supabase.functions.invoke("send-notification", {
            body: {
              type: "chat_lead",
              data: {
                phone: updatedLead.phone,
                email: updatedLead.email || "Not provided",
                name: updatedLead.name || "Not provided",
                practiceArea,
                conversationSummary: fullTranscript,
                userMessage: userMsg,
                sessionId,
              },
            },
          });
        } catch (leadErr) {
          console.error("Failed to submit lead:", leadErr);
        }
      }

      // Save chat to DB
      try {
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "chat_query",
            data: {
              userMessage: userMsg,
              botResponse,
              sessionId,
              model: LLM_CONFIG.model,
            },
          },
        });
      } catch (dbErr) {
        console.error("Failed to save chat query to database:", dbErr);
      }
    } catch (err) {
      const errorMessage = "I apologize, but I'm having trouble processing your request. Please try again or contact us directly at bnslegal01@gmail.com or call 9223438655.";
      setMessages((prev) => [...prev, { role: "bot", text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 backdrop-blur-xl bg-card/90 border border-white/10 shadow-2xl flex flex-col max-h-[70vh] rounded-2xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-background/80 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-primary" />
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">BNS Legal</p>
                  <p className="font-body text-[10px] text-muted-foreground">Est. 1988 • Free Consultation</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3 py-2 text-sm whitespace-pre-line rounded ${
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-foreground"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-foreground px-3 py-2 rounded text-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></span>
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-100"></span>
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-200"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-white/10 flex gap-2 bg-background/50 backdrop-blur-md">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                placeholder="Describe your legal matter..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50 rounded-lg"
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading}
                className="px-3 py-2 bg-primary text-primary-foreground hover:bg-[hsl(var(--gold-light))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
};

export default ChatButton;
