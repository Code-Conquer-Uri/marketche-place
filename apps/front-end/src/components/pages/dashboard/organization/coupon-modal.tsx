"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createCouponAction,
  deleteCouponAction,
  getCouponAction,
  updateCouponAction,
} from "@/actions/coupon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import type {
  CreateCouponBodyDto,
  GetCouponResponseDto,
  UpdateCouponBodyDto,
} from "@/http";

type CouponModalMode = "create" | "edit" | "delete";

const createCouponSchema = z.object({
  discountPercentage: z
    .number()
    .min(0.01, "Desconto deve ser maior que zero")
    .max(100, "Desconto deve ser menor ou igual a 100%"),
  maxQuantity: z
    .number()
    .int("Quantidade deve ser um número inteiro")
    .min(1, "Quantidade deve ser pelo menos 1"),
});

const updateCouponSchema = z.object({
  discountPercentage: z
    .number()
    .min(0.01, "Desconto deve ser maior que zero")
    .max(100, "Desconto deve ser menor ou igual a 100%")
    .optional(),
  maxQuantity: z
    .number()
    .int("Quantidade deve ser um número inteiro")
    .min(1, "Quantidade deve ser pelo menos 1")
    .optional(),
  currentQuantity: z
    .number()
    .int("Quantidade deve ser um número inteiro")
    .min(0, "Quantidade atual deve ser maior ou igual a zero")
    .optional(),
});

type CreateCouponFormData = z.infer<typeof createCouponSchema>;
type UpdateCouponFormData = z.infer<typeof updateCouponSchema>;

interface CouponModalProps {
  mode: CouponModalMode;
  productId: string;
  couponId?: string;
  children: ReactNode;
}

export const CouponModal: FC<CouponModalProps> = ({
  mode,
  productId,
  couponId,
  children,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createForm = useForm<CreateCouponFormData>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      discountPercentage: 0,
      maxQuantity: 1,
    },
  });

  const updateForm = useForm<UpdateCouponFormData>({
    resolver: zodResolver(updateCouponSchema),
    defaultValues: {
      discountPercentage: undefined,
      maxQuantity: undefined,
      currentQuantity: undefined,
    },
  });

  const [currentCoupon, setCurrentCoupon] = useState<
    GetCouponResponseDto["coupon"] | null
  >(null);

  // Load coupon data when modal opens in edit mode
  useEffect(() => {
    if (isOpen && mode === "edit" && couponId) {
      const loadCoupon = async () => {
        setIsLoading(true);
        try {
          const [error, coupon] = await getCouponAction(couponId);
          if (error) {
            console.error("Error loading coupon:", error);
            return;
          }

          if (coupon) {
            setCurrentCoupon(coupon.coupon);
            updateForm.reset({
              discountPercentage: coupon.coupon.discountPercentage,
              maxQuantity: coupon.coupon.maxQuantity,
              currentQuantity: coupon.coupon.currentQuantity,
            });
          }
        } catch (error) {
          console.error("Error loading coupon:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadCoupon();
    }
  }, [isOpen, mode, couponId, updateForm]);

  const handleCreateSubmit = async (data: CreateCouponFormData) => {
    try {
      setIsSubmitting(true);

      const createData: CreateCouponBodyDto = {
        productId,
        discountPercentage: data.discountPercentage,
        maxQuantity: data.maxQuantity,
      };

      await createCouponAction(createData);

      // Reset form and close modal on success
      createForm.reset();
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating coupon:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (data: UpdateCouponFormData) => {
    if (!couponId) return;

    try {
      setIsSubmitting(true);

      const updateData: UpdateCouponBodyDto = {};

      if (data.discountPercentage !== undefined) {
        updateData.discountPercentage = data.discountPercentage;
      }
      if (data.maxQuantity !== undefined) {
        updateData.maxQuantity = data.maxQuantity;
      }
      if (data.currentQuantity !== undefined) {
        updateData.currentQuantity = data.currentQuantity;
      }

      await updateCouponAction(couponId, updateData);

      // Reset form and close modal on success
      updateForm.reset();
      setCurrentCoupon(null);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating coupon:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!couponId) return;

    try {
      setIsSubmitting(true);
      await deleteCouponAction(couponId);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting coupon:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset forms when closing
      createForm.reset();
      updateForm.reset();
      setCurrentCoupon(null);
    }
  };

  const getDialogTitle = () => {
    switch (mode) {
      case "create":
        return "Criar Cupom";
      case "edit":
        return "Editar Cupom";
      case "delete":
        return "Excluir Cupom";
      default:
        return "Cupom";
    }
  };

  const renderContent = () => {
    if (mode === "delete") {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Cupom
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este cupom? Esta ação não pode
                ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isSubmitting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isSubmitting ? "Excluindo..." : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }

    const isEdit = mode === "edit";
    const form = isEdit ? updateForm : createForm;
    const onSubmit = isEdit ? handleUpdateSubmit : handleCreateSubmit;

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Carregando cupom...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="discountPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="10.00"
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

              <FormField
                control={form.control}
                name="maxQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade Máxima</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="100"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEdit && (
                <FormField
                  control={form.control}
                  name="currentQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade Atual (Opcional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder={
                            currentCoupon?.currentQuantity?.toString() || "0"
                          }
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            )
                          }
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}

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
                  {isEdit ? "Salvar" : "Criar"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
