import { Atendimento, KM } from './../../models/atendimento';
import {
    ADICIONAR_PERGUNTAS,
    CHEGOU_AO_DESTINO,
    EDITAR_ATENDIMENTO,
    EM_DESLOCAMENTO,
    INICIAR_ATENDIMENTO,
    SYNC_ATENDIMENTOS_SUCCESS,
    FIM_ATENDIMENTO
} from './../actions/atendimentos';
import {
    Actions,
    RETRIEVE_ATENDIMENTOS,
    RETRIEVE_ATENDIMENTOS_FAILED,
    RETRIEVE_ATENDIMENTOS_SUCCESS,
} from '../actions/atendimentos';


function changeAtendimento(state:Atendimento[], atendimento: Atendimento): Atendimento[]{
  return state.map(at => {
        if(atendimento._id === at._id){
          return atendimento;
        }else{
          return at;
        }
  })
}

export function atendimentosReducer(state:Atendimento[] = [], action: Actions) {
	switch (action.type) {
		case RETRIEVE_ATENDIMENTOS:
      return state;

    case EDITAR_ATENDIMENTO: {
      const atendimento = state.find(at => at._id === action.payload._id);
      if(atendimento){
        const novoAt: Atendimento = Object.assign({}, atendimento, action.payload, { synced: false});
        return state.map(at => {
          if(novoAt._id === at._id){
            return novoAt;
          }else{
            return at;
          }
        })
      }
    }

		case RETRIEVE_ATENDIMENTOS_SUCCESS:{
      const atendimentos = action.payload.map((atendimento: Atendimento) => {
        const atendimentoFound: Atendimento = state.find(at => at._id === atendimento._id);
        if( atendimentoFound && atendimentoFound.synced === false ){
          return atendimentoFound;
        }else{
          return atendimento;
        }
      });
      return atendimentos;
    }

    case INICIAR_ATENDIMENTO: {
      const atendimento = state.find( atendimento => atendimento._id === action.payload._id);

      const atendimentoModificado =  Object.assign({}, atendimento, {synced: false}, {
        inicio: atendimento.inicio || new Date(),
        estado: 'inicio_atendimento'
      });

      return changeAtendimento(state, atendimentoModificado);

    }

    case EM_DESLOCAMENTO: {
      const atendimento = state.find( atendimento => atendimento._id === action.payload._id);

      const km: KM = action.payload.km_inicial;
      const data = (atendimento.km_inicio && atendimento.km_inicio.data) ? atendimento.km_inicio.data : km.data;

      const atendimentoComKM =  Object.assign({}, atendimento, {synced: false}, {
        km_inicio: {
          km: km.km || atendimento.km_inicio.km || 0,
          data
        },
        estado: 'em_deslocamento'
      });

      return changeAtendimento(state, atendimentoComKM);
    }

    case CHEGOU_AO_DESTINO: {
      const atendimento = state.find( atendimento => atendimento._id === action.payload._id);

      const km: KM = action.payload.km_final;

      const atendimentoComKM =  Object.assign({}, atendimento, {synced: false}, {
        km_final: {
          km: km.km || atendimento.km_final.km,
          data: atendimento.km_final.data || km.data
        },
        estado: 'chegou_ao_destino'
      });
      return changeAtendimento(state, atendimentoComKM);
    }

    case ADICIONAR_PERGUNTAS: {
      const atendimento = state.find( atendimento => atendimento._id === action.payload._id);

      const atendimentoModificado = Object.assign({}, atendimento, {synced: false}, {
        fim: atendimento.fim || new Date(),
        avaliacao: action.payload.avaliacao,
        estado: 'fim_do_atendimento'
      });

      return changeAtendimento(state, atendimentoModificado);
    }

    case FIM_ATENDIMENTO: {
      const atendimento = state.find( atendimento => atendimento._id === action.payload._id);

      const atendimentoModificado = Object.assign({}, atendimento, {synced: false}, {
        fim: atendimento.fim || new Date(),
        estado: 'fim_do_atendimento'
      });

      return changeAtendimento(state, atendimentoModificado);
    }

		case RETRIEVE_ATENDIMENTOS_FAILED:
      return state;
    case  SYNC_ATENDIMENTOS_SUCCESS:{
      const atendimentos = state.map(atendimento =>{
        const achou = action.payload.find((atendimentoSynced:Atendimento)=> atendimentoSynced._id === atendimento._id);
        if(achou){
          delete atendimento.synced;
          return atendimento;
        }else{
          return atendimento;
        }
      })
      return atendimentos;
    }

		default:
			return state;
	}
}
