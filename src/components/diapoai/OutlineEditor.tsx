
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, MoveUp, MoveDown } from "lucide-react";

interface Section {
  section: string;
  subsections: string[];
}

interface OutlineEditorProps {
  outline: Section[];
  onChange: (outline: Section[]) => void;
}

const OutlineEditor = ({ outline, onChange }: OutlineEditorProps) => {
  const [editableOutline, setEditableOutline] = useState<Section[]>([]);

  useEffect(() => {
    setEditableOutline(JSON.parse(JSON.stringify(outline)));
  }, [outline]);

  const updateOutline = (newOutline: Section[]) => {
    setEditableOutline(newOutline);
    onChange(newOutline);
  };

  const handleSectionChange = (index: number, value: string) => {
    const newOutline = [...editableOutline];
    newOutline[index].section = value;
    updateOutline(newOutline);
  };

  const handleSubsectionChange = (sectionIndex: number, subsectionIndex: number, value: string) => {
    const newOutline = [...editableOutline];
    newOutline[sectionIndex].subsections[subsectionIndex] = value;
    updateOutline(newOutline);
  };

  const addSection = () => {
    updateOutline([...editableOutline, { section: "Nouvelle section", subsections: ["Sous-section"] }]);
  };

  const addSubsection = (sectionIndex: number) => {
    const newOutline = [...editableOutline];
    newOutline[sectionIndex].subsections.push("Nouvelle sous-section");
    updateOutline(newOutline);
  };

  const removeSection = (index: number) => {
    const newOutline = [...editableOutline];
    newOutline.splice(index, 1);
    updateOutline(newOutline);
  };

  const removeSubsection = (sectionIndex: number, subsectionIndex: number) => {
    const newOutline = [...editableOutline];
    newOutline[sectionIndex].subsections.splice(subsectionIndex, 1);
    updateOutline(newOutline);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || 
        (direction === "down" && index === editableOutline.length - 1)) {
      return;
    }
    
    const newOutline = [...editableOutline];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    [newOutline[index], newOutline[targetIndex]] = [newOutline[targetIndex], newOutline[index]];
    updateOutline(newOutline);
  };

  const moveSubsection = (sectionIndex: number, subsectionIndex: number, direction: "up" | "down") => {
    const subsections = editableOutline[sectionIndex].subsections;
    
    if ((direction === "up" && subsectionIndex === 0) || 
        (direction === "down" && subsectionIndex === subsections.length - 1)) {
      return;
    }
    
    const newOutline = [...editableOutline];
    const targetIndex = direction === "up" ? subsectionIndex - 1 : subsectionIndex + 1;
    
    [newOutline[sectionIndex].subsections[subsectionIndex], newOutline[sectionIndex].subsections[targetIndex]] = 
      [newOutline[sectionIndex].subsections[targetIndex], newOutline[sectionIndex].subsections[subsectionIndex]];
    
    updateOutline(newOutline);
  };

  if (!editableOutline.length) {
    return <div>Chargement du plan...</div>;
  }

  return (
    <div className="space-y-6">
      {editableOutline.map((section, sectionIndex) => (
        <div key={sectionIndex} className="border p-4 rounded-md bg-gray-50">
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex-grow">
              <label className="text-sm font-medium mb-1 block">Section</label>
              <Input
                value={section.section}
                onChange={(e) => handleSectionChange(sectionIndex, e.target.value)}
                className="font-medium"
              />
            </div>
            <div className="flex space-x-1">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => moveSection(sectionIndex, "up")}
                disabled={sectionIndex === 0}
              >
                <MoveUp className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => moveSection(sectionIndex, "down")}
                disabled={sectionIndex === editableOutline.length - 1}
              >
                <MoveDown className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => removeSection(sectionIndex)}
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="pl-4 border-l-2 border-gray-200 space-y-2">
            <label className="text-sm font-medium mb-1 block">Sous-sections</label>
            
            {section.subsections.map((subsection, subsectionIndex) => (
              <div key={subsectionIndex} className="flex items-center space-x-2">
                <Input
                  value={subsection}
                  onChange={(e) => handleSubsectionChange(sectionIndex, subsectionIndex, e.target.value)}
                  className="flex-grow"
                />
                <div className="flex space-x-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => moveSubsection(sectionIndex, subsectionIndex, "up")}
                    disabled={subsectionIndex === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => moveSubsection(sectionIndex, subsectionIndex, "down")}
                    disabled={subsectionIndex === section.subsections.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => removeSubsection(sectionIndex, subsectionIndex)}
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    disabled={section.subsections.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => addSubsection(sectionIndex)}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" /> Ajouter une sous-section
            </Button>
          </div>
        </div>
      ))}
      
      <Button onClick={addSection} className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Ajouter une section
      </Button>
    </div>
  );
};

export default OutlineEditor;
