const { getAgentNames, getAgentFiles } = require('../lib/agent-map');
const { fetchAndConcat, getRepoTree } = require('../lib/github');

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { agent, format, file } = req.query;

  // GET /api/brain — no params — list available agents
  if (!agent && !file) {
    const agents = getAgentNames().map(name => {
      const info = getAgentFiles(name);
      return { id: name, name: info.name, fileCount: info.files.length };
    });
    return res.status(200).json({
      agents,
      usage: 'GET /api/brain?agent=shira — returns Shira\'s full context as text',
      formats: 'Add &format=json for structured output, &format=list for file paths only',
    });
  }

  // GET /api/brain?file=agents/shira-brief-copywriter.md — single file
  if (file) {
    const results = await fetchAndConcat([file]);
    if (results.length === 0) {
      return res.status(404).json({ error: `File not found: ${file}` });
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(results[0].content);
  }

  // GET /api/brain?agent=shira
  const agentInfo = getAgentFiles(agent);
  if (!agentInfo) {
    return res.status(404).json({
      error: `Unknown agent: ${agent}`,
      available: getAgentNames(),
    });
  }

  try {
    const results = await fetchAndConcat(agentInfo.files);

    // Estimate tokens (~4 chars per token for English/Hebrew mix)
    const totalChars = results.reduce((sum, r) => sum + r.content.length, 0);
    const estimatedTokens = Math.ceil(totalChars / 3.5);

    res.setHeader('X-Agent', agentInfo.name.replace(/[^\x20-\x7E]/g, '-'));
    res.setHeader('X-File-Count', results.length.toString());
    res.setHeader('X-Estimated-Tokens', estimatedTokens.toString());

    // Format: list — just file paths
    if (format === 'list') {
      return res.status(200).json({
        agent: agent,
        name: agentInfo.name,
        fileCount: results.length,
        estimatedTokens,
        files: results.map(r => r.path),
      });
    }

    // Format: json — structured with file contents
    if (format === 'json') {
      return res.status(200).json({
        agent: agent,
        name: agentInfo.name,
        fileCount: results.length,
        estimatedTokens,
        files: results.map(r => ({ path: r.path, content: r.content })),
      });
    }

    // Default: plain text — concatenated with headers, ready for system prompt
    const text = results.map(r => {
      return `\n${'='.repeat(60)}\n📄 ${r.path}\n${'='.repeat(60)}\n\n${r.content}`;
    }).join('\n');

    const header = `# Agent Context: ${agentInfo.name}\n# Files: ${results.length} | Estimated tokens: ${estimatedTokens}\n# Source: github.com/saar-rgb/claude-memory (auto-synced)\n`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(header + text);

  } catch (err) {
    console.error('Brain API error:', err);
    return res.status(500).json({ error: err.message });
  }
};
