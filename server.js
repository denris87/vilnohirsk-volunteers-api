const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');

const app = express();
app.use(cors());

// Використовуємо офіційний API GitHub, оскільки raw-посилання примусово кешуються на 5 хвилин!
const GITHUB_API_URL = 'https://api.github.com/repos/denris87/vilnohirsk-volunteers-api/contents/volunteers.yaml';

app.get('/api/volunteers', async (req, res) => {
    try {
        // Звертаємося до API з вимогою віддати сирий текст миттєво і без кешу
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        if (!response.ok) throw new Error('Не вдалося завантажити YAML з GitHub API');
        
        const yamlText = await response.text();
        const data = yaml.load(yamlText);
        
        // Суворо забороняємо браузерам і Railway кешувати цю відповідь
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        res.json(data.volunteers || []);
    } catch (error) {
        console.error('Помилка сервера:', error);
        res.status(500).json({ error: 'Failed to load data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
