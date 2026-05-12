interface Props {
  modality: string
}

export default function ModalityLabel({ modality }: Props) {
  return (
    <p className="text-xs font-bold uppercase tracking-wide px-6 -mt-2 text-text-body">
      MODALITY:&nbsp;
      <span className="font-bold normal-case tracking-normal">
        {modality}
      </span>
    </p>
  )
}
