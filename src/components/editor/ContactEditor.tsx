import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ContactButton } from '@/types/cardBuilder';
import { Mail, Phone, Globe } from 'lucide-react';

interface ContactEditorProps {
  buttons: ContactButton[];
  onUpdate: (id: string, updates: Partial<ContactButton>) => void;
}

const contactIcons = {
  email: Mail,
  phone: Phone,
  website: Globe,
};

const contactPlaceholders = {
  email: 'hello@example.com',
  phone: '+1 (555) 123-4567',
  website: 'https://yourwebsite.com',
};

export function ContactEditor({ buttons, onUpdate }: ContactEditorProps) {
  return (
    <div className="space-y-4">
      {buttons.map((button) => {
        const Icon = contactIcons[button.type];
        return (
          <div key={button.id} className="space-y-3 p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium capitalize">{button.type}</span>
              </div>
              <Switch
                checked={button.enabled}
                onCheckedChange={(enabled) => onUpdate(button.id, { enabled })}
              />
            </div>
            
            {button.enabled && (
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs">Button Label</Label>
                  <Input
                    value={button.label}
                    onChange={(e) => onUpdate(button.id, { label: e.target.value })}
                    placeholder="Button text..."
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">
                    {button.type === 'email' ? 'Email Address' : 
                     button.type === 'phone' ? 'Phone Number' : 'Website URL'}
                  </Label>
                  <Input
                    value={button.value}
                    onChange={(e) => onUpdate(button.id, { value: e.target.value })}
                    placeholder={contactPlaceholders[button.type]}
                    className="h-9"
                    type={button.type === 'email' ? 'email' : button.type === 'phone' ? 'tel' : 'url'}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
