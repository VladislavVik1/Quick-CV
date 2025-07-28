import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');

app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));

app.post('/generate-description', async (req, res) => {
  const { name, skills } = req.body;
  const skillStr = skills.join(', ') || 'веб-технологиями';

  const prompt = `
Ты — помощник по написанию резюме. Сгенерируй 1 связный, живой текст для раздела "О себе" для IT компаний.

Составь короткий текст минимум 300, максимум 500 символов "О себе" для IT-резюме на русском. Имя: ${name}. Навыки: ${skills}.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 400
    });

    const description = completion.choices[0].message.content.trim();
    res.json({ description });

  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'Ошибка генерации описаний.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
