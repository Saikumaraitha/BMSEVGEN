interface VisionCardProps {
  vision: string
}

export default function VisionCard({ vision }: VisionCardProps) {
  return (
    <div className="bg-neutral-100 rounded-xl px-5 py-4 mb-4">
      <p className="text-xs font-bold text-vision uppercase mb-2">Vision</p>
      <p className="text-sm text-black leading-relaxed">{vision}</p>
    </div>
  )
}
