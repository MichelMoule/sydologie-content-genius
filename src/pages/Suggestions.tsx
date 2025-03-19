import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import SuggestionHeader from "@/components/suggestions/SuggestionHeader";
import SuggestionsList from "@/components/suggestions/SuggestionsList";

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
  const navigate = useNavigate();
  
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
        
        // Sort suggestions by upvotes only
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-16">
        <SuggestionHeader user={user} setSuggestions={setSuggestions} />
        
        <SuggestionsList 
          suggestions={suggestions} 
          setSuggestions={setSuggestions} 
          loading={loading} 
          user={user} 
        />
      </div>
    </div>
  );
};

export default Suggestions;
