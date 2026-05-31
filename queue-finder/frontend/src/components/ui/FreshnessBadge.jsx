export default function FreshnessBadge({ reportedAt }) {
  if (!reportedAt) return null

  const ageMs = Date.now() - new Date(reportedAt).getTime()
  const ageMin = Math.floor(ageMs / 60000)
  const ageHrs = ageMin / 60

  let label, dotColor, textColor

  if (ageHrs < 2) {
    label = ageMin < 1 ? 'Just now' : `${ageMin}m ago`
    dotColor = 'bg-crowd-quiet'
    textColor = 'text-crowd-quiet'
  } else if (ageHrs < 4) {
    label = `${Math.floor(ageHrs)}h ago · Getting old`
    dotColor = 'bg-crowd-moderate'
    textColor = 'text-crowd-moderate'
  } else {
    label = `${Math.floor(ageHrs)}h ago · Stale`
    dotColor = 'bg-crowd-none'
    textColor = 'text-crowd-none'
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${textColor}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      {label}
    </span>
  )
}
