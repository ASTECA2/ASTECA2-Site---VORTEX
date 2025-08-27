# Site - VORTEX (Para GitHub Pages)

Este pacote contém os arquivos do frontend do seu site, pré-configurados para serem implantados no GitHub Pages no repositório `asteca2/Site---VORTEX`.

## 🚀 Como Implantar no GitHub Pages

Siga estas instruções cuidadosamente para garantir que seu site seja publicado corretamente:

1.  **Baixe este arquivo ZIP** e descompacte-o. Você encontrará uma pasta chamada `Site---VORTEX`.

2.  **Vá para o seu repositório no GitHub:** `https://github.com/asteca2/Site---VORTEX`

3.  **Limpe sua branch de deploy:**
    *   Se você estiver usando a branch `main` (ou `master`) para o GitHub Pages, vá para essa branch.
    *   Se você estiver usando uma branch `gh-pages`, vá para essa branch.
    *   **Exclua TODO o conteúdo existente** nessa branch (mantenha apenas o `.git` se você estiver fazendo isso localmente, mas se for via interface do GitHub, apenas exclua os arquivos).

4.  **Faça o upload dos arquivos:**
    *   **Suba TODO o conteúdo da pasta `Site---VORTEX`** (que você descompactou) para a **raiz** da sua branch de deploy no GitHub.
    *   Certifique-se de que o arquivo `index.html` esteja diretamente na raiz da branch.

5.  **Configure o GitHub Pages (se ainda não estiver configurado ou se tiver dúvidas):**
    *   No seu repositório, clique em `Settings` (Configurações).
    *   No menu lateral esquerdo, clique em `Pages`.
    *   Em `Build and deployment` -> `Source`, selecione a branch que você está usando para o deploy (ex: `main` ou `gh-pages`).
    *   Certifique-se de que a pasta está definida como `/ (root)`. Se você estivesse usando uma subpasta como `docs`, seria `/docs`.
    *   Clique em `Save` (Salvar).

6.  **Aguarde a publicação:** Pode levar alguns minutos para o GitHub Pages processar e publicar as alterações. Você pode verificar o status do deploy na seção `Pages`.

7.  **Acesse seu site:** Uma vez publicado, seu site estará disponível em: `https://asteca2.github.io/Site---VORTEX/`

## ⚠️ Importante

*   Este pacote contém apenas o frontend (HTML, CSS, JavaScript). O backend (Flask) que você desenvolveu não está incluído aqui, pois ele precisa ser implantado em um servidor que suporte Python (como o que usamos no Manus).
*   O site foi configurado para funcionar especificamente no URL `https://asteca2.github.io/Site---VORTEX/`. Se você mudar o nome do repositório ou o caminho, precisará reconfigurar o `homepage` no `package.json` e reconstruir o frontend.

Se você encontrar algum problema ou tiver dúvidas, não hesite em procurar ajuda!

