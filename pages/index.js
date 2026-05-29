import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  AiFillGithub,
  AiFillInstagram,
  AiFillLinkedin,
  AiOutlineClose,
  AiOutlineMenu,
} from 'react-icons/ai';
import { BsChatFill, BsHeartFill, BsTools } from 'react-icons/bs';
import profile from '../public/profile.jpg';
import {
  defaultPortfolioContent,
  detailCards,
  navItems,
  portfolioProjects,
  socialLinks,
} from '../lib/portfolio-content';
import { loadStoredContent } from '../lib/portfolio-editor';
import { markdownToHtml } from '../lib/markdown';

const socialIcons = {
  github: AiFillGithub,
  linkedin: AiFillLinkedin,
  instagram: AiFillInstagram,
};

const cardIcons = {
  chat: BsChatFill,
  heart: BsHeartFill,
  tool: BsTools,
};

const markerSymbols = {
  rocket: '🚀',
  cap: '🎓',
  picture: '🖼️',
  code: '👨‍💻',
  book: '📚',
  spark: '✨',
  palette: '🎨',
};

function NavLink({ item, onClick }) {
  return (
    <a
      className='font-display text-[15px] font-semibold leading-none text-secondary transition-colors duration-300 hover:text-primary'
      href={item.href}
      onClick={onClick}>
      {item.label}
    </a>
  );
}

function SocialLink({ link }) {
  const Icon = socialIcons[link.icon] || AiFillGithub;

  return (
    <a
      aria-label={link.label}
      className='flex h-12 w-12 items-center justify-center rounded-md border border-surface-border bg-surface-container-lowest text-2xl text-secondary transition-all duration-300 hover:border-primary hover:text-primary'
      href={link.href}
      rel='noreferrer'
      target='_blank'>
      <Icon />
    </a>
  );
}

function DetailCard({ card }) {
  const Icon = cardIcons[card.icon];
  const isTools = card.title === 'Tools I use';
  const isInterests = card.title === 'Interests';

  return (
    <article className='rounded-lg border border-surface-border bg-surface p-8 shadow-ambient'>
      <h3 className='mb-8 flex items-center gap-4 font-display text-[30px] font-bold leading-tight text-on-surface'>
        <Icon className='text-xl text-primary-container' />
        {card.title}
      </h3>

      {isTools ? (
        <div className='grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2'>
          {card.items.map((item) => (
            <div
              className='flex items-center gap-3 font-display text-[12px] font-bold leading-tight text-secondary'
              key={item.text}>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  item.marker === 'primary' ? 'bg-primary-container' : 'bg-slate-400'
                }`}
              />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      ) : isInterests ? (
        <div className='flex flex-wrap gap-3'>
          {card.items.map((item) => (
            <span
              className='rounded-md border border-surface-border bg-surface-container-low px-4 py-2 font-display text-[12px] font-bold leading-none text-on-surface'
              key={item.text}>
              <span className='mr-2' aria-hidden='true'>
                {markerSymbols[item.marker]}
              </span>
              {item.text}
            </span>
          ))}
        </div>
      ) : (
        <ul className='space-y-6'>
          {card.items.map((item) => (
            <li className='flex gap-4 text-secondary' key={item.text}>
              <span className='mt-0.5 text-xl' aria-hidden='true'>
                {markerSymbols[item.marker]}
              </span>
              <span className='text-[17px] leading-relaxed'>{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function ProjectCard({ project, onSelect }) {
  const initials = project.title
    .split(/[-_\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <button
      className='group overflow-hidden rounded-lg border border-surface-border bg-surface text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-ambient'
      onClick={() => onSelect(project)}
      type='button'>
      <span className='relative block aspect-video overflow-hidden'>
        {project.image ? (
          <Image
            alt={project.title}
            className='object-cover transition-transform duration-700 group-hover:scale-[1.05]'
            fill
            sizes='(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
            src={project.image}
          />
        ) : (
          <span className='flex h-full w-full flex-col justify-between bg-[radial-gradient(circle_at_20%_20%,#ffd0d2,transparent_28%),linear-gradient(135deg,#ffffff,#f2f4f6)] p-5 transition-transform duration-700 group-hover:scale-[1.03]'>
            <span className='flex items-center justify-between font-display text-[11px] font-bold uppercase tracking-[0.08em] text-secondary'>
              <span>{project.source}</span>
              <span
                className={`rounded px-2 py-1 ${
                  project.visibility === 'private'
                    ? 'bg-primary-fixed text-primary'
                    : 'bg-surface-container text-secondary'
                }`}>
                {project.visibility}
              </span>
            </span>
            <span className='font-display text-[56px] font-bold leading-none text-on-surface'>
              {initials || 'GH'}
            </span>
            <span className='font-display text-[12px] font-bold leading-none text-secondary'>
              {project.repository}
            </span>
          </span>
        )}
      </span>
      <span className='block p-4'>
        <span className='flex items-start justify-between gap-3'>
          <span className='min-w-0'>
            <span className='block truncate font-display text-[18px] font-bold leading-tight text-on-surface'>
              {project.title}
            </span>
            <span className='mt-1 block font-display text-[12px] font-bold leading-none text-secondary'>
              {project.category}
            </span>
          </span>
          <span className='shrink-0 rounded bg-surface-container px-2 py-1 font-display text-[10px] font-bold uppercase leading-none text-secondary'>
            {project.visibility}
          </span>
        </span>
      </span>
    </button>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [content, setContent] = useState(defaultPortfolioContent);
  const activeNavItems = content.navItems || navItems;
  const activeSocialLinks = content.socialLinks || socialLinks;
  const activeDetailCards = content.detailCards || detailCards;
  const activeProjects = content.projects || portfolioProjects;
  const projectSummary = activeProjects.reduce(
    (summary, project) => {
      summary.total += 1;
      summary[project.visibility] = (summary[project.visibility] || 0) + 1;
      if (project.source === 'GitHub') {
        summary.github += 1;
      }
      if (project.source === 'Original Portfolio') {
        summary.original += 1;
      }
      return summary;
    },
    { total: 0, public: 0, private: 0, github: 0, original: 0 }
  );

  useEffect(() => {
    setContent(loadStoredContent(defaultPortfolioContent));
  }, []);

  return (
    <>
      <Head>
        <title>Yehezkiel Owen - Web Developer and Designer</title>
        <meta
          name='description'
          content='Portfolio of Yehezkiel Owen, web developer and designer.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='min-h-screen overflow-x-hidden bg-background font-body text-on-background antialiased selection:bg-primary-container selection:text-on-primary'>
        <nav className='fixed top-0 z-50 w-full border-b border-surface-border bg-background/85 backdrop-blur-md'>
          <div className='mx-auto flex h-20 max-w-container items-center justify-between px-6'>
            <a
              className='font-display text-[30px] font-bold leading-none text-on-surface'
              href='#about'>
              {content.hero.name}
            </a>

            <div className='hidden items-center gap-10 md:flex'>
              {activeNavItems.map((item) => (
                <NavLink item={item} key={item.label} />
              ))}
              <a
                className='rounded bg-primary-container px-7 py-3 font-display text-[12px] font-bold leading-none text-on-primary transition-colors duration-300 hover:bg-slate-900'
                href='https://www.linkedin.com/in/yehezkiel-owen-ombuh-018459251/'
                rel='noreferrer'
                target='_blank'>
                Resume
              </a>
            </div>

            <button
              aria-expanded={menuOpen}
              aria-label='Toggle navigation'
              className='flex h-11 w-11 items-center justify-center rounded-md border border-surface-border bg-surface-container-lowest text-2xl text-on-surface md:hidden'
              onClick={() => setMenuOpen((open) => !open)}
              type='button'>
              {menuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>
          </div>

          {menuOpen && (
            <div className='border-t border-surface-border bg-background px-6 py-5 md:hidden'>
              <div className='mx-auto flex max-w-container flex-col gap-5'>
                {activeNavItems.map((item) => (
                  <NavLink
                    item={item}
                    key={item.label}
                    onClick={() => setMenuOpen(false)}
                  />
                ))}
                <a
                  className='inline-flex w-fit rounded bg-primary-container px-7 py-3 font-display text-[12px] font-bold leading-none text-on-primary'
                  href='https://www.linkedin.com/in/yehezkiel-owen-ombuh-018459251/'
                  rel='noreferrer'
                  target='_blank'>
                  Resume
                </a>
              </div>
            </div>
          )}
        </nav>

        <main>
          <section
            className='mx-auto max-w-container px-6 pb-20 pt-36 md:pb-[120px] md:pt-48'
            id='about'>
            <div className='grid items-center gap-16 md:grid-cols-[1fr_384px] md:gap-24'>
              <div>
                <h1 className='font-display text-[40px] font-bold leading-[1.15] text-on-surface sm:text-[58px] md:text-[64px]'>
                  {content.hero.name}
                </h1>
                <h2 className='mt-5 font-display text-[24px] font-bold leading-tight text-slate-600 sm:text-[28px] md:text-[32px]'>
                  {content.hero.title}
                </h2>
                <p className='mt-9 max-w-[660px] text-[18px] leading-[1.65] text-secondary'>
                  {content.hero.intro}
                </p>

                <div className='mt-12 flex gap-4'>
                  {activeSocialLinks.map((link) => (
                    <SocialLink key={link.label} link={link} />
                  ))}
                </div>
              </div>

              <div className='relative mx-auto h-72 w-72 md:h-96 md:w-96'>
                <div className='absolute inset-0 translate-x-4 translate-y-4 rounded-lg bg-surface-border' />
                <div className='relative h-full w-full overflow-hidden rounded-lg border border-surface-border bg-surface-container shadow-sm'>
                  <Image
                    alt='Yehezkiel Owen'
                    className='object-cover grayscale transition-all duration-500 hover:grayscale-0'
                    fill
                    priority
                    sizes='(min-width: 768px) 384px, 288px'
                    src={profile}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className='border-y border-surface-border bg-surface-bright py-16 md:py-[120px]'>
            <div className='mx-auto grid max-w-container grid-cols-1 gap-8 px-6 md:grid-cols-3'>
              {activeDetailCards.map((card) => (
                <DetailCard card={card} key={card.title} />
              ))}
            </div>
          </section>

          <section
            className='mx-auto max-w-container px-6 py-16 md:py-20'
            id='portfolio'>
            <div className='mx-auto mb-12 max-w-3xl text-center'>
              <h2 className='font-display text-[46px] font-bold leading-tight text-on-surface md:text-[64px]'>
                Portfolio
              </h2>
              <p className='mt-5 text-[18px] leading-[1.6] text-secondary'>
                Since I started my journey as a developer and designer, this
                portfolio brings together the original base portfolio pieces and
                the 2025 GitHub projects available through the connected account.
              </p>
              <div className='mt-8 flex flex-wrap justify-center gap-3'>
                <span className='rounded-md border border-surface-border bg-surface-container-lowest px-4 py-2 font-display text-[12px] font-bold uppercase leading-none text-secondary'>
                  {projectSummary.total} total projects
                </span>
                <span className='rounded-md border border-surface-border bg-surface-container-lowest px-4 py-2 font-display text-[12px] font-bold uppercase leading-none text-secondary'>
                  {projectSummary.github} GitHub from 2025
                </span>
                <span className='rounded-md border border-surface-border bg-surface-container-lowest px-4 py-2 font-display text-[12px] font-bold uppercase leading-none text-secondary'>
                  {projectSummary.original} original
                </span>
                <span className='rounded-md border border-surface-border bg-surface-container-lowest px-4 py-2 font-display text-[12px] font-bold uppercase leading-none text-secondary'>
                  {projectSummary.public} public
                </span>
                <span className='rounded-md border border-surface-border bg-surface-container-lowest px-4 py-2 font-display text-[12px] font-bold uppercase leading-none text-primary'>
                  {projectSummary.private} private
                </span>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {activeProjects.map((project) => (
                <ProjectCard
                  key={project.title}
                  onSelect={setSelectedProject}
                  project={project}
                />
              ))}
            </div>
          </section>

          <footer
            className='border-t border-surface-border bg-surface-bright px-6 py-12'
            id='contact'>
            <div className='mx-auto flex max-w-container flex-col gap-5 md:flex-row md:items-center md:justify-between'>
              <div>
                <p className='font-display text-[22px] font-bold text-on-surface'>
                  {content.contact.heading}
                </p>
                <p className='mt-2 text-secondary'>
                  {content.contact.body}
                </p>
              </div>
              <a
                className='inline-flex w-fit rounded bg-primary-container px-7 py-4 font-display text-[12px] font-bold leading-none text-on-primary transition-colors duration-300 hover:bg-slate-900'
                href={`mailto:${content.contact.email}`}>
                Contact
              </a>
            </div>
          </footer>
        </main>

        {selectedProject && (
          <div
            className='fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 p-6 backdrop-blur-sm'
            onClick={() => setSelectedProject(null)}
            role='presentation'>
            <div
              aria-modal='true'
              className='w-full max-w-4xl overflow-hidden rounded-lg border border-surface-border bg-surface-container-lowest shadow-ambient'
              onClick={(event) => event.stopPropagation()}
              role='dialog'>
              <div className='flex items-center justify-between border-b border-surface-border p-5'>
                <div>
                  <h3 className='font-display text-[24px] font-bold text-on-surface'>
                    {selectedProject.title}
                  </h3>
                  <p className='font-display text-[12px] font-bold text-secondary'>
                    {selectedProject.category}
                  </p>
                </div>
                <button
                  aria-label='Close project preview'
                  className='flex h-10 w-10 items-center justify-center rounded-md border border-surface-border text-xl text-secondary hover:text-primary'
                  onClick={() => setSelectedProject(null)}
                  type='button'>
                  <AiOutlineClose />
                </button>
              </div>
              <div className='relative aspect-video overflow-hidden bg-surface-container-low'>
                {selectedProject.image ? (
                  <Image
                    alt={selectedProject.title}
                    className='object-cover'
                    fill
                    sizes='896px'
                    src={selectedProject.image}
                  />
                ) : (
                  <div className='flex h-full flex-col justify-between bg-[radial-gradient(circle_at_20%_20%,#ffd0d2,transparent_28%),linear-gradient(135deg,#ffffff,#f2f4f6)] p-8'>
                    <span className='font-display text-[12px] font-bold uppercase tracking-[0.08em] text-secondary'>
                      {selectedProject.source} / {selectedProject.visibility}
                    </span>
                    <span className='font-display text-[64px] font-bold leading-none text-on-surface'>
                      {selectedProject.title}
                    </span>
                    <span className='font-display text-[14px] font-bold text-secondary'>
                      {selectedProject.repository}
                    </span>
                  </div>
                )}
              </div>
              {selectedProject.descriptionMarkdown && (
                <div
                  className='prose-markdown border-t border-surface-border p-5 text-secondary'
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(selectedProject.descriptionMarkdown),
                  }}
                />
              )}
              <div className='grid gap-4 border-t border-surface-border p-5 text-secondary sm:grid-cols-3'>
                <div>
                  <p className='font-display text-[11px] font-bold uppercase leading-none text-secondary'>
                    Created
                  </p>
                  <p className='mt-2 font-display text-[14px] font-bold text-on-surface'>
                    {new Date(selectedProject.createdAt).getFullYear()}
                  </p>
                </div>
                <div>
                  <p className='font-display text-[11px] font-bold uppercase leading-none text-secondary'>
                    Size
                  </p>
                  <p className='mt-2 font-display text-[14px] font-bold text-on-surface'>
                    {selectedProject.sizeKb.toLocaleString()} KB
                  </p>
                </div>
                <div>
                  <p className='font-display text-[11px] font-bold uppercase leading-none text-secondary'>
                    Source
                  </p>
                  <a
                    className='mt-2 inline-flex font-display text-[14px] font-bold text-primary hover:text-slate-900'
                    href={selectedProject.url}
                    rel='noreferrer'
                    target='_blank'>
                    Open repository
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
