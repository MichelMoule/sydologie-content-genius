
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
      ).sort((a, b) => b.upvotes_count - a.upvotes_count)
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

  return (
    <div className="space-y-4 md:space-y-6">
      {suggestions.map((suggestion, index) => (
        <SuggestionItem
          key={suggestion.id}
          suggestion={suggestion}
          index={index}
          currentUser={user}
          updateSuggestion={updateSuggestion}
        />
      ))}
    </div>
  );
};

export default SuggestionsList;
