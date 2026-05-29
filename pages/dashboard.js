import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  AiOutlineDelete,
  AiOutlineDownload,
  AiOutlineEye,
  AiOutlinePlus,
  AiOutlineSave,
  AiOutlineUndo,
} from 'react-icons/ai';
import { defaultPortfolioContent } from '../lib/portfolio-content';
import {
  clearStoredContent,
  cloneContent,
  loadStoredContent,
  saveStoredContent,
} from '../lib/portfolio-editor';
import { markdownToHtml } from '../lib/markdown';

function Field({ label, children }) {
  return (
    <label className='grid gap-2'>
      <span className='font-display text-[12px] font-bold uppercase leading-none text-secondary'>
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className='min-h-[44px] rounded-md border border-surface-border bg-white px-3 font-body text-[15px] text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10'
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className='min-h-[120px] resize-y rounded-md border border-surface-border bg-white px-3 py-3 font-body text-[15px] leading-relaxed text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10'
    />
  );
}

function Section({ title, children }) {
  return (
    <section className='rounded-lg border border-surface-border bg-surface p-6 shadow-ambient'>
      <h2 className='font-display text-[24px] font-bold leading-tight text-on-surface'>
        {title}
      </h2>
      <div className='mt-6 grid gap-4'>{children}</div>
    </section>
  );
}

function updateArrayItem(items, index, patch) {
  return items.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item
  );
}

function updateNestedArrayItem(items, index, childKey, childIndex, patch) {
  return items.map((item, itemIndex) => {
    if (itemIndex !== index) return item;

    return {
      ...item,
      [childKey]: updateArrayItem(item[childKey], childIndex, patch),
    };
  });
}

export default function Dashboard() {
  const [content, setContent] = useState(defaultPortfolioContent);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [savedAt, setSavedAt] = useState('');
  const selectedProject = content.projects[selectedProjectIndex];
  const summary = useMemo(
    () =>
      content.projects.reduce(
        (totals, project) => {
          totals.total += 1;
          totals[project.visibility] = (totals[project.visibility] || 0) + 1;
          return totals;
        },
        { total: 0, public: 0, private: 0 }
      ),
    [content.projects]
  );

  useEffect(() => {
    setContent(loadStoredContent(defaultPortfolioContent));
  }, []);

  function saveContent() {
    saveStoredContent(content);
    setSavedAt(new Date().toLocaleTimeString());
  }

  function resetContent() {
    clearStoredContent();
    setContent(cloneContent(defaultPortfolioContent));
    setSelectedProjectIndex(0);
    setSavedAt('reset');
  }

  function addProject() {
    const nextProject = {
      title: 'New Project',
      category: 'Web Application',
      image: '',
      descriptionMarkdown:
        '## Overview\n\nWrite the project summary here.\n\n## Highlights\n\n- Add a key outcome\n- Add the stack or role',
      source: 'Manual',
      visibility: 'public',
      owner: 'Sitouxz',
      repository: 'Sitouxz/new-project',
      defaultBranch: 'main',
      sizeKb: 0,
      createdAt: new Date().toISOString(),
      url: 'https://github.com/Sitouxz',
    };

    setContent((current) => ({
      ...current,
      projects: [...current.projects, nextProject],
    }));
    setSelectedProjectIndex(content.projects.length);
  }

  function updateProject(patch) {
    setContent((current) => ({
      ...current,
      projects: updateArrayItem(current.projects, selectedProjectIndex, patch),
    }));
  }

  function deleteProject() {
    setContent((current) => {
      const projects = current.projects.filter(
        (_, index) => index !== selectedProjectIndex
      );
      return { ...current, projects };
    });
    setSelectedProjectIndex(Math.max(0, selectedProjectIndex - 1));
  }

  return (
    <>
      <Head>
        <title>Portfolio Dashboard</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      <main className='min-h-screen bg-background px-6 py-8 font-body text-on-background'>
        <div className='mx-auto max-w-container'>
          <header className='flex flex-col gap-5 border-b border-surface-border pb-6 md:flex-row md:items-center md:justify-between'>
            <div>
              <h1 className='font-display text-[40px] font-bold leading-tight text-on-surface'>
                Portfolio Dashboard
              </h1>
              <p className='mt-2 max-w-2xl text-secondary'>
                Manage homepage copy, contact details, social links, info cards, and
                Markdown project descriptions.
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Link
                className='inline-flex items-center gap-2 rounded-md border border-surface-border bg-white px-4 py-3 font-display text-[12px] font-bold leading-none text-secondary'
                href='/'>
                <AiOutlineEye /> View
              </Link>
              <button
                className='inline-flex items-center gap-2 rounded-md border border-surface-border bg-white px-4 py-3 font-display text-[12px] font-bold leading-none text-secondary'
                onClick={resetContent}
                type='button'>
                <AiOutlineUndo /> Reset
              </button>
              <button
                className='inline-flex items-center gap-2 rounded-md bg-primary-container px-4 py-3 font-display text-[12px] font-bold leading-none text-on-primary'
                onClick={saveContent}
                type='button'>
                <AiOutlineSave /> Save
              </button>
            </div>
          </header>

          <div className='mt-6 grid gap-3 md:grid-cols-4'>
            <div className='rounded-lg border border-surface-border bg-white p-4'>
              <p className='font-display text-[12px] font-bold uppercase text-secondary'>
                Projects
              </p>
              <p className='mt-2 font-display text-[28px] font-bold'>
                {summary.total}
              </p>
            </div>
            <div className='rounded-lg border border-surface-border bg-white p-4'>
              <p className='font-display text-[12px] font-bold uppercase text-secondary'>
                Public
              </p>
              <p className='mt-2 font-display text-[28px] font-bold'>
                {summary.public || 0}
              </p>
            </div>
            <div className='rounded-lg border border-surface-border bg-white p-4'>
              <p className='font-display text-[12px] font-bold uppercase text-secondary'>
                Private
              </p>
              <p className='mt-2 font-display text-[28px] font-bold text-primary'>
                {summary.private || 0}
              </p>
            </div>
            <div className='rounded-lg border border-surface-border bg-white p-4'>
              <p className='font-display text-[12px] font-bold uppercase text-secondary'>
                Status
              </p>
              <p className='mt-2 font-display text-[18px] font-bold'>
                {savedAt ? `Saved ${savedAt}` : 'Unsaved'}
              </p>
            </div>
          </div>

          <div className='mt-8 grid gap-8 lg:grid-cols-[360px_1fr]'>
            <div className='grid content-start gap-6'>
              <Section title='Hero'>
                <Field label='Name'>
                  <TextInput
                    value={content.hero.name}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, name: event.target.value },
                      })
                    }
                  />
                </Field>
                <Field label='Title'>
                  <TextInput
                    value={content.hero.title}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, title: event.target.value },
                      })
                    }
                  />
                </Field>
                <Field label='Intro'>
                  <TextArea
                    value={content.hero.intro}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, intro: event.target.value },
                      })
                    }
                  />
                </Field>
              </Section>

              <Section title='Social Links'>
                {content.socialLinks.map((link, index) => (
                  <div
                    className='grid gap-3 rounded-md border border-surface-border bg-white p-4'
                    key={`${link.label}-${index}`}>
                    <Field label='Label'>
                      <TextInput
                        value={link.label}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            socialLinks: updateArrayItem(
                              content.socialLinks,
                              index,
                              { label: event.target.value }
                            ),
                          })
                        }
                      />
                    </Field>
                    <Field label='URL'>
                      <TextInput
                        value={link.href}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            socialLinks: updateArrayItem(
                              content.socialLinks,
                              index,
                              { href: event.target.value }
                            ),
                          })
                        }
                      />
                    </Field>
                  </div>
                ))}
              </Section>

              <Section title='Contact'>
                <Field label='Heading'>
                  <TextInput
                    value={content.contact.heading}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        contact: {
                          ...content.contact,
                          heading: event.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label='Body'>
                  <TextArea
                    value={content.contact.body}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, body: event.target.value },
                      })
                    }
                  />
                </Field>
                <Field label='Email'>
                  <TextInput
                    value={content.contact.email}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        contact: {
                          ...content.contact,
                          email: event.target.value,
                        },
                      })
                    }
                  />
                </Field>
              </Section>
            </div>

            <div className='grid gap-6'>
              <Section title='Homepage Cards'>
                {content.detailCards.map((card, cardIndex) => (
                  <div
                    className='grid gap-4 rounded-md border border-surface-border bg-white p-4'
                    key={`${card.title}-${cardIndex}`}>
                    <Field label='Card title'>
                      <TextInput
                        value={card.title}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            detailCards: updateArrayItem(
                              content.detailCards,
                              cardIndex,
                              { title: event.target.value }
                            ),
                          })
                        }
                      />
                    </Field>
                    <div className='grid gap-3 md:grid-cols-2'>
                      {card.items.map((item, itemIndex) => (
                        <Field
                          key={`${card.title}-${itemIndex}`}
                          label={`Item ${itemIndex + 1}`}>
                          <TextArea
                            value={item.text}
                            onChange={(event) =>
                              setContent({
                                ...content,
                                detailCards: updateNestedArrayItem(
                                  content.detailCards,
                                  cardIndex,
                                  'items',
                                  itemIndex,
                                  { text: event.target.value }
                                ),
                              })
                            }
                          />
                        </Field>
                      ))}
                    </div>
                  </div>
                ))}
              </Section>

              <Section title='Projects'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                  <select
                    className='min-h-[44px] flex-1 rounded-md border border-surface-border bg-white px-3 font-body text-[15px] text-on-surface outline-none'
                    onChange={(event) =>
                      setSelectedProjectIndex(Number(event.target.value))
                    }
                    value={selectedProjectIndex}>
                    {content.projects.map((project, index) => (
                      <option key={`${project.title}-${index}`} value={index}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                  <button
                    className='inline-flex items-center gap-2 rounded-md border border-surface-border bg-white px-4 py-3 font-display text-[12px] font-bold leading-none text-secondary'
                    onClick={addProject}
                    type='button'>
                    <AiOutlinePlus /> Add
                  </button>
                  <button
                    className='inline-flex items-center gap-2 rounded-md border border-surface-border bg-white px-4 py-3 font-display text-[12px] font-bold leading-none text-primary'
                    disabled={!selectedProject}
                    onClick={deleteProject}
                    type='button'>
                    <AiOutlineDelete /> Delete
                  </button>
                </div>

                {selectedProject && (
                  <div className='grid gap-5'>
                    <div className='grid gap-4 md:grid-cols-2'>
                      <Field label='Title'>
                        <TextInput
                          value={selectedProject.title}
                          onChange={(event) =>
                            updateProject({ title: event.target.value })
                          }
                        />
                      </Field>
                      <Field label='Category'>
                        <TextInput
                          value={selectedProject.category}
                          onChange={(event) =>
                            updateProject({ category: event.target.value })
                          }
                        />
                      </Field>
                      <Field label='Image path'>
                        <TextInput
                          placeholder='/project-screenshots/example.png'
                          value={selectedProject.image || ''}
                          onChange={(event) =>
                            updateProject({ image: event.target.value })
                          }
                        />
                      </Field>
                      <Field label='Visibility'>
                        <select
                          className='min-h-[44px] rounded-md border border-surface-border bg-white px-3 font-body text-[15px] text-on-surface outline-none'
                          value={selectedProject.visibility}
                          onChange={(event) =>
                            updateProject({ visibility: event.target.value })
                          }>
                          <option value='public'>public</option>
                          <option value='private'>private</option>
                        </select>
                      </Field>
                      <Field label='Repository URL'>
                        <TextInput
                          value={selectedProject.url}
                          onChange={(event) =>
                            updateProject({ url: event.target.value })
                          }
                        />
                      </Field>
                      <Field label='Default branch'>
                        <TextInput
                          value={selectedProject.defaultBranch}
                          onChange={(event) =>
                            updateProject({ defaultBranch: event.target.value })
                          }
                        />
                      </Field>
                    </div>

                    <div className='grid gap-4 xl:grid-cols-2'>
                      <Field label='Markdown description'>
                        <TextArea
                          value={selectedProject.descriptionMarkdown || ''}
                          onChange={(event) =>
                            updateProject({
                              descriptionMarkdown: event.target.value,
                            })
                          }
                        />
                      </Field>
                      <div className='rounded-md border border-surface-border bg-white p-4'>
                        <div className='mb-3 flex items-center justify-between'>
                          <p className='font-display text-[12px] font-bold uppercase text-secondary'>
                            Markdown preview
                          </p>
                          <AiOutlineDownload className='text-secondary' />
                        </div>
                        <div
                          className='prose-markdown'
                          dangerouslySetInnerHTML={{
                            __html: markdownToHtml(
                              selectedProject.descriptionMarkdown
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
