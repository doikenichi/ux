# Prototipagem de ideia - Trabalho de UX - UFSCar

Atividade em grupo · 2ª semana · Tema: Alimentação Saudável.

Protótipo mobile de acompanhamento alimentar. Permite registrar refeições e visualizar estimativas de calorias e macronutrientes a partir das informações do perfil.

O projeto original está disponível no [Figma](https://www.figma.com/design/Wp0lQHsm4h5PrPFFkZsbn3/Prototipagem-de-ideia).

## Membros da Equipe

- Aline Ribeiro Braga
- Claudio Yaitiro Sakamoto
- Erik Kaue de Oliveira Silva
- Enrico Sola Lopes
- Fabio Colatto
- Franco Doi
- Rafael Luis Albano

## Recursos

- Onboarding para informar nome, altura, peso e sexo.
- Home com meta calórica estimada, consumo do dia, macronutrientes e refeições registradas.
- Busca de alimentos e ajuste de porções em gramas.
- Registro de alimentos em café da manhã, almoço, jantar ou lanche.
- Tela de progresso e detalhamento de cada refeição, incluindo remoção de itens.
- Tema claro ou escuro conforme a preferência do sistema, layout adaptável e navegação acessível por rótulos ARIA e foco visível.

## Tecnologias

- React e TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Interface visual inspirada no Material Design 3

## Como executar

Instale as dependências:

```bash
npm i
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

## Limitações do protótipo

- A base de alimentos e os registros de refeições usam dados locais de demonstração; apenas o perfil é persistido no navegador.
- Não há autenticação, armazenamento seguro, política de privacidade ou consentimento para dados pessoais e de saúde.
- Não há histórico alimentar real por data; as médias e os cálculos exibidos são estimativas.
- A meta calórica não substitui orientação de profissional de saúde ou nutrição.
- As diretrizes de UX foram aplicadas visualmente, mas ainda requerem auditoria de acessibilidade e testes com usuários em dispositivos reais.
