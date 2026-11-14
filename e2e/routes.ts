import { projectCopy as projects } from '../src/data/project-copy';

/** Every route the site serves: the home page, the projects page and a page per project. */
export const ROUTES = ['/', '/projects', ...projects.map((p) => `/projects/${p.id}`)];
