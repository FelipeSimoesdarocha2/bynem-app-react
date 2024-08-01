import React from 'react';

import * as S from './styles';

import FormUpdateSimulated from '../../components/FormUpdateSimulated';

import { useParams } from 'react-router-dom';

export type Uuid = {
    uuid: string | string[];
}

const UpdateSimulated = () => {
    const { uuid } = useParams<any>();

    return (
        <S.FormContainer>
            <FormUpdateSimulated uuid={uuid} />
        </S.FormContainer>
    )
}

export default UpdateSimulated;
