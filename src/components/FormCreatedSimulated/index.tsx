import React, { useState } from 'react'
import api from '../../service/api'
import { Form, Input, Button, Radio, Space, Divider, Upload, InputNumber, TimePicker } from 'antd';
import * as S from './styles'
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { UploadOutlined } from '@ant-design/icons'
import { useHistory } from "react-router-dom";
import moment from 'moment'

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

export type FormCreatedSimulated = {
    titulo: string
    descricao: string
    linkYouTube?: string
    thumbnail?: string
    sequencial: number
    aleatoria: number
    tempo: boolean
    tempoPorProva: string
}

export type Time = {
    tempoPorProva: string
}

export default function FormCreatedSimulated() {
    const antIcon = <LoadingOutlined style={{ fontSize: 34, color: "#E414B2" }} spin />
    const [ordemDasPerguntas, setOrdemDasPerguntas] = useState({ ordemDasPerguntas: 0 })
    const [isSpinning, setIsSpinning] = useState<boolean>(false)
    const [youtubeOrThumbnailSelected, setYoutubeOrThumbnailSelected] = useState("")
    const [OrderQuestionsSelected, setOrderQuestionsSelected] = useState<number>(0)
    const [formDataThumbnail, setformDataThumbnail] = useState<any>(null)
    const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false)

    const history = useHistory();

    function goTohome() {
        history.push("/");
    }

    const onFinish = (values) => {
        setIsLoadingButton(true)
        if (values.linkYoutube) {
            const urlYoutube = values.linkYoutube.replace('watch?v=', 'embed/');
            values.linkYoutube = urlYoutube;

            postSimulatedLinkYoutube(values);
            return;
        } else if (formDataThumbnail) {
            postSimulated(values);
            return;
        }

        postSimulatedSemNada(values);
    };

    function orderQuestions(e) {
        setOrderQuestionsSelected(e.target.value)
        setOrdemDasPerguntas({ ...ordemDasPerguntas, ordemDasPerguntas: e.target.value })
    }

    async function postSimulatedSemNada(newObject) {
        if (newObject.tempoPorProva) {
            newObject.tempoPorProva = newObject.tempoPorProva.toString();
        }

        await api.post('Simulado/semCapa', newObject)
            .then(response => {
                if (response) {
                    history.push(`/criar-perguntas/${response.data.id}`);
                }
            }).catch(function (error) {
                console.log('errir', error)
                toast.error(`Um erro inesperado aconteceu`)
                setIsSpinning(false)
            });
    }

    async function postSimulatedLinkYoutube(newObject) {
        if (newObject.tempoPorProva) {
            newObject.tempoPorProva = newObject.tempoPorProva.toString();
        }

        await api.post('Simulado/semCapa', newObject)
            .then(response => {
                if (response) {
                    history.push(`/criar-perguntas/${response.data.id}`);
                }

            }).catch(function (error) {
                console.log('errir', error)
                setIsSpinning(false)
                setIsLoadingButton(false)
                toast.error(`Um erro inesperado aconteceu`)
            });
    }

    async function postSimulated(newObject) {
        if (newObject.tempoPorProva) {
            newObject.tempoPorProva = newObject.tempoPorProva.toString();
        }

        const formData: FormData = new FormData();

        formData.append("descricao", newObject.descricao);
        formData.append("ordemDasPerguntas", newObject.ordemDasPerguntas);
        formData.append("tempoPorProva", newObject.tempoPorProva == undefined ? '0' : newObject.tempoPorProva);
        formData.append("titulo", newObject.titulo);
        formData.append("youtubeOuThumbnail", newObject.youtubeOrThumbnail);
        formData.append('imagemCapaSimulado', formDataThumbnail);

        await api.post('Simulado', formData)
            .then(response => {
                if (response.data.id) {
                    history.push(`/criar-perguntas/${response.data.id}`);
                    toast.success('Simulado salvo com sucesso!')
                }
            }).catch(function (error) {
                console.log('errir', error)
                setIsSpinning(false)
                setIsLoadingButton(false)
                toast.error(`Um erro inesperado aconteceu`)
            });
    }

    const normFile = (file: any, fileList: any) => {
        setformDataThumbnail(file)
    };

    function youtubeOrThumbnail(e) {
        setYoutubeOrThumbnailSelected(e.target.value)
    }

    return (
        <Spin indicator={antIcon} spinning={isSpinning}>
            <Form {...layout} name="nest-messages" labelAlign={"left"} onFinish={onFinish} validateMessages={validateMessages}>
                <Form.Item
                    name='titulo'
                    label="Título"
                    rules={[
                        {
                            required: true,
                            message: 'Insira seu titulo',
                        },
                    ]}
                >
                    <Input placeholder="Insira seu título" maxLength={100} />
                </Form.Item>
                <Form.Item
                    name='descricao'
                    label="Descriação"
                    rules={[
                        {
                            required: true,
                            message: 'Insira sua descriação',
                        },
                    ]}
                >
                    <Input.TextArea placeholder="Insira sua descriação" />
                </Form.Item>
                <Form.Item
                    name="youtubeOuThumbnail"
                    label="Capa do simulado"
                >
                    <Radio.Group onChange={e => youtubeOrThumbnail(e)}>
                        <Radio.Button value="thumbnail">Imagem</Radio.Button> <S.Or>Ou</S.Or>
                        <Radio.Button value="youtube" style={{ padding: "0 21px 0 22px", marginTop: "4px" }}>Link Do Youtube</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                {youtubeOrThumbnailSelected == "thumbnail" ?
                    (
                        <Form.Item
                            name='clientImage'
                            label="Capa do simulado"
                        >
                            <Upload
                                listType="picture"
                                beforeUpload={normFile}
                                accept=".png"
                            >
                                <Button style={{ color: '#000000D9', border: '1px solid #d9d9d9' }} icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>
                        </Form.Item>
                    ) : youtubeOrThumbnailSelected == "youtube" ?
                        (
                            <Form.Item
                                name='linkYoutube'
                                label="Youtube Link"
                            >
                                <Input placeholder="https://www.youtube.com/watch?v=xxxxx" />
                            </Form.Item>
                        ) : (null)
                }
                <S.SubTitle>Ordem das perguntas</S.SubTitle>
                <Form.Item name="ordemDasPerguntas" rules={[{ required: true, message: 'Selecione uma das opções!' }]}>
                    <Radio.Group name="radiogroup" onChange={(e) => orderQuestions(e)} >
                        <Space direction="vertical">
                            <Radio value={2}>Sequencial</Radio>
                            <Radio value={1}>Aleatória</Radio>
                            {OrderQuestionsSelected == 1 ?
                                (
                                    <Form.Item
                                        name='qtdLimitePerguntasSimulado'
                                        label="Quantidade de Perguntas Por Simulado"
                                        rules={[{ required: true, message: 'Selecione a Quantidade de perguntas!' }]}
                                    >
                                        <InputNumber defaultValue={0} min={1} />
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
                    label="Tempo por prova"
                >
                <InputNumber/>
                </Form.Item>
                <Divider style={{ borderTop: "1px solid rgba(0, 0, 0, 0.06)", width: "100%" }} />
                <Form.Item>
                    <S.ContainerButton>
                        <Button type="primary" danger onClick={goTohome} >
                            VOLTAR
                        </Button>
                        <Button type="primary" htmlType="submit" loading={isLoadingButton} style={{ backgroundColor: '#46a6e6', marginLeft: '10px' }}>
                            PROXIMO
                        </Button>
                    </S.ContainerButton>
                </Form.Item>
                <br />
            </Form>
        </Spin>
    );
}
