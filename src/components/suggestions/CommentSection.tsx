
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Trash2, Edit, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type Comment = {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  username?: string;
  isEditing?: boolean;
};

type CommentSectionProps = {
  toolSuggestionId: string;
  currentUser: any;
};

const CommentSection = ({ toolSuggestionId, currentUser }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComments();
  }, [toolSuggestionId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data: comments, error } = await supabase
        .from("tool_comments")
        .select("*")
        .eq("tool_suggestion_id", toolSuggestionId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Récupérer les noms d'utilisateurs
      if (comments && comments.length > 0) {
        const userIds = [...new Set(comments.map(c => c.user_id))];
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username")
          .in("id", userIds);

        if (profilesError) throw profilesError;

        const profilesMap = profiles
          ? profiles.reduce((acc, profile) => {
              acc[profile.id] = profile.username || "Utilisateur";
              return acc;
            }, {} as Record<string, string>)
          : {};

        const commentsWithUsernames = comments.map(comment => ({
          ...comment,
          username: profilesMap[comment.user_id] || "Utilisateur"
        }));

        setComments(commentsWithUsernames);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires:", error);
      toast.error("Erreur lors du chargement des commentaires");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    if (!currentUser) {
      toast.error("Vous devez être connecté pour commenter");
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from("tool_comments")
        .insert([
          {
            tool_suggestion_id: toolSuggestionId,
            user_id: currentUser.id,
            comment: newComment.trim()
          }
        ]);

      if (error) throw error;

      setNewComment("");
      toast.success("Commentaire ajouté avec succès");
      fetchComments();
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditText(comment.comment);
  };

  const saveEditedComment = async () => {
    if (!editText.trim() || !editingComment) return;

    try {
      const { error } = await supabase
        .from("tool_comments")
        .update({ comment: editText.trim() })
        .eq("id", editingComment);

      if (error) throw error;

      setEditingComment(null);
      toast.success("Commentaire modifié avec succès");
      fetchComments();
    } catch (error) {
      console.error("Erreur lors de la modification du commentaire:", error);
      toast.error("Erreur lors de la modification du commentaire");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("tool_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      toast.success("Commentaire supprimé avec succès");
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
      toast.error("Erreur lors de la suppression du commentaire");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="mt-4 space-y-4 font-dmsans">
      <h3 className="text-lg font-semibold">Commentaires</h3>
      
      {/* Zone d'ajout de commentaire */}
      <div className="flex flex-col space-y-2">
        <Textarea
          placeholder="Ajouter un commentaire..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px] font-dmsans"
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white font-dmsans flex items-center gap-2"
          >
            <Send size={16} />
            Commenter
          </Button>
        </div>
      </div>

      {/* Liste des commentaires */}
      {loading ? (
        <div className="text-center py-4 font-dmsans">Chargement des commentaires...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4 text-gray-500 font-dmsans">Aucun commentaire pour le moment</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className="text-gray-500" />
                  <span className="font-medium font-dmsans">{comment.username}</span>
                  <span className="text-xs text-gray-500 font-dmsans">{formatDate(comment.created_at)}</span>
                </div>
                
                {currentUser && currentUser.id === comment.user_id && (
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditComment(comment)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit size={16} className="text-gray-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
              
              {editingComment === comment.id ? (
                <div className="mt-2 space-y-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="min-h-[80px] font-dmsans"
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingComment(null)}
                      className="font-dmsans"
                    >
                      Annuler
                    </Button>
                    <Button 
                      size="sm"
                      onClick={saveEditedComment}
                      disabled={!editText.trim()}
                      className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white font-dmsans"
                    >
                      Enregistrer
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap font-dmsans">{comment.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
