
import { useState } from "react";
import SuggestionItem from "./SuggestionItem";
import EmptySuggestionsList from "./EmptySuggestionsList";

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

type SuggestionsListProps = {
  suggestions: ToolSuggestion[];
  setSuggestions: React.Dispatch<React.SetStateAction<ToolSuggestion[]>>;
  loading: boolean;
  user: any;
};

const SuggestionsList = ({ suggestions, setSuggestions, loading, user }: SuggestionsListProps) => {
  const updateSuggestion = (updatedSuggestion: ToolSuggestion) => {
    setSuggestions(prev => 
      prev.map(suggestion => 
        suggestion.id === updatedSuggestion.id ? updatedSuggestion : suggestion
      )
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12 font-dmsans">
        <p>Chargement des propositions...</p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return <EmptySuggestionsList user={user} setSuggestions={setSuggestions} />;
  }

  const pendingSuggestions = suggestions.filter(s => s.status !== 'realized')
    .sort((a, b) => b.upvotes_count - a.upvotes_count);
  
  const realizedSuggestions = suggestions.filter(s => s.status === 'realized')
    .sort((a, b) => b.upvotes_count - a.upvotes_count);

  return (
    <div className="space-y-8">
      <div className="space-y-4 md:space-y-6">
        {pendingSuggestions.map((suggestion, index) => (
          <SuggestionItem
            key={suggestion.id}
            suggestion={suggestion}
            index={index}
            currentUser={user}
            updateSuggestion={updateSuggestion}
          />
        ))}
      </div>

      {realizedSuggestions.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-xl font-semibold mb-6 font-dmsans text-sydologie-green">
            Propositions réalisées
          </h2>
          <div className="space-y-4 md:space-y-6">
            {realizedSuggestions.map((suggestion, index) => (
              <SuggestionItem
                key={suggestion.id}
                suggestion={suggestion}
                index={index}
                currentUser={user}
                updateSuggestion={updateSuggestion}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestionsList;
