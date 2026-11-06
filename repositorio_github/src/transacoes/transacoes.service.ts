import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transacao, TransacaoDocument } from './schemas/transacao.schema.js';
import { CreateTransacaoDto } from './dto/create-transacao.dto.js';

export interface MetricasTransacoes {
  saldoTotal: number;
  totalDespesas: number;
  totalGastoImpulso: number;
}

export interface ResumoTransacoes {
  historico: Transacao[];
  metricas: MetricasTransacoes;
}

const arredondar = (valor: number): number => Math.round(valor * 100) / 100;

@Injectable()
export class TransacoesService {
  constructor(
    @InjectModel(Transacao.name)
    private readonly transacaoModel: Model<TransacaoDocument>,
  ) {}

  async criar(dto: CreateTransacaoDto): Promise<TransacaoDocument> {
    const transacao = new this.transacaoModel(dto);
    return transacao.save();
  }

  async listar(): Promise<ResumoTransacoes> {
    const historico = await this.transacaoModel
      .find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return {
      historico,
      metricas: this.calcularMetricas(historico),
    };
  }

  calcularMetricas(transacoes: Transacao[]): MetricasTransacoes {
    let totalReceitas = 0;
    let totalDespesas = 0;
    let totalGastoImpulso = 0;

    for (const transacao of transacoes) {
      if (transacao.tipo === 'receita') {
        totalReceitas += transacao.valor;
      } else if (transacao.tipo === 'despesa') {
        totalDespesas += transacao.valor;
        if (transacao.consumoConsciente === false) {
          totalGastoImpulso += transacao.valor;
        }
      }
    }

    return {
      saldoTotal: arredondar(totalReceitas - totalDespesas),
      totalDespesas: arredondar(totalDespesas),
      totalGastoImpulso: arredondar(totalGastoImpulso),
    };
  }
}
