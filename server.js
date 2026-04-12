const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');

const app = express();
app.use(cors());

// УВАГА: Замініть це посилання на "Raw" посилання вашого файлу volunteers.yaml з GitHub
// Воно виглядає приблизно так: https://raw.githubusercontent.com/ВАШ_НІК/ВАШ_РЕПОЗИТОРІЙ/main/volunteers.yaml
const YAML_URL = 'https://raw.githubusercontent.com/denris87/vilnohirsk-volunteers-api/main/volunteers.yaml';

app.get('/api/volunteers', async (req, res) => {
    try {
        // Додаємо ?t=date щоб скинути кеш GitHub
        const response = await fetch(YAML_URL + '?t=' + Date.now());
        if (!response.ok) throw new Error('Не вдалося завантажити YAML з GitHub');
        
        const yamlText = await response.text();
        const data = yaml.load(yamlText);
        
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
