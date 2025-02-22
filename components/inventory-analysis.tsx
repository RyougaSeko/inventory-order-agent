"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, X, ImagePlus, Loader2 } from "lucide-react";
import { AnalysisResults } from "./analysis-results";
import { toast } from "sonner";
import { reorderPoints, InventoryItem } from "@/types/inventory";
import Image from "next/image";

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

const MAX_FILE_SIZE_MB = 5;

interface InventoryAnalysisProps {
  onAnalysisComplete: (items: InventoryItem[]) => void;
}

export function InventoryAnalysis({
  onAnalysisComplete,
}: InventoryAnalysisProps) {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<InventoryItem[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const target = e.target;
        if (target && target.result) {
          setImage({
            file,
            preview: target.result as string,
            id: crypto.randomUUID(),
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error("Please select an image");
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: image.preview,
          filename: image.file.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const analysisData = await response.json();

      // Transform the data to include status based on minimum requirements
      const transformedItems = analysisData.map((item: InventoryItem) => ({
        ...item,
        status: item.quantity > reorderPoints[item.name] ? "Sufficient" : "Low",
      }));

      setAnalysisResults(transformedItems);
      onAnalysisComplete(transformedItems);
      setDialogOpen(false);
      setResultsDialogOpen(true);
      toast.success("Analysis complete");
    } catch (error) {
      toast.error("Failed to analyze image");
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              Upload Inventory Image
              <Upload className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Upload Inventory Image</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-wrap gap-4">
                {image ? (
                  <div className="relative w-32 h-32">
                    <Image
                      src={image.preview}
                      alt="Preview"
                      className="object-cover rounded-lg"
                      fill
                      sizes="128px"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImagePlus className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-xs text-gray-500 text-center">
                        Click to add image
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
              <Button
                onClick={handleUpload}
                disabled={analyzing || !image}
                className="w-full"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Image...
                  </>
                ) : (
                  "Analyze Inventory"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {image && !dialogOpen && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">1 image selected</p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => setDialogOpen(true)}
            >
              View Image
            </Button>
          </div>
        )}

        <AnalysisResults
          open={resultsDialogOpen}
          onOpenChange={setResultsDialogOpen}
          items={analysisResults}
        />
      </CardContent>
    </Card>
  );
}
