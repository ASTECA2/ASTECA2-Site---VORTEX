import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Upload, Plus, X, Image, Video, Link, Save, 
  LogOut, User, Eye, EyeOff, Edit, Trash2, 
  AlertCircle, CheckCircle 
} from 'lucide-react';

const Admin = () => {
  // Estados de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Estados da interface administrativa
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadType, setUploadType] = useState('image');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    url: '',
    category: 'design',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Estados para gerenciamento de itens
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [stats, setStats] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  // URL da API (ajuste conforme necessário)
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Verifica autenticação ao carregar o componente
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        loadPortfolioItems();
        loadStats();
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('session_token', data.session_token);
        setUser(data.user);
        setIsAuthenticated(true);
        setLoginData({ username: '', password: '' });
        loadPortfolioItems();
        loadStats();
        showMessage('success', 'Login realizado com sucesso!');
      } else {
        setLoginError(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setLoginError('Erro de conexão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        }
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('session_token');
      setIsAuthenticated(false);
      setUser(null);
      showMessage('success', 'Logout realizado com sucesso!');
    }
  };

  const loadPortfolioItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/portfolio?include_inactive=true`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolioItems(data.items);
      }
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let dataToSend = {
        title: formData.title,
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        category: formData.category,
        type: uploadType,
      };

      if (uploadType === 'link') {
        dataToSend.url = formData.url;
      }

      // TODO: Implementar upload de arquivos
      if (selectedFile && uploadType !== 'link') {
        // Por enquanto, apenas simula o upload
        dataToSend.file_path = `/uploads/${selectedFile.name}`;
      }

      const response = await fetch(`${API_BASE_URL}/admin/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        },
        credentials: 'include',
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        showMessage('success', 'Item adicionado com sucesso!');
        
        // Limpa o formulário
        setFormData({
          title: '',
          description: '',
          tags: '',
          url: '',
          category: 'design',
        });
        setSelectedFile(null);
        setPreviewUrl('');
        
        // Recarrega os itens
        loadPortfolioItems();
        loadStats();
      } else {
        const errorData = await response.json();
        showMessage('error', errorData.error || 'Erro ao adicionar item');
      }
    } catch (error) {
      showMessage('error', 'Erro de conexão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Tem certeza que deseja deletar este item?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/portfolio/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        }
      });

      if (response.ok) {
        showMessage('success', 'Item deletado com sucesso!');
        loadPortfolioItems();
        loadStats();
      } else {
        const errorData = await response.json();
        showMessage('error', errorData.error || 'Erro ao deletar item');
      }
    } catch (error) {
      showMessage('error', 'Erro de conexão. Tente novamente.');
    }
  };

  const uploadTypes = [
    { id: 'image', label: 'Imagem', icon: <Image size={20} /> },
    { id: 'video', label: 'Vídeo', icon: <Video size={20} /> },
    { id: 'link', label: 'Link', icon: <Link size={20} /> },
  ];

  const categories = [
    { id: 'design', label: 'Design Gráfico' },
    { id: 'video', label: 'Edição de Vídeo' },
    { id: 'links', label: 'Projetos Digitais' },
  ];

  // Tela de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Tela de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <User className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Área Administrativa</h1>
            <p className="text-gray-600 mt-2">Faça login para continuar</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={loginData.username}
                onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu usuário"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Interface administrativa principal
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-xl text-gray-600 mt-2">
              Bem-vindo, {user?.username}! Gerencie o conteúdo do seu portfólio
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
            <LogOut size={16} />
            <span>Sair</span>
          </Button>
        </div>

        {/* Mensagens */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? 
              <CheckCircle className="h-5 w-5 mr-2" /> : 
              <AlertCircle className="h-5 w-5 mr-2" />
            }
            <span>{message.text}</span>
          </div>
        )}

        {/* Estatísticas */}
        {stats.portfolio && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Total de Itens</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.portfolio.total_items}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Imagens</h3>
              <p className="text-3xl font-bold text-green-600">{stats.portfolio.images}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Vídeos</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.portfolio.videos}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Links</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.portfolio.links}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'upload'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Plus className="inline mr-2" size={16} />
                Adicionar Conteúdo
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'manage'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Gerenciar Itens ({portfolioItems.length})
              </button>
            </nav>
          </div>

          <div className="p-8">
            {/* Tab de Upload */}
            {activeTab === 'upload' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Adicionar Novo Item
                </h2>

                {/* Seletor de tipo */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de Conteúdo
                  </label>
                  <div className="flex space-x-4">
                    {uploadTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setUploadType(type.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                          uploadType === type.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {type.icon}
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Campo de URL para links */}
                  {uploadType === 'link' && (
                    <div>
                      <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                        URL do Link *
                      </label>
                      <input
                        type="url"
                        id="url"
                        name="url"
                        required
                        value={formData.url}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://exemplo.com"
                      />
                    </div>
                  )}

                  {/* Upload de arquivo para imagens e vídeos */}
                  {uploadType !== 'link' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Arquivo *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          onChange={handleFileSelect}
                          accept={uploadType === 'image' ? 'image/*' : 'video/*'}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-lg font-medium text-gray-900 mb-2">
                            Clique para fazer upload
                          </p>
                          <p className="text-sm text-gray-500">
                            {uploadType === 'image' ? 'PNG, JPG, GIF até 10MB' : 'MP4, MOV, AVI até 100MB'}
                          </p>
                        </label>
                        
                        {previewUrl && (
                          <div className="mt-4">
                            {uploadType === 'image' ? (
                              <img src={previewUrl} alt="Preview" className="max-h-32 mx-auto rounded" />
                            ) : (
                              <video src={previewUrl} className="max-h-32 mx-auto rounded" controls />
                            )}
                            <p className="text-sm text-gray-600 mt-2">{selectedFile?.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Título */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite o título"
                    />
                  </div>

                  {/* Descrição */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descreva o item"
                    />
                  </div>

                  {/* Categoria */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="design, logo, branding (separadas por vírgula)"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Separe as tags com vírgulas
                    </p>
                  </div>

                  {/* Botão de envio */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>{isSubmitting ? 'Salvando...' : 'Salvar Item'}</span>
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab de Gerenciamento */}
            {activeTab === 'manage' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Gerenciar Itens do Portfólio
                </h2>

                {portfolioItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Nenhum item encontrado</p>
                    <Button 
                      onClick={() => setActiveTab('upload')} 
                      className="mt-4"
                    >
                      Adicionar Primeiro Item
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {portfolioItems.map((item) => (
                      <div key={item.id} className="bg-gray-50 p-6 rounded-lg border">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {item.type === 'image' && <Image size={16} className="text-green-600" />}
                              {item.type === 'video' && <Video size={16} className="text-purple-600" />}
                              {item.type === 'link' && <Link size={16} className="text-orange-600" />}
                              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                              {!item.is_active && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                  Inativo
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-2">{item.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Categoria: {item.category}</span>
                              <span>Criado: {new Date(item.created_at).toLocaleDateString()}</span>
                              {item.tags && item.tags.length > 0 && (
                                <span>Tags: {item.tags.join(', ')}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingItem(item)}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

