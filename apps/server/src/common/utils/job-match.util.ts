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
];

export const analyzeJobMatch = (
  resumeSkills: string[],
  jobDescription: string,
) => {
  const lowerJD =
    jobDescription.toLowerCase();

  const requiredSkills =
    SKILLS.filter((skill) =>
      lowerJD.includes(skill),
    );

  const matchedSkills =
    requiredSkills.filter((skill) =>
      resumeSkills.includes(skill),
    );

  const missingSkills =
    requiredSkills.filter(
      (skill) =>
        !resumeSkills.includes(skill),
    );

  let matchScore = 0;

  if (requiredSkills.length > 0) {
    matchScore = Math.round(
      (matchedSkills.length /
        requiredSkills.length) *
        100,
    );
  }

  return {
    matchedSkills,
    missingSkills,
    matchScore,
  };
};