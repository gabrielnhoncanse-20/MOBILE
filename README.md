# EcoCut Monitoramento

## Sistema monitorado

Este sistema monitora indicadores de operação em tempo real, como:
- temperatura
- energia/bateria
- vibração
- status geral da leitura por sensor

## Como subir o backend

1. Abra o projeto do backend em outra pasta.
2. Certifique-se de que o Spring Boot está configurado para rodar em:
   http://localhost:8080
3. Inicie a aplicação com o comando do projeto Java/Spring Boot.
4. Teste o endpoint principal antes de rodar o mobile.

## Como subir o app

1. Acesse a pasta MOBILE.
2. Instale as dependências:
   npm install
3. Inicie o app:
   npx expo start

### Configuração da URL
- Web / iOS: http://localhost:8080
- Emulador Android: http://10.0.2.2:8080
- Celular físico: use o IP da máquina, por exemplo http://192.168.0.10:8080

## Endpoints usados pelo app

- GET /medicoes
- GET /sensores
- POST /medicoes
- POST /medicoes/simular (quando suportado pelo backend)

## O que o botão de simular faz

Ao pressionar o botão de gerar nova medição, o app envia uma requisição para a API para criar ou simular uma nova coleta. Em seguida, o app recarrega a lista de medições para mostrar o valor atualizado e o status final.

## O que a tela mostra se o backend estiver parado

Se o backend estiver indisponível, o app exibe uma mensagem de erro amigável e oferece um botão para tentar novamente. O app não quebra e mostra o estado de carregamento enquanto a conexão é testada.

## Estrutura do mobile

- src/types: tipos do domínio
- src/services/api.ts: chamadas HTTP
- src/utils: funções de status, cores e formatação
- App.tsx: tela principal do monitoramento

## Status visual

Os valores são convertidos para status visual:
- NORMAL
- ALERTA
- CRÍTICO

A regra usada no app foi:
- valor > 100 => CRÍTICO
- valor > 80 => ALERTA
- demais casos => NORMAL
