import fs from 'fs';

import { PDFParse } from 'pdf-parse';

export const extractPdfText = async (
  filePath: string,
) => {
  const dataBuffer =
    fs.readFileSync(filePath);

  const parser = new PDFParse({
    data: dataBuffer,
  });

  const result =
    await parser.getText();

  return result.text;
};