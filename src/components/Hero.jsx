import { motion } from 'framer-motion'

const contentByPhase = {
  before: {
    subtitle: 'The Western Ghats are calling. Pack light, dream big.',
    badge: 'Pre-Departure',
  },
  during: {
    subtitle: 'Wheels are rolling south. Every mile turns into a memory.',
    badge: 'Journey In Motion',
  },
  after: {
    subtitle: 'You made it to God\'s Own Country. Let the stories begin.',
    badge: 'Arrival Complete',
  },
}

const particles = [
  { id: 1, top: '16%', left: '12%', size: 7, duration: 5.4 },
  { id: 2, top: '27%', left: '32%', size: 5, duration: 6.2 },
  { id: 3, top: '21%', left: '56%', size: 8, duration: 5.9 },
  { id: 4, top: '44%', left: '72%', size: 6, duration: 7.1 },
  { id: 5, top: '35%', left: '87%', size: 4, duration: 6.6 },
]

function Hero({ phase }) {
  const content = contentByPhase[phase]

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-8 sm:pt-16">
      <div className="sun-sheen" />
      <div className="mist-layer" />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="particle-light"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
          }}
          animate={{ y: [0, -14, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: 'easeOut' }}
        className="relative z-10 mx-auto flex max-w-6xl flex-col gap-5"
      >
        <span className="w-fit rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
          {content.badge}
        </span>

        <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
          Kerala Trip Begins In...
        </h1>

        <p className="max-w-2xl text-sm text-slate-200 sm:text-base">{content.subtitle}</p>
      </motion.div>
    </section>
  )
}

export default Hero
