import React, { useState, useEffect } from 'react';

import * as S from './styles'

import FormCreateQuestions from '../../components/FormCreateQuestions'

import { useParams } from 'react-router-dom';

export type Uuid = {
    uuiSimulado: string | string[];
    numeroDaPergunta: number
    setNumeroDaPerguntaNumber: Function
}

const CreateQuestions = () => {
    const [numeroDaPerguntaNumber, setNumeroDaPerguntaNumber] = useState(1)
    const { uuiSimulado, numeroDaPergunta }: any = useParams();

    useEffect(() => {
        if (numeroDaPergunta) {
            setNumeroDaPerguntaNumber(parseInt(numeroDaPergunta))
        }
    }, [])

    return (
        <>
            <S.Title>Questão {numeroDaPerguntaNumber}</S.Title>
            <FormCreateQuestions
                uuiSimulado={uuiSimulado}
                setNumeroDaPerguntaNumber={setNumeroDaPerguntaNumber}
                numeroDaPergunta={numeroDaPerguntaNumber}
            />
        </>
    )
}

export default CreateQuestions;
