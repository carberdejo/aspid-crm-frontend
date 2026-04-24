"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  Phone, Briefcase, Save, Loader2 } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateContact } from "@/hooks";
import { ContactFormValues, contactSchema } from "@/lib/schemas/contact";
import { ClientAndContactResponseCreate, Contact } from "@/interfaces";




interface ContactFormProps {
  clientId: number;
  onSuccess: (data?: ClientAndContactResponseCreate<Contact>) => void;
}

export function ContactForm({ clientId, onSuccess }: ContactFormProps) {
  const { mutate, isPending } = useCreateContact();
    console.log({clientId})
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { firstName: "", lastName: "", position: "", phone: "", clientId: +clientId },
  });

  const onSubmit = (values: ContactFormValues) => {
    console.log({form})
    mutate(values, {
      onSuccess: (res) => onSuccess(res),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pb-2">
        <div className="grid grid-cols-2 gap-5">
          <FormField control={form.control} name="firstName" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold text-gray-700 uppercase">Nombre</FormLabel>
              <FormControl><Input placeholder="Ej. Carlos" {...field} className="h-11 border-gray-200" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="lastName" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold text-gray-700 uppercase">Apellido</FormLabel>
              <FormControl><Input placeholder="Ej. Berdejo" {...field} className="h-11 border-gray-200" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="position" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold text-gray-700 uppercase leading-none">Cargo / Puesto</FormLabel>
            <FormControl>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Ej. Gerente de TI" {...field} className="h-11 pl-10 border-gray-200" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold text-gray-700 uppercase">Teléfono Directo</FormLabel>
            <FormControl>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <Input placeholder="999 999 999" {...field} className="h-11 pl-10 border-gray-200" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={() => onSuccess()} className="font-bold text-gray-500">
            CANCELAR
          </Button>
          <Button type="submit" disabled={isPending} className="bg-secondary hover:bg-secondary-dark text-white px-8 h-12 rounded-lg font-black shadow-lg active:scale-95 gap-2">
            {isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            GUARDAR CONTACTO
          </Button>
        </div>
      </form>
    </Form>
  );
}