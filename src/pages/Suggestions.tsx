
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ThumbsUp, ThumbsDown, Plus, LightbulbIcon, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import SuggestionForm from "@/components/suggestions/SuggestionForm";

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
  username?: string | null;
};

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState<ToolSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  
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

        // Récupérer les profils des utilisateurs qui ont soumis les suggestions
        const userIds = [...new Set(suggestionsWithVotes.map(s => s.submitted_by))];
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        const profilesMap = profiles ? 
          profiles.reduce((acc, profile) => {
            acc[profile.id] = profile.username || "Utilisateur";
            return acc;
          }, {} as Record<string, string>) : {};
        
        const finalSuggestions = suggestionsWithVotes.map(suggestion => {
          const suggestionVotes = votesCounts?.filter(vote => vote.tool_suggestion_id === suggestion.id) || [];
          const upvotes = suggestionVotes.filter(vote => vote.vote_type === 'up').length;
          const downvotes = suggestionVotes.filter(vote => vote.vote_type === 'down').length;
          
          return {
            ...suggestion,
            upvotes_count: upvotes,
            downvotes_count: downvotes,
            username: profilesMap[suggestion.submitted_by] || "Utilisateur"
          };
        });
        
        // Trier par nombre de votes (popularité)
        const sortedSuggestions = finalSuggestions.sort(
          (a, b) => (b.upvotes_count - b.downvotes_count) - (a.upvotes_count - a.downvotes_count)
        );
        
        setSuggestions(sortedSuggestions);
      } catch (error) {
        console.error('Erreur lors du chargement des suggestions:', error);
        toast.error('Erreur lors du chargement des suggestions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSuggestions();
  }, [user]);

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

  // Calculer le score de chaque suggestion
  const getScore = (suggestion: ToolSuggestion) => {
    return suggestion.upvotes_count - suggestion.downvotes_count;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold">
              <span className="text-[#00FF00]">_</span>Propositions d'outils
            </h1>
            <p className="text-lg mt-2 text-gray-600">
              Découvrez les outils les plus demandés par notre communauté et participez au vote ! 
              Nous développerons l'outil le plus voté (sans engagement sur les délais, notre développeur 
              a une tendance à la procrastination).
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#00FF00] text-black font-medium hover:bg-[#00FF00]/90 flex items-center gap-2">
                <Plus size={18} />
                Proposer un outil
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  <span className="text-[#00FF00]">_</span>Proposer un outil
                </DialogTitle>
                <DialogDescription>
                  Suggérez un outil qui pourrait être développé sur sydologie.ai
                </DialogDescription>
              </DialogHeader>
              <SuggestionForm 
                setSuggestions={setSuggestions} 
                user={user}
                navigate={navigate}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p>Chargement des propositions...</p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <LightbulbIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">Aucune proposition pour le moment</h3>
            <p className="text-gray-600 mb-6">Soyez le premier à proposer un outil !</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#00FF00] text-black hover:bg-[#00FF00]/90">
                  Proposer un outil
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    <span className="text-[#00FF00]">_</span>Proposer un outil
                  </DialogTitle>
                  <DialogDescription>
                    Suggérez un outil qui pourrait être développé sur sydologie.ai
                  </DialogDescription>
                </DialogHeader>
                <SuggestionForm 
                  setSuggestions={setSuggestions} 
                  user={user}
                  navigate={navigate}
                />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Table>
            <TableCaption>Liste des propositions d'outils classées par popularité</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rang</TableHead>
                <TableHead>Outil</TableHead>
                <TableHead>Proposé par</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suggestions.map((suggestion, index) => (
                <TableRow key={suggestion.id} className={index < 3 ? "bg-green-50/50" : ""}>
                  <TableCell className="font-medium">
                    {index + 1}
                    {index < 3 && (
                      <span className="ml-1 text-xs font-bold text-green-600">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-lg">{suggestion.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{suggestion.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <User size={14} />
                      {suggestion.username || "Utilisateur"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`
                      ${suggestion.category === 'conception' ? 'bg-blue-500' : ''}
                      ${suggestion.category === 'realisation' ? 'bg-green-500' : ''}
                      ${suggestion.category === 'analyse' ? 'bg-purple-500' : ''}
                      ${suggestion.category === 'autre' ? 'bg-gray-500' : ''}
                    `}>
                      {suggestion.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    <span className={`
                      ${getScore(suggestion) > 0 ? 'text-green-600' : ''}
                      ${getScore(suggestion) < 0 ? 'text-red-600' : ''}
                      ${getScore(suggestion) === 0 ? 'text-gray-600' : ''}
                    `}>
                      {getScore(suggestion)}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-end space-x-2">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
