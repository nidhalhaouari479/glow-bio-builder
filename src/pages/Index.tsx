import React, { useState } from 'react';
import { useCardBuilder } from '@/hooks/useCardBuilder';
import { useAuth } from '@/contexts/AuthContext';
import { CardPreview } from '@/components/preview/CardPreview';
import { ProfileEditor } from '@/components/editor/ProfileEditor';
import { BackgroundEditor } from '@/components/editor/BackgroundEditor';
import { SocialLinksEditor } from '@/components/editor/SocialLinksEditor';
import { ContactEditor } from '@/components/editor/ContactEditor';
import { SectionOrderEditor } from '@/components/editor/SectionOrderEditor';
import { ThemeEditor } from '@/components/editor/ThemeEditor';
import { ExtrasEditor } from '@/components/editor/ExtrasEditor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
  { id: 'extras', label: 'Extras', icon: Sparkles },
  { id: 'theme', label: 'Appearance', icon: Settings },
];

import { useNavigate } from 'react-router-dom';

export default function Index() {
  const { user, signOut } = useAuth();
  const builder = useCardBuilder();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<string[]>(['profile']);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [copied, setCopied] = useState(false);

  const getPublicLink = () => {
    if (!user) return 'https://glow-bio.app';
    if (builder.cardData.customDomain) {
      const domain = builder.cardData.customDomain.replace(/^(https?:\/\/)/, '');
      return `https://${domain}`;
    }
    return `${window.location.origin}/p/${user.id}`;
  };

  const publicLink = getPublicLink();

  const toggleSection = (id: string) => {
    setOpenSections(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(publicLink);
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
            customDomain={builder.cardData.customDomain}
            onUpdateField={builder.updateField}
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
            layout={builder.cardData.layout}
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
            <h1 className="text-xl font-bold gradient-text flex items-center gap-2">
              <img src="/logo.jpg" alt="GlowLink" className="h-8 w-8 rounded-lg object-contain" />
              GlowLink
            </h1>
            <p className="text-xs text-muted-foreground ml-10">Premium Bio Builder</p>
          </div>
          <div className="flex items-center gap-2">
            {!user ? (
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={builder.saveProfile}
              disabled={builder.loading}
            >
              {builder.loading ? 'Saving...' : 'Save'}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white border-0 shadow-lg shadow-purple-500/25 hover:opacity-90 transition-all">
                  <QrCode className="h-4 w-4" />
                  Publish
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/90 backdrop-blur-2xl border-white/10 text-white sm:rounded-2xl shadow-2xl shadow-purple-900/40 max-w-sm sm:max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                    Your Card is Ready!
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-5 py-4 w-full">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                    <div className="relative p-3 bg-white rounded-lg">
                      <QRCodeSVG
                        value={publicLink}
                        size={180}
                        fgColor={builder.cardData.accentColor || '#000000'}
                        level="Q"
                        includeMargin
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full items-center">
                    <Label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest self-start ml-[calc(50%-140px)]">Card Link</Label>
                    <div className="flex items-center gap-2 w-full max-w-[280px] p-1 pl-3 bg-white/5 border border-white/10 rounded-lg transition-colors focus-within:bg-white/10 focus-within:border-white/20 overflow-hidden h-9">
                      <Link className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span className="text-sm truncate flex-1 text-gray-300 font-medium min-w-0">{publicLink}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white hover:bg-white/10 h-7 w-7 p-0 rounded-md shrink-0"
                        onClick={copyLink}
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    className="w-full max-w-[280px] gap-2 bg-white text-black hover:bg-gray-100 border-0 h-9 text-sm font-medium rounded-lg transition-all shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download QR Code
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
