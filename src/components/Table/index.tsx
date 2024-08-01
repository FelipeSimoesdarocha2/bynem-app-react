import React, { useEffect, useState } from 'react';
import { Button, Skeleton, Table } from 'antd';
import { Space } from 'antd';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { Pagination } from 'antd';
import 'antd/dist/antd.css';
import * as S from './styles';

import api from '../../service/api'

import { useSearch } from '../../context/SearchContext'

export type DataTable = {
    descricao: string;
    id: number;
    linkYouTube: string;
    ordemDasPerguntas: number;
    titulo: string;
    slugTitulo: string;
    autor: string;
    autorId: string;
}

export type Table = {
    setBottom: Function;
};

export default function TableAnt({ setBottom }: Table) {
    const [data, setData] = useState<DataTable[]>()
    
    const [isLoading, setIsLoading] = useState(true)

    const [arraiDeFavoritosDoUsuario, setArraiDeFavoritosDoUsuario] = useState<any[]>([])

    const user = JSON.parse(localStorage.getItem("user"))
    const history = useHistory();

    const { search } = useSearch();

    const visualizarSimulado = (id) => {
        var tituloSimulado = data?.find(e => e.id == id)?.slugTitulo;
        history.push(`/visualizar/simulado/${tituloSimulado}`, {
            uuid: id
        });
    }

    const SeeProfile = (id) => {
        history.push(`/visualizar/perfil/${id}`)
    }

    async function deleteOFavorito(id) {
        setIsLoading(true);
        await api.delete(`Simulado/SimuladosFavoritos/${user.id}/${id}`)
            .then(response => {
                if (response) {
                    const idsSimuladosFavoritos = arraiDeFavoritosDoUsuario.filter((value) => value.id !== id);
                    setArraiDeFavoritosDoUsuario(idsSimuladosFavoritos);
                    toast.success('Favorito removido com sucesso ')
                    setIsLoading(false)
                }
            })
            .catch(function (error) {
                toast.error(`Um erro inesperado aconteceu`)
                setIsLoading(false);
            });
    }

    async function addOFavorito(id) {
        const idNovoSimulado = { id: id }
        if (user) {
            arraiDeFavoritosDoUsuario.push(idNovoSimulado)
            setArraiDeFavoritosDoUsuario(arraiDeFavoritosDoUsuario)
            let dataRequest = { userId: user.id, simuladoId: id };
            setIsLoading(true);
            await api.post(`Simulado/SimuladosFavoritos`, dataRequest)
                .then(function (response) {
                    if (response) {
                        toast.success('Adicionado a lista de favoritos')
                        setIsLoading(false)
                    }
                })
                .catch(function (error) {
                    toast.error(`Um erro inesperado aconteceu`)
                    setIsLoading(false);
                });
        }
    }

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'titulo',
            key: 'titulo',
        },
        {
            title: 'Autor',
            dataIndex: 'autorId',
            key: 'autorId',
            render: (autorId) => (
                <>
                    <Space size="middle">
                        <a onClick={() => SeeProfile(autorId)}>{data?.find(e => e.autorId == autorId)?.autor}</a>
                    </Space>
                </>
            ),
        },
        {
            title: 'Quantidade de Perguntas',
            dataIndex: 'qtdPerguntas',
            key: 'qtdPerguntas',
        },
        {
            title: 'Visualizar',
            dataIndex: 'id',
            key: 'id',
            render: (id: number) => (
                <Space size="middle">
                    <a onClick={() => visualizarSimulado(id)}>Visualizar</a>
                </Space>
            ),
        },
        {
            title: 'Favoritar',
            dataIndex: 'id',
            key: 'id',
            render: (id) => {
                let verificados = arraiDeFavoritosDoUsuario.filter((item) => item.id === id)
                if (verificados.length > 0) {
                    return <S.Star onClick={() => deleteOFavorito(id)} />
                } else {
                    return <S.StartFavorito onClick={() => addOFavorito(id)} />
                }
            }
        },
    ];

    async function getIdsSimuladosFavoritosUsuario() {
        if (user) {
            await api.get(`Simulado/SimuladosFavoritos/${user.id}`)
                .then(function (response) {
                    if (response.data.length > 0) {
                        setArraiDeFavoritosDoUsuario(response.data);
                    }

                    setIsLoading(false);
                }).catch(function (error) {
                    setIsLoading(false);
                });
        }
    }

    useEffect(() => {
        const getSimulateds = async () => {
            try {
                setIsLoading(true)

                async function get(): Promise<DataTable[]> {
                    return (await api.get<DataTable[]>('Simulado', { params: { filter: search } })).data;
                }

                const response = await get();

                setData(response);
            } catch (err: any) {
                toast.error(`Um erro inesperado aconteceu`)
            } finally {
                setIsLoading(false)
            }
        }
        getSimulateds();
        getIdsSimuladosFavoritosUsuario();
    }, [search])

    function verificaLogadoEredirect() {
        if (user) {
            history.push(`/criar-simulados`)
            return
        } else {
            toast.warning('Você precisa ter uma conta antes')
        }
    }

    return (
        <>
            <S.Tools>
                <S.divButton>
                    <Button onClick={() => verificaLogadoEredirect()} type="default">Criar Simulado</Button>
                </S.divButton>
            </S.Tools>
            <S.DivTable>
                {isLoading ? (
                    <Skeleton active className="antSkeleton" />
                ) : (
                    <Table
                        pagination={{ pageSizeOptions: ['10', '20', '30'] }}
                        columns={columns}
                        dataSource={data}
                        loading={isLoading}
                    />
                )}

            </S.DivTable>
        </>
    )
}
