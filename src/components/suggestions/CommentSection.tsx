
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Trash2, Edit, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

type Comment = {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  username?: string;
  full_name?: string;
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
  const [addingComment, setAddingComment] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchComments();
  }, [toolSuggestionId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      console.log("Récupération des commentaires pour la suggestion:", toolSuggestionId);
      const { data: comments, error } = await supabase
        .from("tool_comments")
        .select("*")
        .eq("tool_suggestion_id", toolSuggestionId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des commentaires:", error);
        throw error;
      }

      console.log("Commentaires récupérés:", comments?.length || 0);

      // Récupérer les noms d'utilisateurs
      if (comments && comments.length > 0) {
        const userIds = [...new Set(comments.map(c => c.user_id))];
        console.log("Récupération des profils pour les utilisateurs:", userIds);
        
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username, full_name")
          .in("id", userIds);

        if (profilesError) {
          console.error("Erreur lors de la récupération des profils:", profilesError);
          throw profilesError;
        }

        console.log("Profils récupérés:", profiles?.length || 0);

        const profilesMap = profiles
          ? profiles.reduce((acc, profile) => {
              acc[profile.id] = {
                username: profile.username || "Utilisateur",
                full_name: profile.full_name || "Utilisateur"
              };
              return acc;
            }, {} as Record<string, { username: string, full_name: string }>)
          : {};

        const commentsWithUsernames = comments.map(comment => ({
          ...comment,
          username: profilesMap[comment.user_id]?.username || "Utilisateur",
          full_name: profilesMap[comment.user_id]?.full_name || "Utilisateur"
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

    console.log("Tentative d'ajout d'un commentaire par l'utilisateur:", currentUser.id);
    console.log("Pour la suggestion:", toolSuggestionId);
    
    setAddingComment(true);
    
    try {
      // Vérifier d'abord la session active
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Erreur de session:", sessionError);
        toast.error("Problème d'authentification. Veuillez vous reconnecter.");
        navigate("/auth");
        return;
      }
      
      if (!sessionData.session) {
        console.error("Aucune session active");
        toast.error("Votre session a expiré. Veuillez vous reconnecter.");
        navigate("/auth");
        return;
      }
      
      console.log("Session vérifiée, utilisateur authentifié:", sessionData.session.user.id);
      
      const commentData = {
        tool_suggestion_id: toolSuggestionId,
        user_id: currentUser.id,
        comment: newComment.trim()
      };
      
      console.log("Données du commentaire à insérer:", commentData);
      
      const { data, error } = await supabase
        .from("tool_comments")
        .insert([commentData])
        .select();

      if (error) {
        console.error("Erreur détaillée lors de l'insertion:", error);
        console.error("Code d'erreur:", error.code);
        console.error("Message d'erreur:", error.message);
        console.error("Détails:", error.details);
        
        if (error.code === "42501") {
          toast.error("Erreur de permission: vous n'avez pas les droits nécessaires pour commenter. Vérifiez que vous êtes bien connecté.");
          
          // Tenter de se reconnecter
          navigate("/auth");
        } else if (error.code === "23503") {
          toast.error("Erreur de référence: la suggestion n'existe plus ou l'utilisateur n'est pas valide");
        } else if (error.code === "23514") {
          toast.error("Erreur de validation: vérifiez le format de votre commentaire");
        } else {
          toast.error(`Erreur lors de l'ajout du commentaire: ${error.message || "erreur inconnue"}`);
        }
        
        return;
      }

      console.log("Commentaire ajouté avec succès:", data);
      setNewComment("");
      toast.success("Commentaire ajouté avec succès");
      
      // Immédiatement ajouter le commentaire à la liste
      if (data && data.length > 0) {
        const newCommentData = data[0];
        
        try {
          // Récupérer le nom d'utilisateur
          console.log("Récupération du profil pour l'utilisateur:", currentUser.id);
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", currentUser.id)
            .maybeSingle();

          if (profileError) {
            console.error("Erreur lors de la récupération du profil:", profileError);
            throw profileError;
          }
          
          console.log("Profil récupéré:", profile);
          
          // Ajouter le commentaire au début de la liste avec le nom d'utilisateur
          setComments(prev => [{
            ...newCommentData,
            username: profile?.username || "Utilisateur"
          }, ...prev]);
        } catch (profileError) {
          console.error("Erreur lors de la récupération du profil:", profileError);
          // Ajouter quand même le commentaire, mais sans nom d'utilisateur personnalisé
          setComments(prev => [{
            ...newCommentData,
            username: "Utilisateur"
          }, ...prev]);
        }
      } else {
        console.log("Aucune donnée retournée après l'insertion, rafraîchissement des commentaires");
        // Si on ne reçoit pas les données, on rafraîchit tous les commentaires
        fetchComments();
      }
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      console.error("Code d'erreur:", error.code);
      console.error("Message d'erreur:", error.message);
      console.error("Détails:", error.details);
      
      // Afficher un message d'erreur plus détaillé
      if (error.code === "42501") {
        toast.error("Erreur de permission: vous n'avez pas les droits nécessaires pour commenter. Vérifiez que vous êtes bien connecté.");
      } else if (error.code === "23503") {
        toast.error("Erreur de référence: la suggestion n'existe plus ou l'utilisateur n'est pas valide");
      } else if (error.code === "23514") {
        toast.error("Erreur de validation: vérifiez le format de votre commentaire");
      } else {
        toast.error(`Erreur lors de l'ajout du commentaire: ${error.message || "erreur inconnue"}`);
      }
    } finally {
      setAddingComment(false);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditText(comment.comment);
  };

  const saveEditedComment = async () => {
    if (!editText.trim() || !editingComment) return;

    try {
      console.log("Tentative de modification du commentaire:", editingComment);
      const { error } = await supabase
        .from("tool_comments")
        .update({ comment: editText.trim() })
        .eq("id", editingComment);

      if (error) {
        console.error("Erreur lors de la modification du commentaire:", error);
        throw error;
      }

      setEditingComment(null);
      toast.success("Commentaire modifié avec succès");
      
      // Mettre à jour le commentaire dans l'état local
      setComments(prev => prev.map(comment => 
        comment.id === editingComment 
          ? { ...comment, comment: editText.trim() } 
          : comment
      ));
    } catch (error) {
      console.error("Erreur lors de la modification du commentaire:", error);
      toast.error("Erreur lors de la modification du commentaire");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      console.log("Tentative de suppression du commentaire:", commentId);
      const { error } = await supabase
        .from("tool_comments")
        .delete()
        .eq("id", commentId);

      if (error) {
        console.error("Erreur lors de la suppression du commentaire:", error);
        throw error;
      }

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
    <div className="mt-4 md:mt-6 space-y-4 md:space-y-6 font-dmsans">
      <div className="flex items-center gap-1 md:gap-2 mb-3 md:mb-4">
        <MessageCircle className="text-[#9b87f5]" size={isMobile ? 18 : 22} />
        <h3 className="text-lg md:text-xl font-bold">Commentaires</h3>
      </div>
      
      {/* Liste des commentaires */}
      {loading ? (
        <div className="flex justify-center py-6 md:py-8">
          <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-[#9b87f5]"></div>
        </div>
      ) : comments.length === 0 ? (
        <Card className="bg-gray-50 border-dashed border-gray-300">
          <CardContent className="text-center py-8 md:py-10">
            <MessageCircle className="mx-auto text-gray-400 mb-2 md:mb-3" size={isMobile ? 24 : 32} />
            <p className="text-gray-500 font-dmsans text-sm md:text-base">Aucun commentaire pour le moment</p>
            <p className="text-xs md:text-sm text-gray-400 font-dmsans mt-1">Soyez le premier à commenter cette suggestion</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
              <CardContent className="p-3 md:p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <div className="bg-[#e5deff] p-1.5 md:p-2 rounded-full">
                      <User size={isMobile ? 14 : 16} className="text-[#9b87f5]" />
                    </div>
                    <div>
                      <span className="font-medium font-dmsans text-gray-800 text-sm md:text-base">{comment.full_name}</span>
                      <p className="text-[10px] md:text-xs text-gray-500 font-dmsans">{formatDate(comment.created_at)}</p>
                    </div>
                  </div>
                  
                  {currentUser && currentUser.id === comment.user_id && (
                    <div className="flex gap-1 md:gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditComment(comment)}
                        className="h-7 w-7 md:h-8 md:w-8 p-0 rounded-full hover:bg-[#e5deff]"
                      >
                        <Edit size={isMobile ? 14 : 16} className="text-gray-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="h-7 w-7 md:h-8 md:w-8 p-0 rounded-full hover:bg-red-100"
                      >
                        <Trash2 size={isMobile ? 14 : 16} className="text-red-500" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {editingComment === comment.id ? (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="min-h-[60px] md:min-h-[80px] font-dmsans border-[#9b87f5] focus:border-[#8B5CF6] text-sm md:text-base"
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingComment(null)}
                        className="font-dmsans border-[#9b87f5] text-[#9b87f5] text-xs md:text-sm h-8 md:h-9"
                      >
                        Annuler
                      </Button>
                      <Button 
                        size="sm"
                        onClick={saveEditedComment}
                        disabled={!editText.trim()}
                        className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white font-dmsans text-xs md:text-sm h-8 md:h-9"
                      >
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap font-dmsans mt-2 leading-relaxed text-sm md:text-base">{comment.comment}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Zone d'ajout de commentaire en bas */}
      <Card className="mt-4 md:mt-6 border-t-4 border-t-[#9b87f5]">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col space-y-2 md:space-y-3">
            <div className="flex items-center gap-2 mb-1">
              {currentUser ? (
                <>
                  <div className="bg-[#e5deff] p-1.5 md:p-2 rounded-full">
                    <User size={isMobile ? 14 : 16} className="text-[#9b87f5]" />
                  </div>
                  <span className="font-medium text-xs md:text-sm">{currentUser.user_metadata?.full_name || "Utilisateur"}</span>
                </>
              ) : (
                <p className="text-xs md:text-sm text-gray-500 italic">Connectez-vous pour commenter</p>
              )}
            </div>
            
            <Textarea
              placeholder={currentUser ? "Ajouter un commentaire..." : "Veuillez vous connecter pour commenter"}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="text-sm md:text-base min-h-[80px] md:min-h-[100px] font-dmsans resize-none focus-visible:ring-[#9b87f5]"
              disabled={!currentUser}
            />
            
            <div className="flex justify-end">
              <Button 
                onClick={handleAddComment}
                disabled={!newComment.trim() || addingComment || !currentUser}
                className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white font-dmsans flex items-center gap-2 transition-all duration-200 hover:shadow-md text-xs md:text-sm h-8 md:h-9"
              >
                {addingComment ? (
                  <span className="inline-block h-3 w-3 md:h-4 md:w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                ) : (
                  <Send size={isMobile ? 14 : 16} />
                )}
                {addingComment ? "Envoi..." : "Commenter"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentSection;
