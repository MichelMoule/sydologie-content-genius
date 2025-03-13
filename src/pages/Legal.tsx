
import { BookText, Shield, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";

const Legal = () => {
  return (
    <div className="min-h-screen bg-background font-dmsans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Mentions Légales et Conditions d'Utilisation</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Informations juridiques concernant notre site et les conditions d'utilisation de nos services.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-[#82C8A0]/10 border-[#82C8A0]/20">
            <CardHeader className="flex flex-row items-center gap-4">
              <FileText className="h-8 w-8 text-[#82C8A0]" />
              <CardTitle>Mentions Légales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Informations légales concernant l'éditeur et l'hébergeur du site.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#82C8A0]/10 border-[#82C8A0]/20">
            <CardHeader className="flex flex-row items-center gap-4">
              <Shield className="h-8 w-8 text-[#82C8A0]" />
              <CardTitle>Conditions d'Utilisation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Règles et conditions régissant l'utilisation de notre site et de nos services.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#82C8A0]/10 border-[#82C8A0]/20">
            <CardHeader className="flex flex-row items-center gap-4">
              <BookText className="h-8 w-8 text-[#82C8A0]" />
              <CardTitle>Politique de Confidentialité</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Informations sur la collecte et le traitement des données personnelles.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Mentions Légales</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Éditeur du site</h3>
                  <p>Sydologie.ai</p>
                  <p>Entreprise spécialisée dans la formation et les outils pédagogiques</p>
                  <p>Numéro SIRET : [Numéro SIRET]</p>
                  <p>Adresse : [Adresse complète]</p>
                  <p>Email : contact@sydologie.ai</p>
                  <p>Téléphone : [Numéro de téléphone]</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Directeur de la publication</h3>
                  <p>[Nom du directeur de publication]</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Hébergeur</h3>
                  <p>[Nom de l'hébergeur]</p>
                  <p>Adresse : [Adresse de l'hébergeur]</p>
                  <p>Téléphone : [Téléphone de l'hébergeur]</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Conditions d'Utilisation</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Acceptation des conditions</h3>
                  <p>
                    L'utilisation du site Sydologie.ai implique l'acceptation pleine et entière des conditions générales d'utilisation décrites ci-après. 
                    Ces conditions d'utilisation sont susceptibles d'être modifiées ou complétées à tout moment, les utilisateurs du site sont donc invités à les consulter de manière régulière.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Services fournis</h3>
                  <p>
                    Le site Sydologie.ai a pour objet de fournir des informations et des services concernant les formations et outils pédagogiques proposés par la société.
                    Tous les efforts sont faits pour fournir des informations précises et à jour. Cependant, Sydologie.ai ne peut garantir l'exactitude, la complétude et l'actualité des informations diffusées sur son site.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Propriété intellectuelle</h3>
                  <p>
                    Tous les éléments du site Sydologie.ai, qu'ils soient visuels ou sonores, y compris la technologie sous-jacente, sont protégés par le droit d'auteur, des marques ou des brevets.
                    Toute reproduction, même partielle, des contenus des pages du site sans autorisation préalable est strictement interdite.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Limitations de responsabilité</h3>
                  <p>
                    Sydologie.ai ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site, 
                    et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications techniques requises, soit de l'apparition d'un bug ou d'une incompatibilité.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-6">Politique de Confidentialité</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Collecte des données personnelles</h3>
                  <p>
                    Les informations recueillies sur le site Sydologie.ai sont utilisées uniquement dans le cadre légal prévu en France et dans l'Union Européenne 
                    (RGPD - Règlement Général sur la Protection des Données).
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Finalités du traitement</h3>
                  <p>
                    Les données collectées sont nécessaires pour la gestion des demandes de contact, l'inscription aux formations, 
                    et l'accès aux différents outils proposés. Aucune information personnelle n'est publiée ou transférée à des tiers sans votre consentement.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Droit d'accès et de rectification</h3>
                  <p>
                    Conformément à la loi, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. 
                    Pour exercer ce droit, veuillez nous contacter par email à l'adresse : privacy@sydologie.ai
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Legal;
