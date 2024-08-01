import React, { useEffect, useState } from 'react';
import api from '../../service/api'
import { Space, Table } from 'antd';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import * as S from './styles';

import 'antd/dist/antd.css';

import { useSearch } from '../../context/SearchContext'

export type DataTable = {
    descricao: string;
    id: number;
    linkYouTube: string;
    ordemDasPerguntas: number;
    titulo: string;
    slugTitulo: string;
}

export type Table = {
    setBottom: Function;
}

export default function TableAnt({ setBottom }: Table) {
    const [data, setData] = useState<DataTable[]>()
    const [isLoading, setIsLoading] = useState(true)

    const [arraiDeFavoritosDoUsuario, setArraiDeFavoritosDoUsuario] = useState<any[]>([])

    const user = JSON.parse(localStorage.getItem("user"))
    const history = useHistory();

    const { search } = useSearch();

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
            title: 'Visualizar',
            dataIndex: 'id',
            key: 'id',
            render: (id) => (
                <Space size="middle">
                    <a onClick={() => editQuestion(id)}>Visualizar</a>
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

    const editQuestion = (id) => {
        history.push(`/visualizar/simulado/${data.find(e => e.id == id)?.slugTitulo}`, {
            uuid: id
        })
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

    useEffect(() => {
        const getSimulateds = async () => {
            if (user == null) {
                toast.error(`Você precisa estar logado`)

                setTimeout(() => {
                    window.location.href = "/";
                }, 5000)
            }

            await api.get(`Simulado/SimuladosFavoritos/${user.id}`, {
                params: { filter: search }
            })
                .then(function (response) {
                    if (response.data.length > 0) {
                        setData(response.data)
                        setArraiDeFavoritosDoUsuario(response.data);
                    }
                    setIsLoading(false);
                }).catch(function (error) {
                    setIsLoading(false);
                    toast.error(`Um erro inesperado aconteceu`)
                });
        }

        getSimulateds();
    }, [search])

    return (
        <>
            <S.DivTable>
                <Table
                    pagination={{
                        pageSizeOptions: ['10', '20', '30']
                    }}
                    loading={isLoading}
                    columns={columns}
                    dataSource={data} />
            </S.DivTable>
        </>
    )
}
