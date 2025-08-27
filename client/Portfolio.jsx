// No início do ficheiro, adicione useEffect aos imports
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Play, Image } from 'lucide-react';

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // 1. Substituímos a lista de exemplos por um estado para guardar os itens do backend
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar que está a carregar
  const [error, setError] = useState(null); // Estado para guardar erros

  // 2. Este código vai buscar os dados do seu backend quando a página carregar
  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        // A sua URL da Render já está aqui
        const response = await fetch('https://portfolio-backend-onmk.onrender.com/api/portfolio');
        if (!response.ok) {
          throw new Error('Não foi possível buscar os itens do portfólio.');
        }
        const data = await response.json();
        setPortfolioItems(data); // Guarda os itens recebidos no estado
      } catch (error) {
        console.error("Erro ao buscar portfólio:", error);
        setError(error.message); // Guarda a mensagem de erro
      } finally {
        setIsLoading(false); // Termina o carregamento (com sucesso ou erro)
      }
    };

    fetchPortfolioItems();
  }, []); // O array vazio [] garante que isto só executa uma vez quando o componente é montado

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
        return <Image size={20} />;
      case 'video':
        return <Play size={20} />;
      case 'link':
        return <ExternalLink size={20} />;
      default:
        return <Image size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nosso Portfólio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore nossos trabalhos mais recentes em design gráfico, edição de vídeo e projetos digitais
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category.id)}
              className="flex items-center space-x-2"
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </Button>
          ))}
        </div>

        {/* 3. Lógica para mostrar o estado de carregamento, erro ou os itens */}
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">A carregar projetos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-600">
            <p>Erro ao carregar projetos: {error}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={item.thumbnail_path || '/api/placeholder/400/300'} // Usa a thumbnail do backend ou um placeholder
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                      {renderItemIcon(item.type)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {item.description}
                    </p>
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
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                      {item.type === 'link' && item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="flex items-center space-x-2">
                            <span>Visitar</span>
                            <ExternalLink size={16} />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Nenhum item encontrado
                </h3>
                <p className="text-gray-600">
                  Não há itens nesta categoria ainda. Adicione um no painel de Admin!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;