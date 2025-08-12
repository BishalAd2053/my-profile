import { motion } from 'framer-motion'

type Item = { id: number; date: string; count: number }
export default function Heatmap({ items }: { items: Item[] }) {
  const map = new Map<string, number>()
  items.forEach(i => map.set(i.date, i.count))
  const year = new Date(items[0]?.date ?? new Date().toISOString()).getFullYear()
  const start = new Date(year,0,1)
  const days = Array.from({length: 365}, (_,i)=> new Date(start.getTime()+i*86400000))
  const color = (c:number) => c===0?'#1f2937': c===1?'#14532d': c===2?'#166534': c===3?'#15803d':'#16a34a'

  return (
    <div className="overflow-x-auto">
      <div className="grid" style={{gridTemplateColumns: 'repeat(53, 12px)', gap: 3}}>
        {days.map((d,idx)=>{
          const key = d.toISOString().slice(0,10)
          const c = map.get(key) ?? 0
          return (
            <motion.div
              key={idx}
              className="w-3 h-3 rounded-sm"
              title={`${key}: ${c}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.002, duration: 0.2 }}
              style={{ background: color(c) }}
            />
          )
        })}
      </div>
    </div>
  )
}
