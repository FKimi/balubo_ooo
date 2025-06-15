import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { WorkCard } from './WorkCard'
import { WorkData } from '@/types/work'

interface SortableWorkCardProps {
  work: WorkData
  onDelete: (workId: string) => void
  isDraggable: boolean
}

export function SortableWorkCard({ work, onDelete, isDraggable }: SortableWorkCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: work.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  if (!isDraggable) {
    return <WorkCard work={work} onDelete={onDelete} isDraggable={false} />
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <WorkCard work={work} onDelete={onDelete} isDraggable={true} />
    </div>
  )
} 