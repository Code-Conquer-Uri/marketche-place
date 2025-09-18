"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getProductAction, updateProductAction } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { GetProductResponseDto, UpdateProductBodyDto } from "@/http";
import { cn } from "@/lib/utils";

const editProductSchema = z.object({
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Imagem deve ter no máximo 5MB",
    )
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        ),
      "Imagem deve ser uma imagem (JPEG, PNG ou WebP)",
    ),
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(100, "Título deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(500, "Descrição deve ter no máximo 500 caracteres"),
  price: z
    .number()
    .min(0.01, "Preço deve ser maior que zero")
    .max(999999.99, "Preço deve ser menor que R$ 999.999,99"),
});

type EditProductFormData = z.infer<typeof editProductSchema>;

interface FileUploadAreaProps {
  label: string;
  accept: string;
  onDrop: (acceptedFiles: File[]) => void;
  uploadedFile: File | null;
  currentImageUrl?: string;
  onRemove: () => void;
  maxSizeText: string;
}

const FileUploadArea: FC<FileUploadAreaProps> = ({
  label,
  accept,
  onDrop,
  uploadedFile,
  currentImageUrl,
  onRemove,
  maxSizeText,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const hasImage = uploadedFile || currentImageUrl;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <FormLabel className="text-base font-semibold mb-4 block">
          {label} (Opcional)
        </FormLabel>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 hover:border-primary/50",
            isDragActive
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-muted-foreground/25",
            hasImage && "border-green-500 bg-green-50/50",
          )}
        >
          <input {...getInputProps()} />

          {hasImage ? (
            <div className="space-y-4">
              <div className="relative w-full h-32 rounded-md overflow-hidden border mx-auto max-w-sm">
                <Image
                  src={
                    uploadedFile
                      ? URL.createObjectURL(uploadedFile)
                      : currentImageUrl || ""
                  }
                  alt={`${label} preview`}
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-700">
                  {uploadedFile ? uploadedFile.name : "Imagem atual"}
                </p>
                {uploadedFile && (
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {isDragActive
                    ? "Solte a imagem aqui"
                    : `Alterar ${label.toLowerCase()}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Arraste e solte ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground">{maxSizeText}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const EditProductModal: FC<{
  productId: string;
  children: ReactNode;
}> = ({ children, productId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentProduct, setCurrentProduct] = useState<
    GetProductResponseDto["product"] | null
  >(null);

  // Load product data when modal opens
  useEffect(() => {
    if (isOpen && productId) {
      const loadProduct = async () => {
        setIsLoading(true);
        try {
          const [error, product] = await getProductAction(productId);
          if (error) {
            console.error("Error loading product:", error);
            return;
          }

          if (product) {
            setCurrentProduct(product.product);
            form.reset({
              title: product.product.title,
              description: product.product.description,
              price: product.product.price,
            });
          }
        } catch (error) {
          console.error("Error loading product:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadProduct();
    }
  }, [isOpen, productId, form]);

  const onImageDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setImageFile(file);
        form.setValue("image", file);
        form.clearErrors("image");
      }
    },
    [form],
  );

  const removeImage = () => {
    setImageFile(null);
    form.setValue("image", undefined);
  };

  const onSubmit = async (data: EditProductFormData) => {
    try {
      setIsSubmitting(true);

      const updateData: UpdateProductBodyDto = {
        title: data.title,
        description: data.description,
        price: data.price,
      };

      // Only include image if a new one was uploaded
      if (data.image) {
        const imageBase64 = await fileToBase64(data.image);
        updateData.image = imageBase64;
      }

      await updateProductAction(productId, updateData);

      // Reset form and close modal on success
      form.reset();
      setImageFile(null);
      setCurrentProduct(null);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileToBase64 = async (file: File): Promise<string> => {
    const buffer = Buffer.from(await file.arrayBuffer());
    return buffer.toString("base64");
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when closing
      form.reset();
      setImageFile(null);
      setCurrentProduct(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Editar Produto
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Carregando produto...</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Image Upload */}
              <FileUploadArea
                label="Imagem do Produto"
                accept="image/*"
                onDrop={onImageDrop}
                uploadedFile={imageFile}
                currentImageUrl={currentProduct?.imageUrl}
                onRemove={removeImage}
                maxSizeText="Máx. 5MB (JPEG, PNG, WebP)"
              />

              {/* Form Fields */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Produto</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Camiseta Básica"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o produto..."
                          {...field}
                          className="min-h-[100px] resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    "Salvando..."
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
