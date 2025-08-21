import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Plus, X, Image, Video, Link, Save } from 'lucide-react'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('upload')
  const [uploadType, setUploadType] = useState('image')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    url: '',
    category: 'design'
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const submitData = new FormData()
    submitData.append('title', formData.title)
    submitData.append('description', formData.description)
    submitData.append('tags', formData.tags)
    submitData.append('category', formData.category)
    submitData.append('type', uploadType)
    
    if (uploadType === 'link') {
      submitData.append('url', formData.url)
    } else if (selectedFile) {
      submitData.append('file', selectedFile)
    }

    // Aqui será implementada a integração com o backend
    console.log('Dados para upload:', Object.fromEntries(submitData))
    
    alert('Item adicionado com sucesso!')
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      tags: '',
      url: '',
      category: 'design'
    })
    setSelectedFile(null)
    setPreviewUrl('')
  }

  const uploadTypes = [
    { id: 'image', label: 'Imagem', icon: <Image size={20} /> },
    { id: 'video', label: 'Vídeo', icon: <Video size={20} /> },
    { id: 'link', label: 'Link', icon: <Link size={20} /> }
  ]

  const categories = [
    { id: 'design', label: 'Design Gráfico' },
    { id: 'video', label: 'Edição de Vídeo' },
    { id: 'links', label: 'Projetos Digitais' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Painel Administrativo
          </h1>
          <p className="text-xl text-gray-600">
            Gerencie o conteúdo do seu portfólio
          </p>
        </div>

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

                {/* Upload Type Selection */}
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
                  {/* File Upload or URL Input */}
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
                        Arquivo {uploadType === 'image' ? 'de Imagem' : 'de Vídeo'} *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          accept={uploadType === 'image' ? 'image/*' : 'video/*'}
                          onChange={handleFileSelect}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-600">
                            Clique para selecionar ou arraste o arquivo aqui
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            {uploadType === 'image' ? 'PNG, JPG, GIF até 10MB' : 'MP4, MOV, AVI até 100MB'}
                          </p>
                        </label>
                      </div>
                      
                      {/* Preview */}
                      {previewUrl && (
                        <div className="mt-4">
                          <div className="relative inline-block">
                            {uploadType === 'image' ? (
                              <img
                                src={previewUrl}
                                alt="Preview"
                                className="max-w-xs max-h-48 rounded-lg"
                              />
                            ) : (
                              <video
                                src={previewUrl}
                                controls
                                className="max-w-xs max-h-48 rounded-lg"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFile(null)
                                setPreviewUrl('')
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Title */}
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
                      placeholder="Título do projeto"
                    />
                  </div>

                  {/* Description */}
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
                      placeholder="Descrição detalhada do projeto"
                    />
                  </div>

                  {/* Category */}
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
                      placeholder="logo, branding, corporativo (separadas por vírgula)"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Separe as tags com vírgulas
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full flex items-center justify-center space-x-2" size="lg">
                    <Save size={20} />
                    <span>Salvar Item</span>
                  </Button>
                </form>
              </div>
            )}

            {activeTab === 'manage' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Gerenciar Itens do Portfólio
                </h2>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Funcionalidade em Desenvolvimento
                  </h3>
                  <p className="text-gray-600">
                    A funcionalidade de gerenciamento será implementada na próxima versão.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin

