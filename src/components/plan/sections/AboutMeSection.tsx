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
import { PrePopulatedField } from "../PrePopulatedField";
import { FieldWithPrompt } from "../FieldWithPrompt";
import { TableField } from "../TableField";
import { ConditionalField } from "../ConditionalField";
import { DatePickerField } from "../DatePickerField";
import { SelectField } from "../SelectField";
import { ActionTable } from "../ActionTable";
import { ImageCropDialog } from "../ImageCropDialog";

export const AboutMeSection = () => {
  const { sections, updateField, planId, profilePicture, backgroundPicture, updatePlanImages, isReadOnly } = usePlan();
  const section = sections["about-me"];
  const [showMenu, setShowMenu] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const parseAttachments = (fieldId: string) => {
    try {
      const val = section?.fields?.[fieldId];
      if (!val) return [];
      return typeof val === 'string' ? JSON.parse(val) : val;
    } catch {
      return [];
    }
  };

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
      if (type === 'profile') {
        // Open crop dialog for profile pictures
        setSelectedFile(file);
        setCropDialogOpen(true);
      } else {
        // Upload background directly
        uploadImage(file, type);
      }
    }
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  const handleCroppedImage = async (croppedBlob: Blob) => {
    if (!planId) {
      toast.error("Please create a plan first");
      return;
    }

    setUploading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      const fileName = `${user.id}/profile-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, croppedBlob, { upsert: true, contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('plans')
        .update({ profile_picture_url: publicUrl })
        .eq('id', planId);

      if (updateError) throw updateError;

      updatePlanImages(publicUrl, backgroundPicture);

      toast.success("Profile picture updated");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      setSelectedFile(null);
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

        {/* Image Crop Dialog */}
        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageFile={selectedFile}
          onConfirm={handleCroppedImage}
        />

      </div>

      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">About Me</h2>
        <p className="text-muted-foreground">
          Tell us about yourself
        </p>
      </div>

      <div className="space-y-6">
        {/* Pre-populated fields */}
        <PrePopulatedField label="My name is" value="James Andrew Cameron" />
        
        <PrePopulatedField label="I like to be called" value="Jamie" />
        
        <div className="grid grid-cols-2 gap-4">
          <PrePopulatedField label="My gender is" value="Male" />
          
          <FieldWithPrompt 
            label="My pronouns are"
            prompt="Everyone has pronouns - they help us refer to someone without using their name. Using the correct pronouns is respectful and helpful not just for gender diverse people but can be helpful when a tamariki has a gender neutral name or a culturally specific name so that we know how best to address them."
          >
            <Input
              value={section.fields.pronouns || ""}
              onChange={(e) => updateField("about-me", "pronouns", e.target.value)}
              placeholder="e.g., He/Him, She/Her, They/Them"
              autoComplete="off"
            />
          </FieldWithPrompt>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <PrePopulatedField label="My age is" value="16" />
          <PrePopulatedField label="My date of birth is" value="12 July 2009" />
        </div>

        <PrePopulatedField label="My parents' names are" value="Robert Jackson (Stepdad), John Cameron (Father), Sarah Anne Cudby (Mother)" />

        <PrePopulatedField label="My brothers and sisters are" value="2 siblings - step/half siblings options available" />

        <TableField
          label="My whānau or family and significant people are"
          prompt="Clearly specify whether this is a whakapapa connection or define the nature of the relationship"
          columns={[
            { key: "name", label: "Person Name" },
            { key: "relationship", label: "Relationship to tamaiti" }
          ]}
          value={typeof section.fields.whanau === 'string' ? JSON.parse(section.fields.whanau || '[]') : (section.fields.whanau || [])}
          onChange={(value) => updateField("about-me", "whanau", JSON.stringify(value))}
          attachments={parseAttachments("whanau-attachments")}
          onAttachmentsChange={(attachments) => updateField("about-me", "whanau-attachments", JSON.stringify(attachments))}
          readOnly={isReadOnly}
        />

        <PrePopulatedField label="Mātā waka/ethnicity or ethnicities (maternal, paternal)" value="New Zealand European, Māori" />

        {/* Conditional Māori fields */}
        <ConditionalField show={true}>
          <div className="space-y-4 pl-4 border-l-2 border-primary/30">
            <PrePopulatedField label="My iwi: maternal, paternal" value="Ngāti Kurī (Maternal), Ngāti Porou (Paternal)" />
            <PrePopulatedField label="My hapū: maternal, paternal" value="Ngāi Tahu (Maternal), Ngāti Porou (Paternal)" />
            <PrePopulatedField label="My marae: maternal, paternal" value="Ngāi Tūāhuriri" />
          </div>
        </ConditionalField>

        <PrePopulatedField label="My island/village: maternal, paternal" value="Christchurch, New Zealand" />

        <PrePopulatedField label="The languages that are important to me and my family or whānau are" value="English, Te Reo Māori" />

        <FieldWithPrompt
          label="My preferred way to communicate is"
          prompt="What is their preferred language. Also consider the following: dialects, sign language, using my iPad, using my Communication Book, using PECS (Picture Exchange Communication System), using Augmentative Communication, using Letter Boards, using other visual, oral, story-board options"
        >
          <Textarea
            value={section.fields.communication || ""}
            onChange={(e) => updateField("about-me", "communication", e.target.value)}
            placeholder="Describe your preferred communication method..."
            autoComplete="off"
            className="min-h-[80px] resize-none"
          />
        </FieldWithPrompt>

        <FieldWithPrompt label="How I would like to be involved in decisions that will affect me">
          <Textarea
            value={section.fields.decisionInvolvement || ""}
            onChange={(e) => updateField("about-me", "decisionInvolvement", e.target.value)}
            placeholder="Share how you'd like to be involved..."
            autoComplete="off"
            className="min-h-[80px] resize-none"
          />
        </FieldWithPrompt>

        <TableField
          label="People supporting me and my whānau"
          prompt="Consider care provider social worker, youth worker, kaimahi, teacher, coaches, Kapa Haka rangatira etc"
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "mobile", label: "Mobile" },
            { key: "office", label: "Office" }
          ]}
          value={typeof section.fields.supportPeople === 'string' ? JSON.parse(section.fields.supportPeople || '[]') : (section.fields.supportPeople || [])}
          onChange={(value) => updateField("about-me", "supportPeople", JSON.stringify(value))}
          attachments={parseAttachments("supportPeople-attachments")}
          onAttachmentsChange={(attachments) => updateField("about-me", "supportPeople-attachments", JSON.stringify(attachments))}
          readOnly={isReadOnly}
        />

        <FieldWithPrompt label="Why is the service involved with me and my whānau, and what is my current situation">
          <Textarea
            value={section.fields.otInvolvement || ""}
            onChange={(e) => updateField("about-me", "otInvolvement", e.target.value)}
            placeholder="Describe the situation..."
            autoComplete="off"
            className="min-h-[100px] resize-none"
          />
        </FieldWithPrompt>

        <PrePopulatedField label="My Legal status or orders" value="Care and Protection Order - Section 101(1)(a)" />

        <SelectField
          label="My current permanent care goal and concurrent permanent care goal"
          prompt="Ensure goals align with the goals outlined in the Family Group Conference (FGC) or court-approved plan, unless a change has been formally agreed to."
          value={section.fields.careGoal || ""}
          onChange={(value) => updateField("about-me", "careGoal", value)}
          options={[
            { value: "return-home", label: "Return home" },
            { value: "independence", label: "Independence" },
            { value: "family-whanau", label: "Family/whānau group" },
            { value: "non-family-whanau", label: "Non family/whānau group" },
            { value: "other", label: "Other" }
          ]}
        />

        <PrePopulatedField label="My next court date or family group conference (review) date is on" value="15 March 2026, 10:00 AM at Wellington Family Court" />

        <TableField
          label="My routines are"
          prompt="Consider regular routines and commitments — not just daily, but also weekly or monthly. This could include things like: Meal times, Bed times, Transport needs, School activities, After school activities, Cultural or spiritual practices (e.g. church, marae visits, family traditions), Medical or specialist appointments, Monthly check-ins, support groups, or community events, Anything else that's part of their rhythm or important to them"
          columns={[
            { key: "routine", label: "Routine", type: "textarea" },
            { key: "frequency", label: "Frequency" }
          ]}
          value={typeof section.fields.routines === 'string' ? JSON.parse(section.fields.routines || '[]') : (section.fields.routines || [])}
          onChange={(value) => updateField("about-me", "routines", JSON.stringify(value))}
          attachments={parseAttachments("routines-attachments")}
          onAttachmentsChange={(attachments) => updateField("about-me", "routines-attachments", JSON.stringify(attachments))}
          readOnly={isReadOnly}
        />

        <FieldWithPrompt
          label="My strengths"
          prompt="Consider using practice tools (eg Three houses) appropriate to the individual and collective uniqueness of te tamaiti or rangatahi to help identify strengths - Ensure any goals or aspirations are covered in the plan below"
        >
          <Textarea
            value={section.fields.strengths || ""}
            onChange={(e) => updateField("about-me", "strengths", e.target.value)}
            placeholder="Describe your strengths..."
            autoComplete="off"
            className="min-h-[100px] resize-none"
          />
        </FieldWithPrompt>

        <TableField
          label="The things I enjoy doing or am interested in"
          prompt="Consider what te tamaiti or rangatahi enjoys or is interested in, including activities they currently engage in and those they haven't tried but would like to experience."
          columns={[
            { key: "activity", label: "Activity/Interest", type: "textarea" }
          ]}
          value={typeof section.fields.interests === 'string' ? JSON.parse(section.fields.interests || '[]') : (section.fields.interests || [])}
          onChange={(value) => updateField("about-me", "interests", JSON.stringify(value))}
          attachments={parseAttachments("interests-attachments")}
          onAttachmentsChange={(attachments) => updateField("about-me", "interests-attachments", JSON.stringify(attachments))}
          readOnly={isReadOnly}
        />

        <div className="grid grid-cols-2 gap-4">
          <FieldWithPrompt label="Kai and drinks that I like">
            <Textarea
              value={section.fields.foodLikes || ""}
              onChange={(e) => updateField("about-me", "foodLikes", e.target.value)}
              placeholder="Foods and drinks you enjoy..."
              autoComplete="off"
              className="resize-none"
            />
          </FieldWithPrompt>
          
          <FieldWithPrompt label="Kai and drinks that I don't like">
            <Textarea
              value={section.fields.foodDislikes || ""}
              onChange={(e) => updateField("about-me", "foodDislikes", e.target.value)}
              placeholder="Foods and drinks you don't like..."
              autoComplete="off"
              className="resize-none"
            />
          </FieldWithPrompt>
        </div>

        <TableField
          label="The things I find hard, my worries, how I feel safe, and people who support me"
          prompt="Consider difficulties such as getting angry or being impulsive, getting to sleep at night, going to school, doing maths. Consider emotional distress also. Consider who is important to te tamaiti or rangatahi. Who might they want to talk to if they need support, are feeling upset, worried, or unsafe?"
          columns={[
            { key: "challenge", label: "1) The things I find hard and what helps me", type: "textarea" },
            { key: "worries", label: "2) My Worries and how I may show these", type: "textarea" },
            { key: "safety", label: "3) How I feel safe and comforted", type: "textarea" },
            { key: "supporters", label: "4) The people who support me are", type: "textarea" }
          ]}
          value={typeof section.fields.challengesSupport === 'string' ? JSON.parse(section.fields.challengesSupport || '[]') : (section.fields.challengesSupport || [])}
          onChange={(value) => updateField("about-me", "challengesSupport", JSON.stringify(value))}
          attachments={parseAttachments("challengesSupport-attachments")}
          onAttachmentsChange={(attachments) => updateField("about-me", "challengesSupport-attachments", JSON.stringify(attachments))}
          readOnly={isReadOnly}
        />

        <TableField
          label="My important belongings or taonga and how they are kept safe"
          prompt="Where are the belongings or taonga currently kept? Are there any actions required to ensure they are stored safely and respectfully?"
          columns={[
            { key: "belonging", label: "Belonging" },
            { key: "safety", label: "How I keep it Safe" }
          ]}
          value={typeof section.fields.belongings === 'string' ? JSON.parse(section.fields.belongings || '[]') : (section.fields.belongings || [])}
          onChange={(value) => updateField("about-me", "belongings", JSON.stringify(value))}
          attachments={parseAttachments("belongings-attachments")}
          onAttachmentsChange={(attachments) => updateField("about-me", "belongings-attachments", JSON.stringify(attachments))}
          readOnly={isReadOnly}
        />

        <FieldWithPrompt
          label="Social and/or community activities I am a part of/or interested in"
          prompt="Being involved in social and community groups can support connections and interests. Explore with te tamaiti or rangatahi any groups they may be interested in joining."
        >
          <Textarea
            value={section.fields.communityActivities || ""}
            onChange={(e) => updateField("about-me", "communityActivities", e.target.value)}
            placeholder="Community groups and activities..."
          />
        </FieldWithPrompt>

        <FieldWithPrompt
          label="Sport, hobbies or other activities I enjoy are"
          prompt="Consider what activities, sports and hobbies they are currently involved in, and explore any others they may be interested in trying."
        >
          <Textarea
            value={section.fields.hobbies || ""}
            onChange={(e) => updateField("about-me", "hobbies", e.target.value)}
            placeholder="Sports, hobbies, and activities..."
          />
        </FieldWithPrompt>

        <FieldWithPrompt
          label="My views, wishes and aspirations"
          prompt="Support te tamaiti to express their views, wishes, and aspirations in ways that reflect their unique identity, culture, and experiences. This includes what matters to them now and what they hope for in the future. If te tamaiti requires support to express themselves — for example, due to age, development, or disability — ensure appropriate assistance is provided. This may include a whānau or family member, youth advocate, community leader, or another trusted person who can help them communicate in a way that feels safe and meaningful."
        >
          <Textarea
            value={section.fields.aspirations || ""}
            onChange={(e) => updateField("about-me", "aspirations", e.target.value)}
            placeholder="Share your views, wishes and what you aspire to..."
            className="min-h-[120px]"
          />
        </FieldWithPrompt>
      </div>

      {/* Action Plan Table - Day to day needs */}
      <ActionTable 
        sectionId="about-me" 
        subHeading="My Day-to-day Needs & Safety Goals"
      />

      {/* Action Plan Table - Behavioural Support */}
      <ActionTable 
        sectionId="about-me"
        subHeading="Behavioural Support"
        actionsKey="behavioural_actions"
        needsGoalsLabel="The support I need with my behavioural needs"
        needsGoalsPrompt="Consider what support is needed to respond to the behavioural needs in a way that promotes safety, regulation, and wellbeing. Use what is known about their behaviour to plan consistent strategies across settings, including routines, relationships, and environments that help reduce distress and encourage positive behaviour."
      />
    </div>
  );
};
