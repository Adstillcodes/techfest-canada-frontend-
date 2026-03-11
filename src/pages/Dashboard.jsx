import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WalletTicket from "../components/WalletTicket";
import { fetchMe } from "../utils/api";
import { logout } from "../utils/auth";
import EventSchedule from "../components/EventSchedule";
import { client } from "../utils/sanity";

const NEWS_DB = {
  "Artificial Intelligence & Machine Learning": [
    { title: "OpenAI's GPT-5 Brings Multimodal Reasoning to Enterprise at Scale", source: "MIT Technology Review", url: "https://www.technologyreview.com", date: "Mar 2026", tag: "Enterprise AI" },
    { title: "Canada Invests $2.4B in National AI Sovereignty Strategy", source: "Globe and Mail", url: "https://www.theglobeandmail.com", date: "Feb 2026", tag: "Policy" },
    { title: "Anthropic's Constitutional AI Now Powering 400+ Government Deployments", source: "Wired", url: "https://www.wired.com", date: "Mar 2026", tag: "GovTech" },
    { title: "AI Hallucination Rates Drop 78% with New Grounding Architectures", source: "The Verge", url: "https://www.theverge.com", date: "Feb 2026", tag: "Research" },
    { title: "Microsoft Copilot Reaches 500M Daily Active Users in Workplace", source: "TechCrunch", url: "https://techcrunch.com", date: "Mar 2026", tag: "Enterprise" },
    { title: "DeepMind AlphaFold 3 Accelerates Drug Discovery by 10x", source: "Nature", url: "https://www.nature.com", date: "Jan 2026", tag: "Healthcare AI" },
    { title: "EU AI Act Full Compliance Deadline Triggers Wave of Audits", source: "Reuters", url: "https://www.reuters.com", date: "Mar 2026", tag: "Regulation" },
    { title: "Edge AI Chips Hit 100 TOPS Efficiency — Enabling On-Device LLMs", source: "IEEE Spectrum", url: "https://spectrum.ieee.org", date: "Feb 2026", tag: "Hardware" },
    { title: "AI-Powered Procurement Platforms Cut Enterprise Costs by 34%", source: "Forbes", url: "https://www.forbes.com", date: "Mar 2026", tag: "Enterprise" },
    { title: "Generative AI in Legal: 60% of Canada's Top 50 Firms Now Deployed", source: "Canadian Lawyer", url: "https://www.canadianlawyermag.com", date: "Feb 2026", tag: "LegalTech" },
    { title: "Small Language Models Outperform GPT-4 on Domain-Specific Tasks", source: "Hugging Face Blog", url: "https://huggingface.co/blog", date: "Jan 2026", tag: "Research" },
    { title: "Vector Search Becomes the Default Database Architecture for AI Apps", source: "InfoQ", url: "https://www.infoq.com", date: "Feb 2026", tag: "Infrastructure" },
  ],
  "Cybersecurity": [
    { title: "Nation-State Hackers Exploit Zero-Days in Critical Infrastructure — CISA Alert", source: "Wired", url: "https://www.wired.com", date: "Mar 2026", tag: "Threat Intel" },
    { title: "Canada's New Cyber Shield Act Mandates 72-Hour Breach Disclosure", source: "Globe and Mail", url: "https://www.theglobeandmail.com", date: "Feb 2026", tag: "Regulation" },
    { title: "Zero-Trust Architecture Adoption Hits 68% Among Fortune 500", source: "Dark Reading", url: "https://www.darkreading.com", date: "Mar 2026", tag: "Architecture" },
    { title: "Ransomware Costs Hit $275B Globally in 2025 — A Record High", source: "Cybersecurity Ventures", url: "https://cybersecurityventures.com", date: "Jan 2026", tag: "Threat Report" },
    { title: "Post-Quantum Cryptography Migration: NIST Finalizes Standards", source: "NIST", url: "https://www.nist.gov", date: "Feb 2026", tag: "Cryptography" },
    { title: "AI-Powered SOCs Reduce Mean Time to Detect by 91%", source: "CrowdStrike Blog", url: "https://www.crowdstrike.com/blog", date: "Mar 2026", tag: "Operations" },
    { title: "Supply Chain Attacks Surge 340% — Software Bill of Materials Now Mandatory", source: "SC Media", url: "https://www.scmagazine.com", date: "Feb 2026", tag: "Supply Chain" },
    { title: "Identity-Based Attacks Account for 74% of All Breaches in 2025", source: "Verizon DBIR", url: "https://www.verizon.com/business/resources/reports/dbir", date: "Jan 2026", tag: "Identity" },
    { title: "Microsoft Defender Now Blocks 99.9% of Phishing With AI Heuristics", source: "BleepingComputer", url: "https://www.bleepingcomputer.com", date: "Mar 2026", tag: "Tools" },
    { title: "OT/IT Convergence: Industrial Cyber Incidents Up 200% Year-Over-Year", source: "Dragos", url: "https://www.dragos.com", date: "Feb 2026", tag: "Industrial" },
    { title: "Cyber Insurance Premiums Drop 15% as AI Underwriting Matures", source: "Insurance Journal", url: "https://www.insurancejournal.com", date: "Mar 2026", tag: "Insurance" },
    { title: "CISA Warns of Critical Vulnerabilities in Water Treatment SCADA Systems", source: "Reuters", url: "https://www.reuters.com", date: "Feb 2026", tag: "Critical Infra" },
  ],
  "Quantum Computing": [
    { title: "IBM Condor Reaches 1,000 Qubit Milestone with Error Correction", source: "Nature", url: "https://www.nature.com", date: "Mar 2026", tag: "Hardware" },
    { title: "Google Achieves Fault-Tolerant Quantum Computing Breakthrough", source: "Science", url: "https://www.science.org", date: "Feb 2026", tag: "Research" },
    { title: "Canada's Quantum Valley Attracts $800M in Foreign Investment", source: "Financial Post", url: "https://financialpost.com", date: "Mar 2026", tag: "Investment" },
    { title: "Banks Begin Quantum-Safe Migration — JP Morgan Leads with $2B Program", source: "Bloomberg", url: "https://www.bloomberg.com", date: "Feb 2026", tag: "Finance" },
    { title: "D-Wave Solves Logistics Optimization Problem in 2ms vs 6 Hours Classical", source: "MIT Technology Review", url: "https://www.technologyreview.com", date: "Jan 2026", tag: "Applications" },
    { title: "NIST Post-Quantum Standards Enter Final Adoption Phase Globally", source: "NIST", url: "https://www.nist.gov", date: "Feb 2026", tag: "Standards" },
    { title: "Quantum Networks: China and Canada Both Achieve 1,000km Entanglement", source: "Physics Today", url: "https://physicstoday.scitation.org", date: "Mar 2026", tag: "Networking" },
    { title: "IonQ Partners with Airbus for Quantum-Optimized Flight Routing", source: "Aviation Week", url: "https://aviationweek.com", date: "Feb 2026", tag: "Aerospace" },
    { title: "Quantum Drug Discovery: 3 FDA Approvals Cite Quantum-Assisted Research", source: "BioPharma Dive", url: "https://www.biopharmadive.com", date: "Mar 2026", tag: "Pharma" },
    { title: "Photonic Quantum Chips Hit Room Temperature Operation — Game Changer", source: "IEEE Spectrum", url: "https://spectrum.ieee.org", date: "Jan 2026", tag: "Hardware" },
    { title: "EU Quantum Flagship Publishes 2030 Commercial Roadmap", source: "European Commission", url: "https://ec.europa.eu", date: "Feb 2026", tag: "Policy" },
    { title: "Quantum Random Number Generators Now Built Into Intel CPUs", source: "Ars Technica", url: "https://arstechnica.com", date: "Mar 2026", tag: "Hardware" },
  ],
  "Blockchain & Web3": [
    { title: "Ethereum Processes 1M TPS After Final Sharding Implementation", source: "CoinDesk", url: "https://www.coindesk.com", date: "Mar 2026", tag: "Infrastructure" },
    { title: "Canada's Digital Dollar Pilot Expands to 2 Million Users", source: "Bank of Canada", url: "https://www.bankofcanada.ca", date: "Feb 2026", tag: "CBDC" },
    { title: "BlackRock Tokenizes $50B Real Estate Portfolio on Ethereum", source: "Bloomberg", url: "https://www.bloomberg.com", date: "Mar 2026", tag: "RWA" },
    { title: "SEC Approves Spot Ethereum ETF — Institutional Floodgates Open", source: "Financial Times", url: "https://www.ft.com", date: "Feb 2026", tag: "Regulation" },
    { title: "Smart Contract Auditing Becomes ISO-Certified — New Global Standard", source: "Reuters", url: "https://www.reuters.com", date: "Jan 2026", tag: "Standards" },
    { title: "Web3 Gaming Surpasses Traditional Mobile Games in Daily Active Users", source: "Wired", url: "https://www.wired.com", date: "Mar 2026", tag: "Gaming" },
    { title: "DeFi Total Value Locked Hits $2 Trillion Milestone", source: "DeFi Pulse", url: "https://defipulse.com", date: "Feb 2026", tag: "DeFi" },
    { title: "Supply Chain Blockchain Reduces Food Safety Incidents by 60% at Walmart", source: "Harvard Business Review", url: "https://hbr.org", date: "Mar 2026", tag: "Supply Chain" },
    { title: "Zero-Knowledge Proofs Enable Private Compliance Verification for Banks", source: "The Block", url: "https://www.theblock.co", date: "Feb 2026", tag: "Privacy" },
    { title: "NFT Land Registry Adopted by 3 Canadian Provinces", source: "Globe and Mail", url: "https://www.theglobeandmail.com", date: "Jan 2026", tag: "GovTech" },
    { title: "Layer 2 Gas Fees Drop Below $0.001 — Making Micro-Payments Viable", source: "Decrypt", url: "https://decrypt.co", date: "Mar 2026", tag: "Infrastructure" },
    { title: "Cross-Chain Bridges Finally Safe? Audit Reports Show 99% Loss Reduction", source: "CryptoSlate", url: "https://cryptoslate.com", date: "Feb 2026", tag: "Security" },
  ],
  "FinTech & Digital Payments": [
    { title: "Real-Time Payments Rails Process $1 Trillion in a Single Day for First Time", source: "Financial Times", url: "https://www.ft.com", date: "Mar 2026", tag: "Payments" },
    { title: "Canada's Payments Modernization Act Goes Live — ISO 20022 Mandatory", source: "Payments Canada", url: "https://www.payments.ca", date: "Feb 2026", tag: "Regulation" },
    { title: "Stripe Valuation Hits $200B After Profitable IPO", source: "TechCrunch", url: "https://techcrunch.com", date: "Mar 2026", tag: "Markets" },
    { title: "Buy Now Pay Later Regulation Tightens — CFPB Issues Final Rules", source: "Reuters", url: "https://www.reuters.com", date: "Feb 2026", tag: "BNPL" },
    { title: "AI Fraud Detection Saves Canadian Banks $4.2B in 2025", source: "Financial Post", url: "https://financialpost.com", date: "Jan 2026", tag: "Fraud" },
    { title: "Open Banking API Standard Adopted by All Big Six Canadian Banks", source: "Globe and Mail", url: "https://www.theglobeandmail.com", date: "Mar 2026", tag: "Open Banking" },
    { title: "Embedded Finance Market Reaches $7 Trillion — Every App Becomes a Bank", source: "Forbes", url: "https://www.forbes.com", date: "Feb 2026", tag: "Embedded Finance" },
    { title: "Digital Wallets Overtake Cash and Cards in Canada for First Time", source: "CBC Business", url: "https://www.cbc.ca/news/business", date: "Mar 2026", tag: "Consumer" },
    { title: "Chime, Wealthsimple, and Neo Financial Report Combined 30M Canadian Users", source: "BNN Bloomberg", url: "https://www.bnnbloomberg.ca", date: "Feb 2026", tag: "Neobanks" },
    { title: "Cross-Border Payment Costs Hit All-Time Low of 0.3% Average", source: "World Bank", url: "https://www.worldbank.org", date: "Jan 2026", tag: "Remittance" },
    { title: "RegTech Spending Hits $25B as Compliance Complexity Grows", source: "Deloitte Insights", url: "https://www2.deloitte.com/insights", date: "Mar 2026", tag: "Compliance" },
    { title: "Biometric Payments Cleared 10 Billion Transactions in 2025", source: "Mastercard Newsroom", url: "https://www.mastercard.com/news", date: "Feb 2026", tag: "Biometrics" },
  ],
  "Investment Banking": [
    { title: "Global M&A Activity Rebounds to $5.2 Trillion — Tech Sector Leads", source: "Bloomberg", url: "https://www.bloomberg.com", date: "Mar 2026", tag: "M&A" },
    { title: "AI-Driven Due Diligence Cuts Deal Timeline from 90 to 12 Days", source: "Financial Times", url: "https://www.ft.com", date: "Feb 2026", tag: "Deal Making" },
    { title: "Goldman Sachs AI Trading Desk Outperforms Human Teams by 23%", source: "Wall Street Journal", url: "https://www.wsj.com", date: "Mar 2026", tag: "Trading" },
    { title: "Canada's Tech IPO Market Returns — 14 Listings in Q1 2026", source: "Financial Post", url: "https://financialpost.com", date: "Mar 2026", tag: "IPO" },
    { title: "Private Equity Dry Powder Hits $4 Trillion — Deployment Pressure Intensifies", source: "Pitchbook", url: "https://pitchbook.com", date: "Feb 2026", tag: "Private Equity" },
    { title: "ESG Bonds Surpass Traditional Corporate Bonds in Issuance Volume", source: "Reuters", url: "https://www.reuters.com", date: "Jan 2026", tag: "ESG" },
    { title: "Tokenized Securities Trading Volume Surpasses Traditional Equities", source: "Bloomberg", url: "https://www.bloomberg.com", date: "Mar 2026", tag: "Tokenization" },
    { title: "Morgan Stanley Rolls Out AI Advisor to 16,000 Financial Advisors", source: "CNBC", url: "https://www.cnbc.com", date: "Feb 2026", tag: "Wealth Mgmt" },
    { title: "SPAC Revival: Clean Energy SPACs Raise $80B in 6 Months", source: "Barron's", url: "https://www.barrons.com", date: "Mar 2026", tag: "SPAC" },
    { title: "Debt Capital Markets Digitization Saves $1.2B in Issuance Costs Annually", source: "IFR", url: "https://www.ifre.com", date: "Feb 2026", tag: "DCM" },
    { title: "Activist Shareholders Win Record 78% of Campaigns in 2025", source: "Wall Street Journal", url: "https://www.wsj.com", date: "Jan 2026", tag: "Activism" },
    { title: "Cross-Border M&A Scrutiny Peaks — 40% of Deals Face Regulatory Review", source: "Harvard Law Forum", url: "https://corpgov.law.harvard.edu", date: "Mar 2026", tag: "Regulation" },
  ],
  "Software Engineering": [
    { title: "GitHub Copilot X Writes 60% of Production Code at Meta and Google", source: "The Verge", url: "https://www.theverge.com", date: "Mar 2026", tag: "AI Dev Tools" },
    { title: "Rust Overtakes Python as Most-Loved Language for 5th Year Running", source: "Stack Overflow", url: "https://survey.stackoverflow.co", date: "Feb 2026", tag: "Languages" },
    { title: "WebAssembly Becomes Dominant Runtime for Edge Computing", source: "InfoQ", url: "https://www.infoq.com", date: "Mar 2026", tag: "Runtime" },
    { title: "Micro-Frontend Architecture Adopted by 70% of Enterprise React Teams", source: "Smashing Magazine", url: "https://www.smashingmagazine.com", date: "Feb 2026", tag: "Architecture" },
    { title: "Serverless Cold Start Problem Finally Solved by AWS Lambda SnapStart GA", source: "AWS News", url: "https://aws.amazon.com/blogs", date: "Jan 2026", tag: "Cloud" },
    { title: "AI Code Review Tools Catch 3x More Bugs Than Human Reviewers", source: "ACM Queue", url: "https://queue.acm.org", date: "Mar 2026", tag: "Quality" },
    { title: "OpenTelemetry Becomes the Default Observability Standard Across All Major Clouds", source: "CNCF", url: "https://www.cncf.io", date: "Feb 2026", tag: "Observability" },
    { title: "Platform Engineering Teams Reduce Developer Toil by 55%", source: "Gartner", url: "https://www.gartner.com", date: "Mar 2026", tag: "Platform Eng" },
    { title: "TypeScript 6.0 Adds Native Runtime Type Checking — No Zod Needed", source: "Dev.to", url: "https://dev.to", date: "Feb 2026", tag: "Languages" },
    { title: "Kubernetes Turns 12 — Adoption Hits 89% of Fortune 500 Enterprises", source: "CNCF Survey", url: "https://www.cncf.io", date: "Jan 2026", tag: "Infrastructure" },
    { title: "DORA Metrics Study: Elite Performers Deploy 208x More Frequently", source: "DORA Report", url: "https://dora.dev", date: "Mar 2026", tag: "DevOps" },
    { title: "eBPF Revolutionizes Linux Networking — 10x Throughput Gains Reported", source: "Linux Foundation", url: "https://www.linuxfoundation.org", date: "Feb 2026", tag: "Systems" },
  ],
  "Data Science & Analytics": [
    { title: "Databricks Unity Catalog Becomes Enterprise Data Mesh Default", source: "InfoQ", url: "https://www.infoq.com", date: "Mar 2026", tag: "Data Mesh" },
    { title: "Real-Time ML Inference Latency Hits Sub-Millisecond with FPGA Backends", source: "IEEE Spectrum", url: "https://spectrum.ieee.org", date: "Feb 2026", tag: "MLOps" },
    { title: "Apache Iceberg Replaces Parquet as the Default Data Lake Format", source: "Hacker News", url: "https://news.ycombinator.com", date: "Mar 2026", tag: "Data Infra" },
    { title: "Synthetic Data Generation Solves Privacy Bottleneck for 80% of ML Teams", source: "MIT Technology Review", url: "https://www.technologyreview.com", date: "Feb 2026", tag: "Privacy" },
    { title: "Feature Stores Become Standard — Feast, Tecton Both Hit 5,000 Enterprises", source: "Towards Data Science", url: "https://towardsdatascience.com", date: "Jan 2026", tag: "MLOps" },
    { title: "Canada Passes AI Transparency Act — Model Cards Now Legally Required", source: "Globe and Mail", url: "https://www.theglobeandmail.com", date: "Mar 2026", tag: "Regulation" },
    { title: "Causal AI Moves from Research to Production — Reducing A/B Test Times by 90%", source: "Harvard Data Science Review", url: "https://hdsr.mitpress.mit.edu", date: "Feb 2026", tag: "Causal AI" },
    { title: "Data Contracts Become Industry Standard After Monzo Open-Sources Framework", source: "Data Engineering Weekly", url: "https://dataengineeringweekly.com", date: "Mar 2026", tag: "Data Quality" },
    { title: "Graph Neural Networks Enable Trillion-Node Analysis at Meta Scale", source: "ICML 2026 Proceedings", url: "https://icml.cc", date: "Feb 2026", tag: "Research" },
    { title: "Time-Series Foundation Models Outperform Classical Methods on All Benchmarks", source: "Arxiv", url: "https://arxiv.org", date: "Jan 2026", tag: "Research" },
    { title: "DuckDB Becomes the Default Analytics Engine for Python Data Workflows", source: "Python Weekly", url: "https://www.pythonweekly.com", date: "Mar 2026", tag: "Tools" },
    { title: "Analytics Engineering Certification Surpasses Data Science in Job Demand", source: "LinkedIn Economic Graph", url: "https://economicgraph.linkedin.com", date: "Feb 2026", tag: "Careers" },
  ],
  "Healthcare & Life Sciences Tech": [
    { title: "FDA Approves First AI-Diagnosed Disease — No Radiologist Required", source: "NEJM", url: "https://www.nejm.org", date: "Mar 2026", tag: "AI Diagnostics" },
    { title: "CRISPR Gene Therapy Cures Sickle Cell — 94% Remission Rate at 2 Years", source: "Nature Medicine", url: "https://www.nature.com/nm", date: "Feb 2026", tag: "Gene Therapy" },
    { title: "Canada's Digital Health Backbone — Pan-Canadian Health Data Network Goes Live", source: "Health Canada", url: "https://www.canada.ca/health", date: "Mar 2026", tag: "Digital Health" },
    { title: "Remote Patient Monitoring Prevents 1.2M Hospitalizations Annually in Canada", source: "CIHI", url: "https://www.cihi.ca", date: "Feb 2026", tag: "Remote Care" },
    { title: "GLP-1 Drug Market Hits $200B — Ozempic Competition Drives Price Collapse", source: "BioPharma Dive", url: "https://www.biopharmadive.com", date: "Jan 2026", tag: "Pharma" },
    { title: "Surgical Robots Perform 2M Procedures — 40% Fewer Complications Than Human", source: "Lancet", url: "https://www.thelancet.com", date: "Mar 2026", tag: "Robotics" },
    { title: "Digital Twins for Clinical Trials Reduce Drug Development Cost by 35%", source: "MIT Technology Review", url: "https://www.technologyreview.com", date: "Feb 2026", tag: "Digital Twins" },
    { title: "Wearable Continuous Glucose Monitors Hit 97% Accuracy — No Calibration", source: "Diabetes Care", url: "https://diabetesjournals.org/care", date: "Mar 2026", tag: "Wearables" },
    { title: "Mental Health Apps Proven Effective — Meta-Analysis of 200 RCTs Published", source: "JAMA Psychiatry", url: "https://jamanetwork.com", date: "Feb 2026", tag: "Mental Health" },
    { title: "Federated Learning Enables Hospitals to Train AI Without Sharing Patient Data", source: "Google Health Blog", url: "https://health.google", date: "Jan 2026", tag: "Privacy" },
    { title: "Cancer Moonshot: AI Detects Stage 1 Pancreatic Cancer with 91% Accuracy", source: "Cancer Research", url: "https://cancerres.aacrjournals.org", date: "Mar 2026", tag: "Oncology" },
    { title: "Longevity Biotech Raises $15B — Epigenetic Reprogramming Enters Trials", source: "STAT News", url: "https://www.statnews.com", date: "Feb 2026", tag: "Longevity" },
  ],
  "Clean Tech & Sustainability": [
    { title: "Canada Hits 50% Renewable Grid — Nuclear + Solar Now Dominant", source: "Natural Resources Canada", url: "https://www.nrcan.gc.ca", date: "Mar 2026", tag: "Energy" },
    { title: "Solid-State Batteries Enter Mass Production — 800km EV Range Standard", source: "MIT Technology Review", url: "https://www.technologyreview.com", date: "Feb 2026", tag: "Energy Storage" },
    { title: "Carbon Capture Costs Fall Below $100/Ton — Commercial Viability Threshold", source: "IEA", url: "https://www.iea.org", date: "Mar 2026", tag: "Carbon Capture" },
    { title: "Green Hydrogen Hits $1.50/kg — Cheaper Than Natural Gas in 8 Markets", source: "BloombergNEF", url: "https://about.bnef.com", date: "Feb 2026", tag: "Hydrogen" },
    { title: "AI Grid Optimization Reduces Curtailment of Renewables by 60%", source: "Rocky Mountain Institute", url: "https://rmi.org", date: "Jan 2026", tag: "Smart Grid" },
    { title: "Canada's Carbon Tax Hits $170/Tonne — Accelerating Industrial Transition", source: "Globe and Mail", url: "https://www.theglobeandmail.com", date: "Mar 2026", tag: "Policy" },
    { title: "Direct Air Capture Plants Now Operational Across 12 Canadian Provinces", source: "Clean Energy Canada", url: "https://cleanenergycanada.org", date: "Feb 2026", tag: "DAC" },
    { title: "Perovskite Solar Efficiency Hits 35% — Commercial Panels Begin Shipping", source: "Science", url: "https://www.science.org", date: "Mar 2026", tag: "Solar" },
    { title: "Supply Chain Decarbonization: Scope 3 Reporting Now Mandatory in Canada", source: "OSC", url: "https://www.osc.ca", date: "Feb 2026", tag: "Reporting" },
    { title: "Fusion Energy Milestone — NIF Achieves Net Energy Gain for 3rd Consecutive Time", source: "Nature Physics", url: "https://www.nature.com/nphys", date: "Jan 2026", tag: "Fusion" },
    { title: "Wave Energy Converters Achieve Grid Parity in Atlantic Canada", source: "IEEE Spectrum", url: "https://spectrum.ieee.org", date: "Mar 2026", tag: "Ocean Energy" },
    { title: "Vertical Farming Scales: 40% of Canadian Leafy Greens Now Grown Indoors", source: "AgFunder News", url: "https://agfundernews.com", date: "Feb 2026", tag: "AgriTech" },
  ],
  "Robotics & Automation": [
    { title: "Tesla Optimus Ships 100,000 Units — Humanoid Robots Enter Mass Market", source: "TechCrunch", url: "https://techcrunch.com", date: "Mar 2026", tag: "Humanoid" },
    { title: "Collaborative Robots Hit 45% of New Manufacturing Line Installations", source: "Robotics Business Review", url: "https://www.roboticsbusinessreview.com", date: "Feb 2026", tag: "Cobots" },
    { title: "Amazon's Fully Autonomous Warehouse Opens — Zero Human Workers on Floor", source: "The Verge", url: "https://www.theverge.com", date: "Mar 2026", tag: "Logistics" },
    { title: "Drone Delivery Approved for Urban Areas Across All Canadian Cities", source: "Transport Canada", url: "https://tc.canada.ca", date: "Feb 2026", tag: "Drones" },
    { title: "Surgical Robot Market Hits $25B — da Vinci 5 Performs 2M Procedures", source: "MedTech Dive", url: "https://www.medtechdive.com", date: "Jan 2026", tag: "Medical Robots" },
    { title: "AI Vision Systems Enable Bin-Picking Robots to Handle Any Object", source: "IEEE Robotics", url: "https://www.ieee-ras.org", date: "Mar 2026", tag: "Vision AI" },
    { title: "Self-Driving Trucks Carry 30% of Long-Haul Freight in North America", source: "Freight Waves", url: "https://www.freightwaves.com", date: "Feb 2026", tag: "Autonomous Vehicles" },
    { title: "Industrial Automation ROI Averages 14 Months — New McKinsey Study", source: "McKinsey", url: "https://www.mckinsey.com", date: "Mar 2026", tag: "ROI" },
    { title: "Boston Dynamics Atlas Now Used in 500 Construction Sites", source: "Construction Dive", url: "https://www.constructiondive.com", date: "Feb 2026", tag: "Construction" },
    { title: "Process Mining Reveals 40% Efficiency Gains Before Any Automation Deployed", source: "Gartner", url: "https://www.gartner.com", date: "Jan 2026", tag: "Process Mining" },
    { title: "RPA Market Consolidates — UiPath and Automation Anywhere Merge", source: "Fortune", url: "https://fortune.com", date: "Mar 2026", tag: "RPA" },
    { title: "Space Robotics: Moon Base Construction Robots Deployed by Axiom", source: "Space News", url: "https://spacenews.com", date: "Feb 2026", tag: "Space" },
  ],
  "DevOps & Platform Engineering": [
    { title: "Platform Engineering Reduces Cognitive Load by 62% — State of DevOps Report", source: "DORA", url: "https://dora.dev", date: "Mar 2026", tag: "Platform Eng" },
    { title: "FinOps Becomes Mandatory — Average Cloud Waste Drops from 35% to 12%", source: "FinOps Foundation", url: "https://www.finops.org", date: "Feb 2026", tag: "FinOps" },
    { title: "GitOps Now Standard at 80% of Cloud-Native Organizations", source: "CNCF Survey", url: "https://www.cncf.io", date: "Mar 2026", tag: "GitOps" },
    { title: "Service Mesh Complexity Crisis — Istio 2.0 Simplifies Configuration by 90%", source: "InfoQ", url: "https://www.infoq.com", date: "Feb 2026", tag: "Service Mesh" },
    { title: "Internal Developer Portals Become Top Priority — Backstage Hits 10K Deployments", source: "ThoughtWorks", url: "https://www.thoughtworks.com", date: "Jan 2026", tag: "IDP" },
    { title: "eBPF-Based Networking Replaces iptables in 60% of New Kubernetes Clusters", source: "Linux Foundation", url: "https://www.linuxfoundation.org", date: "Mar 2026", tag: "Networking" },
    { title: "AI-Powered Incident Response Cuts MTTR from 4 Hours to 12 Minutes", source: "PagerDuty Blog", url: "https://www.pagerduty.com/blog", date: "Feb 2026", tag: "SRE" },
    { title: "Green Engineering: CPU Efficiency Optimization Becomes KPI at Top 100 Tech Firms", source: "ACM Queue", url: "https://queue.acm.org", date: "Mar 2026", tag: "Sustainability" },
    { title: "Multi-Cloud Strategy Adopted by 89% of Enterprises — Complexity Surges", source: "Flexera", url: "https://www.flexera.com", date: "Feb 2026", tag: "Multi-Cloud" },
    { title: "Supply Chain Security: SLSA Level 3 Becomes Procurement Requirement", source: "OpenSSF", url: "https://openssf.org", date: "Jan 2026", tag: "Supply Chain" },
    { title: "Serverless Function Count Exceeds Containers for First Time at AWS", source: "AWS re:Invent", url: "https://reinvent.awsevents.com", date: "Mar 2026", tag: "Serverless" },
    { title: "Chaos Engineering Certification Launches — Netflix, Google Co-Author Curriculum", source: "Chaos Engineering Community", url: "https://principlesofchaos.org", date: "Feb 2026", tag: "Reliability" },
  ],
  "Product Management": [
    { title: "AI Product Managers Earn 40% More — Certification Programs Overwhelmed", source: "Product School", url: "https://productschool.com", date: "Mar 2026", tag: "Careers" },
    { title: "Continuous Discovery: Teresa Torres Framework Adopted by Spotify, Airbnb, Meta", source: "Product Talk", url: "https://www.producttalk.org", date: "Feb 2026", tag: "Discovery" },
    { title: "Jobs-to-be-Done Framework Gets AI Overlay — Customer Research in Minutes", source: "Harvard Business Review", url: "https://hbr.org", date: "Mar 2026", tag: "Research" },
    { title: "PLG vs Sales-Led: Data Shows Hybrid Wins — 73% of $1B+ SaaS Companies Pivot", source: "OpenView Partners", url: "https://openviewpartners.com", date: "Feb 2026", tag: "GTM" },
    { title: "Feature Velocity Drops 30% As Teams Prioritize Depth Over Breadth", source: "Intercom Blog", url: "https://www.intercom.com/blog", date: "Jan 2026", tag: "Strategy" },
    { title: "North Star Metric Frameworks Being Replaced by Portfolio Metrics", source: "Amplitude Blog", url: "https://amplitude.com/blog", date: "Mar 2026", tag: "Metrics" },
    { title: "AI Writes 80% of PRDs at Notion, Linear, Figma — PM Role Evolving", source: "Lenny's Newsletter", url: "https://www.lennysnewsletter.com", date: "Feb 2026", tag: "AI Tools" },
    { title: "B2B SaaS Churn Hits 5-Year High — Retention Now Bigger Priority Than Acquisition", source: "ChartMogul", url: "https://chartmogul.com", date: "Mar 2026", tag: "Retention" },
    { title: "Outcome-Based Roadmaps Outperform Feature Roadmaps — 2 Year Study Confirms", source: "Mind the Product", url: "https://www.mindtheproduct.com", date: "Feb 2026", tag: "Roadmapping" },
    { title: "Design Systems ROI: 10x Developer Productivity at Scale — Figma Study", source: "Figma", url: "https://www.figma.com/blog", date: "Jan 2026", tag: "Design" },
    { title: "Product-Led Sales Emerges: Sales Teams Working the PQL Pipeline", source: "Kyle Poyar, OpenView", url: "https://openviewpartners.com", date: "Mar 2026", tag: "PLS" },
    { title: "Pricing Power: 68% of SaaS Companies Raised Prices in 2025 Without Churn", source: "Price Intelligently", url: "https://www.priceintelligently.com", date: "Feb 2026", tag: "Pricing" },
  ],
  "Other": [
    { title: "Canada Named Top 5 Global Tech Hub for First Time — 40,000 New Tech Jobs", source: "Globe and Mail", url: "https://www.theglobeandmail.com", date: "Mar 2026", tag: "Canada Tech" },
    { title: "Remote Work Productivity Study: Hybrid Teams Outperform Both Extremes", source: "Stanford SIEPR", url: "https://siepr.stanford.edu", date: "Feb 2026", tag: "Future of Work" },
    { title: "Global Tech Investment Reaches $850B in 2025 — AI Accounts for 40%", source: "PitchBook", url: "https://pitchbook.com", date: "Mar 2026", tag: "Investment" },
    { title: "Digital Transformation Failures Drop 60% as Methodology Matures", source: "McKinsey Digital", url: "https://www.mckinsey.com/capabilities/mckinsey-digital", date: "Feb 2026", tag: "Strategy" },
    { title: "Top Tech Skills for 2026: Prompt Engineering, MLOps, FinOps Top the List", source: "LinkedIn Learning", url: "https://learning.linkedin.com", date: "Jan 2026", tag: "Skills" },
    { title: "Open Source Foundations Secure $500M in Sustaining Grants", source: "Linux Foundation", url: "https://www.linuxfoundation.org", date: "Mar 2026", tag: "Open Source" },
    { title: "The 2026 CTO Report: AI Strategy Now Boards' #1 Agenda Item", source: "Gartner", url: "https://www.gartner.com", date: "Feb 2026", tag: "Leadership" },
    { title: "Toronto, Montreal, Vancouver Rank in Global Top 10 AI Research Cities", source: "Nature Index", url: "https://www.nature.com/nature-index", date: "Mar 2026", tag: "Canada" },
    { title: "Tech Layoffs Plateau — Hiring Rebounds in AI, Security, and Platform Roles", source: "Layoffs.fyi", url: "https://layoffs.fyi", date: "Feb 2026", tag: "Jobs" },
    { title: "Developer Experience Becomes Executive Priority — 72% of CIOs Measure DX", source: "Developer Experience Report", url: "https://developerexperience.io", date: "Jan 2026", tag: "DX" },
    { title: "Cross-Industry Tech Adoption: 90% of Non-Tech Companies Now Have a CTO", source: "Deloitte", url: "https://www2.deloitte.com", date: "Mar 2026", tag: "Industry" },
    { title: "Purpose-Driven Tech: ESG Frameworks Now Applied to Software Procurement", source: "Harvard Business Review", url: "https://hbr.org", date: "Feb 2026", tag: "ESG" },
  ],
};

// Aliases so onboarding field names map correctly
const FIELD_ALIASES = {
  "Venture Capital & Private Equity": "Investment Banking",
  "Asset Management": "Investment Banking",
  "InsurTech": "FinTech & Digital Payments",
  "RegTech & Compliance": "FinTech & Digital Payments",
  "Cloud Computing & Infrastructure": "DevOps & Platform Engineering",
  "Telecommunications": "Software Engineering",
  "Media & AdTech": "Product Management",
  "EdTech": "Product Management",
  "PropTech & Real Estate Tech": "Other",
  "Defence & GovTech": "Cybersecurity",
  "Supply Chain & Logistics Tech": "Robotics & Automation",
};

function getNewsForField(field) {
  if (!field) return NEWS_DB["Other"];
  const direct = NEWS_DB[field];
  if (direct) return direct;
  const alias = FIELD_ALIASES[field];
  if (alias) return NEWS_DB[alias];
  return NEWS_DB["Other"];
}


// ── TAG COLOR MAP ──────────────────────────────────────────────────────────────
const TAG_COLORS = [
  "#7a3fd1","#f5a623","#22c55e","#06b6d4","#ec4899",
  "#a855f7","#f97316","#10b981","#3b82f6","#eab308",
];
function tagColor(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

// ── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(122,63,209,0.20)",
        borderRadius: 16, padding: "20px 22px",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />
      <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>{icon}</div>
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "1.4rem", fontWeight: 900, color: "#fff", marginBottom: 4,
      }}>{value}</div>
      <div style={{ fontSize: "0.7rem", color: "rgba(200,180,255,0.6)", textTransform: "uppercase", letterSpacing: "0.8px" }}>{label}</div>
    </motion.div>
  );
}

// ── NEWS CARD ─────────────────────────────────────────────────────────────────
function NewsCard({ item, index }) {
  const color = tagColor(item.tag);
  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ x: 4 }}
      style={{
        display: "flex", alignItems: "flex-start", gap: 14,
        padding: "16px 18px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderLeft: `3px solid ${color}`,
        borderRadius: 12,
        textDecoration: "none",
        cursor: "pointer",
        transition: "background 0.2s",
        marginBottom: 8,
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(122,63,209,0.08)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
    >
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "0.65rem", fontWeight: 800,
        color, minWidth: 24, paddingTop: 2, letterSpacing: "0.5px",
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: "0.85rem", fontWeight: 600,
          color: "rgba(255,255,255,0.92)", lineHeight: 1.45,
          marginBottom: 6,
        }}>
          {item.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            fontSize: "0.65rem", fontWeight: 700,
            background: `${color}20`, color,
            padding: "2px 8px", borderRadius: 99,
            border: `1px solid ${color}40`,
          }}>{item.tag}</span>
          <span style={{ fontSize: "0.65rem", color: "rgba(200,180,255,0.45)" }}>
            {item.source} · {item.date}
          </span>
          <span style={{ fontSize: "0.65rem", color: "rgba(200,180,255,0.4)", marginLeft: "auto" }}>↗</span>
        </div>
      </div>
    </motion.a>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [venueSettings, setVenueSettings] = useState(null);
  const [activeTab, setActiveTab]     = useState("overview");
  const [isDark, setIsDark]           = useState(true);
  const [newsField, setNewsField]     = useState(null);
  const [newsItems, setNewsItems]     = useState([]);

  useEffect(() => {
    setIsDark(document.body.classList.contains("dark-mode"));
    const observer = new MutationObserver(() => setIsDark(document.body.classList.contains("dark-mode")));
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const userData = await fetchMe();
        setUser(userData);
        const field = userData?.fieldOfWork || localStorage.getItem("tfc_field") || null;
        setNewsField(field);
        setNewsItems(getNewsForField(field));
        const settingsData = await client.fetch('*[_type == "siteSettings"][0]');
        setVenueSettings(settingsData);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleGoogleCalendar = () => {
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", venueSettings?.eventName || "The Tech Festival Canada");
    url.searchParams.set("details", "Canada's premier tech conference — The Carlu, Toronto");
    url.searchParams.set("location", `${venueSettings?.venueName || "The Carlu"}, ${venueSettings?.venueAddress || "444 Yonge St, Toronto, ON"}`);
    url.searchParams.set("dates", "20261028T130000Z/20261028T210000Z");
    window.open(url.toString(), "_blank");
  };

  const handleAppleCalendar = () => {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${venueSettings?.eventName || "The Tech Festival Canada"}\nLOCATION:${venueSettings?.venueName || "The Carlu"}, ${venueSettings?.venueAddress || "444 Yonge St, Toronto"}\nDTSTART:20261028T130000Z\nDTEND:20261028T210000Z\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "techfest-canada-2026.ics";
    a.click();
  };

  const bg       = isDark ? "#07030f"                   : "#f4f0ff";
  const card     = isDark ? "rgba(255,255,255,0.03)"    : "rgba(122,63,209,0.06)";
  const border   = isDark ? "rgba(255,255,255,0.08)"    : "rgba(122,63,209,0.20)";
  const textMain = isDark ? "#ffffff"                   : "#0f0520";
  const textMuted= isDark ? "rgba(200,180,255,0.65)"    : "rgba(60,30,110,0.65)";

  const TABS = [
    { id: "overview", label: "Overview",   icon: "⚡" },
    { id: "tickets",  label: "My Tickets", icon: "🎟" },
    { id: "news",     label: "Industry Intel", icon: "📡" },
    { id: "schedule", label: "Schedule",   icon: "📅" },
  ];

  if (loading) {
    return (
      <div style={{ background: "#07030f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Navbar />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ width: 40, height: 40, border: "3px solid rgba(122,63,209,0.3)", borderTopColor: "#7a3fd1", borderRadius: "50%" }}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "100vh", background: "#07030f", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#fff" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif" }}>Session expired</h2>
            <p style={{ color: "rgba(200,180,255,0.6)", marginBottom: 24 }}>Please log in again.</p>
            <button onClick={() => window.location.href = "/"} style={{ padding: "12px 28px", background: "linear-gradient(135deg,#7a3fd1,#f5a623)", border: "none", borderRadius: 12, color: "#fff", fontFamily: "'Orbitron',sans-serif", fontWeight: 800, cursor: "pointer" }}>
              Go Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const firstName = user.name?.split(" ")[0] || "Delegate";
  const ticketCount = user.tickets?.length || 0;
  const hasTickets = ticketCount > 0;

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMain }}>
      <style>{`
        @media (max-width: 768px) {
          .db-stat-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .db-overview-grid { grid-template-columns: 1fr !important; }
          .db-account-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .db-account-span { grid-column: span 1 !important; }
          .db-news-grid { grid-template-columns: 1fr !important; }
          .db-news-sidebar { display: none !important; }
          .db-tab-label { display: none; }
          .db-hero-pad { padding-left: 4% !important; padding-right: 4% !important; }
          .db-content-pad { padding-left: 4% !important; padding-right: 4% !important; }
          .db-venue-subgrid { grid-template-columns: 1fr 1fr !important; }
          .db-cal-row { flex-direction: column !important; }
        }
        @media (max-width: 480px) {
          .db-stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .db-account-grid { grid-template-columns: 1fr !important; }
          .db-venue-subgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Navbar />

      {/* ── HERO HEADER ── */}
      <div style={{
        position: "relative", paddingTop: 120, paddingBottom: 48,
        paddingLeft: "5%", paddingRight: "5%",
        background: isDark
          ? "linear-gradient(180deg, rgba(122,63,209,0.12) 0%, transparent 100%)"
          : "linear-gradient(180deg, rgba(122,63,209,0.08) 0%, transparent 100%)",
        borderBottom: `1px solid ${border}`,
        overflow: "hidden",
      }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(${isDark ? "rgba(122,63,209,0.05)" : "rgba(122,63,209,0.07)"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "rgba(122,63,209,0.05)" : "rgba(122,63,209,0.07)"} 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }} />

        <div className="db-hero-pad" style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Greeting */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: isDark ? "rgba(122,63,209,0.15)" : "rgba(122,63,209,0.10)",
              border: `1px solid rgba(122,63,209,0.30)`,
              borderRadius: 999, padding: "5px 16px", marginBottom: 20,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", display: "inline-block" }} />
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", color: isDark ? "#c4a8ff" : "#6b21d6" }}>
                Delegate Portal
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900, marginBottom: 8, lineHeight: 1.1,
            }}>
              Welcome back,{" "}
              <span style={{ background: "linear-gradient(135deg,#7a3fd1,#f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {firstName}
              </span>
            </h1>
            <p style={{ color: textMuted, fontSize: "0.95rem", marginBottom: 32 }}>
              {newsField ? `Your ${newsField} industry intel is ready.` : "Your personalized event portal — October 28, 2026."}
            </p>
          </motion.div>

          {/* Stat strip */}
          <div className="db-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, maxWidth: 700 }}>
            <StatCard label="Days to Event"     value="231"           icon="⏳" color="#7a3fd1" delay={0.1} />
            <StatCard label="My Tickets"        value={ticketCount}   icon="🎟" color="#f5a623" delay={0.2} />
            <StatCard label="News Articles"     value={newsItems.length} icon="📡" color="#22c55e" delay={0.3} />
            <StatCard label="Event Venue"       value="The Carlu"     icon="📍" color="#06b6d4" delay={0.4} />
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{
        borderBottom: `1px solid ${border}`,
        paddingLeft: "5%", paddingRight: "5%",
        background: isDark ? "rgba(0,0,0,0.3)" : "rgba(122,63,209,0.04)",
        position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 4, overflowX: "auto" }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "16px 12px", background: "none",
                border: "none", borderBottom: `2px solid ${activeTab === t.id ? "#7a3fd1" : "transparent"}`,
                color: activeTab === t.id ? (isDark ? "#fff" : "#0f0520") : textMuted,
                cursor: "pointer", fontSize: "0.82rem", fontWeight: 700,
                fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.5px",
                textTransform: "uppercase", whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 5% 80px" }}>
        <AnimatePresence mode="wait">

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="db-overview-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

                {/* Venue Card */}
                <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 24, padding: "32px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#7a3fd1,#f5a623)" }} />
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c4a8ff", marginBottom: 20 }}>📍 Venue & Date</div>

                  <div className="db-venue-subgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                    {[
                      { label: "LOCATION", main: venueSettings?.venueName || "The Carlu", sub: venueSettings?.venueAddress || "444 Yonge St, Toronto, ON" },
                      { label: "DATE", main: "Wednesday", sub: "October 28, 2026" },
                      { label: "DOORS OPEN", main: "08:00 AM", sub: "EST — Registration" },
                      { label: "FORMAT", main: "1-Day Summit", sub: "Full Day Program" },
                    ].map(v => (
                      <div key={v.label} style={{ background: isDark ? "rgba(122,63,209,0.08)" : "rgba(122,63,209,0.05)", border: `1px solid ${border}`, borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(196,168,255,0.7)", marginBottom: 4 }}>{v.label}</div>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: textMain, marginBottom: 2 }}>{v.main}</div>
                        <div style={{ fontSize: "0.72rem", color: textMuted }}>{v.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Map link */}
                  <a
                    href="https://maps.google.com/?q=The+Carlu+444+Yonge+St+Toronto"
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "block", textAlign: "center", padding: "12px",
                      background: isDark ? "rgba(122,63,209,0.15)" : "rgba(122,63,209,0.10)",
                      border: `1px solid rgba(122,63,209,0.30)`,
                      borderRadius: 12, color: "#c4a8ff",
                      textDecoration: "none", fontSize: "0.75rem", fontWeight: 700,
                      letterSpacing: "0.5px", marginBottom: 16,
                    }}
                  >
                    🗺 View on Google Maps →
                  </a>

                  {/* Calendar buttons */}
                  <div className="db-cal-row" style={{ display: "flex", gap: 10 }}>
                    <button onClick={handleGoogleCalendar} style={{
                      flex: 1, padding: "12px", background: "linear-gradient(135deg,#7a3fd1,#f5a623)",
                      border: "none", borderRadius: 12, color: "#fff",
                      fontFamily: "'Orbitron', sans-serif", fontWeight: 800,
                      fontSize: "0.7rem", cursor: "pointer", letterSpacing: "0.5px",
                    }}>+ Google Calendar</button>
                    <button onClick={handleAppleCalendar} style={{
                      flex: 1, padding: "12px",
                      background: card, border: `1.5px solid ${border}`,
                      borderRadius: 12, color: textMain,
                      fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
                      fontSize: "0.7rem", cursor: "pointer",
                    }}>+ Apple / Outlook</button>
                  </div>
                </div>

                {/* Top News Preview */}
                <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 24, padding: "32px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#22c55e,#06b6d4)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "#86efac" }}>
                      📡 {newsField ? `${newsField.split(" ")[0]} Intel` : "Industry Intel"}
                    </div>
                    <button onClick={() => setActiveTab("news")} style={{ background: "none", border: "none", color: "rgba(134,239,172,0.7)", fontSize: "0.7rem", cursor: "pointer", fontWeight: 700 }}>
                      See all →
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {newsItems.slice(0, 5).map((item, i) => (
                      <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{
                        display: "flex", gap: 10, alignItems: "flex-start",
                        padding: "10px 12px",
                        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.04)",
                        border: `1px solid ${border}`, borderRadius: 10,
                        textDecoration: "none",
                        transition: "background 0.2s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(122,63,209,0.10)" : "rgba(122,63,209,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.04)"}
                      >
                        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem", fontWeight: 800, color: tagColor(item.tag), minWidth: 20, paddingTop: 1 }}>{i + 1}</span>
                        <div>
                          <div style={{ fontSize: "0.78rem", color: isDark ? "rgba(255,255,255,0.85)" : "#1a0a40", lineHeight: 1.4, fontWeight: 500, marginBottom: 3 }}>{item.title}</div>
                          <div style={{ fontSize: "0.62rem", color: textMuted }}>{item.source} · {item.date}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Account info */}
                <div
  className="db-account-span"
  style={{
    background: card,
    border: `1.5px solid ${border}`,
    borderRadius: 24,
    padding: "32px",
    gridColumn: "span 2",
    position: "relative",
    overflow: "hidden"
  }}
>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#a855f7,#f5a623)" }} />
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c4a8ff", marginBottom: 20 }}>👤 Your Account</div>
                  <div className="db-account-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                    {[
                      { label: "Name", val: user.name || "—" },
                      { label: "Email", val: user.email || "—" },
                      { label: "Field", val: user.fieldOfWork || newsField || "Not set" },
                      { label: "LinkedIn", val: user.linkedinUrl ? "Connected ✓" : "Not linked" },
                    ].map(f => (
                      <div key={f.label} style={{ background: isDark ? "rgba(122,63,209,0.06)" : "rgba(122,63,209,0.04)", border: `1px solid ${border}`, borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: textMuted, marginBottom: 5 }}>{f.label}</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: textMain, wordBreak: "break-word" }}>{f.val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={logout} style={{
                      padding: "10px 22px",
                      background: "rgba(239,68,68,0.10)", border: "1.5px solid rgba(239,68,68,0.25)",
                      borderRadius: 10, color: "#f87171",
                      fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
                      fontSize: "0.72rem", cursor: "pointer", letterSpacing: "0.5px",
                    }}>
                      Log Out →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TICKETS TAB */}
          {activeTab === "tickets" && (
            <motion.div key="tickets" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {hasTickets ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                  {user.tickets.map(t => (
                    <WalletTicket key={t.ticketId} user={user} ticket={t} />
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: "center", padding: "80px 20px",
                  background: card, border: `1.5px solid ${border}`, borderRadius: 24,
                }}>
                  <div style={{ fontSize: "4rem", marginBottom: 20 }}>🎟</div>
                  <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.2rem", fontWeight: 900, color: textMain, marginBottom: 12 }}>No Tickets Yet</h3>
                  <p style={{ color: textMuted, marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>
                    Secure your delegate pass to The Tech Festival Canada — October 28, 2026 at The Carlu, Toronto.
                  </p>
                  <a href="/tickets" style={{
                    display: "inline-block", padding: "14px 32px",
                    background: "linear-gradient(135deg,#7a3fd1,#f5a623)",
                    border: "none", borderRadius: 12, color: "#fff",
                    fontFamily: "'Orbitron', sans-serif", fontWeight: 800,
                    fontSize: "0.85rem", textDecoration: "none",
                  }}>
                    ✦ Get Your Tickets
                  </a>
                </div>
              )}
            </motion.div>
          )}

          {/* NEWS TAB */}
          {activeTab === "news" && (
            <motion.div key="news" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="db-news-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 28, alignItems: "start" }}>
                <div>
                  {/* Header */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.2rem", fontWeight: 900, color: textMain }}>
                        {newsField ? `${newsField}` : "Industry Intelligence"}
                      </div>
                    </div>
                    <p style={{ color: textMuted, fontSize: "0.85rem" }}>
                      Top {newsItems.length} stories curated for your field · Updated March 2026
                    </p>
                  </div>

                  {/* News list */}
                  {newsItems.map((item, i) => (
                    <NewsCard key={i} item={item} index={i} />
                  ))}
                </div>

                {/* Sidebar */}
                <div className="db-news-sidebar" style={{ position: "sticky", top: 80 }}>
                  <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 20, padding: "24px" }}>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", color: isDark ? "#c4a8ff" : "#6b21d6", marginBottom: 16 }}>
                      Your Field
                    </div>
                    <div style={{
                      background: isDark ? "rgba(122,63,209,0.12)" : "rgba(122,63,209,0.08)",
                      border: "1px solid rgba(122,63,209,0.25)",
                      borderRadius: 12, padding: "14px 16px",
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "0.78rem", fontWeight: 700, color: textMain,
                      marginBottom: 16,
                    }}>
                      {newsField || "General Technology"}
                    </div>
                    <p style={{ fontSize: "0.78rem", color: textMuted, lineHeight: 1.6, marginBottom: 20 }}>
                      News is curated based on the field you selected during onboarding. To change your field, update your profile.
                    </p>
                    <div style={{ borderTop: `1px solid ${border}`, paddingTop: 16 }}>
                      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: textMuted, marginBottom: 12 }}>
                        Sources Include
                      </div>
                      {["Reuters", "Bloomberg", "MIT Tech Review", "Globe and Mail", "Financial Post", "The Verge", "Wired", "Nature"].map(s => (
                        <div key={s} style={{ fontSize: "0.75rem", color: textMuted, paddingBottom: 6, borderBottom: `1px solid ${border}`, marginBottom: 6 }}>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SCHEDULE TAB */}
          {activeTab === "schedule" && (
            <motion.div key="schedule" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <EventSchedule />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
