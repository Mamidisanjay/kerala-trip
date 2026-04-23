import { motion } from 'framer-motion'

const getCountdownTarget = (phase, departureTime, arrivalTime) => {
  if (phase === 'before') return departureTime
  if (phase === 'during') return arrivalTime
  return null
}

const toParts = (diffMs) => {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds }
}

const labels = {
  before: 'Time Until Departure',
  during: 'Time Until Arrival',
  after: 'Journey Completed',
}

const formatInIST = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)

function Countdown({ now, departureTime, arrivalTime, phase }) {
  const target = getCountdownTarget(phase, departureTime, arrivalTime)
  const diff = target ? target.getTime() - now.getTime() : 0
  const { days, hours, minutes, seconds } = toParts(diff)

  const values = [
    { key: 'Days', value: days },
    { key: 'Hours', value: hours },
    { key: 'Minutes', value: minutes },
    { key: 'Seconds', value: seconds },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-5"
    >
      <h2 className="font-display text-2xl text-white">Countdown Timer</h2>
      <p className="mt-1 text-sm text-slate-200">{labels[phase]}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-300">
        IST Now: {formatInIST(now)}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {values.map((item) => (
          <motion.div
            key={item.key}
            whileHover={{ scale: 1.03 }}
            className="rounded-2xl border border-white/20 bg-white/5 p-3 text-center"
          >
            <div className="text-2xl font-semibold text-white">{String(item.value).padStart(2, '0')}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-300">{item.key}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 grid gap-2 rounded-2xl border border-white/15 bg-black/15 p-3 text-xs text-slate-200 sm:grid-cols-2">
        <p>Departure: {formatInIST(departureTime)}</p>
        <p>Arrival: {formatInIST(arrivalTime)}</p>
      </div>
    </motion.div>
  )
}

export default Countdown
