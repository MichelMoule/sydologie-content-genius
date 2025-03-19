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
import { ThumbsUp, Plus, LightbulbIcon, User, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import SuggestionForm from "@/components/suggestions/SuggestionForm";
import CommentSection from "@/components/suggestions/CommentSection";
import { useIsMobile } from "@/hooks/use-mobile";

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
  comments_count?: number;
};

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState<ToolSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    checkUser();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const { data: suggestions, error } = await supabase
          .from('tool_suggestions')
          .select('*');
        
        if (error) throw error;
        
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
        
        const { data: votesCounts, error: countError } = await supabase
          .from('tool_votes')
          .select('tool_suggestion_id, vote_type');
        
        if (countError) throw countError;

        // Récupérer tous les commentaires pour le comptage
        const { data: commentCounts, error: commentCountError } = await supabase
          .from('tool_comments')
          .select('tool_suggestion_id');

        // Compter manuellement les commentaires par suggestion
        const commentCountMap: Record<string, number> = {};
        if (!commentCountError && commentCounts) {
          commentCounts.forEach(item => {
            const id = item.tool_suggestion_id;
            commentCountMap[id] = (commentCountMap[id] || 0) + 1;
          });
        }

        const userIds = [...new Set(suggestionsWithVotes.map(s => s.submitted_by))];
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        const profilesMap = profiles ? 
          profiles.reduce<Record<string, string>>((acc, profile) => {
            acc[profile.id] = profile.username || "Utilisateur";
            return acc;
          }, {}) : {};
        
        const finalSuggestions = suggestionsWithVotes.map(suggestion => {
          const suggestionVotes = votesCounts?.filter(vote => vote.tool_suggestion_id === suggestion.id) || [];
          const upvotes = suggestionVotes.filter(vote => vote.vote_type === 'up').length;
          // We still keep the count in the data structure for compatibility
          const downvotes = suggestionVotes.filter(vote => vote.vote_type === 'down').length;
          
          return {
            ...suggestion,
            upvotes_count: upvotes,
            downvotes_count: downvotes,
            username: profilesMap[suggestion.submitted_by] || "Utilisateur",
            comments_count: commentCountMap[suggestion.id] || 0
          };
        });
        
        // Modified: Sort suggestions by upvotes only, not by net score
        const sortedSuggestions = finalSuggestions.sort(
          (a, b) => b.upvotes_count - a.upvotes_count
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

  const handleVote = async (suggestionId: string, voteType: 'up') => {
    if (!user) {
      toast.error('Vous devez être connecté pour voter');
      navigate('/auth');
      return;
    }
    
    try {
      const { data: existingVotes } = await supabase
        .from('tool_votes')
        .select('*')
        .eq('tool_suggestion_id', suggestionId)
        .eq('user_id', user.id);
      
      const existingVote = existingVotes && existingVotes[0];
      
      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // User is removing their upvote
          await supabase
            .from('tool_votes')
            .delete()
            .eq('id', existingVote.id);
            
          setSuggestions(prev => prev.map(suggestion => {
            if (suggestion.id === suggestionId) {
              return {
                ...suggestion,
                user_vote: null,
                upvotes_count: suggestion.upvotes_count - 1
              };
            }
            return suggestion;
          }));
        } else {
          // This case shouldn't occur anymore since we only have upvotes now,
          // but keeping for future reference if needed
          await supabase
            .from('tool_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
            
          setSuggestions(prev => prev.map(suggestion => {
            if (suggestion.id === suggestionId) {
              return {
                ...suggestion,
                user_vote: voteType,
                upvotes_count: suggestion.upvotes_count + 1
              };
            }
            return suggestion;
          }));
        }
      } else {
        // User is adding a new upvote
        await supabase
          .from('tool_votes')
          .insert([
            {
              tool_suggestion_id: suggestionId,
              user_id: user.id,
              vote_type: voteType
            }
          ]);
          
        setSuggestions(prev => prev.map(suggestion => {
          if (suggestion.id === suggestionId) {
            return {
              ...suggestion,
              user_vote: voteType,
              upvotes_count: suggestion.upvotes_count + 1
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

  // Modified: Get score function now returns only upvotes_count
  const getScore = (suggestion: ToolSuggestion) => {
    return suggestion.upvotes_count;
  };

  const toggleExpandSuggestion = (suggestionId: string) => {
    if (expandedSuggestion === suggestionId) {
      setExpandedSuggestion(null);
    } else {
      setExpandedSuggestion(suggestionId);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-12">
          <div className="text-left">
            <h1 className="text-2xl md:text-4xl font-bold font-dmsans">
              <span className="text-[#00FF00]">_</span>Propositions d'outils
            </h1>
            <p className="text-sm md:text-lg mt-2 text-gray-600 font-dmsans">
              Découvrez les outils les plus demandés par notre communauté et participez au vote ! 
              {!isMobile && " Nous développerons l'outil le plus voté (sans engagement sur les délais, notre développeur a une tendance à la procrastination)."}
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#9b87f5] text-white font-medium hover:bg-[#8B5CF6] flex items-center gap-2 font-dmsans w-full md:w-auto mt-4 md:mt-0">
                <Plus size={isMobile ? 16 : 18} />
                Proposer un outil
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] font-dmsans w-[95%] md:w-auto">
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl font-dmsans">
                  <span className="text-[#00FF00]">_</span>Proposer un outil
                </DialogTitle>
                <DialogDescription className="font-dmsans text-sm md:text-base">
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
          <div className="text-center py-12 font-dmsans">
            <p>Chargement des propositions...</p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-8 md:py-12 bg-gray-50 rounded-lg border border-gray-200 font-dmsans">
            <LightbulbIcon className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400 mb-4" />
            <h3 className="text-lg md:text-xl font-medium mb-2">Aucune proposition pour le moment</h3>
            <p className="text-gray-600 mb-6 px-4 text-sm md:text-base">Soyez le premier à proposer un outil !</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#9b87f5] text-white hover:bg-[#8B5CF6] font-dmsans">
                  Proposer un outil
                </Button>
              </DialogTrigger>
              <DialogContent className="font-dmsans w-[95%] md:w-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl md:text-2xl font-dmsans">
                    <span className="text-[#00FF00]">_</span>Proposer un outil
                  </DialogTitle>
                  <DialogDescription className="font-dmsans text-sm md:text-base">
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
          <div className="space-y-4 md:space-y-6">
            {suggestions.map((suggestion, index) => (
              <div key={suggestion.id} className="bg-white rounded-lg border overflow-hidden">
                <div className={`p-3 md:p-4 ${index < 3 ? "bg-green-50/50" : ""}`}>
                  <div className="flex flex-col md:flex-row md:justify-between gap-3 md:gap-0">
                    <div className="flex items-start md:items-center gap-2">
                      <span className="font-medium text-base md:text-lg font-dmsans">
                        {index + 1}
                        {index < 3 && (
                          <span className="ml-1 text-xs font-bold text-green-600">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                          </span>
                        )}
                      </span>
                      <div className="text-left">
                        <div className="font-semibold text-base md:text-lg font-dmsans">{suggestion.name}</div>
                        <div className="text-xs md:text-sm text-gray-500 mt-1 font-dmsans">{suggestion.description}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-2 md:gap-4 mt-2 md:mt-0">
                      <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600 font-dmsans">
                        <User size={isMobile ? 12 : 14} />
                        {suggestion.username || "Utilisateur"}
                      </div>
                      
                      <Badge className={`
                        text-xs
                        ${suggestion.category === 'conception' ? 'bg-blue-500' : ''}
                        ${suggestion.category === 'realisation' ? 'bg-green-500' : ''}
                        ${suggestion.category === 'analyse' ? 'bg-purple-500' : ''}
                        ${suggestion.category === 'autre' ? 'bg-gray-500' : ''}
                        font-dmsans
                      `}>
                        {suggestion.category}
                      </Badge>
                      
                      <div className="flex items-center gap-1 ml-auto md:ml-0">
                        <span className="font-medium font-dmsans text-sm md:text-base text-green-600">
                          {getScore(suggestion)}
                        </span>
                        
                        <div className="flex space-x-1 md:space-x-2">
                          <Button
                            variant="outline"
                            size={isMobile ? "sm" : "default"}
                            className={`flex items-center space-x-1 font-dmsans px-2 h-8 md:h-10 ${
                              suggestion.user_vote === 'up' ? 'bg-green-100 border-green-500' : ''
                            }`}
                            onClick={() => handleVote(suggestion.id, 'up')}
                          >
                            <ThumbsUp size={isMobile ? 14 : 16} className={suggestion.user_vote === 'up' ? 'text-green-500' : ''} />
                            <span className="text-xs md:text-sm">{suggestion.upvotes_count}</span>
                          </Button>
                          
                          {/* Removed the thumbs down button */}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpandSuggestion(suggestion.id)}
                    className="mt-2 text-[#9b87f5] hover:text-[#8B5CF6] hover:bg-transparent p-0 h-auto font-dmsans flex items-center gap-1 text-xs md:text-sm"
                  >
                    <MessageCircle size={isMobile ? 14 : 16} />
                    {suggestion.comments_count || 0} commentaire{suggestion.comments_count !== 1 ? 's' : ''}
                    {expandedSuggestion === suggestion.id ? ' (cacher)' : ' (afficher)'}
                  </Button>
                </div>
                
                {expandedSuggestion === suggestion.id && (
                  <div className="border-t p-3 md:p-4 bg-gray-50">
                    <CommentSection 
                      toolSuggestionId={suggestion.id} 
                      currentUser={user}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
