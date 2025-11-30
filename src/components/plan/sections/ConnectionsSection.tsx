import { Textarea } from "@/components/ui/textarea";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";
import { FieldWithPrompt } from "@/components/plan/FieldWithPrompt";
import { TableField } from "@/components/plan/TableField";

export const ConnectionsSection = () => {
  const { sections, updateField, isReadOnly } = usePlan();
  const data = sections["connections"];

  const parseAttachments = (fieldId: string) => {
    try {
      const val = data?.fields?.[fieldId];
      if (!val) return [];
      return typeof val === 'string' ? JSON.parse(val) : val;
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">My Connections</h2>
        <p className="text-muted-foreground">
          Tell us about the important people in your life
        </p>
      </div>

      <div className="space-y-4">
        <FieldWithPrompt
          label="Friends who are important to me are:"
          prompt="Consider existing friendships they may want to stay connected to and how they can do this."
        >
          <Textarea
            value={data?.fields?.friends || ""}
            onChange={(e) => updateField("connections", "friends", e.target.value)}
            placeholder="Who are the friends that matter to you?"
            autoComplete="off"
            className="min-h-[120px] resize-none"
          />
        </FieldWithPrompt>

        <TableField
          label="My Connections are:"
          columns={[
            { key: "name", label: "Person name" },
            { key: "relationship", label: "Relationship" },
            { key: "contact", label: "Contact details" },
            { key: "arrangements", label: "Contact arrangements", type: "textarea" },
            { key: "support", label: "Support needed to maintain connection", type: "textarea" }
          ]}
          value={typeof data?.fields?.connections === 'string' ? JSON.parse(data?.fields?.connections || '[]') : (data?.fields?.connections || [])}
          onChange={(value) => updateField("connections", "connections", JSON.stringify(value))}
          prompt="Consider any significant people for te tamaiti or rangatahi - Include any court orders and what the current whānau or family contact arrangements look like, such as how often they will be visited and by whom, whether it is supervised, where they will be visited"
          attachments={parseAttachments("connections-attachments")}
          onAttachmentsChange={(attachments) => updateField("connections", "connections-attachments", JSON.stringify(attachments))}
          readOnly={isReadOnly}
        />

        <FieldWithPrompt
          label="People currently unable to have contact with me and why:"
          prompt="Consider any court orders, including non associations orders and what the current whānau or family contact arrangements look like."
        >
          <Textarea
            value={data?.fields?.["no-contact-people"] || ""}
            onChange={(e) => updateField("connections", "no-contact-people", e.target.value)}
            placeholder="List people and rationale..."
            autoComplete="off"
            className="min-h-[100px] resize-none"
          />
        </FieldWithPrompt>

        <FieldWithPrompt
          label="My family, whānau, hapū, iwi, island and village views, wishes and aspirations for me."
          prompt="Views relate to what is thought/expressed about the current situation for the tamaiti. Ensure these perspectives are heard and reflected in planning, recognising their importance in shaping wellbeing, identity, and future goals."
        >
          <Textarea
            value={data?.fields?.["whanau-wishes"] || ""}
            onChange={(e) => updateField("connections", "whanau-wishes", e.target.value)}
            placeholder="What does your family hope for you?"
            autoComplete="off"
            className="min-h-[100px] resize-none"
          />
        </FieldWithPrompt>

        <FieldWithPrompt
          label="Other important people in my life and their views, wishes and aspirations for me."
          prompt="Other important people are people the tamaiti or their whānau or family have identified as important for the tamaiti to maintain contact with, who are not related to the tamaiti by whakapapa. Ensure these perspectives are heard and reflected in planning, recognising their importance in shaping wellbeing, identity, and future goals."
        >
          <Textarea
            value={data?.fields?.["other-important-people"] || ""}
            onChange={(e) => updateField("connections", "other-important-people", e.target.value)}
            placeholder="Other important people and their views..."
            autoComplete="off"
            className="min-h-[100px] resize-none"
          />
        </FieldWithPrompt>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="connections" />
      </div>
    </div>
  );
};
