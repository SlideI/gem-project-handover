import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePlan } from "@/contexts/PlanContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, Trash2, User } from "lucide-react";

export const AboutMeSection = () => {
  const { sections, updateField, planId, profilePicture, backgroundPicture, updatePlanImages } = usePlan();
  const section = sections["about-me"];
  const [showMenu, setShowMenu] = useState(false);
  const [uploading, setUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File, type: 'profile' | 'background') => {
    if (!planId) {
      toast.error("Please create a plan first");
      return;
    }

    setUploading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      const updateField = type === 'profile' ? 'profile_picture_url' : 'background_picture_url';
      const { error: updateError } = await supabase
        .from('plans')
        .update({ [updateField]: publicUrl })
        .eq('id', planId);

      if (updateError) throw updateError;

      updatePlanImages(
        type === 'profile' ? publicUrl : profilePicture,
        type === 'background' ? publicUrl : backgroundPicture
      );

      toast.success(`${type === 'profile' ? 'Profile picture' : 'Background'} updated`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (type: 'profile' | 'background') => {
    if (!planId) return;

    try {
      const updateField = type === 'profile' ? 'profile_picture_url' : 'background_picture_url';
      const currentUrl = type === 'profile' ? profilePicture : backgroundPicture;
      
      if (currentUrl) {
        const path = currentUrl.split('/profile-images/')[1];
        if (path) {
          await supabase.storage.from('profile-images').remove([path]);
        }
      }

      const { error } = await supabase
        .from('plans')
        .update({ [updateField]: null })
        .eq('id', planId);

      if (error) throw error;

      updatePlanImages(
        type === 'profile' ? null : profilePicture,
        type === 'background' ? null : backgroundPicture
      );

      toast.success(`${type === 'profile' ? 'Profile picture' : 'Background'} removed`);
    } catch (error) {
      console.error('Remove error:', error);
      toast.error("Failed to remove image");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'background') => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file, type);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className="relative rounded-lg overflow-hidden"
        style={{
          background: backgroundPicture 
            ? `url(${backgroundPicture}) center/cover no-repeat` 
            : 'linear-gradient(135deg, hsl(var(--muted)), hsl(var(--muted)/0.5))',
          minHeight: '280px',
          padding: '2rem',
        }}
      >
        {/* Menu Trigger */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow-lg border-2 border-primary/30 transition-all z-10"
        >
          <span className="text-2xl">⋯</span>
        </button>

        {/* Avatar Menu */}
        {showMenu && (
          <div className="absolute top-16 left-4 bg-background rounded-lg p-5 shadow-xl border-2 border-primary z-10 min-w-[200px]">
            <div className="flex flex-col gap-2 mb-2">
              <Button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploading}
                variant="default"
                size="sm"
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              {profilePicture && (
                <Button
                  onClick={() => removeImage('profile')}
                  disabled={uploading}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => backgroundInputRef.current?.click()}
                disabled={uploading}
                variant="default"
                size="sm"
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Change Background
              </Button>
              {backgroundPicture && (
                <Button
                  onClick={() => removeImage('background')}
                  disabled={uploading}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Avatar Display */}
        <div className="flex justify-center">
          <div 
            className="cursor-pointer"
            onClick={() => avatarInputRef.current?.click()}
          >
            <Avatar className="w-36 h-36 border-4 border-primary shadow-lg">
              {profilePicture ? (
                <AvatarImage src={profilePicture} alt="Profile" />
              ) : (
                <AvatarFallback className="bg-background">
                  <div className="flex flex-col items-center gap-2">
                    <User className="w-12 h-12 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground text-center">Click to add<br />your photo</p>
                  </div>
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'profile')}
        />
        <input
          ref={backgroundInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'background')}
        />

        <h1 className="text-3xl font-bold text-center mt-4">About Me</h1>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="my-name">My name is</Label>
          <Input
            id="my-name"
            value="James Andrew Cameron"
            readOnly
            className="mt-1 bg-muted"
          />
        </div>

        <div>
          <Label htmlFor="preferred-name">My preferred name is</Label>
          <Input
            id="preferred-name"
            value="Jamie"
            readOnly
            className="mt-1 bg-muted"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gender">My gender is</Label>
            <Input
              id="gender"
              value="Male"
              readOnly
              className="mt-1 bg-muted"
            />
          </div>
          <div>
            <Label htmlFor="pronouns">My pronouns are</Label>
            <Input
              id="pronouns"
              value="He/Him"
              readOnly
              className="mt-1 bg-muted"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="parents">My parents' names are</Label>
          <Input
            id="parents"
            value="Robert Jackson (Stepdad), John Cameron (Father), Sarah Anne Cudby (Mother)"
            readOnly
            className="mt-1 bg-muted"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">My age is</Label>
            <Input
              id="age"
              value="16"
              readOnly
              className="mt-1 bg-muted"
            />
          </div>
          <div>
            <Label htmlFor="dob">My date of birth is</Label>
            <Input
              id="dob"
              value="12 July 2009"
              readOnly
              className="mt-1 bg-muted"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="siblings">My brothers and sisters are</Label>
          <Textarea
            id="siblings"
            value={section.fields.siblings || ""}
            onChange={(e) => updateField("about-me", "siblings", e.target.value)}
            placeholder="List your siblings here..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="ethnicity">Mātā waka/Ethnicity or Ethnicities</Label>
          <Input
            id="ethnicity"
            value="New Zealand European"
            readOnly
            className="mt-1 bg-muted"
          />
        </div>

        <div>
          <Label htmlFor="iwi">My Iwi</Label>
          <Input
            id="iwi"
            value="Ngāti Kurī"
            readOnly
            className="mt-1 bg-muted"
          />
        </div>

        <div>
          <Label htmlFor="hapu">My Hapū <span className="text-sm text-muted-foreground">(Maternal, Paternal)</span></Label>
          <Input
            id="hapu"
            value="Ngāi Tahu (Maternal), Ngāti Porou (Paternal)"
            readOnly
            className="mt-1 bg-muted"
          />
        </div>

        <div>
          <Label htmlFor="marae">My Marae <span className="text-sm text-muted-foreground">(Maternal, Paternal)</span></Label>
          <Input
            id="marae"
            value="Ngāi Tūāhuriri"
            readOnly
            className="mt-1 bg-muted"
          />
        </div>
      </div>
    </div>
  );
};
