import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type FormationType = "all" | "presentielle" | "mixte" | "a-distance";

interface FormationFiltersProps {
  selectedType: FormationType;
  onTypeChange: (type: FormationType) => void;
}

const FormationFilters = ({ selectedType, onTypeChange }: FormationFiltersProps) => {
  return (
    <div className="w-full md:w-[200px]">
      <Select value={selectedType} onValueChange={(value) => onTypeChange(value as FormationType)}>
        <SelectTrigger>
          <SelectValue placeholder="Type de formation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          <SelectItem value="presentielle">Présentielle</SelectItem>
          <SelectItem value="mixte">Mixte</SelectItem>
          <SelectItem value="a-distance">À distance</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FormationFilters;