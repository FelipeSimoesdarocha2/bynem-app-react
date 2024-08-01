import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Radio, Space, Divider, Upload, InputNumber, Row, Col, TimePicker } from 'antd';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Uuid } from '../../templates/UpdateSimulated';

import TableVizualizeQuestions from '../TableVizualizeQuestionsExcluir';

import moment from 'moment'


import api from '../../service/api';
import * as S from './styles';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const validateMessages = {
    required: '${label} é obrigatorio',
};

export type FormCreatedSimulated = {
    author: string
    descricao: string
    linkYouTube: string
    titulo: string
    ordemDasPerguntas: number
    linkImagemCapaSimulado: string
}

export type Simulated = {
    data: FormCreatedSimulated
}

export default function FormUpdateSimulated({ uuid }: Uuid) {
    const [simulated, setSimulated] = useState<FormCreatedSimulated | any>()
    const antIcon = <LoadingOutlined style={{ fontSize: 34, color: "#E414B2" }} spin />
    const [isSpinning, setIsSpinning] = useState(false)
    const [OrderQuestionsSelected, setOrderQuestionsSelected] = useState<number>(0)
    const [youtubeOrThumbnailSelected, setYoutubeOrThumbnailSelected] = useState("")
    const [ordemDasPerguntas, setOrdemDasPerguntas] = useState({ ordemDasPerguntas: 1 })
    const [form, setForm] = useState<any>()
    const [formDataThumbnail, setformDataThumbnail] = useState<any>(null)
    const user = JSON.parse(localStorage.getItem("user"))

    const normFile = (file: any, fileList: any) => {
        setformDataThumbnail(file)
    };

    useEffect(() => {
        if (user == null) {
            toast.error(`Você precisa estar logado`)

            setTimeout(() => {
                window.location.href = "/";
            }, 5000)
        }

        if (simulated) {
            setForm({
                titulo: simulated.titulo,
                descricao: simulated.descricao,
                author: "",
                linkYouTube: simulated.linkYouTube ? simulated.linkYouTube : "",
                ordemDasPerguntas: simulated.ordemDasPerguntas,
                quantidade: "",
                linkImagemCapaSimulado: simulated?.linkImagemCapaSimulado,
                qtdLimitePerguntasSimulado: simulated?.qtdLimitePerguntasSimulado,
                file: '',
            })
            setOrdemDasPerguntas({ ordemDasPerguntas: simulated?.ordemDasPerguntas })
            setOrderQuestionsSelected(simulated.ordemDasPerguntas)
        }
    }, [simulated])

    function criarObjeto(e) {
        if (typeof e === "number") {
            setForm({
                ...form,
                quantidade: e
            })
            return;
        }

        const { name, value } = e.target

        if (name === "ordemDasPerguntas") {
            orderQuestions(e)
        }

        setForm({
            ...form,
            [name]: value
        })
    }

    const history = useHistory();

    const onFinish = (values) => {
        if (values.clientImage) {
            setIsSpinning(true)
            const newObject = Object.assign(ordemDasPerguntas, form, values.clientImage)
            postSimuladoComImagem(newObject)

            return
        }

        const newObject = Object.assign(ordemDasPerguntas, values)
        postSimulated(newObject)
    };

    function orderQuestions(e) {
        setOrderQuestionsSelected(e.target.value)
        setOrdemDasPerguntas({ ordemDasPerguntas: e.target.value })
    }

    useEffect(() => {
        async function getSimulatedById() {
            await api.get(`Simulado/${uuid}`).then(function (response) {
                setSimulated(response.data)
            }).catch(function (error) {
                toast.error(`Um erro inesperado aconteceu`)
            });
        }

        getSimulatedById();
    }, []);

    async function postSimuladoComImagem(newObject) {
        const idSimulated = { id: uuid }
        const dataRequest = Object.assign(newObject, idSimulated)

        await api.put('Simulado', dataRequest)
            .then().catch(function (error) {
                setIsSpinning(false)
                toast.error(`Um erro inesperado aconteceu`)
            });

        const archive = new FormData()
        archive.append('arquivo', formDataThumbnail)

        await api.post(`Simulado/upload-thumbnail/${idSimulated.id}`, archive)
            .then().catch(function (error) {
                setIsSpinning(false)
                toast.error(`Um erro inesperado aconteceu`)
            });

        goToMySimulateds();

        toast.success('Simulado salvo com sucesso!')
        setIsSpinning(false)
    }

    async function postSimulated(newObject) {
        if (newObject.titulo != undefined || newObject.descricao != undefined || newObject.linkYoutube != undefined) {
            const idSimulated = { id: uuid }
            const dataRequest = Object.assign(newObject, idSimulated)

            await api.put('Simulado', dataRequest)
                .then().catch(function (error) {
                    setIsSpinning(false)
                    toast.error(`Um erro inesperado aconteceu`)
                });
        }

        goToMySimulateds();
        setIsSpinning(false);
    }

    function goToMySimulateds() {
        history.push("/meus-simulados")
    }

    function adicionarNovaQuestao() {
        const numeroDaQuestao = simulated.perguntas.length + 1
        history.push(`/criar-perguntas/${simulated.id}/${numeroDaQuestao}`)
    }

    function youtubeOrThumbnail(e) {
        setYoutubeOrThumbnailSelected(e.target.value)
    }

    return (
        <Spin indicator={antIcon} spinning={isSpinning}>
            {simulated &&
                <>
                    <S.Container>
                        <Form
                            {...layout}
                            name="nest-messages"
                            labelAlign={"left"}
                            onFinish={onFinish}
                            initialValues={{
                                titulo: simulated?.titulo,
                                descricao: simulated?.descricao,
                                linkYoutube: simulated?.linkYouTube,
                                tempoPorProva: simulated.tempoPorProva,
                                qtdLimitePerguntasSimulado: simulated?.qtdLimitePerguntasSimulado
                            }}
                            validateMessages={validateMessages}>
                            <Row gutter={[16, 16]}>
                                <Col md={24} lg={24}>
                                    <Form.Item
                                        name='titulo'
                                        label="Título"
                                        rules={[
                                            {
                                                message: 'Insira seu titulo',
                                            },
                                        ]}
                                    >
                                        <Input name="titulo" onChange={e => criarObjeto(e)} placeholder="Insira seu título" />
                                    </Form.Item>
                                    <Form.Item
                                        name='descricao'
                                        label="Descriação"
                                    >
                                        <Input.TextArea name="descricao" onChange={e => criarObjeto(e)} placeholder="Insira sua descriação" />
                                    </Form.Item>
                                    <Form.Item name="youtubeOuThumbnail" label="Capa do simulado">
                                        <S.ContainerVideoOrImage>
                                            {simulated.linkYouTube &&
                                                <iframe
                                                    height="90"
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
                                            {(!simulated.linkImagemCapaSimulado && !simulated.linkYouTube) &&
                                                <Radio.Group onChange={e => youtubeOrThumbnail(e)}>
                                                    <Radio.Button value="thumbnail">Imagem</Radio.Button> <S.Or>Ou</S.Or>
                                                    <Radio.Button value="youtube" style={{ padding: "0 21px 0 22px", marginTop: "4px" }}>Link Do Youtube</Radio.Button>
                                                </Radio.Group>
                                            }
                                        </S.ContainerVideoOrImage>
                                    </Form.Item>

                                    {(simulated.linkImagemCapaSimulado || youtubeOrThumbnailSelected == "thumbnail") ? (
                                        <Form.Item name='clientImage' label="Atualizar Capa do simulado">
                                            <Upload
                                                listType="picture"
                                                beforeUpload={normFile}
                                                accept=".png"
                                            >
                                                <Button style={{ color: '#000000D9', border: '1px solid #d9d9d9' }} icon={<UploadOutlined />}>Click to upload</Button>
                                            </Upload>
                                        </Form.Item>

                                    ) : (simulated.linkYouTube || youtubeOrThumbnailSelected == "youtube") ? (
                                        <Form.Item
                                            name='linkYoutube'
                                            label="Youtube Link"
                                        >
                                            <Input defaultValue={simulated.linkYouTube} name="linkYouTube" onChange={e => criarObjeto(e)} placeholder="https://www.youtube.com/watch?v=xxxxx" />
                                        </Form.Item>
                                    ) : (null)
                                    }
                                    <S.SubTitle>Ordem das perguntas</S.SubTitle>
                                    <Form.Item name="radio-group"  >
                                        <Radio.Group name="ordemDasPerguntas" defaultValue={simulated.ordemDasPerguntas} onChange={e => (criarObjeto(e))} style={{ width: "400px" }}>
                                            <Space direction="vertical">
                                                <Radio value={2}>Sequencial</Radio>
                                                <Radio value={1}>Aleatória</Radio>
                                                {OrderQuestionsSelected === 1 ?
                                                    (
                                                        <Form.Item
                                                            name='qtdLimitePerguntasSimulado'
                                                            label="Quantidade de Perguntas Por Simulado"
                                                            rules={[{ required: true, message: 'Selecione a Quantidade de perguntas!' }]}
                                                        >
                                                            <InputNumber name="qtdLimitePerguntasSimulado" onChange={e => (criarObjeto(e))} min={1} />
                                                        </Form.Item>
                                                    ) :
                                                    (
                                                        null
                                                    )
                                                }
                                            </Space>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item
                                        name="tempoPorProva"
                                        label="Tempo por prova /min"
                                    >
                                        <Input type='text' placeholder="Hora" />
                                        {/* // defaultValue={0 ? moment('12:08:23', 'HH:mm:ss') : undefined} */}
                                    </Form.Item>
                                    <Divider style={{ borderTop: "2px solid rgba(0, 0, 0, 0.06)" }} />
                                    <Form.Item>
                                        <S.ContainerButton>
                                            <Button type="primary" danger onClick={goToMySimulateds} htmlType="submit">
                                                VOLTAR
                                            </Button>
                                            <Button type="primary" htmlType="submit">
                                                SALVAR
                                            </Button>
                                            <Button
                                                style={{
                                                    backgroundColor: '#70e000',
                                                    textTransform: 'uppercase',
                                                    marginLeft: '10px'
                                                }}
                                                onClick={() => adicionarNovaQuestao()}>
                                                Adicionar nova questão
                                            </Button>
                                        </S.ContainerButton>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </S.Container>
                    <TableVizualizeQuestions uuidSimulado={uuid} perguntas={simulated.perguntas} />
                </>
            }
        </Spin>
    );
}
