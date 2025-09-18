"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, ReactNode, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createStoreFrontAction } from "@/actions/store-front";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const AddOrganizationHeaderModal: FC<{
  organizationId: string;
  children: ReactNode;
}> = ({ children, organizationId }) => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedImage(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleUploadImage = async () => {
    if (uploadedImage) {
      const buffer = Buffer.from(await uploadedImage.arrayBuffer());
      const imageBase64 = buffer.toString("base64");

      await createStoreFrontAction({
        organizationId,
        bannerImage: imageBase64,
        location: "dasdasd",
        logoImage: imageBase64,
        whatsappNumber: "123123213",
      });

      router.refresh();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicione uma imagem</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }
            `}
          >
            <input {...getInputProps()} />
            {uploadedImage ? (
              <div className="space-y-4">
                <div className="relative w-full h-48 rounded-md overflow-hidden border">
                  <Image
                    src={URL.createObjectURL(uploadedImage)}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {uploadedImage.name}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>gattaca</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {isDragActive
                      ? "Solte a imagem aqui"
                      : "Carregar nova foto"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Arraste e solte ou clique para selecionar
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setUploadedImage(null)}
            >
              Excluir foto
            </button>
            <button
              type="button"
              onClick={handleUploadImage}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              disabled={!uploadedImage}
            >
              Salvar
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Gattaca</title>

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
