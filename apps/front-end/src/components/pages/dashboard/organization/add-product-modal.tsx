"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, ReactNode, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createProductAction } from "@/actions/product";
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
import { cn } from "@/lib/utils";

const productSchema = z.object({
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Imagem deve ter no máximo 5MB",
    )
    .refine(
      (file) =>
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

type ProductFormData = z.infer<typeof productSchema>;

interface FileUploadAreaProps {
  label: string;
  accept: string;
  onDrop: (acceptedFiles: File[]) => void;
  uploadedFile: File | null;
  onRemove: () => void;
  maxSizeText: string;
}

const FileUploadArea: FC<FileUploadAreaProps> = ({
  label,
  accept,
  onDrop,
  uploadedFile,
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

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <FormLabel className="text-base font-semibold mb-4 block">
          {label}
        </FormLabel>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 hover:border-primary/50",
            isDragActive
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-muted-foreground/25",
            uploadedFile && "border-green-500 bg-green-50/50",
          )}
        >
          <input {...getInputProps()} />

          {uploadedFile ? (
            <div className="space-y-4">
              <div className="relative w-full h-32 rounded-md overflow-hidden border mx-auto max-w-sm">
                <Image
                  src={URL.createObjectURL(uploadedFile)}
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
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
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
                    : `Carregar ${label.toLowerCase()}`}
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

export const AddProductModal: FC<{
  organizationId: string;
  children: ReactNode;
}> = ({ children, organizationId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

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
    form.setValue("image", {} as File);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);

      const imageBase64 = await fileToBase64(data.image);

      await createProductAction({
        organizationId,
        image: imageBase64,
        title: data.title,
        description: data.description,
        price: data.price,
      });

      // Reset form and close modal on success
      form.reset();
      setImageFile(null);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileToBase64 = async (file: File): Promise<string> => {
    const buffer = Buffer.from(await file.arrayBuffer());
    return buffer.toString("base64");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Adicionar Produto
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <FileUploadArea
              label="Imagem do Produto"
              accept="image/*"
              onDrop={onImageDrop}
              uploadedFile={imageFile}
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
                onClick={() => {
                  form.reset();
                  setImageFile(null);
                }}
                disabled={isSubmitting}
              >
                Limpar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !imageFile}
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
      </DialogContent>
    </Dialog>
  );
};
