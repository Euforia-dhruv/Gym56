"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface ImageUploaderProps {
  /** Current image URL (if editing) */
  currentImage?: string | null;
  /** Upload handler — receives FormData with "file" field */
  onUpload: (formData: FormData) => Promise<{ publicUrl: string }>;
  /** Delete handler */
  onDelete?: () => Promise<void>;
  /** Alt text for the uploaded image */
  altText?: string;
  /** Whether this is the primary image */
  isPrimary?: boolean;
  /** Accepted file types */
  accept?: string;
  /** Max file size in bytes */
  maxSize?: number;
  className?: string;
}

export function ImageUploader({
  currentImage,
  onUpload,
  onDelete,
  altText,
  accept = "image/jpeg,image/png,image/webp",
  maxSize = 8 * 1024 * 1024,
  className,
}: ImageUploaderProps) {
  const [preview, setPreview] = React.useState<string | null>(currentImage ?? null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreview(currentImage ?? null);
  }, [currentImage]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = accept.split(",").map((t) => t.trim());
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Accepted: ${allowedTypes.join(", ")}`);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`File too large. Max ${Math.round(maxSize / 1024 / 1024)} MB`);
      return;
    }

    setError(null);

    // Show local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (altText) formData.append("alt_text", altText);

      const result = await onUpload(formData);
      setPreview(result.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(currentImage ?? null);
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setUploading(true);
    try {
      await onDelete();
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center",
          "w-full h-48 rounded-xl border-2 border-dashed transition-colors",
          "bg-white/3",
          preview
            ? "border-transparent"
            : "border-white/10 hover:border-accent/40 hover:bg-accent/5"
        )}
      >
        {preview ? (
          <Image
            src={preview}
            alt={altText ?? "Uploaded image"}
            fill
            className="object-cover rounded-xl"
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <ImageIcon className="w-8 h-8" aria-hidden="true" />
            <p className="text-sm font-medium">Click to upload image</p>
            <p className="text-xs text-gray-600">
              JPEG, PNG, or WebP — Max {Math.round(maxSize / 1024 / 1024)} MB
            </p>
          </div>
        )}

        {/* Upload overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-accent animate-spin" aria-label="Uploading…" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
          aria-label="Choose image file"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="w-4 h-4" aria-hidden="true" />
          {currentImage ? "Change Image" : "Upload Image"}
        </Button>

        {currentImage && onDelete && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleDelete}
            disabled={uploading}
          >
            <X className="w-4 h-4" aria-hidden="true" />
            Remove
          </Button>
        )}
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
