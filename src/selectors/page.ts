import { RootState } from '@/store';
import { PageViewport } from '@/types';

export const getPageViewport = (state: RootState): PageViewport => state.page.pageViewport;
