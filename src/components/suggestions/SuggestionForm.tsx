
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { NavigateFunction } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/hooks/use-language";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
  category: z.string({
    required_error: "Veuillez sélectionner une catégorie.",
  }),
  username: z.string().min(2, {
    message: "Le pseudo doit contenir au moins 2 caractères.",
  }),
});

type ToolSuggestion = {
  id: string;
  name: string;
  description: string;
  website: string;
  category: string;
  submitted_by: string;
  created_at: string;
  status: string;
  upvotes_count: number;
  downvotes_count: number;
  user_vote?: string | null;
};

type SuggestionFormProps = {
  setSuggestions: React.Dispatch<React.SetStateAction<ToolSuggestion[]>>;
  user: any;
  navigate: NavigateFunction;
};

const SuggestionForm = ({ setSuggestions, user, navigate }: SuggestionFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const isMobile = useIsMobile();
  const { t, language } = useLanguage();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      username: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error(t('suggestions.loginToVote'));
      navigate('/auth');
      return;
    }
    
    setSubmitting(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username: values.username })
        .eq('id', user.id);
        
      if (profileError) {
        console.error('Erreur lors de la mise à jour du profil:', profileError);
      }
      
      const { data, error } = await supabase
        .from('tool_suggestions')
        .insert([
          {
            name: values.name,
            description: values.description,
            website: "",
            category: values.category,
            submitted_by: user.id
          }
        ])
        .select();
      
      if (error) throw error;
      
      form.reset();
      toast.success(t('suggestions.submissionSuccess'));
      
      if (data && data[0]) {
        setSuggestions(prev => [...prev, {
          ...data[0],
          upvotes_count: 0,
          downvotes_count: 0,
          username: values.username
        }]);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error(t('suggestions.submissionError'));
    } finally {
      setSubmitting(false);
    }
  };

  const getFormErrorMessage = (fieldName: string, defaultMessage: string) => {
    return language === 'fr' ? defaultMessage : t(`suggestions.form.errors.${fieldName}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 mt-3 md:mt-4 font-dmsans">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-1 md:space-y-2">
              <FormLabel className="font-dmsans text-sm md:text-base">{t('suggestions.form.username')}</FormLabel>
              <FormControl>
                <Input placeholder={t('suggestions.form.usernamePlaceholder')} {...field} className="font-dmsans text-sm md:text-base h-9 md:h-10" />
              </FormControl>
              <FormDescription className="font-dmsans text-xs md:text-sm">
                {t('suggestions.form.usernameDescription')}
              </FormDescription>
              <FormMessage className="font-dmsans text-xs md:text-sm" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1 md:space-y-2">
              <FormLabel className="font-dmsans text-sm md:text-base">{t('suggestions.form.toolName')}</FormLabel>
              <FormControl>
                <Input placeholder={t('suggestions.form.toolNamePlaceholder')} {...field} className="font-dmsans text-sm md:text-base h-9 md:h-10" />
              </FormControl>
              <FormMessage className="font-dmsans text-xs md:text-sm" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-1 md:space-y-2">
              <FormLabel className="font-dmsans text-sm md:text-base">{t('suggestions.form.description')}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t('suggestions.form.descriptionPlaceholder')} 
                  {...field} 
                  className="font-dmsans text-sm md:text-base min-h-[80px] md:min-h-[100px]"
                />
              </FormControl>
              <FormMessage className="font-dmsans text-xs md:text-sm" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="space-y-1 md:space-y-2">
              <FormLabel className="font-dmsans text-sm md:text-base">{t('suggestions.form.category')}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="font-dmsans text-sm md:text-base h-9 md:h-10">
                    <SelectValue placeholder={t('suggestions.form.categoryPlaceholder')} className="font-dmsans" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="font-dmsans">
                  <SelectItem value="conception" className="font-dmsans text-sm md:text-base">{t('suggestions.form.categories.conception')}</SelectItem>
                  <SelectItem value="realisation" className="font-dmsans text-sm md:text-base">{t('suggestions.form.categories.realization')}</SelectItem>
                  <SelectItem value="analyse" className="font-dmsans text-sm md:text-base">{t('suggestions.form.categories.analysis')}</SelectItem>
                  <SelectItem value="autre" className="font-dmsans text-sm md:text-base">{t('suggestions.form.categories.other')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="font-dmsans text-xs md:text-sm" />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-[#9b87f5] text-white hover:bg-[#8B5CF6] font-dmsans text-sm md:text-base h-9 md:h-10 mt-2 md:mt-4"
          disabled={submitting}
        >
          {submitting ? t('suggestions.form.submitting') : t('suggestions.form.submit')}
        </Button>
        
        {!user && (
          <FormDescription className="text-yellow-600 font-dmsans text-xs md:text-sm">
            {t('suggestions.form.loginRequired')}
          </FormDescription>
        )}
      </form>
    </Form>
  );
};

export default SuggestionForm;
