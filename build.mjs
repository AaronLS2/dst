import {mkdirSync,copyFileSync} from 'node:fs';
mkdirSync('dist/original',{recursive:true});
for(const file of ['index.html','styles.css','app.js','solar.js']) copyFileSync(file,`dist/${file}`);
copyFileSync('original/index.html','dist/original/index.html');
