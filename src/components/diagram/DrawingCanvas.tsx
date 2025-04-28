
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Line } from "fabric";
import { Button } from "@/components/ui/button";
import { Eraser, Pencil, Undo2, Delete } from "lucide-react";

interface DrawingCanvasProps {
  onDrawingComplete: (drawingDataUrl: string) => void;
}

export function DrawingCanvas({ onDrawingComplete }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [drawingMode, setDrawingMode] = useState<"draw" | "erase">("draw");

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    // Initialize the drawing brush
    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.color = "#000000";

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    if (drawingMode === "erase") {
      fabricCanvas.freeDrawingBrush.width = 20;
      fabricCanvas.freeDrawingBrush.color = "#ffffff";
    } else {
      fabricCanvas.freeDrawingBrush.width = 2;
      fabricCanvas.freeDrawingBrush.color = "#000000";
    }
  }, [drawingMode, fabricCanvas]);

  const handleUndo = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      const lastObject = objects[objects.length - 1];
      fabricCanvas.remove(lastObject);
      fabricCanvas.renderAll();
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
  };

  const handleComplete = () => {
    if (!fabricCanvas) return;
    const drawingDataUrl = fabricCanvas.toDataURL({
      format: "png",
      quality: 1
    });
    onDrawingComplete(drawingDataUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Button
          variant={drawingMode === "draw" ? "default" : "outline"}
          onClick={() => setDrawingMode("draw")}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Dessiner
        </Button>
        <Button
          variant={drawingMode === "erase" ? "default" : "outline"}
          onClick={() => setDrawingMode("erase")}
        >
          <Eraser className="mr-2 h-4 w-4" />
          Gommer
        </Button>
        <Button variant="outline" onClick={handleUndo}>
          <Undo2 className="mr-2 h-4 w-4" />
          Annuler
        </Button>
        <Button variant="outline" onClick={handleClear}>
          <Delete className="mr-2 h-4 w-4" />
          Effacer tout
        </Button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <canvas ref={canvasRef} />
      </div>

      <Button onClick={handleComplete} className="w-full">
        Utiliser ce schéma
      </Button>
    </div>
  );
}
