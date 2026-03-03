# Framework Guide - Playwright Test Automation Suite

Guia conciso de padrões, arquitetura e boas práticas para automação com Playwright.

---

## 1. Overview do Projeto

Projeto de **automação E2E** com **Playwright** para:
- Testes de **APIs REST** - Validação de endpoints
- Testes de **UI Web** - Interações e fluxos de usuário
- Testes **Multi-navegador** - Chrome, Firefox e Safari

**Objetivos**: Testes determinísticos, reutilizáveis, com relatórios detalhados e integrado com CI/CD.

---

## 2. Stack (Linguagem, Framework, Biblioteca)

| Componente | Versão | Descrição |
|-----------|--------|-----------|
| **Playwright** | ^1.58.2 | Framework de automação E2E |
| **@playwright/test** | ^1.58.2 | Test runner oficial |
| **Node.js** | 18+ | Runtime JavaScript |
| **JavaScript** | ES2022+ | Linguagem de programação |

**Por que Playwright?** Auto-waiting nativo, locators robustos, multi-navegador, relatórios built-in, execução paralela, retry automático.

---

## 3. Organização de Testes, Pastas e Padrões

### Estrutura de Diretórios

```
project-root/
├── tests/                  # Arquivos de teste (.spec.js)
├── pages/                  # Page Objects (POM)
├── fixtures/               # Setup, autenticação, dados de teste
├── utils/                  # Helpers e funções utilitárias
├── playwright.config.js    # Configuração do Playwright
├── package.json            # Dependências e scripts
└── .env                    # Variáveis de ambiente (não commitar)
```

### Padrões de Nomeação

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| **Arquivo de Teste** | `kebab-case.spec.js` | `recipe-api.spec.js` |
| **Page Object** | `PascalCase.js` | `LoginPage.js` |
| **Helper/Utils** | `kebab-case.js` | `api-helper.js` |
| **Variáveis** | `camelCase` | `userEmail`, `isFormValid` |
| **Funções** | `verbNoun()` | `loginUser()`, `verifyError()` |
| **Classes** | `PascalCase` | `LoginPage`, `ApiHelper` |
| **Constantes** | `UPPER_SNAKE_CASE` | `DEFAULT_TIMEOUT` |
| **Testes** | Describe o comportamento | `should display error on invalid email` |

---

## 4. Padrões do Projeto e Boas Práticas

### 4.1. Page Object Model (POM)
Padrão arquitetural que **separa seletores e lógica da automação** dos testes. Benefícios:
- 🔄 Reutilização de código (DRY)
- 🛡️ Mudanças de seletores em um único lugar
- 📚 Testes mais legíveis

**Estrutura**: Classe com locators como propriedades e métodos para interações/validações.

### 4.2. Seletores Robustos
**Ordem de preferência**:
1. `getByRole()` - Acessibilidade (PREFERIDO)
2. `getByTestId()` - Atributo data-testid
3. `getByLabel()` - Labels para forms
4. `locator()` - Customizados
5. ❌ CSS/XPath muito específicos - EVITAR

### 4.3. Assertions (Expect)
Use asserções objetivas: `toBeVisible()`, `toHaveText()`, `toContainText()`, `toHaveAttribute()`, `toBeEnabled()`, `toHaveURL()`, `toHaveCount()`.

### 4.4. Waits e Timeouts
- ✅ **Auto-wait** do Playwright (padrão)
- ✅ Esperar por estado: `expect(element).toBeVisible()`
- ⚠️ `waitForFunction()` apenas se necessário
- ❌ **Nunca** use `waitForTimeout()` (hardcoded waits)

### 4.5. Testes Independentes e Determinísticos
- Cada teste deve ser **autossuficiente** (não depender de outros)
- Mesmo resultado a **cada execução**
- **Setup completo** em cada teste
- Evitar estado compartilhado entre testes

### 4.6. Estrutura AAA (Arrange-Act-Assert)
- **Arrange**: Preparar dados e estado
- **Act**: Executar a ação
- **Assert**: Verificar o resultado

---

## 5. Fixtures e Setup

### 5.1. Fixtures Automáticas do Playwright
Built-in: `page`, `context`, `browser`, `request`, `playwright`

### 5.2. Fixtures Customizadas
Estenda `test` para reutilizar setup complexo (autenticação, dados).
Padrão: `test.extend({ fixture: async ({}, use) => { /* setup */ await use(fixture); /* teardown */ } })`

### 5.3. Setup e Teardown
- `test.beforeAll()` - Uma vez antes de todos os testes
- `test.beforeEach()` - Antes de cada teste
- `test.afterEach()` - Após cada teste
- `test.afterAll()` - Uma vez após todos os testes

---

## 6. Tratamento de Variáveis de Ambiente

### 6.1. Arquivo `.env`
Armazene credenciais, URLs e configurações (nunca commitar).

**Variáveis comuns**:
- `BASE_URL` - URL base da aplicação
- `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` - Credenciais de teste
- `CI` - Indicador de ambientes CI/CD
- `TIMEOUT`, `SLOW_MO` - Configurações

### 6.2. Uso nas Configurações
Carregue `dotenv` em `playwright.config.js` e acesse via `process.env.VARIAVEL`.

### 6.3. Variáveis por Ambiente
- **Local**: Desabilitar retries, ativar headed mode
- **CI**: Headless obrigatório, 2+ retries, workers limitados

---

## 7. Padrões de Naming

| Elemento | Padrão | ✅ Bom | ❌ Ruim |
|----------|--------|--------|---------|
| Variáveis | camelCase | `userEmail` | `e`, `email1` |
| Funções | verbNoun | `loginUser()` | `do()`, `test()` |
| Classes | PascalCase | `LoginPage` | `login`, `page` |
| Constantes | UPPER_CASE | `DEFAULT_TIMEOUT` | `timeout` |
| Testes | Descrição de comportamento | `should display error on invalid email` | `login test`, `test 1` |

---

## 8. Dados de Teste

### 8.1. Estructura de Dados
Organize dados de teste em um arquivo centralizado (`fixtures/test-data.js`) com usuários, URLs e dados necessários.

### 8.2. Data Builders
Para dados complexos, use **Builder Pattern**: classe com métodos fluentes `.withProperty()` retornando `this` e método `build()`.

### 8.3. Cleanup de Dados (Teardown)
Em `test.afterEach()`, delete dados criados durante o teste via API ou banco de dados.

---

## 9. Tratamento de Erros e Retry

### 9.1. Configuração de Retry
`retries: 2` em CI, `0` em local (detectado via `process.env.CI`).

### 9.2. Retry em Testes Específicos
`test.retries(n)('nome', async () => {})` - Override para teste individual.

### 9.3. Skip/Only e Tags
- `test.skip()` - Pular teste
- `test.only()` - Executar apenas este
- `@tag` para categorizar e usar `--grep @tag`

### 9.4. Timeouts
- Global: `timeout: 30000` (teste), `expect: { timeout: 5000 }`
- Específico: `test.setTimeout()` ou `expect().toBeVisible({ timeout: 10000 })`

---

## 10. Instruções de Instalação e Execução

### 10.1. Pré-requisitos
- Node.js v18+
- npm v8+
- Git

### 10.2. Instalação
```bash
git clone <repo>
npm install
npx playwright install
cp .env.example .env  # E editar com suas configurações
```

### 10.3. Scripts Disponíveis
```bash
npm test              # Rodar testes (headless)
npm run test:ui       # Modo UI (debug visual)
npm run test:headed   # Navegador visível
npm run test:debug    # Com debugger
```

### 10.4. Executar Testes
- Todos: `npm test`
- Arquivo específico: `npx playwright test tests/file.spec.js`
- Padrão: `npx playwright test --grep "should display"`
- Navegador: `npx playwright test --project=chromium`
- Workers: `npx playwright test --workers=4`
- Relatório: `npx playwright show-report`

---

## 11. Estrutura de CI/CD

### 11.1. Configuração para CI
Detectada automaticamente via `process.env.CI`:
- Headless obrigatório
- 2 workers (paralelo limitado)
- 2 retries automáticos
- Screenshots/vídeos apenas em falhas
- Traces na primeira retry

### 11.2. Plataformas Suportadas
- **GitHub Actions** - Workflow YAML automático
- **GitLab CI** - Dockerfile + script
- **Jenkins** - Jenkinsfile declarativo
- Qualquer CI que rode Node.js

### 11.3. Artefatos
Publique `playwright-report/` como artefato para visualização pós-execução.

### 11.4. Best Practices
- ✅ Headless em CI
- ✅ 2 retries
- ✅ Workers limitados (2-4)
- ✅ Publicar relatórios
- ❌ Nunca hardcoded credentials
- ❌ Nunca desabilitar retries

---

## 12. Estrutura de Relatório

### 12.1. HTML Reporter (Padrão)
Configurado em `playwright.config.js` com `reporter: [['html', { open: 'never' }]]`.
**Conteúdo**: Resumo, duração, screenshots, vídeos, traces, logs.
Visualize com `npx playwright show-report`.

### 12.2. Reporters Disponíveis
- `html` - Relatório visual interativo
- `json` - Dados estruturados
- `junit` - Compatível com CI (XML)
- `list` - Console output
- `dot` - Minimalista (dots)

### 12.3. Traces (Debugging)
Gravadas automaticamente em falhas (`trace: 'on-first-retry'`).
Visualize com `npx playwright show-trace trace.zip`.

### 12.4. Screenshots e Vídeos
- `screenshot: 'only-on-failure'` - Capturar em falhas
- `video: 'retain-on-failure'` - Gravar em falhas

### 12.5. Publicar Relatórios
- **GitHub Actions**: Upload com `actions/upload-artifact`
- **GitHub Pages**: Publique `playwright-report/` automaticamente

---

## 13. Boas Práticas de Código

### 13.1. Princípios Gerais
- 🎯 Testes **determinísticos** (mesmo resultado)
- 🔄 Testes **independentes** (sem dependências)
- 🏗️ **DRY** - Reutilize código
- 📚 **Legibilidade** - Claro e bem organizado
- ⚡ **Performance** - Otimizado para velocidade
- 🛡️ **Manutenibilidade** - Fácil refatorar

### 13.2. Funções Simples
Cada função deve ter **uma responsabilidade**:
- ✅ `fillForm()`, `submitForm()`, `verifySuccess()`
- ❌ `loginUser()` que faz tudo

### 13.3. Testes Acoplados
❌ **Nunca** deixe testes dependerem uns dos outros.
✅ Cada teste com setup **completo e isolado**.

### 13.4. Comentários
✅ Explique **POR QUÊ** (não o quê).
❌ Evite comentários óbvios.

### 13.5. Documentação
Use **JSDoc** para documentar funções com parâmetros, retorno e exemplo.

### 13.6. Tratamento de Exceções
Catch específico, não genérico. Relance erros após log.

### 13.7. Anti-patterns a Evitar

| ❌ Anti-pattern | ✅ Solução |
|---|---|
| Hardcoded waits (`waitForTimeout()`) | Auto-wait + `expect().toBeVisible()` |
| Credenciais em código | Variáveis de ambiente (`.env`) |
| Seletores muito específicos | getByRole, getByTestId |
| Testes muito longos | Dividir em testes menores |
| Testes acoplados | Setup isolado em cada teste |

### 13.8. Code Review Checklist
- ✅ Nome descritivo
- ✅ Padrão AAA (Arrange-Act-Assert)
- ✅ Usa POM
- ✅ Sem hardcoded waits
- ✅ Sem credentials hardcoded
- ✅ Testes independentes
- ✅ Locators robustos
- ✅ Assertions claras
- ✅ Passa local e CI

---

## 14. Recursos Adicionais

### 14.1. Documentação Oficial
- [Playwright Docs](https://playwright.dev/)
- [Playwright API](https://playwright.dev/docs/api/intro)
- [Best Practices](https://playwright.dev/docs/best-practices)

### 14.2. Ferramentas Úteis
- **Debug**: `npx playwright test --debug`
- **Trace Viewer**: `npx playwright show-trace`
- **HTML Report**: `npx playwright show-report`
- **Codegen**: `npx playwright codegen` (gera testes automaticamente)

### 14.3. Troubleshooting Comum
| Problema | Solução |
|----------|---------|
| Falha apenas em CI | `CI=true npx playwright test --workers=2` |
| Elemento não encontrado | `npx playwright test --debug` + aumentar timeout |
| Flakiness | Aumentar `retries`, usar `@tag` para agrupar |

---

## 15. Checklist de Setup Inicial

- [ ] Clonar repositório
- [ ] `npm install`
- [ ] `npx playwright install`
- [ ] Copiar e editar `.env`
- [ ] Rodar teste exemplo: `npm test`
- [ ] Verificar relatório: `npx playwright show-report`

---

**Versão**: 2.0.0 (Resumido)
