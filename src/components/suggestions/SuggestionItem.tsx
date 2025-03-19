
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, User, MessageCircle } from "lucide-react";
import CommentSection from "@/components/suggestions/CommentSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";

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

type SuggestionItemProps = {
  suggestion: ToolSuggestion;
  index: number;
  currentUser: any;
  updateSuggestion: (updatedSuggestion: ToolSuggestion) => void;
};

const SuggestionItem = ({ suggestion, index, currentUser, updateSuggestion }: SuggestionItemProps) => {
  const [expandedComment, setExpandedComment] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getScore = (suggestion: ToolSuggestion) => {
    return suggestion.upvotes_count;
  };

  const handleVote = async (suggestionId: string, voteType: 'up') => {
    if (!currentUser) {
      toast.error(t('suggestions.loginToVote'));
      navigate('/auth');
      return;
    }
    
    try {
      const { data: existingVotes } = await supabase
        .from('tool_votes')
        .select('*')
        .eq('tool_suggestion_id', suggestionId)
        .eq('user_id', currentUser.id);
      
      const existingVote = existingVotes && existingVotes[0];
      
      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // User is removing their upvote
          await supabase
            .from('tool_votes')
            .delete()
            .eq('id', existingVote.id);
            
          updateSuggestion({
            ...suggestion,
            user_vote: null,
            upvotes_count: suggestion.upvotes_count - 1
          });
        } else {
          // This case shouldn't occur anymore since we only have upvotes now
          await supabase
            .from('tool_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
            
          updateSuggestion({
            ...suggestion,
            user_vote: voteType,
            upvotes_count: suggestion.upvotes_count + 1
          });
        }
      } else {
        // User is adding a new upvote
        await supabase
          .from('tool_votes')
          .insert([
            {
              tool_suggestion_id: suggestionId,
              user_id: currentUser.id,
              vote_type: voteType
            }
          ]);
          
        updateSuggestion({
          ...suggestion,
          user_vote: voteType,
          upvotes_count: suggestion.upvotes_count + 1
        });
      }
    } catch (error) {
      console.error('Erreur lors du vote:', error);
      toast.error(t('suggestions.voteError'));
    }
  };

  const toggleExpandComment = () => {
    setExpandedComment(!expandedComment);
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
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
              {suggestion.username || t('suggestions.user')}
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
              <span className="font-medium font-dmsans text-sm md:text-base text-sydologie-green">
                {getScore(suggestion)}
              </span>
              
              <div className="flex space-x-1 md:space-x-2">
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className={`flex items-center space-x-1 font-dmsans px-2 h-8 md:h-10 ${
                    suggestion.user_vote === 'up' ? 'bg-green-100 border-sydologie-green' : ''
                  }`}
                  onClick={() => handleVote(suggestion.id, 'up')}
                >
                  <ThumbsUp size={isMobile ? 14 : 16} className={suggestion.user_vote === 'up' ? 'text-sydologie-green' : ''} />
                  <span className="text-xs md:text-sm">{suggestion.upvotes_count}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpandComment}
          className="mt-2 text-[#9b87f5] hover:text-[#8B5CF6] hover:bg-transparent p-0 h-auto font-dmsans flex items-center gap-1 text-xs md:text-sm"
        >
          <MessageCircle size={isMobile ? 14 : 16} />
          {suggestion.comments_count || 0} {(suggestion.comments_count || 0) !== 1 ? t('suggestions.comments') : t('suggestions.comment')}
          {expandedComment ? ` (${t('suggestions.hide')})` : ` (${t('suggestions.show')})`}
        </Button>
      </div>
      
      {expandedComment && (
        <div className="border-t p-3 md:p-4 bg-gray-50">
          <CommentSection 
            toolSuggestionId={suggestion.id} 
            currentUser={currentUser}
          />
        </div>
      )}
    </div>
  );
};

export default SuggestionItem;
