/* =====================================================
   SUBJECTS DATABASE — AI Study Buddy v2.0
   Complete branch-wise subject bank for all branches
   ===================================================== */

const SUBJECTS_DB = {

  // ── Class 11 / 12 ───────────────────────────────────────
  class11_science: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English', 'Hindi / Marathi'],
  class12_science: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English', 'Hindi / Marathi'],
  class11_commerce: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English', 'Hindi / Marathi'],
  class12_commerce: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English', 'Hindi / Marathi'],
  class11_arts: ['History', 'Geography', 'Political Science', 'Sociology', 'Psychology', 'English', 'Hindi / Marathi'],
  class12_arts: ['History', 'Geography', 'Political Science', 'Sociology', 'Psychology', 'English', 'Hindi / Marathi'],

  // ── Engineering — Common Sem 1–2 ────────────────────────
  engineering_common: [
    'Engineering Mathematics I (M1)', 'Engineering Mathematics II (M2)',
    'Engineering Physics', 'Engineering Chemistry',
    'Basic Electrical Engineering', 'Basic Electronics',
    'Engineering Drawing', 'Computer Programming (C language)',
    'Communication Skills', 'Environmental Studies', 'Engineering Mechanics'
  ],

  // ── CSE / IT / AI-ML / Data Science ─────────────────────
  cse: [
    'Engineering Mathematics I (M1)', 'Engineering Mathematics II (M2)', 'Engineering Mathematics III (M3)',
    'Data Structures and Algorithms', 'Object Oriented Programming (Java)',
    'Object Oriented Programming (C++)', 'Python Programming',
    'Database Management Systems (DBMS)', 'Operating Systems',
    'Computer Networks', 'Theory of Computation (TOC)',
    'Compiler Design', 'Software Engineering', 'Web Technologies',
    'Machine Learning', 'Deep Learning', 'Artificial Intelligence',
    'Data Science', 'Cloud Computing', 'Cybersecurity',
    'Mobile App Development', 'Discrete Mathematics',
    'Computer Architecture and Organization', 'Microprocessors',
    'Software Testing', 'Project Management'
  ],

  // ── Mechanical Engineering ───────────────────────────────
  mechanical: [
    'Engineering Mathematics I (M1)', 'Engineering Mathematics II (M2)',
    'Engineering Thermodynamics', 'Fluid Mechanics and Hydraulics',
    'Strength of Materials (SOM)', 'Manufacturing Processes',
    'Machine Design', 'Heat Transfer', 'CAD/CAM',
    'Automobile Engineering', 'Industrial Engineering',
    'Dynamics of Machinery', 'Metrology and Quality Control',
    'Refrigeration and Air Conditioning', 'Power Plant Engineering',
    'Mechatronics', 'Production Planning and Control'
  ],

  // ── Civil Engineering ────────────────────────────────────
  civil: [
    'Engineering Mathematics I (M1)', 'Engineering Mathematics II (M2)',
    'Structural Analysis', 'Concrete Technology and RCC',
    'Surveying', 'Geotechnical Engineering',
    'Transportation Engineering', 'Environmental Engineering',
    'Hydraulics', 'Building Materials and Construction',
    'Estimation and Costing', 'Steel Structure Design',
    'Foundation Engineering', 'Town Planning'
  ],

  // ── Electrical Engineering ───────────────────────────────
  electrical: [
    'Engineering Mathematics I (M1)', 'Engineering Mathematics II (M2)',
    'Circuit Theory and Networks', 'Electrical Machines',
    'Power Systems', 'Control Systems',
    'Power Electronics', 'Electrical Measurements and Instruments',
    'Microprocessors and Microcontrollers', 'Switchgear and Protection',
    'High Voltage Engineering', 'Utilization of Electrical Energy',
    'Electric Drives', 'Renewable Energy Systems'
  ],

  // ── Electronics and Communication ────────────────────────
  extc: [
    'Engineering Mathematics I (M1)', 'Engineering Mathematics II (M2)',
    'Electronic Devices and Circuits', 'Digital Electronics',
    'Signal Processing (DSP)', 'Communication Engineering',
    'Analog Electronics', 'Microelectronics', 'VLSI Design',
    'Embedded Systems', 'Antenna Theory', 'RF Engineering',
    'Wireless Communication', 'Optical Fiber Communication',
    'Control Systems', 'Microprocessors'
  ],

  // ── Chemical Engineering ─────────────────────────────────
  chemical: [
    'Engineering Mathematics I (M1)', 'Engineering Mathematics II (M2)',
    'Chemical Engineering Thermodynamics', 'Fluid Mechanics',
    'Heat Transfer Operations', 'Mass Transfer',
    'Chemical Reaction Engineering', 'Process Control',
    'Material Science', 'Transport Phenomena',
    'Petroleum Refining', 'Fuel Technology'
  ],

  // ── BCA ──────────────────────────────────────────────────
  bca: [
    'Programming in C', 'Programming in C++', 'Java Programming',
    'Python Programming', 'Data Structures', 'DBMS',
    'Operating Systems', 'Computer Networks', 'Web Development (HTML/CSS/JS)',
    'PHP and MySQL', 'Software Engineering', 'Computer Graphics',
    'E-Commerce', 'Information Security', 'Mobile App Development',
    'Mathematical Foundations', 'Statistics for Computing', 'MCA Entrance Prep'
  ],

  // ── MCA ──────────────────────────────────────────────────
  mca: [
    'Advanced Data Structures', 'Algorithm Design and Analysis',
    'Advanced DBMS', 'System Software', 'Advanced Computer Networks',
    'Cloud Computing', 'Machine Learning', 'Soft Computing',
    'Research Methodology', 'Project Management', 'Distributed Systems',
    'Big Data Analytics', 'Web Technologies', 'Enterprise Systems',
    'Information Security and Cryptography'
  ],

  // ── BBA ──────────────────────────────────────────────────
  bba: [
    'Principles of Management', 'Business Economics (Micro)',
    'Business Economics (Macro)', 'Financial Accounting',
    'Business Mathematics', 'Statistics for Business',
    'Marketing Management', 'Human Resource Management',
    'Business Law', 'Organizational Behavior', 'Business Communication',
    'Entrepreneurship', 'Operations Management', 'International Business',
    'Business Environment', 'Financial Management'
  ],

  // ── MBA ──────────────────────────────────────────────────
  mba: [
    'Management Theory and Practice', 'Managerial Economics',
    'Financial Management', 'Marketing Management',
    'Operations Research', 'Business Research Methods',
    'Strategic Management', 'Supply Chain Management',
    'Corporate Finance', 'Business Ethics and Corporate Governance',
    'Leadership and Organizational Development', 'Quantitative Methods',
    'International Business', 'Human Resource Management',
    'Finance Specialization: Investment Analysis',
    'Finance Specialization: Financial Markets',
    'Marketing Specialization: Consumer Behavior',
    'Marketing Specialization: Digital Marketing',
    'HR Specialization: Industrial Relations',
    'Operations Specialization: TQM and Six Sigma'
  ],

  // ── BSc Science ──────────────────────────────────────────
  bsc_physics: [
    'Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics',
    'Modern Physics', 'Quantum Mechanics', 'Nuclear Physics',
    'Solid State Physics', 'Electronics', 'Mathematical Physics'
  ],
  bsc_chemistry: [
    'Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry',
    'Analytical Chemistry', 'Spectroscopy', 'Industrial Chemistry',
    'Environmental Chemistry', 'Biochemistry'
  ],
  bsc_mathematics: [
    'Calculus', 'Linear Algebra', 'Differential Equations',
    'Real Analysis', 'Abstract Algebra', 'Numerical Methods',
    'Statistics and Probability', 'Discrete Mathematics',
    'Complex Analysis', 'Topology'
  ],
  bsc_biology: [
    'Cell Biology', 'Genetics', 'Ecology', 'Animal Physiology',
    'Plant Physiology', 'Biochemistry', 'Microbiology',
    'Evolution', 'Botany', 'Zoology', 'Developmental Biology'
  ],
  bsc_cs: [
    'Programming in C', 'Data Structures', 'Algorithms',
    'Computer Architecture', 'Operating Systems', 'DBMS',
    'Programming Languages', 'Computer Networks', 'Software Engineering'
  ],
  bsc_biotech: [
    'Molecular Biology', 'Genetic Engineering', 'Bioprocess Engineering',
    'Bioinformatics', 'Immunology', 'Fermentation Technology',
    'Cell Culture', 'Protein Engineering', 'Genomics and Proteomics'
  ],

  // ── Pharmacy ─────────────────────────────────────────────
  dpharm: [
    'Pharmaceutics I', 'Pharmaceutics II',
    'Pharmacognosy', 'Pharmacology', 'Pharmaceutical Chemistry',
    'Hospital and Clinical Pharmacy', 'Drug Store Management',
    'Health Education and Community Pharmacy'
  ],
  bpharm: [
    'Pharmaceutical Chemistry (Organic)', 'Pharmaceutical Chemistry (Inorganic)',
    'Medicinal Chemistry', 'Pharmacology and Toxicology',
    'Pharmacognosy and Phytochemistry', 'Pharmaceutics I',
    'Pharmaceutics II (Dosage Forms)', 'Pharmaceutical Analysis',
    'Biopharmaceutics and Pharmacokinetics', 'Clinical Pharmacy',
    'Drug Regulatory Affairs', 'Pharmaceutical Biotechnology',
    'Pharmaceutical Microbiology', 'Hospital Pharmacy',
    'Pharmaceutical Technology', 'Novel Drug Delivery Systems'
  ],
  mpharm: [
    'Advanced Pharmaceutics', 'Advanced Pharmacology', 'Drug Design',
    'Pharmaceutical Technology', 'Pharmacokinetics and Clinical Pharmacy',
    'Novel Drug Delivery Systems', 'Quality Assurance',
    'Regulatory Affairs', 'Research Methodology', 'Pharmaceutical Validation'
  ],
  pharmd: [
    'Clinical Pharmacy Practice', 'Clinical Pharmacokinetics',
    'Pharmacotherapeutics I', 'Pharmacotherapeutics II',
    'Hospital and Community Pharmacy', 'Clinical Toxicology',
    'Rational Drug Use', 'Clinical Research and Pharmacovigilance',
    'Patient Communication and Counseling'
  ]
};

// ── Branch metadata ──────────────────────────────────────
const BRANCHES = [
  { id: 'class11', label: 'Class 11', icon: '🎓', group: 'School' },
  { id: 'class12', label: 'Class 12', icon: '🎓', group: 'School' },
  { id: 'cse',       label: 'Engineering — CSE / IT / AI-ML / Data Science', icon: '💻', group: 'Engineering' },
  { id: 'mechanical',label: 'Engineering — Mechanical', icon: '⚙️', group: 'Engineering' },
  { id: 'civil',     label: 'Engineering — Civil', icon: '🏗️', group: 'Engineering' },
  { id: 'electrical',label: 'Engineering — Electrical', icon: '⚡', group: 'Engineering' },
  { id: 'extc',      label: 'Engineering — Electronics & Communication', icon: '📡', group: 'Engineering' },
  { id: 'chemical',  label: 'Engineering — Chemical', icon: '🧪', group: 'Engineering' },
  { id: 'bca',       label: 'BCA (Computer Applications)', icon: '🖥️', group: 'Computers' },
  { id: 'mca',       label: 'MCA (Master of Computer Applications)', icon: '🖥️', group: 'Computers' },
  { id: 'bba',       label: 'BBA (Business Administration)', icon: '💼', group: 'Management' },
  { id: 'mba',       label: 'MBA (Master of Business Administration)', icon: '📊', group: 'Management' },
  { id: 'bsc_physics',   label: 'BSc — Physics', icon: '🔭', group: 'Science' },
  { id: 'bsc_chemistry', label: 'BSc — Chemistry', icon: '⚗️', group: 'Science' },
  { id: 'bsc_mathematics',label: 'BSc — Mathematics', icon: '📐', group: 'Science' },
  { id: 'bsc_biology',   label: 'BSc — Biology', icon: '🧬', group: 'Science' },
  { id: 'bsc_cs',        label: 'BSc — Computer Science', icon: '💻', group: 'Science' },
  { id: 'bsc_biotech',   label: 'BSc — Biotechnology', icon: '🧫', group: 'Science' },
  { id: 'dpharm',    label: 'D.Pharm (Diploma in Pharmacy)', icon: '💊', group: 'Pharmacy' },
  { id: 'bpharm',    label: 'B.Pharm (Bachelor of Pharmacy)', icon: '💊', group: 'Pharmacy' },
  { id: 'mpharm',    label: 'M.Pharm (Master of Pharmacy)', icon: '💊', group: 'Pharmacy' },
  { id: 'pharmd',    label: 'Pharm.D (Doctor of Pharmacy)', icon: '💊', group: 'Pharmacy' },
];

// ── Branch accent colors ──────────────────────────────────
const BRANCH_ACCENTS = {
  class11: '#6366F1', class12: '#6366F1',
  cse: '#3B82F6', bca: '#8B5CF6', mca: '#8B5CF6',
  mechanical: '#64748B', civil: '#64748B', electrical: '#64748B',
  extc: '#64748B', chemical: '#64748B',
  bba: '#D97706', mba: '#D97706',
  bsc_physics: '#0D9488', bsc_chemistry: '#0D9488',
  bsc_mathematics: '#0D9488', bsc_biology: '#0D9488',
  bsc_cs: '#0D9488', bsc_biotech: '#0D9488',
  dpharm: '#059669', bpharm: '#059669',
  mpharm: '#059669', pharmd: '#059669'
};

// ── Branch groups for code-playground visibility ──────────
const CODE_BRANCHES = ['cse', 'bca', 'mca', 'bsc_cs'];
const PHARMACY_BRANCHES = ['dpharm', 'bpharm', 'mpharm', 'pharmd'];
const MBA_BRANCHES = ['bba', 'mba'];
const ENGINEERING_BRANCHES = ['cse', 'mechanical', 'civil', 'electrical', 'extc', 'chemical'];
const SCIENCE_BRANCHES = ['bsc_physics', 'bsc_chemistry', 'bsc_mathematics', 'bsc_biology', 'bsc_cs', 'bsc_biotech'];
const PLACEMENT_BRANCHES = ['cse', 'mechanical', 'civil', 'electrical', 'extc', 'chemical', 'bca', 'mca', 'bba', 'mba'];
const FORMULA_BRANCHES = [...ENGINEERING_BRANCHES, ...SCIENCE_BRANCHES, 'dpharm', 'bpharm', 'mpharm', 'pharmd'];

// ── Get subjects for a branch ─────────────────────────────
function getSubjectsForBranch(branchId) {
  const common = SUBJECTS_DB.engineering_common || [];
  if (ENGINEERING_BRANCHES.includes(branchId)) {
    return [...common, ...(SUBJECTS_DB[branchId] || [])];
  }
  return SUBJECTS_DB[branchId] || [];
}

// ── Get universities for a branch ────────────────────────
function getUniversitiesForBranch(branchId) {
  if (ENGINEERING_BRANCHES.includes(branchId)) {
    return ['Mumbai University', 'SPPU Pune', 'GTU Gujarat', 'VTU Karnataka',
            'RGPV MP', 'AKTU UP', 'LNCT', 'RTU Rajasthan', 'Other University'];
  }
  if (PHARMACY_BRANCHES.includes(branchId)) {
    return ['GPAT', 'Mumbai University', 'SPPU Pune', 'Nagpur University',
            'University Semester Exam', 'Other University'];
  }
  if (MBA_BRANCHES.includes(branchId)) {
    return ['CAT Exam', 'MAT Exam', 'Mumbai University', 'SPPU Pune',
            'Nagpur University', 'Other University'];
  }
  return ['Maharashtra Board (HSC)', 'CBSE', 'ICSE', 'Other Board'];
}

// Expose globally
window.SUBJECTS_DB = SUBJECTS_DB;
window.BRANCHES = BRANCHES;
window.BRANCH_ACCENTS = BRANCH_ACCENTS;
window.CODE_BRANCHES = CODE_BRANCHES;
window.PHARMACY_BRANCHES = PHARMACY_BRANCHES;
window.MBA_BRANCHES = MBA_BRANCHES;
window.ENGINEERING_BRANCHES = ENGINEERING_BRANCHES;
window.SCIENCE_BRANCHES = SCIENCE_BRANCHES;
window.PLACEMENT_BRANCHES = PLACEMENT_BRANCHES;
window.FORMULA_BRANCHES = FORMULA_BRANCHES;
window.getSubjectsForBranch = getSubjectsForBranch;
window.getUniversitiesForBranch = getUniversitiesForBranch;
