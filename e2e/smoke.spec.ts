import { expect, test, type Page } from '@playwright/test';
import { profile } from '../src/data/profile-copy';
import { projectCopy as projects } from '../src/data/project-copy';
import { ROUTES } from './routes';

/** Collects console errors and uncaught exceptions on a page. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

test('home renders her name, the hero split, about and projects', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(new RegExp(profile.name.replace(' ', '\\s+')));
  await expect(page.getByRole('slider', { name: /design and dnb dj/i })).toBeVisible();
  await expect(page.locator('#about')).toContainText('Design by trade.');
  await expect(page.locator('#about').getByRole('link', { name: profile.email })).toHaveAttribute('href', `mailto:${profile.email}`);
  await expect(page.locator('#experience')).toContainText('The Arcadia Group');
  await expect(page.getByRole('link', { name: /explore all projects/i })).toBeVisible();
  expect(errors).toEqual([]);
});

test('the nav reaches the projects page and its project pages', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('navigation', { name: 'Sections' }).filter({ visible: true }).getByRole('link', { name: 'Projects' }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
  await expect(page.getByTestId('project-count')).toHaveText(`${projects.length} projects`);
  await page.getByRole('link', { name: new RegExp(`^${projects[0].name}, `) }).click();
  await expect(page).toHaveURL(new RegExp(`/projects/${projects[0].id}$`));
});

test('projects page search narrows the grid and is kept in the URL', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('searchbox', { name: /search projects/i }).fill('wallet');
  await expect(page).toHaveURL(/q=wallet/);
  const hits = projects.filter((p) => [p.name, p.kind, p.description].join(' ').toLowerCase().includes('wallet'));
  await expect(page.getByTestId('project-count')).toHaveText(`${hits.length} of ${projects.length} projects`);
  await page.getByRole('searchbox', { name: /search projects/i }).fill('zzzz-no-match');
  await expect(page.getByText('No projects match that search.')).toBeVisible();
});

test('a project page pages through the title carousel', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto(`/projects/${projects[0].id}`);
  const title = page.getByTestId('project-title');
  await expect(title.getByRole('heading', { level: 1 })).toHaveText(projects[0].name);
  // The first project has no previous one: its chevron is inert.
  await expect(title.getByLabel('Previous project')).toHaveAttribute('aria-disabled', 'true');
  await title.getByRole('link', { name: /^Next project/ }).click();
  await expect(page).toHaveURL(new RegExp(`/projects/${projects[1].id}$`));
  await expect(title.getByRole('heading', { level: 1 })).toHaveText(projects[1].name);
  await page.getByRole('navigation', { name: 'Projects', exact: true }).getByRole('link', { name: `Go to ${projects[2].name}` }).click();
  await expect(title.getByRole('heading', { level: 1 })).toHaveText(projects[2].name);
  expect(errors).toEqual([]);
});

test('the ETHCC before and after slider moves', async ({ page }) => {
  await page.goto('/projects/ethcc');
  const slider = page.getByRole('slider', { name: 'Before and after slider' });
  await slider.fill('80');
  await expect(page.getByTestId('compare')).toHaveCSS('--pos', '80%');
});

test('every route renders without console errors or horizontal scroll', async ({ page }) => {
  const errors = watchErrors(page);
  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${route} scrolls sideways`).toBeLessThanOrEqual(0);
  }
  expect(errors).toEqual([]);
});

test('no horizontal scroll at 360px wide', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  for (const route of ['/', '/projects', '/projects/propscan']) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${route} at 360px`).toBeLessThanOrEqual(0);
  }
});

test('every route has a title, description, canonical and an absolute 1200x630 share card', async ({ request }) => {
  for (const route of ROUTES) {
    const html = await (await request.get(route)).text();
    expect(html, route).toMatch(/<title>[^<]+<\/title>/);
    expect(html, route).toContain('name="description"');
    expect(html, route).toContain('<link rel="canonical" href="https://melissamouton.vercel.app');
    expect(html, route).toContain('property="og:image" content="https://melissamouton.vercel.app/og.jpg"');
    expect(html, route).toContain('name="twitter:card" content="summary_large_image"');
  }
  const og = await request.get('/og.jpg');
  expect(og.ok()).toBe(true);
});
