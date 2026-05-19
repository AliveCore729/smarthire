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

export const analyzeResumeText = (
  text: string,
) => {
  const lowerText = text.toLowerCase();

  const skills = SKILLS.filter((skill) =>
    lowerText.includes(skill),
  );

  const education =
    EDUCATION_KEYWORDS.filter(
      (keyword) =>
        lowerText.includes(keyword),
    );

  let atsScore = 0;

  atsScore += skills.length * 5;

  atsScore += education.length * 5;

  if (text.length > 1000) {
    atsScore += 20;
  }

  if (atsScore > 100) {
    atsScore = 100;
  }

  return {
    skills,
    education,
    experience: [],
    atsScore,
  };
};