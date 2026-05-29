const STORAGE_KEY = 'portfolio-web-content';

function cloneContent(content) {
  return JSON.parse(JSON.stringify(content));
}

function projectKey(project) {
  return project.repository || project.title;
}

function mergeProjects(defaultProjects, storedProjects = []) {
  const storedByKey = new Map(
    storedProjects.map((project) => [projectKey(project), project])
  );
  const mergedDefaults = defaultProjects.map((project) => ({
    ...project,
    ...(storedByKey.get(projectKey(project)) || {}),
  }));
  const defaultKeys = new Set(defaultProjects.map(projectKey));
  const customProjects = storedProjects.filter(
    (project) => !defaultKeys.has(projectKey(project))
  );

  return [...mergedDefaults, ...customProjects];
}

function mergeContent(defaultContent, storedContent) {
  const defaults = cloneContent(defaultContent);

  return {
    ...defaults,
    ...storedContent,
    projects: mergeProjects(defaults.projects, storedContent.projects),
  };
}

function loadStoredContent(defaultContent) {
  if (typeof window === 'undefined') {
    return defaultContent;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultContent;

    return mergeContent(defaultContent, JSON.parse(stored));
  } catch {
    return defaultContent;
  }
}

function saveStoredContent(content) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

function clearStoredContent() {
  window.localStorage.removeItem(STORAGE_KEY);
}

module.exports = {
  STORAGE_KEY,
  clearStoredContent,
  cloneContent,
  loadStoredContent,
  mergeContent,
  saveStoredContent,
};
