import React, { useEffect, useState } from 'react';
import api from '../../service/api'
import { Table } from 'antd';
import { toast } from 'react-toastify';
import * as S from './styles';

import 'antd/dist/antd.css';

export type DataTable = {
    descricao: string;
    id: number;
    linkYouTube: string;
    ordemDasPerguntas: number;
    titulo: string;
    autor: string;
    qtdPerguntas: number;
}

export type Table = {
    setBottom: Function;
}

export default function TableAnt({ simulateds }: any) {
    const [data, setData] = useState<DataTable[] | null>(simulateds)
    const [isLoading, setIsLoading] = useState(false)

    const [arraiDeFavoritosDoUsuario, setArraiDeFavoritosDoUsuario] = useState<any[]>([])
    const user = JSON.parse(localStorage.getItem("user"))

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

    const getIdsSimuladosFavoritosUsuario = async () => {
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
        getIdsSimuladosFavoritosUsuario();
    }, [])


    const columns = [
        {
            title: 'Nome',
            dataIndex: 'titulo',
            key: 'titulo',
        },
        {
            title: 'Autor',
            dataIndex: 'autor',
            key: 'autor',
        },
        {
            title: 'Quantidade de Perguntas',
            dataIndex: 'qtdPerguntas',
            key: 'qtdPerguntas',
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
        }
    ];

    return (
        <Table
            pagination={{ pageSizeOptions: ['10', '20', '30'] }}
            loading={isLoading}
            columns={columns}
            dataSource={data} />
    )
}