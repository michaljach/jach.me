import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';

// Configuration
const POSTS_DIR = './posts';
const OUTPUT_DIR = './blog';
const TEMPLATES_DIR = './templates';
const BASE_PATH = '/blog/';

// Ensure output directory exists
if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Read templates
const baseTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'base.html'), 'utf-8');
const postTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'post.html'), 'utf-8');
const indexTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'index.html'), 'utf-8');

// Get all markdown files
const postFiles = fs.readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.md'))
    .sort()
    .reverse();

// Parse posts
const posts = [];

postFiles.forEach(file => {
    const filePath = path.join(POSTS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    // Extract title from frontmatter or first heading
    let title = data.title;
    if (!title) {
        const match = content.match(/^#\s+(.+)$/m);
        title = match ? match[1] : file.replace('.md', '');
    }
    
    // Extract date from frontmatter or filename or use file creation date
    let date = data.date;
    if (!date) {
        const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
            date = dateMatch[1];
        } else {
            const stats = fs.statSync(filePath);
            date = stats.birthtime.toISOString().split('T')[0];
        }
    }
    
    // Create slug from filename (strip date prefix if present)
    let slug = file.replace('.md', '');
    slug = slug.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    
    posts.push({
        slug,
        title,
        date,
        content,
        data
    });
});

// Sort posts by date (newest first), then by slug (newest first) for same date
posts.sort((a, b) => {
    const dateCompare = new Date(b.date) - new Date(a.date);
    if (dateCompare !== 0) return dateCompare;
    return b.slug.localeCompare(a.slug);
});

// Generate post pages
posts.forEach(post => {
    const html = marked.parse(post.content);
    
    // Fill post template
    let postHtml = postTemplate
        .replace('{{TITLE}}', post.title)
        .replace('{{DATE}}', formatDate(post.date))
        .replace('{{CONTENT}}', html)
        .replace('{{ROOT}}', BASE_PATH);
    
    // Fill base template
    const finalHtml = baseTemplate
        .replace('{{TITLE}}', post.title)
        .replace('{{CONTENT}}', postHtml)
        .replace(/{{ROOT}}/g, BASE_PATH);
    
    // Create post directory
    const postDir = path.join(OUTPUT_DIR, post.slug);
    fs.mkdirSync(postDir, { recursive: true });
    
    // Write post HTML
    fs.writeFileSync(path.join(postDir, 'index.html'), finalHtml);
    
    console.log(`Generated: ${post.slug}/index.html`);
});

// Generate index page
let postsListHtml = posts.map(post => `
<div class="post-item">
    <h3><a href="${post.slug}/">${post.title}</a></h3>
    <time>${formatDate(post.date)}</time>
</div>
`).join('\n');

let indexContent = indexTemplate.replace('{{POSTS}}', postsListHtml);

const indexHtml = baseTemplate
    .replace('{{TITLE}}', 'Blog - JACH')
    .replace('{{CONTENT}}', indexContent)
    .replace(/{{ROOT}}/g, BASE_PATH);

fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHtml);
console.log('Generated: index.html');

// Copy CSS
fs.copyFileSync('./blog-style.css', path.join(OUTPUT_DIR, 'style.css'));
console.log('Copied: style.css');

// Copy images from posts directory
const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
const imageFiles = fs.readdirSync(POSTS_DIR)
    .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()));

imageFiles.forEach(file => {
    fs.copyFileSync(path.join(POSTS_DIR, file), path.join(OUTPUT_DIR, file));
    console.log(`Copied: ${file}`);
});

// Helper function
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

console.log(`\nBuild complete! Generated ${posts.length} posts.`);
