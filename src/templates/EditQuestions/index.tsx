import React from 'react';

import * as S from './styles'

import FormEditQuestions from '../../components/FormEditQuestions'

import { useParams } from "react-router-dom";

export type EditQuestions = {
    uuidSimulado: string
    uuidQuestao: string
}
 
const EditQuestions = () => {
    const { uuidSimulado, uuidQuestao }: EditQuestions = useParams();

    const variavelQuestao = 1

    return (
        <>
            <S.Title>Editar Questão {variavelQuestao}</S.Title>
            <FormEditQuestions uuidSimulado={uuidSimulado} uuidQuestao={uuidQuestao} />
        </>
    )
}

export default EditQuestions;