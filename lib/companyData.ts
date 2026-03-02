export interface Article {
  title: string;
  date: string;
  url: string;
}

export interface TradingUpdate {
  title: string;
  date: string;
  type: string;
}

export interface Podcast {
  title: string;
  url: string;
  date: string;
}

export interface Leadership {
  name: string;
  role: string;
  bio?: string;
}

export interface Financials {
  revenue?: string;
  profit?: string;
  eps?: string;
  dividendYield?: string;
  marketCap?: string;
  totalAssets?: string;
  peRatio?: string;
  notes?: string;
  keyFigures?: { label: string; value: string }[];
}

export interface CompanyInfo {
  fullName: string;
  sector: string;
  founded?: string;
  listed?: string;
  yearEnd?: string;
  headquarters?: string;
  phone?: string;
  website?: string;
  indices?: string[];
  transferSecretary?: string;
  description: string;
  mission?: string;
  vision?: string;
  employees?: string;
  leadership: Leadership[];
  financials: Financials;
  sustainability?: string;
  articles: Article[];
  tradingUpdates: TradingUpdate[];
  podcasts: Podcast[];
}

export const companyData: Record<string, CompanyInfo> = {
  AIRTEL: {
    fullName: "Airtel Malawi Plc",
    sector: "Telecommunications",
    founded: "1998",
    listed: "February 24, 2020",
    yearEnd: "December",
    headquarters: "Airtel Complex, City Centre, Off Convention Drive, Lilongwe, Malawi",
    phone: "+265 999 901 300",
    website: "https://www.airtel.mw",
    indices: ["XMSW All Share", "XMSW Domestic"],
    transferSecretary: "Standard Bank Plc (MW)",
    description:
      "Airtel Malawi Plc is a leading telecommunications company headquartered in Lilongwe, Malawi. It delivers essential mobile and internet connectivity to millions across Malawi and is listed on the Malawi Stock Exchange as a subsidiary of Bharti Airtel Malawi Holdings B.V, part of the globally recognised Bharti Enterprises group. Core business activities include GSM mobile cellular services, mobile internet, messaging, international and long-distance services, and value-added services. Airtel Malawi also engages in the sale of mobile devices and accessories. In 2024, the company recorded 8.1 million customers — a 14.3% year-on-year growth. As the market leader in Malawi's telecom industry, Airtel commands a dominant share of the mobile voice and data market, backed by expansive 4G network infrastructure and AI-powered customer innovations.",
    mission:
      "To enrich lives through digital connectivity by delivering reliable, affordable, and innovative communication services that empower Malawians and promote socio-economic development.",
    employees: "Substantial workforce (exact figure not disclosed in 2024 Annual Report)",
    leadership: [
      { name: "Aashish Dutt", role: "Managing Director", bio: "Appointed January 2025, bringing extensive telecoms experience across the African continent." },
    ],
    financials: {
      revenue: "MWK 270.97 billion (up 39.7% from 2023)",
      profit: "MWK 42.72 billion (vs. MWK 15.42 billion loss in 2023)",
      keyFigures: [
        { label: "Revenue", value: "MWK 270.97 billion (+39.7%)" },
        { label: "Net Profit", value: "MWK 42.72 billion" },
        { label: "Operating Profit", value: "MWK 94.08 billion" },
        { label: "Customer Base", value: "8.1 million" },
        { label: "Data Usage", value: "181 billion MBs (+37.2%)" },
      ],
    },
    sustainability:
      "In 2024, Airtel partnered with UNICEF and the Ministry of Education to digitally transform 17 schools across Malawi, providing tablets, smart TVs, computers, and free 10 Mbps internet valued at over MWK 250 million — reaching over 1.3 million students. Airtel also donated MWK 17 million to families affected by the 2024 plane crash. Environmental stewardship includes e-waste recycling through take-back programmes with Huawei, Ericsson, Nokia, and ZTE.",
    articles: [
      { title: "Airtel Malawi HY2025 Financials", date: "2025-09-25", url: "https://mse.co.mw/company/MWAIRT001156" },
      { title: "Airtel Africa Profit Soars 375% in H1 2025", date: "2025-10-29", url: "https://www.ecofinagency.com/news-finances/2910-49936-airtel-africa-profit-soars-375-in-h1-2025-on-data-and-mobile-money-growth" },
    ],
    tradingUpdates: [
      { title: "New Managing Director Appointment - Aashish Dutt", date: "2025-01-23", type: "Corporate Change" },
      { title: "FY2024 Final Dividend Notice", date: "2025-07-08", type: "Dividend" },
    ],
    podcasts: [],
  },

  BHL: {
    fullName: "Blantyre Hotels Plc",
    sector: "Hospitality & Tourism",
    founded: "1997",
    listed: "January 1, 1997",
    yearEnd: "September",
    headquarters: "Ryalls Hotel, 2 Hannover Avenue, Blantyre, Malawi",
    phone: "0111 895 200",
    indices: ["XMSW All Share", "XMSW Domestic"],
    description:
      "Blantyre Hotels Plc (BHL) is a prominent player in Malawi's hospitality sector, committed to delivering exceptional guest experiences and sustainable growth. BHL operates Protea Hotel Ryalls in Blantyre under a long-term management agreement with Marriott International. The company is actively constructing a four-star hotel in Lilongwe through its special purpose vehicle, Oasis Hospitality Limited, which will add 180 rooms to its portfolio and solidify its presence in the capital city.",
    mission:
      "To redefine hospitality through sustainable practices and eco-conscious innovation, offering guests exceptional comfort while preserving the beauty of the planet, striving to create unforgettable stays where luxury meets sustainability.",
    employees: "120 employees as at 31 December 2024 (up from 116)",
    leadership: [],
    financials: {
      revenue: "K7.8 billion (up 69%)",
      keyFigures: [
        { label: "Gross Revenue", value: "K7.8 billion (+69%)" },
        { label: "EBITDA", value: "K1.03 billion (vs. K242 million prior year)" },
        { label: "Loss After Tax", value: "K1.4 billion" },
        { label: "Total Assets", value: "K85.5 billion (from K15.8 billion)" },
        { label: "Total Equity", value: "K64.8 billion (from K6.8 billion)" },
      ],
      notes: "Loss after tax primarily due to net finance charges of K2.3 billion related to bank loans for the Lilongwe hotel project.",
    },
    sustainability:
      "In October 2024, Protea Hotel by Marriott Blantyre Ryalls began its journey toward Green Key certification. Key environmental initiatives include the Ryalls Herb Garden for sustainable sourcing, waste composting, food waste reduction, reusable Vivreau bottles, and sustainable charcoal from fast-growing eucalyptus trees. BHL planted 2,000 pine trees on Michiru Mountain in 2024 and another 2,000 in 2025, achieving a 98% survival rate. The company also made donations to the QUECH Children Cancer Ward and the juvenile prison in Zomba.",
    articles: [],
    tradingUpdates: [],
    podcasts: [],
  },

  FDHB: {
    fullName: "FDH Bank Plc",
    sector: "Banking & Financial Services",
    founded: "2007",
    listed: "August 3, 2020",
    yearEnd: "December",
    headquarters: "Umoyo House, P.O. Box 512, Blantyre, Malawi",
    phone: "+265 (0) 1 820 219",
    website: "https://www.fdh.co.mw",
    indices: ["XMSW All Share", "XMSW Domestic"],
    transferSecretary: "NICO Asset Managers Limited",
    description:
      "FDH Bank Plc is a leading financial institution in Malawi's commercial banking and financial services sector. The Bank provides comprehensive solutions through Personal and Business Banking (PBB), Corporate and Institutional Banking (CIB), Treasury and Investment Banking (TIB), Global Markets and Trade Finance (GMTF), and Digital Financial Services. Core offerings include current accounts, savings accounts, fixed deposits, overdrafts and loans, foreign exchange, and custodial services. The Bank boasts the most comprehensive digital portfolio in the sector, including FDH Mobile, FDH Wallet, and the pioneering FDH Salama Shariah Compliant Banking Solution. With 48 service centres and 95 ATMs — including the first commercial bank on Likoma Island — FDH is committed to financial inclusion across every district in Malawi.",
    mission: "We provide easy access to financial solutions that enable our communities to grow with us.",
    vision: "To be the leading provider of first class financial solutions in Malawi and the Southern African Region.",
    employees: "Over 800 staff members",
    leadership: [],
    financials: {
      revenue: "K195 billion (up 90%)",
      profit: "K74 billion (up 108%)",
      totalAssets: "K1.2 trillion (up 119%)",
      keyFigures: [
        { label: "Revenue", value: "K195 billion (+90%)" },
        { label: "Profit After Tax", value: "K74 billion (+108%)" },
        { label: "Total Assets", value: "K1.2 trillion (+119%)" },
        { label: "Deposits", value: "K883 billion (+99%)" },
        { label: "Net Interest Income", value: "K141 billion (+136%)" },
        { label: "Dividend Paid", value: "K35.1 billion (K5.09/share)" },
        { label: "Share Price (31 Dec 2024)", value: "K148.23 (+118.75%)" },
        { label: "Return on Equity", value: "76% (from 61%)" },
      ],
    },
    sustainability:
      "FDH's 'FDH Cares' programme aligns with UN SDGs and Malawi's Agenda 2063. Key achievements include contributing 100 metric tonnes of maize to the National Food Reserve Agency, completing 22 disaster-resistant houses for Cyclone Freddy victims at K220 million, planting over 1.1 million trees through the 'Be Green Smart' initiative, procuring 2 electric cars, and replacing approximately half of its 48 service centres' diesel generators with solar energy.",
    articles: [
      { title: "FDH Bank Posts Record-Breaking Profits to K151 Billion", date: "2025-12-19", url: "https://news.frontierafricareports.com/article/fdh-bank-posts-record-breaking-profits-nearly-doubling-earnings-to-k151-billion" },
      { title: "FDH Bank Acquires Ecobank Mozambique", date: "2025-08-13", url: "https://www.fdh.co.mw/fdhbankplc/blog" },
    ],
    tradingUpdates: [
      { title: "Profit Projected to Rise to K151 Billion", date: "2025-12-23", type: "Earnings Guidance" },
      { title: "FDH Bank Hits K4.7 Trillion Market Cap Milestone", date: "2025-08-13", type: "Market Performance" },
    ],
    podcasts: [],
  },

  FMB: {
    fullName: "First Merchant Bank Limited",
    sector: "Banking & Financial Services",
    founded: "1984",
    listed: "January 1, 2006",
    yearEnd: "December",
    headquarters: "Livingstone Towers, Glyn Jones Road, Private Bag 122, Blantyre, Malawi",
    phone: "(+265) 1 821 955",
    indices: ["XMSW All Share", "XMSW Domestic"],
    transferSecretary: "FMB Transfer Secretaries (MW)",
    description:
      "First Merchant Bank Limited is a subsidiary of FMBcapital Holdings Plc, providing corporate and retail banking services in Malawi. Its two wholly-owned subsidiaries are The Leasing and Finance Company of Malawi Limited (deposit taking and asset finance) and FMB Capital Markets Limited (licensed portfolio management). Personal banking offers transactional accounts, private banking, bill payment, safe deposit, mobile and internet banking, treasury bills, and fixed and call deposits. Business banking offers savings and investments, overdrafts, term loans, foreign currency loans, corporate financial advisory, asset management, and leasing. FMB also holds a 70% shareholding in Capital Bank (Mozambique), 38.60% in Capital Bank (Botswana), and 49% in First Capital Bank (Zambia).",
    leadership: [],
    financials: {
      notes: "Subsidiary of FMBcapital Holdings Plc. Refer to FMBCH for consolidated group financials.",
    },
    sustainability: "Operates under FMBcapital Holdings Plc's Group sustainability and ESG framework.",
    articles: [],
    tradingUpdates: [],
    podcasts: [],
  },

  FMBCH: {
    fullName: "FMBcapital Holdings Plc",
    sector: "Banking & Financial Services",
    founded: "2016",
    listed: "September 18, 2017",
    yearEnd: "December",
    headquarters: "c/o JTC Fiduciary Services (Mauritius) Ltd, Unit 5ABC, 5th Floor, Standard Chartered Tower, 19 Cybercity Ebène, Mauritius",
    phone: "+230 659 2000",
    indices: ["XMSW All Share", "XMSW Foreign"],
    transferSecretary: "FMB Transfer Secretaries (MW)",
    description:
      "FMBcapital Holdings Plc (FMBCH) is a strategic investment holding company incorporated in Mauritius and listed on the Malawi Stock Exchange. The Group provides comprehensive commercial, investment, and retail banking services through subsidiaries across sub-Saharan Africa. Operations span Botswana (First Capital Bank Limited), Malawi (First Capital Bank Plc), Mozambique (First Capital Bank S.A.), Zambia (First Capital Bank Limited), and Zimbabwe (Afcarme Zimbabwe Holdings, including First Capital Bank Limited).",
    mission: "Belief comes first.",
    leadership: [],
    financials: {
      revenue: "USD 278.3 million (2023: USD 257.1 million)",
      profit: "USD 103.5 million (2023: USD 91.7 million)",
      totalAssets: "USD 2.07 billion (2023: USD 1.52 billion)",
      keyFigures: [
        { label: "Total Operating Income", value: "USD 278.3 million" },
        { label: "Profit for Year", value: "USD 103.5 million" },
        { label: "Total Assets", value: "USD 2.07 billion" },
        { label: "Total Equity", value: "USD 294.9 million" },
        { label: "Basic EPS", value: "2.792 US cents" },
      ],
    },
    sustainability:
      "FMBCH is developing policies and data systems to assess and manage physical and transition climate risks, aligning with IFRS S1 and IFRS S2. In response to new MSE ESG Reporting requirements introduced in 2024, the Group has enhanced data collection for ESG metrics and strengthened internal governance for reporting compliance.",
    articles: [],
    tradingUpdates: [],
    podcasts: [],
  },

  ICON: {
    fullName: "ICON Properties Plc",
    sector: "Real Estate",
    founded: "2018",
    listed: "January 21, 2019",
    yearEnd: "December",
    headquarters: "Chibisa House, 19 Glyn Jones Road, PO Box 3117, Blantyre, Malawi",
    phone: "+265 1 832 085",
    indices: ["XMSW All Share", "XMSW Domestic"],
    transferSecretary: "NICO Asset Managers Limited",
    description:
      "ICON Properties Plc operates in Malawi's real estate investment sector, focusing on property ownership, leasing, management, and development across Blantyre, Lilongwe, Zomba, and Mzuzu. The company delivers long-term value through strategic investments in commercial, industrial, residential, and mixed-use assets. Key 2024 enhancements include installation of a modern smart parking system at Chichiri Shopping Centre and digitisation of core operational processes. ICON has no direct staff — all operational management is delegated to Eris Properties (Malawi) Limited.",
    mission: "To develop high-quality properties that will create value for all stakeholders.",
    vision: "To be the leading listed company in accommodation solutions in Malawi and beyond.",
    employees: "No direct employees. Operations managed by Eris Properties (Malawi) Limited.",
    leadership: [],
    financials: {
      profit: "K24.4 billion (up 27%)",
      keyFigures: [
        { label: "Profit After Tax", value: "K24.4 billion (+27%)" },
        { label: "Total Income", value: "K32.1 billion" },
        { label: "Property Revaluation Gains", value: "K19.8 billion" },
        { label: "Rental Income Growth", value: "18%" },
        { label: "Occupancy Rate", value: "Above 90%" },
        { label: "Total Expenses", value: "K5.5 billion (+41%)" },
      ],
    },
    sustainability:
      "ICON invested MK51.8 million in CSR in 2024, including a fully furnished double-storey 4-classroom block at Mbayani Primary School, MK4 million for national development dialogue, and a K5 million donation to the Presidential Charity Golf Tournament. The company is developing a Sustainability Framework aligned with UN SDGs, focusing on Resource Utilisation, Energy Conservation, Waste Management, and Emissions Awareness.",
    articles: [],
    tradingUpdates: [],
    podcasts: [],
  },

  ILLOVO: {
    fullName: "Illovo Sugar (Malawi) Plc",
    sector: "Agriculture & Agro-processing",
    founded: "1965",
    listed: "January 1, 1997",
    yearEnd: "August",
    headquarters: "Churchill Road, Limbe, Malawi",
    phone: "+265 (0) 1 843 988",
    indices: ["XMSW All Share", "XMSW Domestic"],
    transferSecretary: "Standard Bank Plc (MW)",
    description:
      "Illovo Sugar (Malawi) Plc is the largest sugar producer in Malawi and a significant contributor to the country's economy. The company operates estates at Nchalo and Dwangawa, spanning cane growing, sugar production, and distribution for both domestic and export markets. Illovo is part of the Illovo Sugar Africa Group, a subsidiary of Associated British Foods plc. With over 75% domestic market share, it is the leader in consumer and industrial sugar supply in Malawi. Illovo is one of the largest private-sector employers in Malawi, playing a vital role in job creation, skills development, and community support.",
    mission:
      "To produce high-quality sugar products that meet consumer and industrial needs while maintaining environmental and social responsibility.",
    leadership: [],
    financials: {
      revenue: "K272.45 billion (2023)",
      keyFigures: [
        { label: "Revenue (2023)", value: "K272.45 billion" },
        { label: "Dividend (2023)", value: "K8.99 billion" },
        { label: "Shareholders (2023)", value: "2,259" },
        { label: "Domestic Market Share", value: "Over 75%" },
      ],
      notes: "Illovo reported a 250% jump in profit in 2025 despite a 25% production decline caused by adverse weather.",
    },
    sustainability:
      "In 2023, Illovo supported communities affected by Cyclone Freddy, providing shelter, food, and clean water to over 2,000 displaced people, and contributed to the cholera outbreak response — administering over 15,000 vaccinations. In 2025, Illovo partnered with the IFC to drive sustainable agriculture and job creation.",
    articles: [
      { title: "Illovo Sugar reports 250% jump in profit", date: "2025-12-04", url: "https://www.sugaronline.com/2025/12/18/malawi-illovo-sugars-production-falls-25-from-peak-due-to-adverse-weather/" },
      { title: "IFC Partners with Illovo Sugar for Sustainable Agriculture", date: "2025-11-07", url: "https://www.ifc.org/en/pressroom/2025/ifc-partners-with-illovo-sugar-malawi-to-drive-sustainable-agriculture-and-job-cre" },
    ],
    tradingUpdates: [
      { title: "Production Falls 25% Due to Adverse Weather", date: "2025-12-18", type: "Operational Update" },
    ],
    podcasts: [],
  },

  MPICO: {
    fullName: "MPICO Plc",
    sector: "Real Estate",
    founded: "1972",
    listed: "November 12, 2007",
    yearEnd: "June",
    headquarters: "Old Mutual House, Robert Mugabe Crescent, PO Box 30459, Lilongwe 3, Malawi",
    phone: "+265 177 0622",
    indices: ["XMSW All Share", "XMSW Domestic"],
    description:
      "MPICO Plc, a member of the Old Mutual Group, is a leading Malawian company dedicated to property development, rental, and management of investment properties. With a portfolio of 27 investment properties predominantly in Lilongwe and Blantyre, MPICO serves both government and private sector clients. Services include property development, project management, valuation, rent collection, property management, leasing, and facilities management. The company maintains a strong occupancy rate averaging 92% in 2024. MPICO has no direct employees — operations are handled through an agreement with Old Mutual Investment Group (OMIG).",
    vision:
      "To be a leading provider of property solutions in Malawi creating shareholder and customer value whilst being an employer of first choice.",
    employees: "No direct employees. Managed by Old Mutual Investment Group (OMIG).",
    leadership: [],
    financials: {
      revenue: "MK21.63 billion (up 25%)",
      profit: "MK12.18 billion (up 72%)",
      keyFigures: [
        { label: "Total Income", value: "MK21.63 billion (+25%)" },
        { label: "Profit After Tax", value: "MK12.18 billion (+72%)" },
        { label: "Rental Income", value: "MK8.06 billion (+17%)" },
        { label: "Fair Value Gains", value: "MK12.07 billion (+35%)" },
        { label: "Total Investment Properties", value: "MK98.79 billion" },
        { label: "Occupancy Rate", value: "92%" },
        { label: "Basic EPS", value: "K3.72" },
        { label: "Issued Shares", value: "2,298,047,460" },
      ],
    },
    sustainability:
      "MPICO's sustainability strategy aligns with Malawi 2063 and the UN SDGs. In 2024, the company planted 10,000 trees, retrofitted 95% of properties with LED lights, updated maintenance policies with water-saving measures, and transitioned air conditioning to eco-friendly R410 gas. Social initiatives include training 35 young people in home gadget repair and sponsoring the Gateway Mall Central Region Netball League with MK40 million.",
    articles: [],
    tradingUpdates: [],
    podcasts: [],
  },

  NBM: {
    fullName: "National Bank of Malawi Plc",
    sector: "Banking & Financial Services",
    founded: "1971",
    listed: "January 1, 2000",
    yearEnd: "December",
    headquarters: "7 Henderson Street, PO Box 945, Blantyre, Malawi",
    phone: "+265 88 551 4442",
    website: "https://www.natbank.co.mw",
    indices: ["XMSW All Share", "XMSW Domestic"],
    description:
      "National Bank of Malawi Plc (NBM) is one of Malawi's oldest and largest commercial banks, offering retail, corporate, development financing, stockbroking, insurance, and pension administration services. With 49 service centres across Malawi and Tanzania (32 in Malawi, 17 in Tanzania), NBM provides cashless banking through innovative digital platforms including Mo626 Pay and MoPay. The Group's expansion into Tanzania through Akiba Commercial Bank plc reinforces its regional footprint. NBM employs 1,110 pensionable employees, with 31.1% female managers.",
    leadership: [
      { name: "Grant Kabango", role: "Board Chairman", bio: "Appointed December 2025, bringing extensive governance and financial sector experience." },
    ],
    employees: "1,110 pensionable employees (470 female, 640 male)",
    financials: {
      profit: "K101.71 billion (up 41.3%)",
      totalAssets: "K1,730,205 million",
      keyFigures: [
        { label: "Profit Before Tax", value: "K167.15 billion" },
        { label: "Profit After Tax", value: "K101.71 billion (+41.3%)" },
        { label: "Total Assets", value: "K1,730,205 million" },
        { label: "Customer Deposits", value: "K1,328,427 million (+37%)" },
        { label: "Net Interest Income Growth", value: "+52%" },
        { label: "Other Income Growth", value: "+46%" },
        { label: "Total Dividend (2024)", value: "K59.0 billion (K126.35/share)" },
      ],
    },
    sustainability:
      "NBM adheres to GRI, IFC Performance Standards, UN SDGs, and UN Global Compact. In 2024, the bank created 81 direct jobs, solarised 45 ATMs and one service centre, and screened 100% of SME and Corporate loans for environmental factors. Social lending included K5,040 million to 1,035 customers through Amayi Angathe loans, K1,290 million via Taoloka loans, and K790 million to 47 young entrepreneurs.",
    articles: [
      { title: "NBM plc appoints Grant Kabango as Board Chairman", date: "2025-12-04", url: "https://www.natbank.co.mw/" },
    ],
    tradingUpdates: [
      { title: "53rd AGM Notice and Reference Rate Update", date: "2025-06-30", type: "Corporate/Policy" },
    ],
    podcasts: [],
  },

  NBS: {
    fullName: "NBS Bank Plc",
    sector: "Banking & Financial Services",
    founded: "1964",
    listed: "April 25, 2007",
    yearEnd: "December",
    headquarters: "NBS House, Corner of Chipembere Highway and Johnstone Road, Ginnery Corner, Blantyre 3, Malawi",
    phone: "+265 (0) 1 812 222",
    indices: ["XMSW All Share", "XMSW Domestic"],
    description:
      "NBS Bank Plc is a publicly listed commercial bank and proud member of the NICO Group. It provides corporate and retail banking services plus treasury management through 26 service centres and 2,489 Bank Pafupi agents nationwide. The bank champions digital transformation with a new mobile app and Pay by Link product. NBS Bank has over 45% female representation in executive and senior management and is committed to financial inclusion and responsible growth across Malawi.",
    mission: "To provide superior banking services and deliver value to our customers, employees, shareholders and all other stakeholders.",
    vision: "To be a world class retail bank.",
    leadership: [],
    financials: {
      profit: "MK72.99 billion (up 148%)",
      totalAssets: "MK1.19 trillion (up 81%)",
      keyFigures: [
        { label: "Profit After Tax", value: "MK72.99 billion (+148%)" },
        { label: "Total Assets", value: "MK1.19 trillion (+81%)" },
        { label: "Net Interest Income", value: "MK160 billion (+139%)" },
        { label: "Total Operating Income", value: "MK205.51 billion (+100%)" },
        { label: "Customer Deposits", value: "MK726.73 billion (+35%)" },
        { label: "Net Loans", value: "MK234.94 billion (+20%)" },
        { label: "Cost to Income Ratio", value: "37% (from 47%)" },
      ],
    },
    sustainability:
      "NBS Bank has engaged Deloitte to integrate ESG at all operational levels. Key initiatives include expanding the Bank Pafupi agency network, sponsoring the NBS National Division League (MK1 billion), ONE NICO Malawi Netball Sponsorship (MK300 million), and MK60 million for SME capacity-building clinics.",
    articles: [],
    tradingUpdates: [],
    podcasts: [],
  },

  NICO: {
    fullName: "NICO Holdings Plc",
    sector: "Diversified Financial Services",
    founded: "1965",
    listed: "November 11, 1996",
    yearEnd: "December",
    headquarters: "Chibisa House, 19 Glyn Jones Road, PO Box 501, Blantyre, Malawi",
    phone: "+265-111-831 902",
    indices: ["XMSW All Share", "XMSW Domestic"],
    description:
      "NICO Holdings Plc is one of Malawi's largest and most diversified financial services groups, with operations spanning general insurance, life assurance, pension administration, banking, asset management, corporate finance advisory, and information technology. The Group holds controlling or full stakes in NBS Bank Plc, NICO Life, NICO General, NICO Asset Managers, NICO Pension Services, NICO Technologies, and others, with an associate in Mozambique and a property development JV through Eris Properties Malawi (50%).",
    employees: "1,284 Group staff as at 31 December 2024",
    leadership: [],
    financials: {
      profit: "K72.01 billion attributable to owners (2023: K30.91 billion)",
      keyFigures: [
        { label: "Profit Attributable to Owners", value: "K72.01 billion" },
        { label: "Client Funds Under Management", value: "K275.5 billion" },
        { label: "Interim Dividends (FY2024)", value: "K16.69 billion (3 tranches)" },
        { label: "Group Employees", value: "1,284" },
      ],
    },
    sustainability:
      "NICO will publish a separate sustainability report for FY2024 covering ESG matters across the NICO Group.",
    articles: [],
    tradingUpdates: [],
    podcasts: [],
  },

  OMU: {
    fullName: "Old Mutual Limited",
    sector: "Insurance & Financial Services",
    founded: "2017",
    listed: "June 26, 2018",
    yearEnd: "December",
    headquarters: "Old Mutual Building, 30 Glyn Jones Road, Blantyre, Malawi",
    phone: "+265 (0) 1 773 522",
    indices: ["XMSW All Share", "XMSW Foreign"],
    transferSecretary: "National Bank of Malawi (MW)",
    description:
      "Old Mutual Limited is a premier African financial services Group operating across 12 countries with over 179 years of history. It offers life and savings, investments, medical insurance, property and casualty, and lending and banking services through segments including Mass and Foundation Cluster, Personal Finance and Wealth Management, Old Mutual Investments, Old Mutual Corporate, Old Mutual Insure, and Old Mutual Africa Regions. Old Mutual leverages a human-led, technology-enabled distribution model with 36,039 tied and independent intermediaries, 816 retail branches, and 47,136 worksites.",
    mission: "To be our customers' 1st choice to sustain, grow and protect their prosperity.",
    employees: "31,710 employees as at 31 December 2024",
    leadership: [],
    financials: {
      keyFigures: [
        { label: "Results from Operations", value: "R8,709 million (+4%)" },
        { label: "Adjusted Headline Earnings", value: "R6,685 million (+14%)" },
        { label: "Return on Net Asset Value", value: "12.7%" },
        { label: "Funds Under Management", value: "R1.5 trillion" },
        { label: "Customer Base", value: "13.7 million" },
        { label: "Total Dividends Per Share", value: "86 cents (+6%)" },
        { label: "Gross Written Premiums", value: "R27,336 million (+7%)" },
        { label: "Total Assets", value: "R1,235,281 million" },
      ],
    },
    sustainability:
      "Old Mutual's sustainability strategy focuses on responsible investment, climate action, and financial wellness. In 2024, Old Mutual Investments managed R178.6 billion in green economy investments and achieved a 22% reduction in operational carbon emissions since 2019. The O'mari mobile money platform in Zimbabwe has reached 1.3 million customers.",
    articles: [],
    tradingUpdates: [],
    podcasts: [],
  },

  OML: {
    fullName: "Old Mutual Life Assurance Company (Malawi) Limited",
    sector: "Insurance & Financial Services",
    founded: "1854",
    listed: "July 12, 1999",
    yearEnd: "December",
    headquarters: "Old Mutual Building, 30 Glyn Jones Road, PO Box 393, Blantyre, Malawi",
    indices: ["XMSW All Share"],
    description:
      "Old Mutual Life Assurance Company (Malawi) Limited is a long-term savings, protection, and investment company providing life assurance, asset management, and unit trusts in Malawi. Its corporate division focuses on employee benefits and investments; its personal assurance division covers investment and savings, retirement planning, and life and disability cover. Old Mutual Malawi is a subsidiary of Old Mutual Africa Holdings in South Africa and operated as a mutual life assurance company from 1954 until 1997 when the Old Mutual Group demutualised. Additional services include third-party asset management, pension fund administration, and property management and investment.",
    leadership: [],
    financials: {
      notes: "Subsidiary of Old Mutual Africa Holdings. Refer to OMU for Group-level financials.",
    },
    articles: [],
    tradingUpdates: [],
    podcasts: [],
  },

  PCL: {
    fullName: "Press Corporation Plc",
    sector: "Diversified Conglomerate",
    founded: "1968",
    listed: "September 9, 1998",
    yearEnd: "December",
    headquarters: "3rd Floor, PCL House, Kaohsiung Road, P.O. Box 1227, Blantyre, Malawi",
    phone: "+265 (0) 111 833 569",
    indices: ["XMSW All Share", "XMSW Domestic"],
    description:
      "Press Corporation Plc (PCL) is Malawi's premier diversified holding company with significant interests across financial services, telecommunications, energy, retail, and real estate. Guided by its 'Pressing On!' motto, PCL pursues growth through organic expansion, greenfield developments, and strategic M&A. Key subsidiaries include National Bank of Malawi Plc (banking), Telekom Networks Malawi Plc/TNM (telecoms), EthCo and PressCane (ethanol/energy), Puma Energy (ground fuels, 25% market share), and LifeCo Holdings (insurance, 6% market share). Operations extend to Tanzania and Liberia.",
    mission: "To create significant viable businesses and contribute to the socio-economic development of Malawi and the region.",
    vision: "To be Malawi's premier holding company.",
    employees: "3,948 staff across Group operations",
    leadership: [],
    financials: {
      revenue: "MK559.63 billion (up 42%)",
      profit: "MK126.35 billion (up 68%)",
      totalAssets: "MK2.17 trillion (up 35%)",
      keyFigures: [
        { label: "Turnover", value: "MK559.63 billion (+42%)" },
        { label: "Profit After Tax", value: "MK126.35 billion (+68%)" },
        { label: "Attributable Earnings", value: "MK64.67 billion (+60%)" },
        { label: "Total Assets", value: "MK2.17 trillion (+35%)" },
        { label: "Shareholders' Equity", value: "MK349.44 billion (+32%)" },
        { label: "Basic EPS", value: "MK538.04" },
        { label: "Dividend Per Share", value: "MK48.28" },
        { label: "Return on Equity", value: "36.16%" },
        { label: "Total Employees", value: "3,948" },
        { label: "Total Shareholders", value: "1,635" },
      ],
    },
    sustainability:
      "PCL invested over MK700 million in community initiatives in 2024. Key green initiatives include a USD55 million investment in a 50MW solar power plant in Nkhoma, Lilongwe, an 18% reduction in water consumption at the Chikwawa ethanol plant, a 37% reduction at Dwangawa over three years, and 232 green loans disbursed in 2024. The ethanol companies are implementing Zero Liquid Discharge and CO2 capture plants.",
    articles: [],
    tradingUpdates: [],
    podcasts: [],
  },

  STNBIC: {
    fullName: "Standard Bank Malawi Plc",
    sector: "Banking & Financial Services",
    founded: "1969",
    listed: "June 29, 1998",
    yearEnd: "December",
    headquarters: "African Unity Avenue, PO Box 30380, Lilongwe 3, Malawi",
    phone: "+265 (0) 999 901 500",
    indices: ["XMSW All Share", "XMSW Domestic"],
    description:
      "Standard Bank Malawi Plc is a leading financial institution aspiring to be the undisputed number one financial services organisation in Malawi. It offers integrated, end-to-end wealth and banking solutions for businesses, institutions, individuals, and corporate clients through Personal and Private Banking (PPB), Business and Commercial Banking (BCB), and Corporate and Investment Banking (CIB). The bank has 27 points of representation across Malawi. Standard Bank Malawi has been awarded Bank of the Year in Malawi for three consecutive years by Global Finance Magazine and Malawi's Best Bank in 2024 by Euromoney.",
    mission: "Driving Malawi's Growth.",
    employees: "833 employees",
    leadership: [],
    financials: {
      profit: "MK86.4 billion (up 64%)",
      keyFigures: [
        { label: "Profit After Tax", value: "MK86.4 billion (+64%)" },
        { label: "Total Revenue Growth", value: "+27%" },
        { label: "Net Interest Income Growth", value: "+43%" },
        { label: "Cost-to-Income Ratio", value: "37% (from 40%)" },
        { label: "Earnings Per Share", value: "MK367.51" },
        { label: "Employees", value: "833" },
      ],
    },
    sustainability:
      "Standard Bank allocated 1% of profit after tax to community initiatives in 2024: MK125.6 million for medical equipment for Zomba Central Hospital, MK69.6 million for scholarships, MK80 million for environmental conservation, and MK32 million for the 'Joy of the Arts' initiative. The bank facilitated US$1.5 million to approximately 5,000 young entrepreneurs, MK8.16 billion in green loans, and MK2.8 billion in Climate Smart Agriculture financing.",
    articles: [],
    tradingUpdates: [],
    podcasts: [],
  },

  SUNBRD: {
    fullName: "Sunbird Tourism Plc",
    sector: "Hospitality & Tourism",
    founded: "1988",
    listed: "August 21, 2002",
    yearEnd: "December",
    headquarters: "28 Glyn Jones Road, P.O. Box 376, Blantyre, Malawi",
    phone: "+265 (0) 1 820 588",
    indices: ["XMSW All Share", "XMSW Domestic"],
    description:
      "Sunbird Tourism Plc is Malawi's leading hotel chain, owning and operating nine distinguished properties: four city hotels (Sunbird Capital, Sunbird Mount Soche, Sunbird Lilongwe, Sunbird Mzuzu), three beach resorts along Lake Malawi (Sunbird Waterfront, Sunbird Livingstonia, Sunbird Nkopola), a beachside inn (Sunbird Chintheche), and an iconic mountain resort (Sunbird Kuchawe). In 2024, Sunbird launched the Sunbird Tours and Travel Agency, expanding into ticketing and destination management. The company holds a 28% market share in Malawi's hospitality sector, with 90% of business from domestic clients.",
    mission: "Sunbird exists to provide excellent accommodation, catering and related hospitality services with the intention of increasing stakeholders' value.",
    vision: "The preferred brand in the hospitality industry.",
    leadership: [],
    financials: {
      revenue: "MK54.7 billion (up 57%)",
      profit: "MK10.6 billion (up 102%)",
      keyFigures: [
        { label: "Revenue", value: "MK54.7 billion (+57%)" },
        { label: "Profit After Tax", value: "MK10.6 billion (+102%)" },
        { label: "Operating Profit", value: "MK18.7 billion" },
        { label: "Market Share", value: "28% (from 27%)" },
        { label: "Guest Satisfaction Score", value: "89% (from 88%)" },
        { label: "Net Promoter Score", value: "67" },
        { label: "Dividend (2024)", value: "MK3.4 billion (MK13.00/share)" },
      ],
    },
    sustainability:
      "Sunbird completed its sustainability framework in 2024, embedding sustainable practices across all processes. The company invests in employee welfare through weekly aerobics, biannual health checks, and internship programmes contributing to the future hospitality talent pipeline.",
    articles: [],
    tradingUpdates: [],
    podcasts: [],
  },

  TNM: {
    fullName: "Telekom Networks Malawi Plc",
    sector: "Telecommunications",
    founded: "1995",
    listed: "January 1, 2008",
    yearEnd: "December",
    headquarters: "Livingstone Towers, Fifth Floor, Off Glyn Jones Road, PO Box 3039, Blantyre, Malawi",
    phone: "+265 (0) 888 800 800",
    website: "https://www.tnm.co.mw",
    indices: ["XMSW All Share", "XMSW Domestic"],
    transferSecretary: "National Bank of Malawi (MW)",
    description:
      "Telekom Networks Malawi Plc (TNM) is a leading Malawian telecommunications company providing comprehensive telecom services and mobile money solutions through its wholly-owned subsidiary, TNM Mpamba Limited. Services include prepaid and postpaid mobile communication, high-speed data, international messaging, enterprise solutions, and the Mpamba mobile money platform. TNM boasts Malawi's best network for data and voice, with 71.3% geographical coverage reaching 89.4% of Malawi's 22 million people. TNM returned to profitability in 2024, reversing losses from the prior two years.",
    mission: "To build world-class digital solutions to empower every Malawian and connect Malawi to the whole world.",
    vision: "To digitally empower every Malawian.",
    employees: "97,452 Mpamba Agents and 17,729 KYC Agents (direct headcount not disclosed)",
    leadership: [],
    financials: {
      revenue: "MK158.17 billion (up 34%)",
      profit: "MK10.05 billion (returned to profitability)",
      keyFigures: [
        { label: "Total Revenue", value: "MK158.17 billion (+34%)" },
        { label: "Profit After Tax", value: "MK10.05 billion" },
        { label: "EBITDA", value: "MK47.89 billion (30% margin)" },
        { label: "Mpamba Revenue", value: "MK29.49 billion (+59%)" },
        { label: "Data Revenue", value: "MK58.98 billion (+40%)" },
        { label: "Customer Base", value: "Over 5 million subscribers" },
        { label: "Mpamba Active Customers", value: "2,909,283" },
        { label: "Tax & Levies to Fiscus", value: "Over MK42.40 billion" },
      ],
    },
    sustainability:
      "TNM added 113 solar sites in 2024 (183 total, 36% of owned sites), backed by a MK6.24 billion investment — exceeding MACRA's 20% target. Through Mpamba, TNM disbursed MK81 billion in social cash transfers to 1.4 million beneficiaries. The company phased out scratch cards, reducing paper usage by MK20 million monthly. TNM invests MK500 million in the Super League of Malawi. The 'Pink Potential' leadership programme nurtures women within the organisation.",
    articles: [
      { title: "TNM Secures License Renewal for 5G Future", date: "2026-01-14", url: "https://techafricanews.com/2024/08/27/tnm-secures-license-renewal-paving-the-way-for-malawis-5g-future/" },
    ],
    tradingUpdates: [
      { title: "End of 19-Year Super League Sponsorship Romance", date: "2026-01-16", type: "Corporate Strategy" },
    ],
    podcasts: [
      { title: "MIJ FM: Business Face of 2025 Recap", url: "https://www.youtube.com/watch?v=6KDtiiANnWU", date: "2025-12-31" },
    ],
  },

  NITL: {
    fullName: "The National Investment Trust Plc",
    sector: "Investment Fund",
    founded: "1962",
    listed: "March 21, 2005",
    yearEnd: "December",
    headquarters: "C/O NICO Asset Managers Ltd, Chibisa House, 19 Glyn Jones Road, PO Box 910, Blantyre, Malawi",
    transferSecretary: "NICO Asset Managers Limited",
    indices: ["XMSW All Share", "XMSW Domestic"],
    description:
      "National Investment Trust Plc (NITL) is a prominent closed-end collective investment scheme in Malawi, offering investors access to a diversified portfolio of equity investments, bonds, property, and money market instruments. Licensed by the Registrar of Financial Institutions under the Financial Services Act 2010, NITL is managed by NICO Asset Managers Limited under a 3-year agreement commencing August 2024. The company's unitary board comprises seven non-executive directors with no executive directors, ensuring strong independent governance focused on maximising shareholder value.",
    employees: "No direct employees. Managed by NICO Asset Managers Limited.",
    leadership: [],
    financials: {
      profit: "K29.76 billion (up 38%)",
      totalAssets: "K74.32 billion (up 64%)",
      keyFigures: [
        { label: "Profit After Tax", value: "K29.76 billion (+38%)" },
        { label: "Dividend Income", value: "K1.87 billion" },
        { label: "Fair Value Gains on Equities", value: "K28.53 billion" },
        { label: "Total Assets", value: "K74.32 billion (+64%)" },
        { label: "Basic EPS", value: "220.44 tambala" },
        { label: "Total Shareholders", value: "1,703" },
        { label: "MSE Index Return (2024)", value: "55.06%" },
      ],
    },
    sustainability:
      "NITL adheres to the Malawi Code II for corporate governance with formal board committees ensuring transparency and ethical standards. The Finance and Audit Committee monitors financial integrity and internal controls, while the Investment Committee oversees the Fund Manager's investment decisions.",
    articles: [],
    tradingUpdates: [],
    podcasts: [],
  },
};