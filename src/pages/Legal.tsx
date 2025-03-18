
import { BookText, Shield, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Legal = () => {
  return (
    <div className="min-h-screen bg-background font-dmsans flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex-grow">
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
          <h2 className="text-2xl font-bold mb-6">1. Présentation du site</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <p>
                  En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site sydologie.ai l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :
                </p>
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Propriétaire</h3>
                  <p>Société Sydo – SARL inscrite au RCS Lyon sous le numéro 498486307</p>
                  <p>31 rue Burdeau 69001 Lyon</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Créateur</h3>
                  <p>Sydo</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Responsable publication</h3>
                  <p>Sylvain Tillon – sylvain@sydo.fr</p>
                  <p className="text-sm text-muted-foreground">Le responsable publication est une personne physique ou une personne morale.</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Directeur technique</h3>
                  <p>Youri Minne</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Webmaster</h3>
                  <p>Youri Minne – contact@sydo.fr</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Hébergeur</h3>
                  <p>Vercel Inc.</p>
                  <p>340 S Lemon Ave #4133</p>
                  <p>Walnut, CA 91789</p>
                  <p>États-Unis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">2. Conditions générales d'utilisation du site et des services proposés</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p>
                  L'utilisation du site sydologie.ai implique l'acceptation pleine et entière des conditions générales d'utilisation ci-après décrites. Ces conditions d'utilisation sont susceptibles d'être modifiées ou complétées à tout moment, les utilisateurs du site sydologie.ai sont donc invités à les consulter de manière régulière.
                </p>
                
                <p>
                  Ce site est normalement accessible à tout moment aux utilisateurs. Une interruption pour raison de maintenance technique peut être toutefois décidée par sydologie.ai, qui s'efforcera alors de communiquer préalablement aux utilisateurs les dates et heures de l'intervention.
                </p>
                
                <p>
                  Le site sydologie.ai est mis à jour régulièrement par Sylvain Tillon. De la même façon, les mentions légales peuvent être modifiées à tout moment : elles s'imposent néanmoins à l'utilisateur qui est invité à s'y référer le plus souvent possible afin d'en prendre connaissance.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">3. Description des services fournis</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p>
                  Le site sydologie.ai a pour objet de fournir une information concernant l'ensemble des activités de la société et des outils utilisant l'intelligence artificielle au service de la formation.
                </p>
                
                <p>
                  Société Sydo s'efforce de fournir sur le site sydologie.ai des informations aussi précises que possible. Toutefois, il ne pourra être tenue responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
                </p>
                
                <p>
                  Toutes les informations indiquées sur le site sydologie.ai sont données à titre indicatif, et sont susceptibles d'évoluer. Par ailleurs, les renseignements figurant sur le site sydologie.ai ne sont pas exhaustifs. Ils sont donnés sous réserve de modifications ayant été apportées depuis leur mise en ligne.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">4. Limitations contractuelles sur les données techniques</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p>
                  Le site utilise la technologie JavaScript et React.
                </p>
                
                <p>
                  Le site Internet ne pourra être tenu responsable de dommages matériels liés à l'utilisation du site. De plus, l'utilisateur du site s'engage à accéder au site en utilisant un matériel récent, ne contenant pas de virus et avec un navigateur de dernière génération mis-à-jour.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">5. Propriété intellectuelle et contrefaçons</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p>
                  Société Sydo est propriétaire des droits de propriété intellectuelle ou détient les droits d'usage sur tous les éléments accessibles sur le site, notamment les textes, images, graphismes, logo, icônes, sons, logiciels.
                </p>
                
                <p>
                  Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de : Société Sydo.
                </p>
                
                <p>
                  Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">6. Limitations de responsabilité</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p>
                  Société Sydo ne pourra être tenue responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site sydologie.ai, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications indiquées au point 4, soit de l'apparition d'un bug ou d'une incompatibilité.
                </p>
                
                <p>
                  Société Sydo ne pourra également être tenue responsable des dommages indirects (tels par exemple qu'une perte de marché ou perte d'une chance) consécutifs à l'utilisation du site sydologie.ai.
                </p>
                
                <p>
                  Des espaces interactifs sont à la disposition des utilisateurs. Société Sydo se réserve le droit de supprimer, sans mise en demeure préalable, tout contenu déposé dans cet espace qui contreviendrait à la législation applicable en France, en particulier aux dispositions relatives à la protection des données. Le cas échéant, Société Sydo se réserve également la possibilité de mettre en cause la responsabilité civile et/ou pénale de l'utilisateur, notamment en cas de message à caractère raciste, injurieux, diffamant, ou pornographique, quel que soit le support utilisé (texte, photographie…).
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">7. Gestion des données personnelles</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p>
                  En France, les données personnelles sont notamment protégées par la loi n° 78-87 du 6 janvier 1978, la loi n° 2004-801 du 6 août 2004, l'article L. 226-13 du Code pénal et la Directive Européenne du 24 octobre 1995, ainsi que par le Règlement Général sur la Protection des Données (RGPD).
                </p>
                
                <p>
                  A l'occasion de l'utilisation du site sydologie.ai, peuvent êtres recueillies : l'URL des liens par l'intermédiaire desquels l'utilisateur a accédé au site sydologie.ai, le fournisseur d'accès de l'utilisateur, l'adresse de protocole Internet (IP) de l'utilisateur.
                </p>
                
                <p>
                  En tout état de cause, Société Sydo ne collecte des informations personnelles relatives à l'utilisateur que pour le besoin de certains services proposés par le site sydologie.ai. L'utilisateur fournit ces informations en toute connaissance de cause, notamment lorsqu'il procède par lui-même à leur saisie. Il est alors précisé à l'utilisateur du site sydologie.ai l'obligation ou non de fournir ces informations.
                </p>
                
                <p>
                  Conformément aux dispositions des articles 38 et suivants de la loi 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, tout utilisateur dispose d'un droit d'accès, de rectification et d'opposition aux données personnelles le concernant, en effectuant sa demande écrite et signée, accompagnée d'une copie du titre d'identité avec signature du titulaire de la pièce, en précisant l'adresse à laquelle la réponse doit être envoyée.
                </p>
                
                <p>
                  Aucune information personnelle de l'utilisateur du site sydologie.ai n'est publiée à l'insu de l'utilisateur, échangée, transférée, cédée ou vendue sur un support quelconque à des tiers. Seule l'hypothèse du rachat de Société Sydo et de ses droits permettrait la transmission des dites informations à l'éventuel acquéreur qui serait à son tour tenu de la même obligation de conservation et de modification des données vis à vis de l'utilisateur du site sydologie.ai.
                </p>
                
                <p>
                  Les bases de données sont protégées par les dispositions de la loi du 1er juillet 1998 transposant la directive 96/9 du 11 mars 1996 relative à la protection juridique des bases de données.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">8. Liens hypertextes et cookies</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p>
                  Le site sydologie.ai contient un certain nombre de liens hypertextes vers d'autres sites, mis en place avec l'autorisation de Société Sydo. Cependant, Société Sydo n'a pas la possibilité de vérifier le contenu des sites ainsi visités, et n'assumera en conséquence aucune responsabilité de ce fait.
                </p>
                
                <p>
                  La navigation sur le site sydologie.ai est susceptible de provoquer l'installation de cookie(s) sur l'ordinateur de l'utilisateur. Un cookie est un fichier de petite taille, qui ne permet pas l'identification de l'utilisateur, mais qui enregistre des informations relatives à la navigation d'un ordinateur sur un site. Les données ainsi obtenues visent à faciliter la navigation ultérieure sur le site, et ont également vocation à permettre diverses mesures de fréquentation.
                </p>
                
                <p>
                  Le refus d'installation d'un cookie peut entraîner l'impossibilité d'accéder à certains services. L'utilisateur peut toutefois configurer son ordinateur pour refuser l'installation des cookies.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">9. Droit applicable et attribution de juridiction</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p>
                  Tout litige en relation avec l'utilisation du site sydologie.ai est soumis au droit français. Il est fait attribution exclusive de juridiction aux tribunaux compétents de Lyon.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">10. Les principales lois concernées</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p>
                  Loi n° 78-87 du 6 janvier 1978, notamment modifiée par la loi n° 2004-801 du 6 août 2004 relative à l'informatique, aux fichiers et aux libertés.
                </p>
                
                <p>
                  Loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.
                </p>
                
                <p>
                  Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 (RGPD).
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">11. Lexique</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p>
                  <strong>Utilisateur :</strong> Internaute se connectant, utilisant le site sydologie.ai.
                </p>
                
                <p>
                  <strong>Informations personnelles :</strong> « les informations qui permettent, sous quelque forme que ce soit, directement ou non, l'identification des personnes physiques auxquelles elles s'appliquent » (article 4 de la loi n° 78-17 du 6 janvier 1978).
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Legal;
