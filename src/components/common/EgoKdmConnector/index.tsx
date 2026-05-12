interface EgoKdmConnectorProps {
  readonly selectedIndex: number
  readonly totalCount:    number
}

export default function EgoKdmConnector({ selectedIndex, totalCount }: EgoKdmConnectorProps) {
  // Wide viewBox; taller H so arms appear vertical, not flat
  const W = 1000
  const H = 64

  const cardW    = W / totalCount
  const startX   = selectedIndex * cardW + cardW / 2   // centre of selected card
  const endX     = W / 2                               // page centre (where badge sits)

  // Cubic bezier: depart vertically from startX, arrive vertically at endX
  const path = `M ${startX} 0 C ${startX} ${H * 0.6}, ${endX} ${H * 0.4}, ${endX} ${H}`

  return (
    <svg
      width="100%"
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className="block"
    >
      <path
        d={path}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
