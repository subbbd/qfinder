const config = {
  quiet:    { bg: 'bg-crowd-quiet',    text: 'text-white', label: 'Quiet',    dot: '🟢' },
  moderate: { bg: 'bg-crowd-moderate', text: 'text-black', label: 'Moderate', dot: '🟡' },
  busy:     { bg: 'bg-crowd-busy',     text: 'text-white', label: 'Busy',     dot: '🔴' },
  none:     { bg: 'bg-crowd-none',     text: 'text-white', label: 'No Data',  dot: '⚪' },
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base font-bold',
}

export default function CrowdBadge({ level = 'none', size = 'md' }) {
  const c = config[level] || config.none
  return (
    <span className={`${c.bg} ${c.text} ${sizes[size]} rounded-full font-semibold inline-flex items-center gap-1`}>
      <span>{c.dot}</span>
      {c.label}
    </span>
  )
}
