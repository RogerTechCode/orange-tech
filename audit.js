const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\roger\\Downloads\\horizons-export-c5d36ec6-ec48-44a6-93c1-8d8f105b7c59\\vanilla';

function checkFileContains(filename, regex, description, shouldExist = true) {
    const filePath = path.join(projectDir, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`❌ [FAIL] ${description} - File not found: ${filename}`);
        return false;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const exists = regex.test(content);

    if (exists === shouldExist) {
        console.log(`✅ [PASS] ${description}`);
        return true;
    } else {
        console.log(`❌ [FAIL] ${description}`);
        return false;
    }
}

console.log("Starting Firebase & UI Audit...");
let passed = 0;
let total = 0;

function test(filename, regex, desc, shouldExist = true) {
    total++;
    if (checkFileContains(filename, regex, desc, shouldExist)) passed++;
}

// 1. Firebase Scripts
const pagesWithFirebase = ['index.html', 'clube.html', 'equipe.html', 'estrutura.html', 'localizacao.html', 'noticias.html', 'contato.html', 'news.html', 'dashboard.html', 'team.html', 'sponsors.html'];

pagesWithFirebase.forEach(page => {
    test(page, /src="firebase-init\.js"/, `${page} includes firebase-init.js`);
});

// 2. Firebase Initialization exists
test('firebase-init.js', /firebase\.firestore\(\)/, 'Firebase Firestore is initialized');

// 3. Async Storage Calls
test('main.js', /await renderSponsors/, 'main.js awaits renderSponsors');
test('main.js', /await Storage\.get/, 'main.js awaits Storage.get');
test('news.html', /await Storage\.add/, 'news.html awaits Storage.add');
test('news.html', /await Storage\.delete/, 'news.html awaits Storage.delete');
test('team.html', /await Storage\.add/, 'team.html awaits Storage.add');
test('sponsors.html', /await Storage\.delete/, 'sponsors.html awaits Storage.delete');
test('dashboard.html', /await Storage\.get/, 'dashboard.html awaits Storage.get for stats');

// 4. Content Removals
test('equipe.html', /renderAtletasCarousel/, 'Atletas logic removed from equipe.html', false);
test('main.js', /renderAtletasCarousel/, 'Atletas logic removed from main.js', false);
test('contato.html', /Visita Programada/, 'Visita Programada CTA removed from contato.html', false);
test('login.html', /julioadmin/, 'Login credentials removed from login.html', false);

// 5. UI Additions
test('styles.css', /max-width:\s*767px.*?header\s*\{.*?height:\s*80px.*?body:not\(\.admin-body\)/s, 'Mobile header CSS fix applied in styles.css');
test('news.html', /max-h-\[90vh\]\s*overflow-y-auto/, 'News modal has mobile scroll classes');
test('team.html', /max-h-\[90vh\]\s*overflow-y-auto/, 'Team modal has mobile scroll classes');
test('sponsors.html', /max-h-\[90vh\]\s*overflow-y-auto/, 'Sponsors modal has mobile scroll classes');
test('index.html', /&copy; 2026 Orange Futebol Clube/, 'Minimal footer on index.html');
test('index.html', /drop-shadow-lg/, 'Hero subtitle has drop shadow on index.html');

console.log(`\nAudit Complete: ${passed}/${total} checks passed.`);
if (passed !== total) {
    process.exit(1);
}
