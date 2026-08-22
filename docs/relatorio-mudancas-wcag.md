# Relatório de mudanças de acessibilidade — WCAG 2.2 AA

## 1. Identificação

- **Aplicação:** NutriDia — protótipo de registro e acompanhamento nutricional.
- **Idioma:** português brasileiro (`pt-BR`).
- **Meta adotada:** WCAG 2.2, níveis A e AA.
- **Data do relatório:** 22 de agosto de 2026.
- **Referência de consulta rápida:** [Guia WCAG 2.2 em português](https://guia-wcag.com/).
- **Referência normativa:** [Tradução autorizada da WCAG 2.2 para português brasileiro — W3C](https://www.w3.org/Translations/WCAG22-pt-BR/).

> Este documento registra as mudanças implementadas e as verificações realizadas. Ele não representa uma certificação formal de conformidade, pois a WCAG exige também avaliação humana e testes com tecnologias assistivas.

## 2. Resumo das mudanças

A aplicação foi revisada de acordo com os quatro princípios da WCAG: **perceptível, operável, compreensível e robusto**. As principais mudanças foram:

- estrutura semântica com conteúdo principal, títulos e agrupamentos de formulário;
- navegação completa por teclado, link para ignorar blocos e foco visível;
- gestão do foco após mudanças de tela;
- formulário com rótulos, obrigatoriedade, instruções e erros acessíveis;
- controles de tema e contraste implementados com elementos HTML nativos;
- mensagens dinâmicas anunciadas por tecnologias assistivas;
- alternativas textuais para gráficos e ocultação de elementos decorativos;
- suporte a ampliação, realinhamento, alto contraste e redução de movimento;
- título e descrição da página em português;
- testes automatizados com Vitest, Testing Library e axe.

## 3. Critérios WCAG relacionados

### 3.1 Perceptível

| Critério | Nível | Mudança implementada | Evidência |
| --- | --- | --- | --- |
| [1.1.1 Conteúdo Não Textual](https://www.w3.org/Translations/WCAG22-pt-BR/#non-text-content) | A | Emojis e ícones decorativos receberam `aria-hidden`. O anel de calorias possui `role="img"` e descrição textual. Barras de macronutrientes expõem rótulo, valor atual, máximo e texto equivalente. | `CalorieRing`, `MacroBar` e listas de alimentos em `src/app/App.tsx`. |
| [1.3.1 Informações e Relações](https://www.w3.org/Translations/WCAG22-pt-BR/#info-and-relationships) | A | Inclusão de `main`, títulos de nível 1, `form`, `fieldset`, `legend`, rótulos associados e regiões de navegação/status. | Estrutura principal e onboarding em `src/app/App.tsx`. |
| [1.3.2 Sequência com Significado](https://www.w3.org/Translations/WCAG22-pt-BR/#meaningful-sequence) | A | A ordem no DOM acompanha a ordem visual: conteúdo principal antes da navegação inferior e campos na sequência esperada de preenchimento. | Estrutura de retorno do componente `App`. |
| [1.3.5 Identificar o Propósito de Entrada](https://www.w3.org/Translations/WCAG22-pt-BR/#identify-input-purpose) | AA | Campos receberam `name`, tipos adequados, `autocomplete`, `inputMode`, limites e passos numéricos. | Campos de nome, e-mail, senha, altura e peso. |
| [1.4.1 Uso de Cores](https://www.w3.org/Translations/WCAG22-pt-BR/#use-of-color) | A | Estados ativos combinam cor com texto, ícones, bordas e propriedades programáticas como `checked`, `pressed` e `current`. Erros usam mensagem textual e não apenas vermelho. | Navegação, filtros, seletores de tema e formulário. |
| [1.4.3 Contraste Mínimo](https://www.w3.org/Translations/WCAG22-pt-BR/#contrast-minimum) | AA | Os tokens dos temas claro, escuro e alto contraste foram conferidos para a relação mínima de 4,5:1 em textos normais. | Tokens em `src/styles/theme.css`; resultados na seção 5. |
| [1.4.4 Redimensionar Texto](https://www.w3.org/Translations/WCAG22-pt-BR/#resize-text) | AA | Remoção da largura mínima do `body`, uso de dimensões relativas e adaptação das grades para preservar conteúdo com ampliação. | Regras base e `.profile-measures` em `src/styles/theme.css`. |
| [1.4.10 Realinhar](https://www.w3.org/Translations/WCAG22-pt-BR/#reflow) | AA | O layout compacto usa largura fluida, a grade de medidas passa para uma coluna e a altura do aplicativo se adapta a viewports reduzidas. | `.app-shell`, `.profile-measures` e media queries. |
| [1.4.11 Contraste Não Textual](https://www.w3.org/Translations/WCAG22-pt-BR/#non-text-contrast) | AA | Bordas, indicadores de foco, controles e estados selecionados usam tokens de primeiro plano e contorno com diferenciação reforçada. | Temas e estilos de foco em `src/styles/theme.css`. |

### 3.2 Operável

| Critério | Nível | Mudança implementada | Evidência |
| --- | --- | --- | --- |
| [2.1.1 Teclado](https://www.w3.org/Translations/WCAG22-pt-BR/#keyboard) | A | Ações utilizam `button`, `input`, `select`, rádio e checkbox nativos, operáveis por Tab, Enter, Espaço e setas. | Componentes e controles em `src/app/App.tsx`. |
| [2.1.2 Sem Bloqueio do Teclado](https://www.w3.org/Translations/WCAG22-pt-BR/#no-keyboard-trap) | A | Não foram introduzidos componentes modais ou scripts que prendam o foco. A navegação permanece sequencial. | Fluxos cobertos pelos testes de componente. |
| [2.4.1 Ignorar Blocos](https://www.w3.org/Translations/WCAG22-pt-BR/#bypass-blocks) | A | Inclusão do link “Ir para o conteúdo”, visível ao receber foco e direcionado ao `main`. | `.skip-link` e `#main-content`. |
| [2.4.2 Página com Título](https://www.w3.org/Translations/WCAG22-pt-BR/#page-titled) | A | O título inicial e a descrição foram corrigidos; `document.title` passa a refletir a tela ativa. | `index.html` e `SCREEN_TITLES`. |
| [2.4.3 Ordem do Foco](https://www.w3.org/Translations/WCAG22-pt-BR/#focus-order) | A | A ordem de foco acompanha o conteúdo. Após uma mudança de tela, o foco é enviado ao novo `h1`; após erro, ao primeiro campo inválido. | Efeito associado a `screen` e `finishOnboarding`. |
| [2.4.6 Cabeçalhos e Rótulos](https://www.w3.org/Translations/WCAG22-pt-BR/#headings-and-labels) | AA | Cada tela possui um `h1` descritivo; busca e campos do perfil receberam rótulos visíveis e instruções claras. | Onboarding, busca e títulos das telas. |
| [2.4.7 Foco Visível](https://www.w3.org/Translations/WCAG22-pt-BR/#focus-visible) | AA | Botões, campos, seletores, controles customizados e títulos focados recebem contorno de 3 px com deslocamento de 2 px. | Seletores `:focus-visible` em `src/styles/theme.css`. |
| [2.4.11 Foco Não Obscurecido — Mínimo](https://www.w3.org/Translations/WCAG22-pt-BR/#focus-not-obscured-minimum) | AA | O conteúdo principal possui rolagem própria e o foco é direcionado para elementos dentro da área visível, acima da navegação inferior. | Contêiner principal e gestão de foco. |
| [2.5.3 Rótulo em Nome](https://www.w3.org/Translations/WCAG22-pt-BR/#label-in-name) | A | Os nomes acessíveis preservam o texto dos rótulos visíveis, como “Seu nome”, “Buscar alimento por nome” e “Alto contraste”. | Atributos `aria-label`, `label` e `htmlFor`. |
| [2.5.8 Tamanho do Alvo — Mínimo](https://www.w3.org/Translations/WCAG22-pt-BR/#target-size-minimum) | AA | Controles interativos mantêm pelo menos 44 × 44 px, superando o mínimo de 24 × 24 px do critério AA. | Botões `min-h-12`, ícones de 48 px e `.accessible-switch`. |

### 3.3 Compreensível

| Critério | Nível | Mudança implementada | Evidência |
| --- | --- | --- | --- |
| [3.1.1 Idioma da Página](https://www.w3.org/Translations/WCAG22-pt-BR/#language-of-page) | A | O documento declara `lang="pt-BR"`; título, descrição, rótulos e mensagens estão em português brasileiro. | `index.html`. |
| [3.2.3 Navegação Consistente](https://www.w3.org/Translations/WCAG22-pt-BR/#consistent-navigation) | AA | A barra principal mantém os mesmos quatro destinos, ordem e identificação nas telas do aplicativo. | `NavigationBar`. |
| [3.3.1 Identificação do Erro](https://www.w3.org/Translations/WCAG22-pt-BR/#error-identification) | A | Nome, altura e peso inválidos recebem `aria-invalid`, mensagem associada e foco no primeiro erro. | `onboardingErrors` e `finishOnboarding`. |
| [3.3.2 Rótulos ou Instruções](https://www.w3.org/Translations/WCAG22-pt-BR/#labels-or-instructions) | A | Campos obrigatórios usam `required`; e-mail e senha são identificados como opcionais; a busca apresenta exemplo de preenchimento. | Formulário e campo de busca. |
| [3.3.3 Sugestão de Erro](https://www.w3.org/Translations/WCAG22-pt-BR/#error-suggestion) | AA | Mensagens informam como corrigir o problema: preencher o nome ou informar valor maior que zero. | Mensagens do tipo “Informe ... para continuar”. |

### 3.4 Robusto

| Critério | Nível | Mudança implementada | Evidência |
| --- | --- | --- | --- |
| [4.1.2 Nome, Função, Valor](https://www.w3.org/Translations/WCAG22-pt-BR/#name-role-value) | A | Controles expõem nome e estado por HTML nativo ou ARIA. Progressos publicam mínimo, máximo, valor atual e texto; navegação usa `aria-current`; filtros usam `aria-pressed`. | `NavigationBar`, `MacroBar`, filtros e configurações. |
| [4.1.3 Mensagens de Status](https://www.w3.org/Translations/WCAG22-pt-BR/#status-messages) | AA | Uma região `role="status"` anuncia criação do perfil, registros, desfazer, repetição e remoções. A busca anuncia a quantidade de resultados e a data usa `aria-live`. | `announcement`, `food-search-status` e `DateNav`. |

## 4. Melhorias adicionais

As seguintes melhorias ultrapassam alguns requisitos mínimos de nível AA ou servem como técnicas complementares:

- alvos de interação de 44 × 44 px, equivalentes à recomendação aprimorada do critério 2.5.5 AAA;
- respeito a `prefers-reduced-motion`, removendo animações e transições não essenciais;
- suporte a `forced-colors` para modos de contraste forçado do sistema;
- opção própria de alto contraste em conjunto com temas claro e escuro;
- conteúdo nutricional acompanhado de ressalva de que não constitui orientação médica.

## 5. Validações executadas

### 5.1 Testes automatizados

Foram configurados Vitest, jsdom, Testing Library, `user-event`, `jest-axe` e `jest-dom`.

| Comando | Resultado |
| --- | --- |
| `npm test` | 5 testes aprovados. |
| `npm run test:a11y` | Oito telas percorridas; nenhuma violação axe encontrada. |
| `npm run build` | Build de produção concluído com sucesso. |

Os testes cobrem:

- onboarding e identificação dos campos opcionais;
- mensagem e foco do primeiro erro;
- atualização do título da página e foco após navegação;
- painel, busca, detalhe do alimento e confirmação;
- cálculo, detalhe da refeição e configurações;
- nomes e estados de rádio e checkbox;
- análise axe em todas as telas alcançadas pelos fluxos.

### 5.2 Contraste dos tokens principais

Foi realizada uma verificação programática das combinações centrais de texto e superfície. O menor resultado encontrado foi **4,98:1** no tema claro e **5,60:1** no tema claro com alto contraste, acima do mínimo de 4,5:1 para texto normal.

| Aparência | Texto principal/superfície | Texto secundário/superfície forte | Botão primário | Container primário |
| --- | ---: | ---: | ---: | ---: |
| Claro | 13,30:1 | 4,98:1 | 5,17:1 | 11,45:1 |
| Escuro | 16,81:1 | 7,07:1 | 5,99:1 | 9,42:1 |
| Claro + alto contraste | 17,29:1 | 5,60:1 | 9,47:1 | 10,89:1 |
| Escuro + alto contraste | 18,93:1 | 6,07:1 | 8,15:1 | 6,84:1 |

## 6. Verificações manuais recomendadas

A análise automatizada não consegue validar toda a WCAG. Antes da entrega definitiva, recomenda-se:

1. percorrer todos os fluxos apenas com teclado;
2. testar com NVDA ou Narrador no Windows;
3. confirmar o anúncio das mensagens de busca, registro, desfazer e remoção;
4. testar zoom de 200% e 400%, inclusive em viewport de 320 CSS px;
5. verificar ausência de conteúdo cortado ou rolagem horizontal;
6. conferir os quatro modos de aparência;
7. ativar “Reduzir movimento” e o modo de contraste forçado do sistema;
8. revisar contraste de estados transitórios de hover, foco, seleção e desabilitado.

## 7. Arquivos criados ou modificados

- `src/app/App.tsx`: semântica, formulário, foco, controles, nomes e mensagens acessíveis.
- `src/styles/theme.css`: foco, realinhamento, alvos, contraste forçado e movimento reduzido.
- `index.html`: idioma, título e descrição em português.
- `package.json` e `package-lock.json`: infraestrutura e comandos de teste.
- `vitest.config.ts` e `src/test/setup.ts`: ambiente de testes.
- `src/app/App.accessibility.test.tsx`: cenários automatizados e análise axe.
- `docs/acessibilidade-wcag.md`: checklist resumido de manutenção.
- `docs/relatorio-mudancas-wcag.md`: este relatório detalhado.

## 8. Referências

- [Guia WCAG 2.2 — consulta rápida em português](https://guia-wcag.com/)
- [Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.2 — tradução autorizada pt-BR](https://www.w3.org/Translations/WCAG22-pt-BR/)
- [WCAG 2.2 — versão normativa em inglês](https://www.w3.org/TR/WCAG22/)
- [WAI — visão geral da WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)
