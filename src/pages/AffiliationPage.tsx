
import MemberHeader from "@/components/MemberHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, MessageCircle, Download, HelpCircle, Book, BookOpen } from "lucide-react";
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
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Área de Arquivos e Suporte" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
              <div className="text-white">
                <h1 className="text-3xl md:text-4xl font-bold">Arquivos e Material de Apoio</h1>
                <p className="mt-2 text-lg">Acesso exclusivo a todos os recursos para seu sucesso</p>
              </div>
            </div>
          </div>
          
          {/* Sobre a Área */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">Bem-vindo à Área de Membros</h2>
                <p className="mb-4 text-lg">
                  Como membro, você tem acesso exclusivo a uma ampla gama de recursos projetados para maximizar 
                  seu sucesso com nossos produtos e soluções. Aqui você encontrará tutoriais detalhados, 
                  manuais técnicos, guias práticos e suporte especializado.
                </p>
                <p className="text-lg">
                  Nossa equipe está constantemente atualizando esta biblioteca com novos conteúdos e 
                  recursos para garantir que você sempre tenha as melhores ferramentas à sua disposição.
                </p>
              </div>
              <div className="md:w-1/3">
                <Card className="border-ramel/20">
                  <CardHeader className="bg-ramel text-white">
                    <CardTitle>Precisa de ajuda?</CardTitle>
                    <CardDescription className="text-white/80">
                      Nossa equipe está pronta para auxiliar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Link to="/membro/suporte">
                      <Button className="w-full bg-ramel hover:bg-ramel-dark">Abrir Ticket de Suporte</Button>
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
                    "Disponibilizamos esta área exclusiva para nossos membros porque acreditamos que seu sucesso 
                    é o nosso sucesso. Todos os recursos que você encontra aqui foram cuidadosamente desenvolvidos 
                    para garantir que você possa extrair o máximo valor de nossas soluções tecnológicas."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
          
          {/* Categorias de Conteúdo */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Recursos Disponíveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-ramel/20">
                <CardHeader>
                  <Book className="h-10 w-10 text-ramel mb-2" />
                  <CardTitle>Manuais Técnicos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Documentação completa sobre cada recurso de nossos produtos, com guias detalhados e exemplos práticos.</p>
                  <Link to="/membro/arquivos/manuais" className="text-ramel hover:underline mt-4 inline-block">
                    Acessar manuais
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="border-ramel/20">
                <CardHeader>
                  <Video className="h-10 w-10 text-ramel mb-2" />
                  <CardTitle>Vídeo Tutoriais</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Tutoriais em vídeo que demonstram passo a passo como utilizar cada funcionalidade de nossos produtos.</p>
                  <Link to="/membro/videos" className="text-ramel hover:underline mt-4 inline-block">
                    Assistir vídeos
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="border-ramel/20">
                <CardHeader>
                  <FileText className="h-10 w-10 text-ramel mb-2" />
                  <CardTitle>Modelos e Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Arquivos prontos para uso, templates e modelos que ajudam a agilizar seu trabalho com nossas soluções.</p>
                  <Link to="/membro/arquivos/templates" className="text-ramel hover:underline mt-4 inline-block">
                    Baixar templates
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="border-ramel/20">
                <CardHeader>
                  <BookOpen className="h-10 w-10 text-ramel mb-2" />
                  <CardTitle>Guias de Boas Práticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Recomendações e dicas de especialistas sobre como obter os melhores resultados com nossas soluções.</p>
                  <Link to="/membro/arquivos/guias" className="text-ramel hover:underline mt-4 inline-block">
                    Conferir guias
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="border-ramel/20">
                <CardHeader>
                  <HelpCircle className="h-10 w-10 text-ramel mb-2" />
                  <CardTitle>FAQ e Soluções</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Respostas para as perguntas mais frequentes e soluções para os problemas mais comuns encontrados.</p>
                  <Link to="/membro/arquivos/faq" className="text-ramel hover:underline mt-4 inline-block">
                    Consultar FAQ
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="border-ramel/20">
                <CardHeader>
                  <MessageCircle className="h-10 w-10 text-ramel mb-2" />
                  <CardTitle>Suporte Técnico</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Contato direto com nossa equipe técnica para resolver dúvidas específicas e problemas complexos.</p>
                  <Link to="/membro/suporte" className="text-ramel hover:underline mt-4 inline-block">
                    Contatar suporte
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Últimas Atualizações */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Materiais Recentes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4 items-start">
                <Download className="h-8 w-8 text-ramel" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Manual DeliveryFlow 2.0</h3>
                  <p className="text-muted-foreground">
                    Guia completo atualizado com todas as novas funcionalidades da versão 2.0, incluindo 
                    integração com marketplaces e gerenciamento avançado de entregas.
                  </p>
                  <Link to="/membro/arquivos/manual-delivery-flow" className="text-ramel hover:underline mt-2 inline-block">
                    Baixar manual
                  </Link>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <Video className="h-8 w-8 text-ramel" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Vídeo: Configuração do AgendaPro</h3>
                  <p className="text-muted-foreground">
                    Tutorial em vídeo mostrando o passo a passo para configurar o AgendaPro desde a 
                    instalação inicial até a personalização avançada.
                  </p>
                  <Link to="/membro/videos/config-agendapro" className="text-ramel hover:underline mt-2 inline-block">
                    Assistir vídeo
                  </Link>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <FileText className="h-8 w-8 text-ramel" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Template: Relatórios Mensais</h3>
                  <p className="text-muted-foreground">
                    Modelo de relatório personalizado para acompanhamento mensal de desempenho, 
                    pronto para ser importado em qualquer um de nossos softwares.
                  </p>
                  <Link to="/membro/arquivos/template-relatorios" className="text-ramel hover:underline mt-2 inline-block">
                    Baixar template
                  </Link>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <HelpCircle className="h-8 w-8 text-ramel" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Guia de Solução de Problemas</h3>
                  <p className="text-muted-foreground">
                    Documento com fluxogramas de diagnóstico e soluções para os problemas mais comuns 
                    reportados por usuários em todos os nossos produtos.
                  </p>
                  <Link to="/membro/arquivos/guia-solucoes" className="text-ramel hover:underline mt-2 inline-block">
                    Acessar guia
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Final */}
          <div className="bg-gradient-to-r from-ramel-dark to-ramel text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Não Encontrou o que Procura?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Nossa equipe de suporte está pronta para auxiliá-lo com qualquer dúvida ou necessidade específica.
              Abra um ticket de suporte e receba atendimento personalizado.
            </p>
            <Link to="/membro/suporte">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ramel">
                Contatar Suporte Técnico
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AffiliationPage;
