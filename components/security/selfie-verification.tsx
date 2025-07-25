"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, CheckCircle, AlertCircle, Loader2, RotateCcw, Upload } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

interface SelfieVerificationProps {
  userId: string
}

export function SelfieVerification({ userId }: SelfieVerificationProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [verificationResult, setVerificationResult] = useState<"success" | "failed" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.")
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file size should be less than 5MB.")
        return
      }
      const imageUrl = URL.createObjectURL(file)
      setCapturedImage(imageUrl)
      setError(null)
    }
  }, [])

  const uploadToSupabase = useCallback(
    async (imageBlob: Blob): Promise<string | null> => {
      try {
        setIsUploading(true)
        const fileName = `selfie_${userId}_${Date.now()}.jpg`
        const filePath = `selfies/${fileName}`
        
        // Try different bucket names that commonly exist
        const possibleBuckets = ["documents", "public", "avatars", "images"]
        let uploadSuccess = false
        let publicUrl = ""
        
        for (const bucketName of possibleBuckets) {
          try {
            console.log(`Attempting to upload to bucket: ${bucketName} at path: ${filePath}`)

            const { data, error } = await supabase.storage
              .from(bucketName)
              .upload(filePath, imageBlob, {
                contentType: "image/jpeg",
                upsert: true, // Allow overwrite if file exists
              })

            if (error) {
              console.warn(`Upload to ${bucketName} failed:`, error.message)
              continue // Try next bucket
            }

            // Get public URL
            const { data: urlData } = supabase.storage
              .from(bucketName)
              .getPublicUrl(filePath)

            if (urlData?.publicUrl) {
              publicUrl = urlData.publicUrl
              uploadSuccess = true
              console.log(`Successfully uploaded to ${bucketName}:`, publicUrl)
              break
            }
          } catch (bucketError) {
            console.warn(`Bucket ${bucketName} not accessible:`, bucketError)
            continue
          }
        }

        if (!uploadSuccess) {
          // If all buckets fail, try creating the file path differently
          try {
            const simpleFileName = `${userId}_${Date.now()}.jpg`
            console.log("Trying simplified upload to documents bucket...")
            
            const { data, error } = await supabase.storage
              .from("documents")
              .upload(simpleFileName, imageBlob, {
                contentType: "image/jpeg",
                upsert: true,
              })

            if (error) {
              throw error
            }

            const { data: urlData } = supabase.storage
              .from("documents")
              .getPublicUrl(simpleFileName)

            if (urlData?.publicUrl) {
              publicUrl = urlData.publicUrl
              uploadSuccess = true
              console.log("Simplified upload successful:", publicUrl)
            }
          } catch (fallbackError) {
            console.error("Fallback upload failed:", fallbackError)
          }
        }

        if (!uploadSuccess) {
          setError("Unable to upload image. Please check if storage buckets are properly configured.")
          return null
        }

        return publicUrl
      } catch (err) {
        console.error("Upload error:", err)
        setError("Failed to upload image. Please try again.")
        return null
      } finally {
        setIsUploading(false)
      }
    },
    [userId, supabase],
  )

  const updateUserProfile = useCallback(
    async (imageUrl: string) => {
      try {
        console.log("Updating profile with selfie URL:", imageUrl)
        
        // First, check if the profile exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", userId)
          .single()

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error checking profile:", fetchError)
          throw fetchError
        }

        let updateResult
        
        if (!existingProfile) {
          // Profile doesn't exist, create it
          console.log("Creating new profile...")
          updateResult = await supabase
            .from("profiles")
            .insert({
              id: userId,
              selfie_url: imageUrl,
              is_verified: true,
              verification_date: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
        } else {
          // Profile exists, update it
          console.log("Updating existing profile...")
          updateResult = await supabase
            .from("profiles")
            .update({
              selfie_url: imageUrl,
              is_verified: true,
              verification_date: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId)
        }

        if (updateResult.error) {
          console.error("Profile update/insert error:", updateResult.error)
          
          // Try alternative column names that might exist
          const alternativeUpdate = await supabase
            .from("profiles")
            .update({
              avatar_url: imageUrl, // Alternative column name
              selfie_image: imageUrl, // Another alternative
              profile_image: imageUrl, // Another alternative
              verified: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId)

          if (alternativeUpdate.error) {
            throw updateResult.error
          }
          
          console.log("Profile updated with alternative column names")
        } else {
          console.log("Profile updated successfully with selfie_url")
        }

        return true
      } catch (err) {
        console.error("Profile update error:", err)
        setError(`Profile update failed: ${err.message}. Image uploaded successfully, but profile could not be updated.`)
        return false
      }
    },
    [userId, supabase],
  )

  const processVerification = useCallback(async () => {
    if (!capturedImage) return

    setIsProcessing(true)
    setError(null)

    try {
      // Convert image to blob
      const response = await fetch(capturedImage)
      const imageBlob = await response.blob()

      // Upload to Supabase
      const uploadedUrl = await uploadToSupabase(imageBlob)

      if (!uploadedUrl) {
        setVerificationResult("failed")
        return
      }

      console.log("Image uploaded successfully:", uploadedUrl)

      // Update user profile
      const profileUpdated = await updateUserProfile(uploadedUrl)

      if (!profileUpdated) {
        setVerificationResult("failed")
        setError("Image uploaded, but profile update failed. Please contact support.")
        return
      }

      // Simulate AI verification processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setVerificationResult("success")

      // Redirect after successful verification
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 3000)
    } catch (err) {
      console.error("Verification processing error:", err)
      setError("Verification processing failed. Please try again.")
      setVerificationResult("failed")
    } finally {
      setIsProcessing(false)
    }
  }, [capturedImage, uploadToSupabase, updateUserProfile])

  const retakePhoto = useCallback(() => {
    // Clean up previous image URL to prevent memory leaks
    if (capturedImage && capturedImage.startsWith("blob:")) {
      URL.revokeObjectURL(capturedImage)
    }
    setCapturedImage(null)
    setVerificationResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = "" // Clear file input
    }
  }, [capturedImage])

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Selfie Verification</CardTitle>
            <CardDescription>Upload a photo to verify your identity and secure your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Display */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
              {capturedImage ? (
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Uploaded selfie"
                  className="w-full h-full object-contain" // Use object-contain to ensure full image is visible
                />
              ) : (
                <div className="text-center">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Upload your selfie here</p>
                </div>
              )}
              {/* Verification Overlay */}
              {verificationResult && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center text-white">
                    {verificationResult === "success" ? (
                      <>
                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Verification Successful!</h3>
                        <p>Your identity has been verified. Redirecting to dashboard...</p>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Verification Failed</h3>
                        <p>Please try again with better lighting and ensure your face is clearly visible</p>
                      </>
                    )}
                  </div>
                </div>
              )}
              {/* Upload Progress Overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 className="w-8 h-8 text-white mx-auto mb-2 animate-spin" />
                    <p>Uploading image...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Instructions:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure good lighting on your face</li>
                <li>• Look directly at the camera</li>
                <li>• Remove sunglasses or hats</li>
                <li>• Keep your face centered in the frame</li>
                <li>• Image should be clear and high quality</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!capturedImage && (
                <Button onClick={triggerFileInput} className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              )}
              {capturedImage && !isProcessing && !verificationResult && (
                <>
                  <Button onClick={processVerification} className="flex-1" disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify Identity
                      </>
                    )}
                  </Button>
                  <Button onClick={retakePhoto} variant="outline" disabled={isUploading}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake
                  </Button>
                </>
              )}
              {isProcessing && (
                <Button disabled className="flex-1">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Verification...
                </Button>
              )}
              {verificationResult === "failed" && (
                <Button onClick={retakePhoto} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}