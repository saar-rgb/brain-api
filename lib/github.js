// GitHub API client with in-memory caching
// Fetches files from saar-rgb/claude-memory repo

const REPO = process.env.GITHUB_REPO || 'saar-rgb/claude-memory';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

// In-memory cache — survives across warm function invocations
const cache = {
  tree: null,
  treeExpiry: 0,
  files: new Map(),
};

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Fetch headers
function headers() {
  const h = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'brain-api',
  };
  if (GITHUB_TOKEN) {
    h['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  return h;
}

// Get full repo tree (all file paths) — cached
async function getRepoTree() {
  if (cache.tree && Date.now() < cache.treeExpiry) {
    return cache.tree;
  }

  const url = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`;
  const res = await fetch(url, { headers: headers() });

  if (!res.ok) {
    throw new Error(`GitHub tree fetch failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  // Only keep .md file paths
  const paths = data.tree
    .filter(item => item.type === 'blob' && item.path.endsWith('.md'))
    .map(item => item.path);

  cache.tree = paths;
  cache.treeExpiry = Date.now() + CACHE_TTL;
  return paths;
}

// Get single file content — cached
async function getFileContent(path) {
  const cached = cache.files.get(path);
  if (cached && Date.now() < cached.expiry) {
    return cached.content;
  }

  const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${encodeURIComponent(path)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'brain-api' },
  });

  if (!res.ok) {
    console.warn(`Failed to fetch ${path}: ${res.status}`);
    return null;
  }

  const content = await res.text();
  cache.files.set(path, { content, expiry: Date.now() + CACHE_TTL });
  return content;
}

// Resolve file list — expand directory paths (ending with /) to all .md files in that dir
async function resolveFiles(filePaths) {
  const tree = await getRepoTree();
  const resolved = [];

  for (const path of filePaths) {
    if (path.endsWith('/')) {
      // Directory — find all .md files in it
      const dirFiles = tree.filter(f => f.startsWith(path) && !f.slice(path.length).includes('/'));
      resolved.push(...dirFiles);
    } else {
      // Single file
      if (tree.includes(path)) {
        resolved.push(path);
      } else {
        console.warn(`File not found in repo: ${path}`);
      }
    }
  }

  // Deduplicate
  return [...new Set(resolved)];
}

// Fetch all files and concatenate
async function fetchAndConcat(filePaths) {
  const resolved = await resolveFiles(filePaths);
  const results = await Promise.all(
    resolved.map(async (path) => {
      const content = await getFileContent(path);
      if (!content) return null;
      return { path, content };
    })
  );

  return results.filter(Boolean);
}

module.exports = { getRepoTree, getFileContent, resolveFiles, fetchAndConcat };
