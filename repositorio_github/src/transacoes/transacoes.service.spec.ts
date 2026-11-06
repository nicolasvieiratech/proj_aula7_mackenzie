import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TransacoesService } from './transacoes.service.js';
import { Transacao } from './schemas/transacao.schema.js';

describe('TransacoesService', () => {
  let service: TransacoesService;
  let find: ReturnType<typeof vi.fn>;

  const dados: Transacao[] = [
    {
      descricao: 'Salário',
      valor: 3000,
      tipo: 'receita',
      categoria: 'Renda',
      consumoConsciente: true,
    },
    {
      descricao: 'Conta de Luz',
      valor: 150.5,
      tipo: 'despesa',
      categoria: 'Moradia',
      consumoConsciente: true,
    },
    {
      descricao: 'Compra de Roupas',
      valor: 300.25,
      tipo: 'despesa',
      categoria: 'Lazer',
      consumoConsciente: false,
    },
    {
      descricao: 'Delivery',
      valor: 49.9,
      tipo: 'despesa',
      categoria: 'Alimentação',
      consumoConsciente: false,
    },
  ];

  beforeEach(async () => {
    find = vi.fn().mockReturnValue({
      sort: () => ({ lean: () => ({ exec: () => Promise.resolve(dados) }) }),
    });

    const module = await Test.createTestingModule({
      providers: [
        TransacoesService,
        { provide: getModelToken(Transacao.name), useValue: { find } },
      ],
    }).compile();

    service = module.get(TransacoesService);
  });

  it('retorna historico e metricas consolidadas', async () => {
    const resultado = await service.listar();

    expect(resultado.historico).toHaveLength(4);
    expect(resultado.metricas).toEqual({
      saldoTotal: 2499.35,
      totalDespesas: 500.65,
      totalGastoImpulso: 350.15,
    });
  });

  it('retorna metricas zeradas sem transacoes', () => {
    expect(service.calcularMetricas([])).toEqual({
      saldoTotal: 0,
      totalDespesas: 0,
      totalGastoImpulso: 0,
    });
  });

  it('ignora receitas no total de gasto por impulso', () => {
    const metricas = service.calcularMetricas([
      {
        descricao: 'Bônus',
        valor: 100,
        tipo: 'receita',
        categoria: 'Renda',
        consumoConsciente: false,
      },
    ]);

    expect(metricas.totalGastoImpulso).toBe(0);
    expect(metricas.saldoTotal).toBe(100);
  });
});
