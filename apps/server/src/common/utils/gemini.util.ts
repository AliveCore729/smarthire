import {
  GoogleGenerativeAI,
} from '@google/generative-ai';

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!,
  );

const getModel = (modelName: string) => genAI.getGenerativeModel({ model: modelName });

export const analyzeResumeWithGemini =
  async (resumeText: string) => {
    const prompt = `
You are an expert ATS resume analyzer and recruiter.

Analyze the following resume and return STRICT JSON ONLY.

Required JSON structure:

{
  "summary": "short professional summary",
  "atsScore": number,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "recommendedRoles": [],
  "suggestions": []
}

Resume:
${resumeText}
`;

    let result;
    try {
      // Primary model
      result = await getModel('gemini-2.5-flash').generateContent(prompt);
    } catch (error: any) {
      if (error?.message?.includes('503 Service Unavailable') || error?.status === 503) {
        console.warn('gemini-2.5-flash returned 503. Falling back to gemini-2.5-flash-lite...');
        // Fallback model
        result = await getModel('gemini-2.5-flash-lite').generateContent(prompt);
      } else {
        throw error;
      }
    }

    const response =
      await result.response;

    const text =
      response.text();

    try {
      const cleanText = text.replace(/```(?:json)?\n?|```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (e) {
      console.error('Gemini parse error. Raw text:', text);
      throw new Error(
        'Failed to parse Gemini response',
      );
    }
  };

export const compareResumeWithJob = async (resumeText: string, jobDescription: string) => {
  const prompt = `
You are an expert technical recruiter and ATS software.

Analyze the provided resume against the provided job description and return STRICT JSON ONLY.

Required JSON structure:
{
  "matchedSkills": ["exact match 1", "exact match 2"],
  "missingSkills": ["skill in job description but missing from resume", "missing skill 2"],
  "matchScore": 85
}
Note: matchScore must be a number between 0 and 100.

Resume Text:
${resumeText}

Job Description:
${jobDescription}
`;

  let result;
  try {
    result = await getModel('gemini-2.5-flash').generateContent(prompt);
  } catch (error: any) {
    if (error?.message?.includes('503 Service Unavailable') || error?.status === 503) {
      console.warn('gemini-2.5-flash returned 503 during job match. Falling back to gemini-2.5-flash-lite...');
      result = await getModel('gemini-2.5-flash-lite').generateContent(prompt);
    } else {
      throw error;
    }
  }

  const response = await result.response;
  const text = response.text();
  const cleanText = text.replace(/```(?:json)?\n?|```/g, '').trim();
  return JSON.parse(cleanText);
};