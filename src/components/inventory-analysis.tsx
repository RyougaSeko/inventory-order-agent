"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, X } from "lucide-react"
import { AnalysisResults } from "./analysis-results"

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

export function InventoryAnalysis() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setAnalyzing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setAnalyzing(false)
    setDialogOpen(false)
    setResultsDialogOpen(true)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
  }

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Loading...</div>
        </CardContent>
      </Card>
    )
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
              Upload Inventory Image
              <Upload className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload Inventory Image</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center w-full">
                {preview ? (
                  <div className="relative w-full">
                    <img src={preview || "/placeholder.svg"} alt="Preview" className="max-w-full h-auto rounded-lg" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                  </label>
                )}
                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </div>
              <Button onClick={handleUpload} disabled={!file || analyzing}>
                {analyzing ? (
                  <>
                    <span className="thinking-dots mr-2">Analyzing</span>
                    <div className="spinner"></div>
                  </>
                ) : (
                  "Analyze Inventory"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {file && !dialogOpen && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Last uploaded: {file.name}</p>
            <Button variant="outline" className="mt-2" onClick={() => setDialogOpen(true)}>
              View Image
            </Button>
          </div>
        )}

        <AnalysisResults open={resultsDialogOpen} onOpenChange={setResultsDialogOpen} items={analysisResults} />
      </CardContent>
    </Card>
  )
}

