const SKILLS = [
  'javascript',
  'typescript',
  'react',
  'next.js',
  'node.js',
  'mongodb',
  'express',
  'docker',
  'redis',
  'python',
  'java',
  'c++',
  'aws',
  'sql',
  'kubernetes',
  'graphql',
  'nestjs',
  'postgresql',
  'firebase',
  'tailwind',
  'git',
];

const EDUCATION_KEYWORDS = [
  'btech',
  'bachelor',
  'master',
  'mca',
  'bca',
  'university',
  'college',
];

const PROJECT_KEYWORDS = [
  'project',
  'portfolio',
  'application',
  'system',
  'platform',
];

const IMPORTANT_SKILLS = [
  'typescript',
  'react',
  'node.js',
  'mongodb',
  'docker',
  'aws',
];

export const analyzeResumeText = (
  text: string,
) => {
  const lowerText =
    text.toLowerCase();

  // Extract skills
  const skills =
    SKILLS.filter((skill) =>
      lowerText.includes(skill),
    );

  // Extract education
  const education =
    EDUCATION_KEYWORDS.filter(
      (keyword) =>
        lowerText.includes(keyword),
    );

  // Extract projects
  const projects =
    PROJECT_KEYWORDS.filter(
      (keyword) =>
        lowerText.includes(keyword),
    );

  // Missing important skills
  const missingSkills =
    IMPORTANT_SKILLS.filter(
      (skill) =>
        !skills.includes(skill),
    );

  // Suggestions
  const suggestions: string[] = [];

  if (!skills.includes('docker')) {
    suggestions.push(
      'Add Docker experience to improve backend profile.',
    );
  }

  if (!skills.includes('aws')) {
    suggestions.push(
      'Add cloud technologies like AWS.',
    );
  }

  if (projects.length < 2) {
    suggestions.push(
      'Add more project details to strengthen your resume.',
    );
  }

  // ATS Score Calculation
  let atsScore = 0;

  atsScore += skills.length * 5;

  atsScore += education.length * 5;

  atsScore += projects.length * 5;

  if (text.length > 1000) {
    atsScore += 20;
  }

  if (skills.includes('docker')) {
    atsScore += 10;
  }

  if (skills.includes('aws')) {
    atsScore += 10;
  }

  if (atsScore > 100) {
    atsScore = 100;
  }

  return {
    skills,

    education,

    experience: [],

    projects,

    missingSkills,

    suggestions,

    atsScore,

    extractedText: text,
  };
};