import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

import CV from './models/Cv.js';
import Setting from './models/Setting.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));

const startServer = async () => {
  try {
    await mongoose.connect('mongodb+srv://CvAdmin:Quickcvadmin@cluster0.t7x7ove.mongodb.net/quickcv');
    console.log('✅ MongoDB connected');

    const keyRecord = await Setting.findOne({ key: 'OPENAI_API_KEY' });
    if (!keyRecord) throw new Error('❌ OPENAI_API_KEY не знайдено в MongoDB');
    console.log('🔑 OPENAI_API_KEY успешно загружен из MongoDB');

    const openai = new OpenAI({ apiKey: keyRecord.value });

    // ✅ Збереження CV
    app.post('/api/cv', async (req, res) => {
      try {
        const cv = new CV(req.body);
        await cv.save();
        res.status(201).json({ message: 'CV сохранено!' });
      } catch (error) {
        console.error('❌ Ошибка сохранения CV:', error);
        res.status(500).json({ error: 'Не удалось сохранить резюме.' });
      }
    });

    // ✅ Генерація опису
    app.post('/generate-description', async (req, res) => {
      try {
        const {
          name = '',
          skills = [],
          specialty = '',
          hobbies = '',
          language = 'ru'
        } = req.body;
    
        const skillStr = skills.length ? skills.join(', ') : 'without specific skills';
        const hobbyStr = hobbies || 'no hobbies';
    
        const langNames = {
          ru: 'Russian',
          uk: 'Ukrainian',
          en: 'English'
        };
        const langName = langNames[language] || 'Russian';
    
        const prompt = `
    You are a resume assistant. Write a first-person "About Me" section in ${langName}.
    
    Do not list the skills literally. Instead, describe strengths by meaning. If hobbies are provided, naturally weave them into the narrative. Keep it short (300–500 characters).
    
    Name: ${name}
    Profession: ${specialty}
    Skills: ${skillStr}
    Hobbies: ${hobbyStr}
    `;
    
        const keyRecord = await Setting.findOne({ key: 'OPENAI_API_KEY' });
        const hfApiKey = keyRecord.value;
    
        const response = await axios.post(
          'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
          { inputs: prompt },
          {
            headers: {
              Authorization: `Bearer ${hfApiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 30000,
          }
        );
    
        const result = response.data?.[0]?.generated_text;
        if (!result) throw new Error('Пустой ответ от модели');
    
        res.json({ description: result.trim() });
      } catch (error) {
        console.error('❌ HuggingFace error:', error?.response?.data || error.message || error);
        res.status(500).json({ error: 'Ошибка генерации описания.' });
      }
    });

    const PORT = 10000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Старт сервера невозможен:', err.message);
    process.exit(1);
  }
};

startServer();
