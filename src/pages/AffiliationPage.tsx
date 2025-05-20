
import MemberHeader from "@/components/MemberHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, MessageCircle, Download, HelpCircle, Award, Gift, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const AffiliationPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MemberHeader />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Banner Header */}
          <div className="relative overflow-hidden rounded-lg mb-10">
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
              alt="Programa de Afiliação" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
              <div className="text-white">
                <h1 className="text-3xl md:text-4xl font-bold">Programa de Afiliação</h1>
                <p className="mt-2 text-lg">Crescimento e benefícios para nossos parceiros</p>
              </div>
            </div>
          </div>
          
          {/* Sobre o Programa */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">Sobre o Programa de Afiliação</h2>
                <p className="mb-4 text-lg">
                  Nosso programa de afiliação foi desenvolvido para criar uma relação de crescimento mútuo. 
                  Oferecemos as ferramentas necessárias para você expandir sua presença no mercado e gerar 
                  receita adicional, enquanto ajuda mais clientes a conhecerem nossas soluções.
                </p>
                <p className="text-lg">
                  Como afiliado, você se torna parte da família Ramel Tecnologia e tem acesso a benefícios exclusivos,
                  comissões atrativas e todo o suporte necessário para o seu sucesso.
                </p>
              </div>
              <div className="md:w-1/3">
                <Card className="border-ramel/20">
                  <CardHeader className="bg-ramel text-white">
                    <CardTitle>Comece a ganhar hoje!</CardTitle>
                    <CardDescription className="text-white/80">
                      Torne-se um afiliado e comece a gerar renda recorrente
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Link to="/membro/afiliacao/cadastro">
                      <Button className="w-full bg-ramel hover:bg-ramel-dark">Quero ser Afiliado</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          {/* CEO Image */}
          <div className="mb-12 py-10 bg-secondary/30 rounded-lg">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/4">
                  <img 
                    src="/lovable-uploads/59485cf7-0a0a-478c-8191-5a602b57e487.png" 
                    alt="Rafael Martins - CEO" 
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-2xl font-bold mb-2">Rafael Martins</h3>
                  <p className="text-lg text-muted-foreground mb-4">CEO & Fundador da Ramel Tecnologia</p>
                  <blockquote className="border-l-4 border-ramel pl-4 italic">
                    "Nosso programa de afiliação foi criado para construir parcerias fortes e duradouras. 
                    Queremos que nossos afiliados cresçam junto conosco e se beneficiem do sucesso mútuo, 
                    oferecendo as melhores soluções tecnológicas para o mercado."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
          
          {/* Benefícios */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Benefícios do Programa</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-ramel/20">
                <CardHeader>
                  <Award className="h-10 w-10 text-ramel mb-2" />
                  <CardTitle>Comissões Atrativas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Ganhe até 30% de comissão recorrente por cada cliente indicado. Comissões mensais enquanto o cliente permanecer ativo.</p>
                </CardContent>
              </Card>
              
              <Card className="border-ramel/20">
                <CardHeader>
                  <FileText className="h-10 w-10 text-ramel mb-2" />
                  <CardTitle>Materiais Exclusivos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Acesso a materiais de marketing profissionais, banners, landing pages e textos prontos para suas campanhas.</p>
                </CardContent>
              </Card>
              
              <Card className="border-ramel/20">
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-ramel mb-2" />
                  <CardTitle>Dashboard Detalhado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Acompanhe suas indicações, conversões e comissões em tempo real através do seu painel exclusivo de afiliado.</p>
                </CardContent>
              </Card>
              
              <Card className="border-ramel/20">
                <CardHeader>
                  <MessageCircle className="h-10 w-10 text-ramel mb-2" />
                  <CardTitle>Suporte Prioritário</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Canal exclusivo de suporte para afiliados, com atendimento prioritário para dúvidas e orientações.</p>
                </CardContent>
              </Card>
              
              <Card className="border-ramel/20">
                <CardHeader>
                  <Gift className="h-10 w-10 text-ramel mb-2" />
                  <CardTitle>Bônus e Premiações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Participe de campanhas especiais com bônus por performance e premiações exclusivas para os melhores afiliados.</p>
                </CardContent>
              </Card>
              
              <Card className="border-ramel/20">
                <CardHeader>
                  <Users className="h-10 w-10 text-ramel mb-2" />
                  <CardTitle>Comunidade de Afiliados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Faça parte de uma comunidade exclusiva de afiliados para networking, troca de experiências e estratégias.</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Recursos Disponíveis */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recursos Disponíveis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4 items-start">
                <Download className="h-8 w-8 text-ramel" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Arquivos de Apoio</h3>
                  <p className="text-muted-foreground">
                    Acesse materiais de marketing, guias de vendas, apresentações prontas e estudos de caso 
                    que facilitarão suas conversões.
                  </p>
                  <Link to="/membro/arquivos" className="text-ramel hover:underline mt-2 inline-block">
                    Acessar arquivos
                  </Link>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <FileText className="h-8 w-8 text-ramel" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Tutoriais e Vídeo-aulas</h3>
                  <p className="text-muted-foreground">
                    Assista tutoriais completos sobre nossos produtos, demonstrações e estratégias de vendas 
                    para maximizar seus resultados.
                  </p>
                  <Link to="/membro/videos" className="text-ramel hover:underline mt-2 inline-block">
                    Acessar vídeos
                  </Link>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <HelpCircle className="h-8 w-8 text-ramel" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Suporte Dedicado</h3>
                  <p className="text-muted-foreground">
                    Conte com nossa equipe de suporte especializada para esclarecer dúvidas técnicas sobre
                    produtos ou sobre o programa de afiliação.
                  </p>
                  <Link to="/membro/suporte" className="text-ramel hover:underline mt-2 inline-block">
                    Abrir ticket de suporte
                  </Link>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <Award className="h-8 w-8 text-ramel" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Links de Afiliação</h3>
                  <p className="text-muted-foreground">
                    Gere links personalizados para cada produto, acompanhe cliques e conversões
                    com rastreamento preciso de todas as suas indicações.
                  </p>
                  <Link to="/membro/afiliacao/links" className="text-ramel hover:underline mt-2 inline-block">
                    Gerenciar links
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Final */}
          <div className="bg-gradient-to-r from-ramel-dark to-ramel text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Torne-se um Afiliado de Sucesso</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Junte-se ao programa de afiliados da Ramel Tecnologia hoje mesmo e comece a construir 
              uma fonte de renda recorrente enquanto ajuda seus contatos com soluções tecnológicas de ponta.
            </p>
            <Link to="/membro/afiliacao/cadastro">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ramel">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AffiliationPage;
