export const DEFAULTS = {
  config: {
    executionMode: 'review',
    dailyTarget: 150,
    discoveryLimit: 0,
    aiLimit: 0,
    minScore: 75,
    aiMode: 'balanced',
    targetLocations: [],
    employmentTypes: ['不限'],
    experiences: [],
    degrees: [],
    salary: '不限',
    sendResumeImage: true,
    sendOnlineResume: false,
    customInstruction: '',
    customPrompt: '',
    betweenJobsSeconds: 12,
    attachmentDelaySeconds: 4,
    requireSingleJobValidation: true,
    singleJobValidationCompletedAt: 0,
    model: {
      baseUrl: 'https://api.deepseek.com',
      apiKey: '',
      model: 'deepseek-v4-pro',
      temperature: 0.1
    }
  },
  profile: null,
  profileFacts: null,
  resumeHash: '',
  profileDraft: null,
  directionPlan: null,
  resumeText: '',
  resumeImage: null,
  resumeSourceFile: null,
  stats: {
    date: '',
    sent: 0,
    discovered: 0,
    analyzed: 0,
    pending: 0,
    failed: 0,
    replied: 0,
    interviews: 0
  },
  aiStats: {
    totalCalls: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalTokens: 0,
    failedCalls: 0,
    byModel: {},
    byType: {},
    records: []
  },
  jobCache: {},
  workflow: {
    running: false,
    paused: true,
    phase: 'idle',
    statusText: '未开始',
    tasks: [],
    taskIndex: 0,
    cardIndex: 0,
    processedKeys: [],
    retries: 0,
    currentJob: null,
    returnUrl: '',
    returnScrollY: 0,
    pendingApplyId: null,
    activeRunId: null
  },
  pending: [],
  taskRuns: [],
  events: []
};

export const today = () => new Date().toISOString().slice(0, 10);
export const uniq = (items = []) => [...new Set(items.filter(Boolean))];
export const list = value => String(value || '')
  .split(/[，,\n]/)
  .map(item => item.trim())
  .filter(Boolean);
export const safeClone = value => JSON.parse(JSON.stringify(value ?? null));
