import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { TransacoesService } from './transacoes.service.js';
import type { ResumoTransacoes } from './transacoes.service.js';
import { CreateTransacaoDto } from './dto/create-transacao.dto.js';
import type { TransacaoDocument } from './schemas/transacao.schema.js';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  criar(@Body() dto: CreateTransacaoDto): Promise<TransacaoDocument> {
    return this.transacoesService.criar(dto);
  }

  @Get()
  listar(): Promise<ResumoTransacoes> {
    return this.transacoesService.listar();
  }
}
