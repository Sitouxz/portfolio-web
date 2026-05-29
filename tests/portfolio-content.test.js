const assert = require('node:assert/strict');

const {
  defaultPortfolioContent,
  github2025Projects,
  navItems,
  originalPortfolioProjects,
  socialLinks,
  detailCards,
  portfolioProjects,
} = require('../lib/portfolio-content');
const { markdownToHtml } = require('../lib/markdown');
const { mergeContent } = require('../lib/portfolio-editor');

assert.deepEqual(
  navItems.map((item) => item.label),
  ['About', 'Work', 'Contact']
);

assert.deepEqual(
  socialLinks.map((item) => item.label),
  ['GitHub', 'LinkedIn', 'Instagram']
);

assert.equal(detailCards.length, 3);
assert.deepEqual(
  detailCards.map((card) => card.title),
  ['Talk about', 'Interests', 'Tools I use']
);

assert.equal(github2025Projects.length, 7);
assert.deepEqual(
  github2025Projects.slice(0, 3).map((project) => project.title),
  ['CS2-AI-Aimbot', 'surm-dashboard', 'tourism']
);

assert.equal(
  github2025Projects.at(-1).title,
  'lenshire',
  'GitHub group should include only 2025 projects'
);

assert.equal(
  github2025Projects.filter((project) => project.visibility === 'private').length,
  1
);

assert.equal(
  github2025Projects.every((project) => project.source === 'GitHub'),
  true
);

assert.equal(
  github2025Projects.every((project) => project.createdAt.startsWith('2025-')),
  true
);

assert.equal(
  github2025Projects.every(
    (project) =>
      typeof project.image === 'string' &&
      project.image.startsWith('/project-screenshots/')
  ),
  true,
  'every 2025 project should include a captured screenshot path'
);

assert.equal(originalPortfolioProjects.length, 14);
assert.deepEqual(
  originalPortfolioProjects.slice(0, 8).map((project) => project.title),
  [
    'runding-web',
    'musart-web',
    'dereyez-app',
    'dereyez-games-react',
    'staycation-app',
    'udine-website',
    'Circlearn-Web',
    'Adobe-Illustrator',
  ]
);

assert.equal(
  originalPortfolioProjects.every(
    (project) =>
      project.source === 'Original Portfolio' &&
      typeof project.image === 'string' &&
      project.image.startsWith('/web') &&
      project.descriptionMarkdown === ''
  ),
  true,
  'original base portfolio projects should be image-only by default'
);

assert.equal(portfolioProjects.length, 21);
assert.equal(defaultPortfolioContent.hero.name, 'Yehezkiel Owen');
assert.equal(defaultPortfolioContent.projects.length, portfolioProjects.length);
assert.equal(
  mergeContent(defaultPortfolioContent, {
    projects: github2025Projects,
  }).projects.length,
  portfolioProjects.length,
  'stored dashboard content should receive newly added default projects'
);
assert.equal(
  github2025Projects.every(
    (project) =>
      typeof project.descriptionMarkdown === 'string' &&
      project.descriptionMarkdown.includes('## Overview')
  ),
  true,
  'GitHub projects should have a markdown description'
);

assert.match(markdownToHtml('## Overview\n\n- **Fast** editing'), /<h4>Overview<\/h4>/);
assert.match(markdownToHtml('## Overview\n\n- **Fast** editing'), /<strong>Fast<\/strong>/);

console.log('portfolio content contract ok');
