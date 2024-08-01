import React, { useEffect, useState } from 'react';
import { Button, Divider } from 'antd';
import { toast } from 'react-toastify';
import { useHistory, useLocation } from 'react-router-dom';
import { Input } from 'antd';

import TableVizualizeQuestions from '../../components/TableVizualizeQuestions';

import * as S from './styles';

import api from '../../service/api';

export type Uuid = {
    uuidSimulado?: string;
}

export type Resposta = { id: string; idPergunta: string, descricao: string; correta: boolean }

export type Perguntas = {
    comentarioFinal: string
    descricao: string
    id: string
    multiplaEscolha: false
    respostas: Resposta[]
    linkImagemCapaSimulado?: any
    filenameImage: any
}

type NewType = {
    id: string;
    tempoPorProva: any;
    author: string;
    descricao: string;
    linkYouTube: string;
    titulo: string;
    ordemDasPerguntas: number;
    linkImagemCapaSimulado: string;
    perguntas: Perguntas[]
};

export type FormCreatedSimulated = NewType;

export default function VisualizeSimulated() {
    const { TextArea } = Input;
    const [simulated, setSimulated] = useState<FormCreatedSimulated>();

    const { state } = useLocation<any>();

    const user = JSON.parse(localStorage.getItem("user"));
    const history = useHistory();

    function DeleteSimulated(id) {
        api.delete(`Simulado/${id}`, {
        }).then(function () {
            toast.success("Simulado Deletado com sucesso ");
            history.push('/');
        }).catch(function (error) {
            toast.error(`Um erro inesperado aconteceu`);
        });
    }

    function UpdateSimulated(id) {
        history.push(`/editar/simulado/${id}`);
    }

    function goToExecucaoSimulado() {
        history.replace(`/simulado/${simulated?.id}`)
    }

    useEffect(() => {
        function getSimulatedById() {
            const { uuid } = state;

            api.get(`Simulado/semOrdenacao/${uuid}`)
                .then(function (response) {
                    setSimulated(response.data)
                }).catch(function (error) {
                    toast.error(`Um erro inesperado aconteceu`)
                });
        }

        function getSimulatedByName() {
            api.get(`Simulado/semOrdenacao/byTitulo/${window.location.pathname.replace('/visualizar/simulado/', '')}`)
                .then(function (response) {
                    setSimulated(response.data)
                }).catch(function (error) {
                    toast.error(`Um erro inesperado aconteceu`)
                });
        }
        console.log("state",state)
        if (state?.uuid) {
            getSimulatedById();
        } else if (window.location?.pathname) {
            getSimulatedByName();
        }
    }, [state]);

    return <>
        {simulated &&
            <>
                <S.Title>{simulated?.titulo}</S.Title>
                <S.ContainerVideoOrImage>
                    {simulated.linkYouTube &&
                        <iframe
                            height="315"
                            src={simulated.linkYouTube}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    }
                    {simulated.linkImagemCapaSimulado &&
                        <img src={simulated.linkImagemCapaSimulado} alt="logo Simulado" />
                    }
                </S.ContainerVideoOrImage>
                <Divider />
                <S.ContainerDescription>
                    <TextArea rows={4} disabled={true} style={{ color: "#373737" }} defaultValue={simulated?.descricao} />
                </S.ContainerDescription>
                <S.ContainerButton>
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: "#38B000",
                            border: "none",
                        }}
                        size="large"
                        onClick={() => { goToExecucaoSimulado() }}
                    >
                        Iniciar Simulado
                    </Button>

                    {user?.tipoUser == 1 && <div style={{ marginTop: 15 }}>
                        <Button
                            onClick={() => UpdateSimulated(simulated.id)}
                            type="primary"
                            style={{ width: "77px" }}
                        >
                            Editar
                        </Button>
                        <Button
                            onClick={() => DeleteSimulated(simulated.id)}
                            type="primary"
                            style={{ width: "77px", marginLeft: 10 }}
                            danger
                        >
                            Deletar
                        </Button>
                    </div>}
                </S.ContainerButton>

                <S.ContainerTableQuestions>
                    <TableVizualizeQuestions perguntas={simulated.perguntas} />
                </S.ContainerTableQuestions>
            </>
        }
    </>
}
