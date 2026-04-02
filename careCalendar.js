export const CARE_CALENDAR = [
  { months: [3],        task: 'Inspect for winter damage',             detail: 'Check branches and trunk for frost cracks or dieback. Note any trees that look weak.' },
  { months: [4],        task: 'Remove protection & prune dead wood',   detail: 'Unwrap burlap, remove styrofoam cones. Prune any dead or damaged branches back to live wood.' },
  { months: [5],        task: 'First fertilize & pest check',          detail: 'Apply balanced 10-10-10 fertilizer. Check for fig rust, aphids, or scale insects.' },
  { months: [6, 7, 8],  task: 'Monitor watering & second fertilize',   detail: 'Deep water weekly in dry spells. Apply second fertilizer in late June. Watch for fig mosaic virus.' },
  { months: [9],        task: 'Harvest — log yields per tree',         detail: 'Main crop harvest. Figs are ripe when soft to touch and drooping. Log each tree\'s yield.' },
  { months: [10],       task: 'Final harvest & winter prep begins',    detail: 'Collect any remaining figs. Begin reducing water. Plan winter protection strategy.' },
  { months: [11],       task: 'Apply winter protection',               detail: 'Wrap trunks in burlap. Mulch heavily at base. For potted trees, move to unheated garage.' },
  { months: [12, 1, 2], task: 'Dormant — no action needed',           detail: 'Trees are fully dormant. No watering or fertilizing needed. Check wraps after ice storms.' },
]

export function getCurrentCareWindow() {
  const month = new Date().getMonth() + 1
  return CARE_CALENDAR.find(c => c.months.includes(month)) || CARE_CALENDAR[CARE_CALENDAR.length - 1]
}

export function getNextCareWindow() {
  const month = new Date().getMonth() + 1
  const idx = CARE_CALENDAR.findIndex(c => c.months.includes(month))
  return CARE_CALENDAR[(idx + 1) % CARE_CALENDAR.length]
}

export const VARIETIES = [
  'Brown Turkey', 'Chicago Hardy', 'Black Mission', 'Celeste',
  'LSU Purple', 'Petite Negra', 'Violette de Bordeaux', 'White Marseilles', 'Other'
]

export function getTreeStatus(tree) {
  const care = getCurrentCareWindow()
  const month = new Date().getMonth() + 1
  if ([12, 1, 2].includes(month)) return 'dormant'
  if ([4, 11].includes(month)) return 'action'
  if (tree.health_logs && tree.health_logs.length > 0) {
    const last = new Date(tree.health_logs[0].log_date)
    const daysSince = (Date.now() - last) / 86400000
    if (daysSince > 30) return 'watch'
  }
  return 'ok'
}

export const STATUS_CONFIG = {
  action:  { label: 'Action',   bg: '#FAECE7', color: '#993C1D' },
  watch:   { label: 'Watch',    bg: '#FAEEDA', color: '#854F0B' },
  ok:      { label: 'OK',       bg: '#EAF3DE', color: '#3B6D11' },
  dormant: { label: 'Dormant',  bg: '#F1EFE8', color: '#5F5E5A' },
}
