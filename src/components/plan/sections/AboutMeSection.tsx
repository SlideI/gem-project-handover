import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { usePlan } from "@/contexts/PlanContext";

export const AboutMeSection = () => {
  const { sections, updateField } = usePlan();
  const section = sections["about-me"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">About Me</h1>
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
