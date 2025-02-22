"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, X, ImagePlus, Loader2 } from "lucide-react"
import { AnalysisResults } from "./analysis-results"
import { toast } from "sonner"
import Image from "next/image"

interface ImageFile {
  file: File
  preview: string
  id: string
}

interface Supplier {
  id: string
  name: string
  price: number
  deliveryDays: number
}

interface InventoryItem {
  name: string
  current: number
  max: number
  status: "Sufficient" | "Low"
  supplier?: Supplier
  suggestedOrderQuantity?: number
}

const MAX_IMAGES = 5
const MAX_FILE_SIZE_MB = 5

export function InventoryAnalysis() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false)

  const analysisResults: InventoryItem[] = [
    {
      name: "Chicken Breast",
      current: 50,
      max: 100,
      status: "Sufficient",
    },
    {
      name: "Tomatoes",
      current: 30,
      max: 50,
      status: "Sufficient",
    },
    {
      name: "Spaghetti Pasta",
      current: 100,
      max: 150,
      status: "Sufficient",
    },
    {
      name: "Olive Oil",
      current: 10,
      max: 30,
      status: "Low",
      supplier: {
        id: "s1",
        name: "Mediterranean Foods Inc.",
        price: 15.0,
        deliveryDays: 3,
      },
      suggestedOrderQuantity: 20,
    },
  ]

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      
      if (images.length + newFiles.length > MAX_IMAGES) {
        toast.error(`Maximum ${MAX_IMAGES} images allowed`)
        return
      }

      newFiles.forEach(file => {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          toast.error(`File ${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit`)
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          const target = e.target
          if (target && target.result) {
            setImages(prev => [...prev, {
              file,
              preview: target.result as string,
              id: crypto.randomUUID()
            }])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const handleUpload = async () => {
    if (images.length === 0) {
      toast.error("Please select at least one image")
      return
    }
    
    setAnalyzing(true)
    try {
      // Simulate API call for multiple image analysis
      await Promise.all(images.map(() => 
        new Promise(resolve => setTimeout(resolve, 1000))
      ))
      
      setDialogOpen(false)
      setResultsDialogOpen(true)
      toast.success("Analysis complete")
    } catch (err) {
      console.error("Analysis failed:", err)
      toast.error("Failed to analyze images")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              Upload Inventory Images
              <Upload className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Upload Inventory Images</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-wrap gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative w-32 h-32">
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
                      onClick={() => handleRemoveImage(image.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {images.length < MAX_IMAGES && (
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImagePlus className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-xs text-gray-500 text-center">
                        Click to add
                        <br />
                        {`(${images.length}/${MAX_IMAGES})`}
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                      multiple
                    />
                  </label>
                )}
              </div>
              <Button
                onClick={handleUpload}
                disabled={analyzing || images.length === 0}
                className="w-full"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Images...
                  </>
                ) : (
                  "Analyze Inventory"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {images.length > 0 && !dialogOpen && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {images.length} {images.length === 1 ? "image" : "images"} selected
            </p>
            <Button variant="outline" className="mt-2" onClick={() => setDialogOpen(true)}>
              View Images
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
  )
}

