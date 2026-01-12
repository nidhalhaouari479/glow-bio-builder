import React, { useState } from 'react';
import { useCardBuilder } from '@/hooks/useCardBuilder';
import { CardPreview } from '@/components/preview/CardPreview';
import { ProfileEditor } from '@/components/editor/ProfileEditor';
import { BackgroundEditor } from '@/components/editor/BackgroundEditor';
import { SocialLinksEditor } from '@/components/editor/SocialLinksEditor';
import { ContactEditor } from '@/components/editor/ContactEditor';
import { SectionOrderEditor } from '@/components/editor/SectionOrderEditor';
import { ThemeEditor } from '@/components/editor/ThemeEditor';
import { ExtrasEditor } from '@/components/editor/ExtrasEditor';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { 
  User, 
  Palette, 
  Share2, 
  Phone, 
  Layers, 
  Sparkles, 
  Settings,
  ChevronDown,
  Smartphone,
  Monitor,
  QrCode,
  Download,
  Link,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const editorSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'background', label: 'Background', icon: Palette },
  { id: 'social', label: 'Social Links', icon: Share2 },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'sections', label: 'Sections', icon: Layers },
  { id: 'extras', label: 'Stories & Stats', icon: Sparkles },
  { id: 'theme', label: 'Appearance', icon: Settings },
];

export default function Index() {
  const builder = useCardBuilder();
  const [openSections, setOpenSections] = useState<string[]>(['profile']);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [copied, setCopied] = useState(false);
  
  const demoUrl = 'https://mycard.link/demo123';

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id) 
        : [...prev, id]
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(demoUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const renderEditor = (id: string) => {
    switch (id) {
      case 'profile':
        return (
          <ProfileEditor
            data={builder.cardData}
            onUpdate={builder.updateField}
            onImageUpload={builder.setProfileImage}
          />
        );
      case 'background':
        return (
          <BackgroundEditor
            config={builder.cardData.background}
            onUpdate={builder.updateBackground}
          />
        );
      case 'social':
        return (
          <SocialLinksEditor
            links={builder.cardData.socialLinks}
            onUpdate={builder.updateSocialLink}
          />
        );
      case 'contact':
        return (
          <ContactEditor
            buttons={builder.cardData.contactButtons}
            onUpdate={builder.updateContactButton}
          />
        );
      case 'sections':
        return (
          <SectionOrderEditor
            sections={builder.cardData.sections}
            onReorder={builder.reorderSections}
            onToggle={builder.toggleSection}
          />
        );
      case 'extras':
        return (
          <ExtrasEditor
            stories={builder.cardData.stories}
            achievements={builder.cardData.achievements}
            badges={builder.cardData.badges}
            onAddStory={builder.addStory}
            onRemoveStory={builder.removeStory}
            onUpdateStory={builder.updateStory}
            onAddAchievement={builder.addAchievement}
            onRemoveAchievement={builder.removeAchievement}
            onUpdateAchievement={builder.updateAchievement}
            onAddBadge={builder.addBadge}
            onRemoveBadge={builder.removeBadge}
            onUpdateBadge={builder.updateBadge}
          />
        );
      case 'theme':
        return (
          <ThemeEditor
            themeMode={builder.cardData.themeMode}
            iconAnimation={builder.cardData.iconAnimation}
            iconStyle={builder.cardData.iconStyle}
            fontFamily={builder.cardData.fontFamily}
            accentColor={builder.cardData.accentColor}
            onUpdate={builder.updateField}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Editor Panel */}
      <div className="w-full lg:w-[420px] border-r bg-background flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold gradient-text">Card Builder</h1>
            <p className="text-xs text-muted-foreground">Create your digital presence</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2" style={{ background: `linear-gradient(135deg, ${builder.cardData.accentColor}, #ec4899)` }}>
                <QrCode className="h-4 w-4" />
                Publish
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your Card is Ready!</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="p-4 bg-white rounded-2xl shadow-lg">
                  <QRCodeSVG 
                    value={demoUrl} 
                    size={180} 
                    fgColor={builder.cardData.accentColor}
                    level="H"
                    includeMargin
                  />
                </div>
                <div className="flex items-center gap-2 w-full p-3 bg-muted rounded-lg">
                  <Link className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate flex-1">{demoUrl}</span>
                  <Button size="sm" variant="ghost" onClick={copyLink}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download QR Code
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Editor Sections */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {editorSections.map((section) => {
              const Icon = section.icon;
              const isOpen = openSections.includes(section.id);
              return (
                <Collapsible 
                  key={section.id} 
                  open={isOpen}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger asChild>
                    <button className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
                      "hover:bg-muted",
                      isOpen && "bg-muted"
                    )}>
                      <div className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center",
                        isOpen ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium flex-1 text-left">{section.label}</span>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen && "rotate-180"
                      )} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pt-3 pb-4 px-1">
                      {renderEditor(section.id)}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Preview Panel */}
      <div className="hidden lg:flex flex-1 flex-col bg-muted/50">
        {/* Preview Controls */}
        <div className="p-4 border-b bg-background/80 backdrop-blur flex items-center justify-center gap-2">
          <Button
            variant={previewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('mobile')}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile
          </Button>
          <Button
            variant={previewMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('desktop')}
          >
            <Monitor className="h-4 w-4 mr-2" />
            Desktop
          </Button>
        </div>

        {/* Preview Frame */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className={cn(
            "bg-background rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-300",
            previewMode === 'mobile' 
              ? "w-[375px] h-[750px]" 
              : "w-[800px] h-[600px] rounded-2xl"
          )}>
            {previewMode === 'mobile' && (
              <div className="h-8 bg-black flex items-center justify-center">
                <div className="w-20 h-5 bg-black rounded-b-xl" />
              </div>
            )}
            <div className={cn(
              "overflow-auto",
              previewMode === 'mobile' ? "h-[calc(100%-2rem)]" : "h-full"
            )}>
              <CardPreview data={builder.cardData} isMobile={previewMode === 'mobile'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
