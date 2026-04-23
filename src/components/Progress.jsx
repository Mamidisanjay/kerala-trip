import { motion } from 'framer-motion'

const getProgress = (now, start, end) => {
  const percentage = ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100
  return Math.min(100, Math.max(0, percentage))
}

const statusByPhase = {
  before: 'Standby mode: waiting for the whistle at the station.',
  during: 'On the move: landscapes shifting, stories unfolding.',
  after: 'Arrived in Kerala: now the adventure begins on land.',
}

const formatISTTime = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date)

function Progress({ now, departureTime, arrivalTime, phase }) {
  const progress = getProgress(now, departureTime, arrivalTime)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass-card p-5"
    >
      <h2 className="font-display text-2xl text-white">Journey Progress</h2>
      <p className="mt-1 text-sm text-slate-200">{statusByPhase[phase]}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-300">
        IST: {formatISTTime(now)} | Phase: {phase}
      </p>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/20 bg-black/20 p-1">
        <motion.div
          className="h-4 rounded-xl bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>

      <div className="mt-3 text-right text-sm font-medium text-white">{progress.toFixed(1)}% complete</div>
    </motion.div>
  )
}

export default Progress
