# GameL0.github.io

Portfólio pessoal e landing page estática criada para apresentar o trabalho e as habilidades do desenvolvedor Arthur Melo.

## Visão geral do projeto

Este projeto é um site de apresentação construído com HTML, CSS e JavaScript, usando Vite como bundler de desenvolvimento e Tailwind CSS para estilos rápidos.

O site inclui:
- seções de `Sobre Mim`, `Skills`, `Projetos`, `Experiências` e `Contato`
- menu responsivo para dispositivos móveis
- efeito de digitação e navegação suave
- imagens e conteúdo pensados para um portfólio pessoal

## Escopo

O projeto contempla:
- página inicial estática para apresentação pessoal
- navegação ancorada entre seções
- layout responsivo para desktop e mobile
- estilos customizados com Tailwind CSS e CSS próprio em `css/style.css`
- scripts JavaScript para interatividade em `menu-mobile.js`, `forms.js` e `typewriter.js`

Não inclui:
- backend ou API para envio de formulários
- autenticação de usuários
- gerenciamento de banco de dados

## Como usar

### Requisitos

- Node.js instalado
- npm ou yarn disponível

### Instalar dependências

```powershell
npm install
```

### Executar em modo de desenvolvimento

```powershell
npm run dev
```

Em seguida, abra o endereço exibido no terminal (normalmente `http://localhost:5173`).

## Estrutura principal

- `index.html` — estrutura da página
- `css/style.css` — estilos personalizados
- `img/` — imagens usadas no site
- `menu-mobile.js` — controle do menu responsivo
- `typewriter.js` — animação de digitação no cabeçalho
- `forms.js` — lógica de formulário de contato (front-end)
- `vite.config.js` — configuração do Vite
- `package.json` — dependências e scripts do projeto

## Decisões técnicas

- Vite foi escolhido para simplificar o desenvolvimento local, habilitar recarregamento rápido e permitir uso fácil de Tailwind CSS.
- Tailwind CSS é usado para construir estilos responsivos de forma rápida e manter o CSS modular.
- O JavaScript está separado em arquivos específicos para manter a interface leve e facilitar futuras alterações.
- O projeto é estático para garantir boa performance e facilidade de hospedagem em serviços como GitHub Pages.

