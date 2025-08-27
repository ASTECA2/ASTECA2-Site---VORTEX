import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Plus, X, Image, Video, Link, Save } from 'lucide-react';

const Admin = () => {
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

  // ESTA É A FUNÇÃO ATUALIZADA
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Sua URL da Render já está aqui
    const backendUrl = 'https://portfolio-backend-onmk.onrender.com/api/portfolio';

    // Prepara os dados para enviar como JSON
    const dataToSend = {
      title: formData.title,
      description: formData.description,
      // Converte a string de tags (separadas por vírgula) para um array
      tags: formData.tags.split(',').map(tag => tag.trim()),
      category: formData.category,
      type: uploadType,
      url: formData.url, // Usado apenas para o tipo 'link'
    };

    // NOTA: Esta função envia dados como JSON e funciona perfeitamente para o tipo 'Link'.
    // O upload de arquivos de imagem/vídeo precisa de uma atualização no seu backend (Python) para funcionar.

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao adicionar o item.');
      }

      const result = await response.json();
      console.log('Item adicionado com sucesso:', result);
      alert('Item adicionado com sucesso!');

      // Limpa o formulário após o sucesso
      setFormData({
        title: '',
        description: '',
        tags: '',
        url: '',
        category: 'design',
      });
      setSelectedFile(null);
      setPreviewUrl('');

    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      alert(`Erro: ${error.message}`);
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Painel Administrativo
          </h1>
          <p className="text-xl text-gray-600">
            Gerencie o conteúdo do seu portfólio
          </p>
        </div>
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
                Gerenciar Itens
              </button>
            </nav>
          </div>
          <div className="p-8">
            {activeTab === 'upload' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Adicionar Novo Item
                </h2>
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  {uploadType === 'link' ? (
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
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">