
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
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
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Définition du schéma de validation pour le formulaire
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
  website: z.string().url({
    message: "Veuillez entrer une URL valide.",
  }),
  category: z.string({
    required_error: "Veuillez sélectionner une catégorie.",
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

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState<ToolSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  
  // Initialiser le formulaire avec le schéma de validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      category: "",
    },
  });

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    checkUser();
  }, []);

  // Charger les suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        // Récupérer les suggestions
        const { data: suggestions, error } = await supabase
          .from('tool_suggestions')
          .select('*');
        
        if (error) throw error;
        
        // Si l'utilisateur est connecté, récupérer ses votes
        let suggestionsWithVotes = suggestions;
        
        if (user) {
          const { data: votes, error: votesError } = await supabase
            .from('tool_votes')
            .select('*')
            .eq('user_id', user.id);
          
          if (!votesError && votes) {
            suggestionsWithVotes = suggestions.map(suggestion => {
              const userVote = votes.find(vote => vote.tool_suggestion_id === suggestion.id);
              return {
                ...suggestion,
                user_vote: userVote ? userVote.vote_type : null
              };
            });
          }
        }
        
        // Compter les votes pour chaque suggestion
        const { data: votesCounts, error: countError } = await supabase
          .from('tool_votes')
          .select('tool_suggestion_id, vote_type');
        
        if (countError) throw countError;
        
        const finalSuggestions = suggestionsWithVotes.map(suggestion => {
          const suggestionVotes = votesCounts?.filter(vote => vote.tool_suggestion_id === suggestion.id) || [];
          const upvotes = suggestionVotes.filter(vote => vote.vote_type === 'up').length;
          const downvotes = suggestionVotes.filter(vote => vote.vote_type === 'down').length;
          
          return {
            ...suggestion,
            upvotes_count: upvotes,
            downvotes_count: downvotes
          };
        });
        
        setSuggestions(finalSuggestions);
      } catch (error) {
        console.error('Erreur lors du chargement des suggestions:', error);
        toast.error('Erreur lors du chargement des suggestions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSuggestions();
  }, [user]);

  // Soumettre une nouvelle suggestion
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error('Vous devez être connecté pour proposer un outil');
      navigate('/auth');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('tool_suggestions')
        .insert([
          {
            name: values.name,
            description: values.description,
            website: values.website,
            category: values.category,
            submitted_by: user.id
          }
        ])
        .select();
      
      if (error) throw error;
      
      form.reset();
      toast.success('Votre suggestion a été soumise avec succès!');
      
      // Ajouter la nouvelle suggestion à la liste
      if (data && data[0]) {
        setSuggestions(prev => [...prev, {
          ...data[0],
          upvotes_count: 0,
          downvotes_count: 0
        }]);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Erreur lors de la soumission de votre suggestion');
    }
  };

  // Gérer les votes
  const handleVote = async (suggestionId: string, voteType: 'up' | 'down') => {
    if (!user) {
      toast.error('Vous devez être connecté pour voter');
      navigate('/auth');
      return;
    }
    
    try {
      // Vérifier si l'utilisateur a déjà voté pour cette suggestion
      const { data: existingVotes } = await supabase
        .from('tool_votes')
        .select('*')
        .eq('tool_suggestion_id', suggestionId)
        .eq('user_id', user.id);
      
      const existingVote = existingVotes && existingVotes[0];
      
      if (existingVote) {
        // Si l'utilisateur a déjà voté avec le même type, annuler son vote
        if (existingVote.vote_type === voteType) {
          await supabase
            .from('tool_votes')
            .delete()
            .eq('id', existingVote.id);
            
          // Mettre à jour l'état local
          setSuggestions(prev => prev.map(suggestion => {
            if (suggestion.id === suggestionId) {
              return {
                ...suggestion,
                user_vote: null,
                [voteType === 'up' ? 'upvotes_count' : 'downvotes_count']: suggestion[voteType === 'up' ? 'upvotes_count' : 'downvotes_count'] - 1
              };
            }
            return suggestion;
          }));
        } else {
          // Si l'utilisateur a voté différemment, mettre à jour son vote
          await supabase
            .from('tool_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
            
          // Mettre à jour l'état local
          setSuggestions(prev => prev.map(suggestion => {
            if (suggestion.id === suggestionId) {
              return {
                ...suggestion,
                user_vote: voteType,
                upvotes_count: voteType === 'up' 
                  ? suggestion.upvotes_count + 1 
                  : suggestion.upvotes_count - (existingVote.vote_type === 'up' ? 1 : 0),
                downvotes_count: voteType === 'down' 
                  ? suggestion.downvotes_count + 1 
                  : suggestion.downvotes_count - (existingVote.vote_type === 'down' ? 1 : 0)
              };
            }
            return suggestion;
          }));
        }
      } else {
        // Si l'utilisateur n'a pas encore voté, créer un nouveau vote
        await supabase
          .from('tool_votes')
          .insert([
            {
              tool_suggestion_id: suggestionId,
              user_id: user.id,
              vote_type: voteType
            }
          ]);
          
        // Mettre à jour l'état local
        setSuggestions(prev => prev.map(suggestion => {
          if (suggestion.id === suggestionId) {
            return {
              ...suggestion,
              user_vote: voteType,
              [voteType === 'up' ? 'upvotes_count' : 'downvotes_count']: suggestion[voteType === 'up' ? 'upvotes_count' : 'downvotes_count'] + 1
            };
          }
          return suggestion;
        }));
      }
    } catch (error) {
      console.error('Erreur lors du vote:', error);
      toast.error('Erreur lors du vote');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Formulaire de suggestion */}
          <div className="md:w-1/3">
            <h1 className="text-4xl font-bold mb-8">
              <span className="text-[#00FF00]">_</span>Proposer un outil
            </h1>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'outil</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Canva, Figma, etc." {...field} />
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez brièvement l'outil et son utilité..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site web</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="conception">Conception</SelectItem>
                          <SelectItem value="realisation">Réalisation</SelectItem>
                          <SelectItem value="analyse">Analyse</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="bg-[#00FF00] text-black hover:bg-[#00FF00]/90">
                  Soumettre
                </Button>
                
                {!user && (
                  <FormDescription className="text-yellow-600">
                    Vous devez être connecté pour proposer un outil.
                  </FormDescription>
                )}
              </form>
            </Form>
          </div>
          
          {/* Liste des suggestions */}
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold mb-8">
              <span className="text-[#00FF00]">_</span>Les propositions
            </h2>
            
            {loading ? (
              <p>Chargement des suggestions...</p>
            ) : suggestions.length === 0 ? (
              <p>Aucune suggestion pour le moment. Soyez le premier à proposer un outil!</p>
            ) : (
              <div className="space-y-6">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-bold mb-2">
                        <span className="text-[#00FF00]">_</span>{suggestion.name}
                      </h3>
                      <Badge className={`
                        ${suggestion.category === 'conception' ? 'bg-blue-500' : ''}
                        ${suggestion.category === 'realisation' ? 'bg-green-500' : ''}
                        ${suggestion.category === 'analyse' ? 'bg-purple-500' : ''}
                        ${suggestion.category === 'autre' ? 'bg-gray-500' : ''}
                      `}>
                        {suggestion.category}
                      </Badge>
                    </div>
                    
                    <p className="mb-4">{suggestion.description}</p>
                    
                    <a 
                      href={suggestion.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mb-4 inline-block"
                    >
                      {suggestion.website}
                    </a>
                    
                    <div className="flex items-center space-x-4 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`flex items-center space-x-1 ${
                          suggestion.user_vote === 'up' ? 'bg-green-100 border-green-500' : ''
                        }`}
                        onClick={() => handleVote(suggestion.id, 'up')}
                      >
                        <ThumbsUp size={16} className={suggestion.user_vote === 'up' ? 'text-green-500' : ''} />
                        <span>{suggestion.upvotes_count}</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className={`flex items-center space-x-1 ${
                          suggestion.user_vote === 'down' ? 'bg-red-100 border-red-500' : ''
                        }`}
                        onClick={() => handleVote(suggestion.id, 'down')}
                      >
                        <ThumbsDown size={16} className={suggestion.user_vote === 'down' ? 'text-red-500' : ''} />
                        <span>{suggestion.downvotes_count}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
