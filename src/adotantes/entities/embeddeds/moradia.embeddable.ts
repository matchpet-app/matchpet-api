import { Column } from 'typeorm';
import { PosseMoradia } from '../../enums/posse-moradia.enum';
import { StatusTelaProtecao } from '../../enums/status-tela-protecao.enum';
import { TipoMoradia } from '../../enums/tipo-moradia.enum';
import { ComposicaoFamiliar } from './composicao-familiar.embeddable';

export class Moradia {
  @Column({ type: 'enum', enum: TipoMoradia })
  tipo: TipoMoradia;

  @Column({ type: 'enum', enum: PosseMoradia })
  posse: PosseMoradia;

  @Column({ type: 'enum', enum: StatusTelaProtecao })
  telaProtecao: StatusTelaProtecao;

  @Column(() => ComposicaoFamiliar)
  composicaoFamiliar: ComposicaoFamiliar;
}
