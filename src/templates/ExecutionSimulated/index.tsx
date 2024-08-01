import React, { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import Content from './Content';

export default function ExecutionSimulated() {
    const { params } = useRouteMatch<{ uuidSimulado: string }>()

    return <Content uuidSimulado={params.uuidSimulado} />
}
