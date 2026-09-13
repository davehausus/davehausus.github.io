import type { PaginateFunction } from 'astro';
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { WorkItem, Taxonomy } from '~/types';
import { APP_WORK } from 'astrowind:config';
import { cleanSlug, trimSlash, WORK_BASE, WORK_PERMALINK_PATTERN, WORK_CATEGORY_BASE, WORK_TAG_BASE } from './permalinks';

const generatePermalink = async ({
  id,
  slug,
  publishDate,
  category,
}: {
  id: string;
  slug: string;
  publishDate: Date;
  category: string | undefined;
}) => {
  const year = String(publishDate.getFullYear()).padStart(4, '0');
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');
  const hour = String(publishDate.getHours()).padStart(2, '0');
  const minute = String(publishDate.getMinutes()).padStart(2, '0');
  const second = String(publishDate.getSeconds()).padStart(2, '0');

  const permalink = WORK_PERMALINK_PATTERN.replace('%slug%', slug)
    .replace('%id%', id)
    .replace('%category%', category || '')
    .replace('%year%', year)
    .replace('%month%', month)
    .replace('%day%', day)
    .replace('%hour%', hour)
    .replace('%minute%', minute)
    .replace('%second%', second);

  return permalink
    .split('/')
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
};

const getNormalizedWork = async (work: CollectionEntry<'work'>): Promise<WorkItem> => {
  const { id, data } = work;
  const { Content, remarkPluginFrontmatter } = await render(work);

  const {
    publishDate: rawPublishDate = new Date(),
    updateDate: rawUpdateDate,
    title,
    excerpt,
    image,
    client,
    role,
    services,
    duration,
    projectUrl,
    tags: rawTags = [],
    category: rawCategory,
    draft = false,
    metadata = {},
  } = data;

  const slug = cleanSlug(id);
  const publishDate = new Date(rawPublishDate);
  const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;

  const category = rawCategory
    ? {
        slug: cleanSlug(rawCategory),
        title: rawCategory,
      }
    : undefined;

  const tags = rawTags.map((tag: string) => ({
    slug: cleanSlug(tag),
    title: tag,
  }));

  return {
    id: id,
    slug: slug,
    permalink: await generatePermalink({ id, slug, publishDate, category: category?.slug }),

    publishDate: publishDate,
    updateDate: updateDate,

    title: title,
    excerpt: excerpt,
    image: image,

    client: client,
    role: role,
    services: services,
    duration: duration,
    projectUrl: projectUrl,

    category: category,
    tags: tags,

    draft: draft,

    metadata,

    Content: Content,

    readingTime: remarkPluginFrontmatter?.readingTime,
  };
};

const load = async function (): Promise<Array<WorkItem>> {
  const items = await getCollection('work');
  const normalizedItems = items.map(async (item) => await getNormalizedWork(item));

  const results = (await Promise.all(normalizedItems))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .filter((item) => !item.draft);

  return results;
};

let _work: Array<WorkItem>;

/** */
export const isWorkEnabled = APP_WORK.isEnabled;
export const isRelatedWorkEnabled = APP_WORK.isRelatedPostsEnabled;
export const isWorkListRouteEnabled = APP_WORK.list.isEnabled;
export const isWorkPostRouteEnabled = APP_WORK.post.isEnabled;
export const isWorkCategoryRouteEnabled = APP_WORK.category.isEnabled;
export const isWorkTagRouteEnabled = APP_WORK.tag.isEnabled;

export const workListRobots = APP_WORK.list.robots;
export const workPostRobots = APP_WORK.post.robots;
export const workCategoryRobots = APP_WORK.category.robots;
export const workTagRobots = APP_WORK.tag.robots;

export const workItemsPerPage = APP_WORK?.postsPerPage;

/** */
export const fetchWork = async (): Promise<Array<WorkItem>> => {
  if (!_work) {
    _work = await load();
  }

  return _work;
};

/** */
export const findWorkBySlugs = async (slugs: Array<string>): Promise<Array<WorkItem>> => {
  if (!Array.isArray(slugs)) return [];

  const items = await fetchWork();

  return slugs.reduce(function (r: Array<WorkItem>, slug: string) {
    items.some(function (item: WorkItem) {
      return slug === item.slug && r.push(item);
    });
    return r;
  }, []);
};

/** */
export const findLatestWork = async ({ count }: { count?: number }): Promise<Array<WorkItem>> => {
  const _count = count || 4;
  const items = await fetchWork();

  return items ? items.slice(0, _count) : [];
};

/** */
export const getStaticPathsWorkList = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isWorkEnabled || !isWorkListRouteEnabled) return [];
  return paginate(await fetchWork(), {
    params: { work: WORK_BASE || undefined },
    pageSize: workItemsPerPage,
  });
};

/** */
export const getStaticPathsWorkPost = async () => {
  if (!isWorkEnabled || !isWorkPostRouteEnabled) return [];
  return (await fetchWork()).flatMap((item) => ({
    params: {
      work: item.permalink,
    },
    props: { post: item },
  }));
};

/** */
export const getStaticPathsWorkCategory = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isWorkEnabled || !isWorkCategoryRouteEnabled) return [];

  const items = await fetchWork();
  const categories: Record<string, Taxonomy> = {};
  items.map((item) => {
    if (item.category?.slug) {
      categories[item.category.slug] = item.category;
    }
  });

  return Array.from(Object.keys(categories)).flatMap((categorySlug) =>
    paginate(
      items.filter((item) => item.category?.slug && categorySlug === item.category?.slug),
      {
        params: { category: categorySlug, work: WORK_CATEGORY_BASE || undefined },
        pageSize: workItemsPerPage,
        props: { category: categories[categorySlug] },
      }
    )
  );
};

/** */
export const getStaticPathsWorkTag = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isWorkEnabled || !isWorkTagRouteEnabled) return [];

  const items = await fetchWork();
  const tags: Record<string, Taxonomy> = {};
  items.map((item) => {
    if (Array.isArray(item.tags)) {
      item.tags.map((tag) => {
        tags[tag.slug] = tag;
      });
    }
  });

  return Array.from(Object.keys(tags)).flatMap((tagSlug) =>
    paginate(
      items.filter((item) => Array.isArray(item.tags) && item.tags.find((elem) => elem.slug === tagSlug)),
      {
        params: { tag: tagSlug, work: WORK_TAG_BASE || undefined },
        pageSize: workItemsPerPage,
        props: { tag: tags[tagSlug] },
      }
    )
  );
};

/** */
export async function getRelatedWork(originalItem: WorkItem, maxResults: number = 4): Promise<WorkItem[]> {
  const allItems = await fetchWork();
  const originalTagsSet = new Set(originalItem.tags ? originalItem.tags.map((tag) => tag.slug) : []);

  const itemsWithScores = allItems.reduce((acc: { post: WorkItem; score: number }[], iteratedItem: WorkItem) => {
    if (iteratedItem.slug === originalItem.slug) return acc;

    let score = 0;
    if (iteratedItem.category && originalItem.category && iteratedItem.category.slug === originalItem.category.slug) {
      score += 5;
    }

    if (iteratedItem.tags) {
      iteratedItem.tags.forEach((tag) => {
        if (originalTagsSet.has(tag.slug)) {
          score += 1;
        }
      });
    }

    acc.push({ post: iteratedItem, score });
    return acc;
  }, []);

  itemsWithScores.sort((a, b) => b.score - a.score);

  const selectedItems: WorkItem[] = [];
  let i = 0;
  while (selectedItems.length < maxResults && i < itemsWithScores.length) {
    selectedItems.push(itemsWithScores[i].post);
    i++;
  }

  return selectedItems;
}