
import { GoogleGenAI, Type } from "@google/genai";
import { Subject, Question, WordChallenge, PuzzleChallenge } from "../types";

const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const generateQuiz = async (subject: Subject): Promise<Question[]> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Buatlah 5 soal pilihan ganda tentang mata pelajaran ${subject} untuk tingkat SMP. Berikan penjelasan singkat untuk setiap jawaban yang benar.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.INTEGER, description: "Index dari jawaban yang benar (0-3)" },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateWordChallenge = async (subject: Subject): Promise<WordChallenge> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Berikan 1 kata kunci penting dalam mata pelajaran ${subject} SMP (1 kata saja, tanpa spasi). Berikan petunjuk yang menarik dan penjelasan singkat setelah kata itu tertebak.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING, description: "Kata kunci dalam huruf kapital" },
          hint: { type: Type.STRING, description: "Petunjuk atau definisi kata tersebut" },
          explanation: { type: Type.STRING, description: "Penjelasan edukatif tentang kata tersebut" }
        },
        required: ["word", "hint", "explanation"]
      }
    }
  });

  const data = JSON.parse(response.text);
  return { ...data, word: data.word.toUpperCase().replace(/\s/g, ''), subject };
};

export const generatePuzzleChallenge = async (subject: Subject): Promise<PuzzleChallenge> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Buatlah sebuah konsep/definisi penting dalam mata pelajaran ${subject} SMP. Kalimat definisinya harus singkat (6-10 kata). Pisahkan kalimat tersebut menjadi kata-kata (segments).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          concept: { type: Type.STRING, description: "Nama konsep yang dibahas" },
          definition: { type: Type.STRING, description: "Kalimat definisi lengkap" },
          segments: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Kata-kata dalam definisi tersebut sebagai potongan puzzle"
          },
          explanation: { type: Type.STRING, description: "Penjelasan lebih mendalam tentang konsep ini" }
        },
        required: ["concept", "definition", "segments", "explanation"]
      }
    }
  });

  const data = JSON.parse(response.text);
  return { ...data, subject };
};

export const getTutorResponse = async (question: string, history: {role: string, content: string}[]) => {
  const ai = getAIInstance();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "Anda adalah Tutor AI yang ramah dan suportif untuk siswa SMP di Indonesia. Gunakan bahasa yang mudah dimengerti, berikan contoh yang relevan dengan kehidupan sehari-hari siswa SMP, dan selalu beri semangat. Jika ditanya rumus, jelaskan logika di baliknya.",
    }
  });

  const result = await chat.sendMessage({ message: question });
  return result.text;
};
