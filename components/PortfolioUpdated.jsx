import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Play, Image, Video, Link as LinkIcon, AlertCircle, RefreshCw } from 'lucide-react';

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL da API (ajuste conforme necessário)
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Busca os dados do backend quando a página carregar
  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/portfolio`);
      
      if (!response.ok) {
        throw new Error('Não foi possível carregar os itens do portfólio.');
      }
      
      const data = await response.json();
      setPortfolioItems(data.items || []);
    } catch (error) {
      console.error("Erro ao buscar portfólio:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'Todos', icon: '🎯' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'video', label: 'Vídeos', icon: '🎬' },
    { id: 'links', label: 'Links', icon: '🔗' },
  ];

  const filteredItems = activeCategory === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);

  const renderItemIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image size={20} className="text-green-600" />;
      case 'video':
        return <Video size={20} className="text-purple-600" />;
      case 'link':
        return <LinkIcon size={20} className="text-orange-600" />;
      default:
        return <Image size={20} className="text-gray-600" />;
    }
  };

  const renderItemContent = (item) => {
    switch (item.type) {
      case 'image':
        return (
          <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
            {item.file_path ? (
              <img 
                src={item.file_path} 
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5JbWFnZW08L3RleHQ+PC9zdmc+';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image size={48} className="text-gray-400" />
              </div>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
            {item.file_path ? (
              <video 
                src={item.file_path}
                className="w-full h-full object-cover"
                controls
                poster={item.thumbnail_path}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play size={48} className="text-gray-400" />
              </div>
            )}
          </div>
        );
      
      case 'link':
        return (
          <div className="aspect-video bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-center">
              <LinkIcon size={48} className="text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-orange-700">Link Externo</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <Image size={48} className="text-gray-400" />
          </div>
        );
    }
  };

  const handleItemClick = (item) => {
    if (item.type === 'link' && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Tela de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nosso Portfólio
            </h1>
            <p className="text-xl text-gray-600">
              Carregando nossos trabalhos...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nosso Portfólio
            </h1>
          </div>
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar portfólio</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchPortfolioItems} className="flex items-center space-x-2 mx-auto">
              <RefreshCw size={16} />
              <span>Tentar novamente</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nosso Portfólio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore nossa coleção de trabalhos criativos, desde designs gráficos até projetos digitais inovadores
          </p>
        </div>

        {/* Filtros de categoria */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              <span>{category.icon}</span>
              <span className="font-medium">{category.label}</span>
              <span className="text-sm opacity-75">
                ({category.id === 'all' ? portfolioItems.length : portfolioItems.filter(item => item.category === category.id).length})
              </span>
            </button>
          ))}
        </div>

        {/* Grid de itens */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeCategory === 'all' ? 'Nenhum item encontrado' : `Nenhum item na categoria "${categories.find(c => c.id === activeCategory)?.label}"`}
              </h3>
              <p className="text-gray-600">
                {activeCategory === 'all' 
                  ? 'Nosso portfólio está sendo atualizado. Volte em breve!'
                  : 'Tente selecionar uma categoria diferente.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                  item.type === 'link' ? 'cursor-pointer' : ''
                }`}
                onClick={() => handleItemClick(item)}
              >
                {/* Conteúdo do item */}
                {renderItemContent(item)}

                {/* Informações do item */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {renderItemIcon(item.type)}
                      <span className="text-sm font-medium text-gray-500 capitalize">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 capitalize">
                      {item.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Botão de ação */}
                  {item.type === 'link' && item.url && (
                    <Button
                      size="sm"
                      className="w-full flex items-center justify-center space-x-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.url, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <ExternalLink size={14} />
                      <span>Visitar Link</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estatísticas */}
        {portfolioItems.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-8 bg-white rounded-lg shadow-md px-8 py-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">{portfolioItems.length}</div>
                <div className="text-sm text-gray-600">Total de Projetos</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {portfolioItems.filter(item => item.type === 'image').length}
                </div>
                <div className="text-sm text-gray-600">Designs</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {portfolioItems.filter(item => item.type === 'video').length}
                </div>
                <div className="text-sm text-gray-600">Vídeos</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {portfolioItems.filter(item => item.type === 'link').length}
                </div>
                <div className="text-sm text-gray-600">Links</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;

