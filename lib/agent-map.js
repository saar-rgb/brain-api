// Agent-to-files mapping
// Each agent lists the files it needs at session start
// Paths are relative to the GitHub repo root (saar-rgb/claude-memory)
// Entries ending with / mean "all .md files in that directory"

const SHARED = [
  'agents/agent-thinking-principles.md',
];

const AGENT_MAP = {
  shira: {
    name: 'Shira — Brief Copywriter',
    files: [
      ...SHARED,
      'agents/shira-brief-copywriter.md',
      'agents/shira-brief-copywriter-lessons.md',
      'brain/copywriting/',
      'brain/creative/creative-board-workflow.md',
      'feedback_copywriting_briefs.md',
    ],
  },

  gal: {
    name: 'Gal — Static Ad Designer',
    files: [
      ...SHARED,
      'agents/gal-static-ad-designer.md',
      'agents/gal-static-ad-designer-lessons.md',
      'brain/creative/playbook.md',
      'brain/creative/hebrew-image-typography.md',
      'brain/creative/meta-ad-format-specs.md',
      'brain/creative/concept-rules-before-after.md',
      'brain/creative/concept-rules-benefits.md',
      'brain/creative/concept-rules-pointout.md',
      'brain/creative/concept-rules-pov.md',
      'brain/creative/concept-rules-story-testimonial.md',
      'brain/creative/concept-rules-us-vs-them.md',
      'brain/creative/foreplay-reference-system.md',
      'brain/creative/whitelisting-native-ads.md',
      'brain/creative/native-looking-realistic.md',
      'brain/media/meta.md',
      'integrations/foreplay.md',
    ],
  },

  dana: {
    name: 'Dana — Pre-Lander Builder',
    files: [
      ...SHARED,
      'agents/dana-prelander-builder.md',
      'agents/dana-prelander-builder-lessons.md',
      'brain/creative/playbook.md',
      'feedback_design_preferences.md',
      'feedback_no_hover_animations.md',
      'projects/listicle-system.md',
    ],
  },

  noa: {
    name: 'Noa — Landing Page Designer',
    files: [
      ...SHARED,
      'agents/noa-landing-page-designer.md',
      'agents/noa-landing-page-designer-lessons.md',
      'brain/creative/design-thinking-framework.md',
      'brain/creative/landing-page-anatomy.md',
      'brain/creative/design-patterns-why.md',
      'brain/creative/hebrew-design-system.md',
      'feedback_design_preferences.md',
    ],
  },

  tal: {
    name: 'Tal — Consumer Intelligence Researcher',
    files: [
      ...SHARED,
      'agents/tal-consumer-intelligence-researcher.md',
      'agents/tal-consumer-intelligence-researcher-lessons.md',
      'agents/tal-research-pipeline.md',
      'integrations/foreplay.md',
      'integrations/apify.md',
      'brain/creative/playbook.md',
      'brain/media/playbook.md',
    ],
  },

  neil: {
    name: 'Neil — Creative Strategist',
    files: [
      ...SHARED,
      'agents/neil-creative-strategist.md',
      'agents/neil-creative-strategist-lessons.md',
      'brain/creative/playbook.md',
      'brain/media/playbook.md',
      'integrations/foreplay.md',
      'projects/creative-board.md',
    ],
  },

  // Lite Neil for the per-launch classification task only.
  // Replaces the 7-file full Neil with 3 focused files (~3K words vs ~19K).
  // Used by claude-neil.js when NEIL_BRAIN_VARIANT=lite.
  'neil-lite': {
    name: 'Neil — Classification Lite',
    files: [
      ...SHARED,
      'agents/neil-lite-classifier.md',
      'brain/creative/persona-pain-angle-sop.md',
    ],
  },

  ido: {
    name: 'Ido — Junior Meta Media Buyer',
    files: [
      ...SHARED,
      'agents/junior-meta-media-buyer.md',
      'agents/junior-meta-media-buyer-lessons.md',
      'agents/junior-meta-ads-memory.md',
      'agents/active-client-verification.md',
      'brain/media/meta.md',
      'brain/media/playbook.md',
      'integrations/monday.md',
      'integrations/ad-action-log.md',
      'projects/creative-board.md',
    ],
  },

  cto: {
    name: 'Alex — CTO',
    files: [
      ...SHARED,
      'agents/cto.md',
      'agents/cto-lessons.md',
      'agents/agent-architecture.md',
      'agents/agent-roles-plan.md',
      'agents/feedback-loop-methodology.md',
    ],
  },

  cfo: {
    name: 'Sharon — CFO',
    files: [
      ...SHARED,
      'agents/cfo.md',
      'agents/cfo-lessons.md',
      'brain/finance/playbook.md',
    ],
  },

  'cfo-auditor': {
    name: 'CFO Auditor',
    files: [
      ...SHARED,
      'agents/cfo-auditor.md',
      'agents/cfo-auditor-lessons.md',
    ],
  },

  cmo: {
    name: 'Lior — CMO',
    files: [
      ...SHARED,
      'agents/cmo.md',
      'agents/cmo-lessons.md',
      'brain/bellapoint-marketing/',
      'brain/company/playbook.md',
      'brain/creative/playbook.md',
    ],
  },

  coo: {
    name: 'Sharon — COO',
    files: [
      ...SHARED,
      'agents/coo-operations-manager.md',
      'agents/coo-operations-manager-lessons.md',
      'agents/agent-roster.md',
      'brain/company/playbook.md',
      'brain/company/ai-agents-roadmap.md',
      'brain/operations/client-onboarding.md',
      'brain/operations/client-offboarding.md',
      'integrations/monday.md',
      'projects/creative-board.md',
    ],
  },

  // Advertorial system — generates Hebrew landing pages
  advertorial: {
    name: 'Advertorial Generator',
    files: [
      ...SHARED,
      'brain/creative/playbook.md',
      'brain/creative/landing-page-anatomy.md',
      'brain/creative/hebrew-design-system.md',
      'brain/copywriting/',
      'feedback_design_preferences.md',
      'feedback_copywriting_briefs.md',
    ],
  },

  // Meeting formatter
  meetings: {
    name: 'Meeting Formatter',
    files: [
      'integrations/monday.md',
    ],
  },
};

// Get list of all known agent names
function getAgentNames() {
  return Object.keys(AGENT_MAP);
}

// Get file list for an agent
function getAgentFiles(agentName) {
  const agent = AGENT_MAP[agentName];
  if (!agent) return null;
  return { name: agent.name, files: agent.files };
}

module.exports = { AGENT_MAP, getAgentNames, getAgentFiles };
