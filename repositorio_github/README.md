# API de Controle Financeiro Pessoal

API RESTful com NestJS e MongoDB (Atlas) para registrar receitas e despesas e consolidar métricas financeiras. Projeto extensionista alinhado ao ODS 1 (erradicação da pobreza) e ao ODS 12 (consumo e produção responsáveis), voltado ao letramento financeiro em oficinas comunitárias.

## Como rodar

```bash
npm install --legacy-peer-deps
cp .env.example .env
npm run start
```

Edite o `.env` com a string de conexão do seu cluster no MongoDB Atlas. A API sobe em `http://localhost:3000`.

## Endpoints

### POST /transacoes

```json
{
  "descricao": "Compra de Roupas",
  "valor": 300.25,
  "tipo": "despesa",
  "categoria": "Lazer",
  "consumoConsciente": false
}
```

- `tipo` aceita apenas `receita` ou `despesa`
- `consumoConsciente` é opcional e assume `true` por padrão

### GET /transacoes

```json
{
  "historico": [],
  "metricas": {
    "saldoTotal": 0,
    "totalDespesas": 0,
    "totalGastoImpulso": 0
  }
}
```

- `saldoTotal`: receitas menos despesas
- `totalDespesas`: soma das despesas
- `totalGastoImpulso`: soma das despesas com `consumoConsciente` igual a `false`

## Testes

```bash
npm test
```
