import photo from '@/assets/img/melissa.webp';
import { profile as copy } from './profile-copy';

export { EDUCATION, EXPERIENCE, HERO, SIDES } from './profile-copy';
export type { EducationEntry, ExperienceEntry, RoleEntry } from './profile-copy';

export const profile = { ...copy, photo } as const;
