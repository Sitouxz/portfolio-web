const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/Sitouxz', icon: 'github' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/yehezkiel-owen-ombuh-018459251/',
    icon: 'linkedin',
  },
  { label: 'Instagram', href: 'https://www.instagram.com/sitouxz/', icon: 'instagram' },
];

const detailCards = [
  {
    title: 'Talk about',
    icon: 'chat',
    items: [
      {
        marker: 'rocket',
        text: 'Currently working on FLO i8 at Formulatrix, focusing on performance optimization, UI enhancements, and collaborative feature development.',
      },
      {
        marker: 'cap',
        text: 'Balancing professional experience with academic growth to stay sharp and innovative.',
      },
    ],
  },
  {
    title: 'Interests',
    icon: 'heart',
    items: [
      { marker: 'picture', text: 'UI/UX Design' },
      { marker: 'code', text: 'JavaScript & TypeScript' },
      { marker: 'book', text: 'MERN Stack & Web Arch' },
      { marker: 'spark', text: 'Clean Code & Systems' },
      { marker: 'palette', text: 'Logo Design & Branding' },
    ],
  },
  {
    title: 'Tools I use',
    icon: 'tool',
    items: [
      { marker: 'primary', text: 'Visual Studio Code' },
      { marker: 'neutral', text: 'Git & GitHub' },
      { marker: 'neutral', text: 'NPM' },
      { marker: 'neutral', text: 'Yarn' },
      { marker: 'neutral', text: 'Trello' },
      { marker: 'neutral', text: 'Adobe Illustrator' },
      { marker: 'neutral', text: 'Figma' },
      { marker: 'neutral', text: 'Postman' },
      { marker: 'neutral', text: 'MongoDB Compass' },
      { marker: 'neutral', text: 'GCP, Vercel, Netlify' },
    ],
  },
];

const featuredProjectImages = {
  'Sitouxz/CS2-AI-Aimbot': '/project-screenshots/cs2-ai-aimbot.png',
  'Sitouxz/surm-dashboard': '/project-screenshots/surm-dashboard.png',
  'Sitouxz/tourism': '/project-screenshots/tourism.png',
  'Sitouxz/homey': '/project-screenshots/homey.png',
  'Sitouxz/assemblyai-research': '/project-screenshots/assemblyai-research.png',
  'Sitouxz/bibty-recreate': '/project-screenshots/bibty-recreate.png',
  'Sitouxz/lenshire': '/project-screenshots/lenshire.png',
  'Sitouxz/runding-web': '/web1.png',
  'Sitouxz/musart-web': '/web2.png',
  'Sitouxz/dereyez-app': '/web3.png',
  'Sitouxz/dereyez-games-react': '/web4.png',
  'Sitouxz/staycation-app': '/web5.png',
  'Sitouxz/udine-website': '/web6.png',
  'Sitouxz/Circlearn-Web': '/web7.png',
  'Sitouxz/Adobe-Illustrator': '/web8.png',
};

const githubRepositories = [
  ['Sitouxz', 'CS2-AI-Aimbot', 'public', 'main', 0, '2025-11-03T23:29:25Z'],
  ['Sitouxz', 'surm-dashboard', 'private', 'main', 362, '2025-11-10T09:00:49Z'],
  ['Sitouxz', 'tourism', 'public', 'main', 599407, '2025-11-12T14:25:32Z'],
  ['Sitouxz', 'homey', 'public', 'main', 70, '2025-11-16T15:55:13Z'],
  ['Sitouxz', 'assemblyai-research', 'public', 'main', 320, '2025-11-19T00:33:24Z'],
  ['Sitouxz', 'bibty-recreate', 'public', 'main', 159, '2025-11-19T08:56:21Z'],
  ['Sitouxz', 'lenshire', 'public', 'main', 172, '2025-11-25T22:03:22Z'],
];

const originalProjectNames = [
  ['runding-web', 'Web Application', '/web1.png'],
  ['musart-web', 'Web Application', '/web2.png'],
  ['dereyez-app', 'Application', '/web3.png'],
  ['dereyez-games-react', 'Interactive Game', '/web4.png'],
  ['staycation-app', 'Travel Application', '/web5.png'],
  ['udine-website', 'Website', '/web6.png'],
  ['Circlearn-Web', 'Learning Platform', '/web7.png'],
  ['Adobe-Illustrator', 'Brand Design', '/web8.png'],
  ['Portfolio Visual 9', 'Portfolio Screenshot', '/web9.png'],
  ['Portfolio Visual 10', 'Portfolio Screenshot', '/web10.png'],
  ['Portfolio Visual 11', 'Portfolio Screenshot', '/web11.png'],
  ['Portfolio Visual 12', 'Portfolio Screenshot', '/web12.png'],
  ['Portfolio Visual 13', 'Portfolio Screenshot', '/web13.png'],
  ['Portfolio Visual 14', 'Portfolio Screenshot', '/web14.png'],
];

function inferCategory(name, visibility) {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('bot')) return 'Automation Bot';
  if (lowerName.includes('dashboard') || lowerName.includes('portal')) return 'Dashboard';
  if (lowerName.includes('store')) return 'Commerce';
  if (lowerName.includes('web') || lowerName.includes('site')) return 'Web Application';
  if (lowerName.includes('app')) return 'Application';
  if (lowerName.includes('research')) return 'Research';
  if (lowerName.includes('portfolio')) return 'Portfolio';
  if (lowerName.includes('test')) return 'Test Case';

  return visibility === 'private' ? 'Private Repository' : 'GitHub Repository';
}

const github2025Projects = githubRepositories.map(
  ([owner, name, visibility, defaultBranch, sizeKb, createdAt]) => {
    const repository = `${owner}/${name}`;

    return {
      title: name,
      category: inferCategory(name, visibility),
      image: featuredProjectImages[repository] || null,
      descriptionMarkdown: `## Overview\n\n${name} is a 2025 ${inferCategory(
        name,
        visibility
      ).toLowerCase()} project maintained on GitHub.\n\n## Notes\n\n- Source: ${repository}\n- Default branch: ${defaultBranch}\n- Visibility: ${visibility}`,
      source: 'GitHub',
      visibility,
      owner,
      repository,
      defaultBranch,
      sizeKb,
      createdAt,
      url: `https://github.com/${repository}`,
    };
  }
);

const originalPortfolioProjects = originalProjectNames.map(
  ([name, category, image]) => ({
    title: name,
    category,
    image,
    descriptionMarkdown: '',
    source: 'Original Portfolio',
    visibility: 'public',
    owner: 'Sitouxz',
    repository: `base-portfolio/${name}`,
    defaultBranch: 'main',
    sizeKb: 0,
    createdAt: '2024-01-01T00:00:00Z',
    url: image,
  })
);

const portfolioProjects = [...github2025Projects, ...originalPortfolioProjects];

const defaultPortfolioContent = {
  hero: {
    name: 'Yehezkiel Owen',
    title: 'Web developer and designer.',
    intro:
      "I'm a passionate web developer and designer with over 2 years of hands-on experience in front-end and back-end development. Currently pursuing a Bachelor's degree in Computer Science at Klabat University, and actively involved in real-world projects at Formulatrix, FXMedia Singapore, and more. I love turning ideas into functional, user-friendly digital products - combining beautiful design with clean, scalable code.",
    profileImage: '/profile.jpg',
  },
  contact: {
    heading: "Let's build something precise.",
    body: 'Available for front-end engineering, UI systems, and product design.',
    email: 'yehezkielowen@gmail.com',
  },
  navItems,
  socialLinks,
  detailCards,
  projects: portfolioProjects,
};

module.exports = {
  defaultPortfolioContent,
  github2025Projects,
  navItems,
  originalPortfolioProjects,
  socialLinks,
  detailCards,
  portfolioProjects,
};
