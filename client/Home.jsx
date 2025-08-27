import { Button } from '@/components/ui/button'
import { ArrowRight, Palette, Video, Link } from 'lucide-react'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Criando <span className="text-blue-600">Experiências</span> Visuais
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Especialista em design gráfico e edição de vídeo, transformando ideias em realidade visual
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="flex items-center space-x-2">
              <span>Ver Portfólio</span>
              <ArrowRight size={20} />
            </Button>
            <Button variant="outline" size="lg">
              Entre em Contato
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Nossos Serviços
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Design Gráfico */}
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Design Gráfico</h3>
              <p className="text-gray-600">
                Criação de identidades visuais, logos, materiais gráficos e designs únicos para sua marca
              </p>
            </div>

            {/* Edição de Vídeo */}
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Edição de Vídeo</h3>
              <p className="text-gray-600">
                Produção e edição de vídeos profissionais, motion graphics e conteúdo audiovisual
              </p>
            </div>

            {/* Projetos Digitais */}
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Link className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Projetos Digitais</h3>
              <p className="text-gray-600">
                Desenvolvimento de projetos digitais, websites e experiências interativas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Sobre Nós
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Somos uma equipe apaixonada por design e tecnologia, dedicada a criar soluções visuais 
            que impactam e inspiram. Com anos de experiência no mercado, oferecemos serviços 
            personalizados que atendem às necessidades específicas de cada cliente.
          </p>
          <p className="text-lg text-gray-600">
            Nosso compromisso é transformar suas ideias em realidade, utilizando as mais modernas 
            ferramentas e técnicas do design contemporâneo.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para começar seu projeto?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Entre em contato conosco e vamos criar algo incrível juntos
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            Fale Conosco
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Home

