export type ExperienceType =
  | 'Work'
  | 'Internship'
  | 'Project'
  | 'Award'
  | 'Certification'
  | 'Education';

export interface ExperienceItem {
  id: string;
  type: ExperienceType;
  role: string;
  organization: string;
  period: string;
  location?: string;
  summary: string;
  highlights: string[];
  tags: string[];
}

export interface ExperienceYearGroup {
  year: string;
  subtitle: string;
  items: ExperienceItem[];
}

export const experienceByYear: ExperienceYearGroup[] = [
  {
    year: '2024',
    subtitle: 'Internship, Provincial Award & Foundations',
    items: [
      {
        id: 'exp-2024-uny',
        type: 'Internship',
        role: 'IT Support Internship',
        organization: 'Faculty of Vocational Studies, UNY',
        period: 'Jul 2024 – Nov 2024',
        location: 'Yogyakarta, Indonesia',
        summary:
          'Built a web-based laboratory information system and maintained campus network infrastructure.',
        highlights: [
          'Developed SILAB (Laboratory Information System) using PHP & Bootstrap.',
          'Handled hardware, software, and LAN troubleshooting & installation.',
          'Configured network switches and campus CCTV systems.',
        ],
        tags: ['PHP', 'Bootstrap', 'Networking', 'LAN & CCTV'],
      },
      {
        id: 'exp-2024-lks',
        type: 'Award',
        role: '3rd Place — LKS IT Software Solution for Business',
        organization: 'Dinas Dikpora DIY (Provincial Level)',
        period: 'Mar 2024',
        location: 'DIY Province',
        summary:
          'Represented school at the provincial software competition by delivering a multiplatform room booking app.',
        highlights: [
          'Built a cross-platform room reservation app (Android, Web, Desktop) with Flutter.',
          'Implemented authentication, booking, schedule management, and notifications.',
          'Demonstrated and presented the complete application before judges.',
        ],
        tags: ['Flutter', 'Dart', 'Multiplatform', '3rd Place'],
      },
      {
        id: 'exp-2024-stewa',
        type: 'Project',
        role: 'UI/UX & App Developer — Stewa Room',
        organization: 'Room Management & Rental App',
        period: 'Apr 2024',
        location: 'Yogyakarta',
        summary:
          'Designed and implemented a responsive room rental interface consistent across mobile and web.',
        highlights: [
          'Built room listings, detail pages, booking forms, and an admin dashboard.',
          'Structured reusable UI components for clean cross-platform scalability.',
        ],
        tags: ['UI/UX', 'Flutter', 'Responsive Design'],
      },
    ],
  },
  {
    year: '2025',
    subtitle: 'Full Stack Role, Certifications & Awards',
    items: [
      {
        id: 'exp-2025-wesclic',
        type: 'Work',
        role: 'Full Stack Developer',
        organization: 'PT. Wesclic Indonesia Neotech',
        period: 'Sep 2025 – Present',
        location: 'Yogyakarta, Indonesia',
        summary:
          'Developing production Laravel backend systems, RESTful APIs, and Web Admin Dashboards.',
        highlights: [
          'Engineered RESTful APIs, migrations, Eloquent ORM models, and middleware in Laravel.',
          'Designed relational database architectures in MySQL & PostgreSQL with query optimization.',
          'Built CRUD Web Admin Dashboards, Postman API tests, and Git team workflows.',
        ],
        tags: ['Laravel', 'REST API', 'MySQL', 'PostgreSQL'],
      },
      {
        id: 'exp-2025-infovolution',
        type: 'Award',
        role: '2nd Place — Web Programming INFOVOLUTION 17',
        organization: 'Faculty of Information Technology, UMBY',
        period: 'Dec 2025',
        location: 'Yogyakarta',
        summary:
          'Won 2nd place with WorkLab Insight, a national labor analytics & interactive job portal.',
        highlights: [
          'Built interactive wage trend & sector demographic charts using Chart.js.',
          'Implemented JSON-driven job search with keyword mapping & responsive UI.',
        ],
        tags: ['HTML/CSS', 'JavaScript', 'Chart.js', '2nd Place'],
      },
      {
        id: 'exp-2025-certs',
        type: 'Certification',
        role: 'MTCNA, BNSP & TOEIC Certifications',
        organization: 'MikroTik Academy · BNSP · ETS',
        period: 'Mar – Jul 2025',
        location: 'Indonesia',
        summary:
          'Validated networking, technical support, and English proficiency through national & global credentials.',
        highlights: [
          'MTCNA (MikroTik Certified Network Associate) — Apr 2025.',
          'BNSP Certificate of Competence in Technical Support — Jul 2025.',
          'TOEIC (Test of English for International Communication) Score 550 — Mar 2025.',
        ],
        tags: ['MTCNA', 'BNSP', 'TOEIC 550'],
      },
      {
        id: 'exp-2025-silat',
        type: 'Project',
        role: 'Full Stack Developer — SiLat',
        organization: 'Equipment Lending System (TJKT)',
        period: 'May – Jun 2025',
        location: 'Yogyakarta',
        summary:
          'Built a school laboratory equipment lending web platform with Laravel & Vue.js.',
        highlights: [
          'Implemented MVC architecture with Laravel Starter Kit, Vue.js, and MySQL.',
          'Created loan/return validation flows plus CSV import & export in the admin panel.',
        ],
        tags: ['Laravel', 'Vue.js', 'MySQL', 'CSV'],
      },
      {
        id: 'exp-2025-smk',
        type: 'Education',
        role: 'Computer & Network Engineering (TJKT)',
        organization: 'SMKN 2 Pengasih',
        period: 'Jul 2022 – May 2025',
        location: 'Yogyakarta, Indonesia',
        summary:
          'Graduated with strong foundations in mobile/backend software development and network administration.',
        highlights: [
          'Mobile apps with Flutter & Dart; backend web development with PHP & MySQL.',
          'MikroTik, Fiber Optic, Cisco Packet Tracer, and Debian Linux server setup.',
        ],
        tags: ['Flutter', 'PHP', 'MikroTik', 'Linux'],
      },
    ],
  },
  {
    year: '2026',
    subtitle: 'Production Systems, AI Integration & University',
    items: [
      {
        id: 'exp-2026-prod',
        type: 'Work',
        role: 'Backend & Full Stack — SUMU, HUWA & Zendo',
        organization: 'PT. Wesclic Indonesia Neotech',
        period: 'Oct 2025 – Present',
        location: 'Yogyakarta, Indonesia',
        summary:
          'Delivering scalable production APIs and frontend features across multiple live digital platforms.',
        highlights: [
          'SUMU (Serikat Usaha Muhammadiyah): Laravel REST API, MySQL indexing & TypeScript frontend.',
          'HUWA (Muslim Super Apps): PostgreSQL schema design, MVC API routing & reliability fixes.',
          'Zendo (On-demand Ojek Platform): Mobile & web API integration with query optimization.',
        ],
        tags: ['Laravel', 'TypeScript', 'PostgreSQL', 'MySQL'],
      },
      {
        id: 'exp-2026-nutriguard',
        type: 'Project',
        role: 'Full Stack & AI Developer — Nutri Guard',
        organization: 'AI Family Nutrition Coach',
        period: 'Dec 2025 – Jan 2026',
        location: 'Yogyakarta',
        summary:
          'Fullstack health & nutrition web app combining Laravel, React, PyTorch vision, and LLM recipes.',
        highlights: [
          'Integrated AI NutriScan (Python + PyTorch, Food-101) via CLI for automatic food logging.',
          'Built FitChef powered by Gemini/Groq for AI recipe generation & PDF export.',
          'Implemented Chart.js growth tracking, family chat, and weekly reports.',
        ],
        tags: ['Laravel', 'React', 'PyTorch', 'Gemini/Groq'],
      },
      {
        id: 'exp-2026-umby',
        type: 'Education',
        role: 'B.Sc. in Informatics Engineering',
        organization: 'Universitas Mercu Buana Yogyakarta',
        period: 'Aug 2025 – Present',
        location: 'Yogyakarta, Indonesia',
        summary:
          'Advancing computer science fundamentals alongside active full-stack industry experience.',
        highlights: [
          'Algorithms & Data Structures (complexity analysis & C implementation).',
          'Web development with Laravel, PHP, MySQL database design, and Git workflows.',
        ],
        tags: ['Informatics', 'C & PHP', 'Laravel', 'MySQL'],
      },
    ],
  },
];
