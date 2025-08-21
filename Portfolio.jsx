import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink, Play, Image } from 'lucide-react'

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  // Dados de exemplo - serão substituídos por dados do backend
  const portfolioItems = [
    {
      id: 1,
      title: 'Logo Corporativo',
      description: 'Identidade visual para empresa de tecnologia',
      category: 'design',
      type: 'image',
      thumbnail: '/api/placeholder/400/300',
      tags: ['logo', 'branding', 'corporativo']
    },
    {
      id: 2,
      title: 'Vídeo Promocional',
      description: 'Vídeo promocional para lançamento de produto',
      category: 'video',
      type: 'video',
      thumbnail: '/api/placeholder/400/300',
      videoUrl: 'https://example.com/video',
      tags: ['promocional', 'produto', 'marketing']
    },
    {
      id: 3,
      title: 'Website Portfolio',
      description: 'Desenvolvimento de website responsivo',
      category: 'links',
      type: 'link',
      thumbnail: '/api/placeholder/400/300',
      url: 'https://example.com',
      tags: ['website', 'responsivo', 'portfolio']
    }
  ]

  const categories = [
    { id: 'all', label: 'Todos', icon: '🎯' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'video', label: 'Vídeos', icon: '🎬' },
    { id: 'links', label: 'Links', icon: '🔗' }
  ]

  const filteredItems = activeCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory)

  const renderItemIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image size={20} />
      case 'video':
        return <Play size={20} />
      case 'link':
        return <ExternalLink size={20} />
      default:
        return <Image size={20} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nosso Portfólio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore nossos trabalhos mais recentes em design gráfico, edição de vídeo e projetos digitais
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className="flex items-center space-x-2"
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Thumbnail */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                  {renderItemIcon(item.type)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  {item.type === 'link' && (
                    <Button size="sm" className="flex items-center space-x-2">
                      <span>Visitar</span>
                      <ExternalLink size={16} />
                    </Button>
                  )}
                  {item.type === 'video' && (
                    <Button size="sm" className="flex items-center space-x-2">
                      <span>Assistir</span>
                      <Play size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Nenhum item encontrado
            </h3>
            <p className="text-gray-600">
              Não há itens nesta categoria ainda. Volte em breve para ver novos trabalhos!
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredItems.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Carregar Mais
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Portfolio

