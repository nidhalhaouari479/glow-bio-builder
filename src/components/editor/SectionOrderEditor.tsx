import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Section, SectionType } from '@/types/cardBuilder';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  User,
  Share2,
  Phone,
  Trophy,
  BookOpen,
  Award,
  Puzzle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionOrderEditorProps {
  sections: Section[];
  onReorder: (sections: Section[]) => void;
  onToggle: (id: string) => void;
}

const sectionIcons: Record<SectionType, React.ElementType> = {
  bio: User,
  social: Share2,
  contact: Phone,
  achievements: Trophy,
  stories: BookOpen,
  badges: Award,
  custom_widgets: Puzzle,
};

const sectionLabels: Record<SectionType, string> = {
  bio: 'Bio',
  social: 'Social Links',
  contact: 'Contact Buttons',
  achievements: 'Stats & Achievements',
  stories: 'Stories',
  badges: 'Badges & Tags',
  custom_widgets: 'Custom Widgets',
};

function SortableItem({ section, onToggle }: { section: Section; onToggle: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = sectionIcons[section.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-card transition-colors",
        isDragging && "opacity-50 border-primary",
        !section.enabled && "opacity-50"
      )}
    >
      <button
        className="cursor-grab active:cursor-grabbing touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <div
        className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center",
          section.enabled ? "bg-primary/10" : "bg-muted"
        )}
      >
        <Icon className={cn(
          "h-4 w-4",
          section.enabled ? "text-primary" : "text-muted-foreground"
        )} />
      </div>
      <span className="flex-1 font-medium text-sm">
        {sectionLabels[section.type]}
      </span>
      <Switch
        checked={section.enabled}
        onCheckedChange={onToggle}
      />
    </div>
  );
}

export function SectionOrderEditor({ sections, onReorder, onToggle }: SectionOrderEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
        ...s,
        order: i,
      }));
      onReorder(newSections);
    }
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Drag to reorder sections</Label>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedSections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sortedSections.map((section) => (
              <SortableItem
                key={section.id}
                section={section}
                onToggle={() => onToggle(section.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
