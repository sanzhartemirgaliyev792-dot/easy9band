import type { IeltsTopic } from '../types/ielts';

export const IELTS_TOPICS_2026: IeltsTopic[] = [
  // Task 2 — 2026 Relevant Topics
  {
    id: 't2-ai-labor-2026',
    taskType: 'task2',
    category: 'Технологии и рынок труда',
    questionType: 'Opinion (Agree / Disagree)',
    prompt:
      'In 2026, generative artificial intelligence is increasingly replacing entry-level white-collar jobs such as junior coding, translation, and financial analysis. Some argue that governments should tax companies that automate these roles to fund universal retraining programs. To what extent do you agree or disagree?',
  },
  {
    id: 't2-urban-cars-2026',
    taskType: 'task2',
    category: 'Урбанистика и экология',
    questionType: 'Advantages / Disadvantages',
    prompt:
      'Many major cities are introducing strict congestion pricing and banning private petrol vehicles from city centres in favour of electric micro-mobility and public transit. Do the advantages of this trend outweigh the disadvantages?',
  },
  {
    id: 't2-remote-isolation-2026',
    taskType: 'task2',
    category: 'Общество и работа',
    questionType: 'Problem / Solution',
    prompt:
      'Although hybrid and fully remote work models have improved flexibility for millions of professionals, surveys in 2026 show rising levels of workplace loneliness and weaker mentorship for younger employees. What problems does this cause, and what practical solutions can employers and cities adopt?',
  },
  {
    id: 't2-biometric-privacy-2026',
    taskType: 'task2',
    category: 'Цифровая этика',
    questionType: 'Discussion (Both Views)',
    prompt:
      'Some people believe that widespread biometric verification in airports, banks, and public spaces makes society safer and more efficient. Others argue it poses an unacceptable threat to personal privacy and civil liberties. Discuss both views and give your own opinion.',
  },
  {
    id: 't2-degree-vs-skills-2026',
    taskType: 'task2',
    category: 'Образование',
    questionType: 'Opinion (Agree / Disagree)',
    prompt:
      'With rapid technological change, many employers now prioritize verified practical portfolios and short-term certifications over traditional four-year university degrees. Is this a positive or negative development for young people and society?',
  },
  {
    id: 't2-climate-adaptation-2026',
    taskType: 'task2',
    category: 'Климат и экономика',
    questionType: 'Discussion (Both Views)',
    prompt:
      'Some economists argue that nations should direct most climate budgets toward immediate adaptation—such as flood barriers and heat-resilient housing—rather than long-term carbon reduction targets. Discuss both perspectives and state your view.',
  },
  {
    id: 't2-longevity-aging-2026',
    taskType: 'task2',
    category: 'Демография',
    questionType: 'Two-Part Question',
    prompt:
      'Rising life expectancy and declining birth rates mean that people over 65 will soon outnumber children in many developed economies. Why is this demographic shift occurring, and how should healthcare and pension systems adapt?',
  },
  {
    id: 't2-media-literacy-2026',
    taskType: 'task2',
    category: 'Медиа и общество',
    questionType: 'Opinion (Agree / Disagree)',
    prompt:
      'Because synthetic media and deepfakes make it difficult to distinguish real news from fabricated content, critical media verification should become a mandatory core subject in secondary schools alongside mathematics. To what extent do you agree or disagree?',
  },

  // Task 1 — Academic Data Reports (2020–2026)
  {
    id: 't1-energy-mix-2026',
    taskType: 'task1',
    category: 'Энергетика (Table)',
    questionType: 'Academic Data Report',
    prompt:
      'The table below shows the percentage share of electricity generation by source in a European country between 2016 and 2026. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    dataTable: {
      headers: ['Energy Source', '2016 (%)', '2021 (%)', '2026 (%)'],
      rows: [
        { label: 'Coal & Oil', values: ['38%', '21%', '7%'] },
        { label: 'Natural Gas', values: ['29%', '27%', '18%'] },
        { label: 'Wind & Solar', values: ['14%', '31%', '51%'] },
        { label: 'Nuclear', values: ['15%', '16%', '18%'] },
        { label: 'Hydro & Other', values: ['4%', '5%', '6%'] },
      ],
    },
  },
  {
    id: 't1-work-modes-2026',
    taskType: 'task1',
    category: 'Рынок труда (Bar Chart Data)',
    questionType: 'Academic Data Report',
    prompt:
      'The data below illustrates the proportion of full-time employees working fully on-site, hybrid, and fully remote across four sectors in 2026. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    dataTable: {
      headers: ['Industry Sector', 'On-site (%)', 'Hybrid (%)', 'Remote (%)'],
      rows: [
        { label: 'Software & IT', values: ['12%', '46%', '42%'] },
        { label: 'Finance & Consulting', values: ['28%', '57%', '15%'] },
        { label: 'Healthcare', values: ['84%', '12%', '4%'] },
        { label: 'Higher Education', values: ['54%', '35%', '11%'] },
      ],
    },
  },
  {
    id: 't1-urban-commute-2026',
    taskType: 'task1',
    category: 'Транспорт (Comparative Trends)',
    questionType: 'Academic Data Report',
    prompt:
      'The table presents average daily commuter trips (in thousands) in Metroville by mode of transport in 2018, 2022, and 2026. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    dataTable: {
      headers: ['Transport Mode', '2018 (k)', '2022 (k)', '2026 (k)'],
      rows: [
        { label: 'Private Car', values: ['620', '490', '340'] },
        { label: 'Metro / Light Rail', values: ['410', '465', '610'] },
        { label: 'Electric Bus', values: ['190', '240', '325'] },
        { label: 'E-Bike & Cycling', values: ['65', '155', '270'] },
      ],
    },
  },
  {
    id: 't1-higher-ed-2026',
    taskType: 'task1',
    category: 'Образование (Enrollment Data)',
    questionType: 'Academic Data Report',
    prompt:
      'The table shows international university enrollment (in thousands of students) across four academic fields in 2020 and 2026. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    dataTable: {
      headers: ['Academic Field', '2020 (k)', '2026 (k)', 'Change'],
      rows: [
        { label: 'Computer Science & AI', values: ['310', '540', '+74%'] },
        { label: 'Business & Economics', values: ['480', '460', '-4%'] },
        { label: 'Environmental Engineering', values: ['145', '255', '+76%'] },
        { label: 'Humanities & Arts', values: ['230', '175', '-24%'] },
      ],
    },
  },
  {
    id: 't1-water-usage-2026',
    taskType: 'task1',
    category: 'Ресурсы (Regional Comparison)',
    questionType: 'Academic Data Report',
    prompt:
      'The table compares freshwater consumption by sector (percentage of total national use) in three countries in 2026. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    dataTable: {
      headers: ['Country', 'Agriculture (%)', 'Industry (%)', 'Domestic (%)'],
      rows: [
        { label: 'Country A (Arid)', values: ['76%', '11%', '13%'] },
        { label: 'Country B (Industrial)', values: ['18%', '63%', '19%'] },
        { label: 'Country C (Balanced)', values: ['42%', '34%', '24%'] },
      ],
    },
  },
  {
    id: 't1-digital-payments-2026',
    taskType: 'task1',
    category: 'Финансы (Demographics)',
    questionType: 'Academic Data Report',
    prompt:
      'The table tracks the percentage of retail transactions completed via cash, physical cards, and mobile wallets across three age groups in 2026. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    dataTable: {
      headers: ['Age Group', 'Cash (%)', 'Physical Card (%)', 'Mobile Wallet (%)'],
      rows: [
        { label: '18–29 years', values: ['4%', '22%', '74%'] },
        { label: '30–54 years', values: ['11%', '41%', '48%'] },
        { label: '55+ years', values: ['31%', '49%', '20%'] },
      ],
    },
  },
];
