import React, { useEffect, useState } from 'react';

import { Button, Form, Modal, Col, Row, Steps } from 'antd';

import { toast } from 'react-toastify';
import { useTimer } from 'react-timer-hook';
import { useHistory } from 'react-router-dom';

import { FormCreatedSimulated, Perguntas, Resposta } from '../../VisualizeSimulated';

import api from '../../../service/api';
import * as S from '../styles';

export type QuestionDone = { id: string; respostasUserByQuestion: Resposta[]; answered: boolean, position: number }

export default function ExecutionSimulated({ uuidSimulado }: { uuidSimulado: string }) {
    const [simulated, setSimulated] = useState<FormCreatedSimulated>()
    const [selectedAnswer, setSelectedAnswer] = useState<Resposta[]>([])
    const [selectedAnswers, setSelectedAnswers] = useState<QuestionDone[]>([])
    const [currentQuestion, setCurrentQuestion] = useState<Perguntas>();
    const [showResponses, setShowResponses] = useState(false)
    const [current, setCurrent] = useState(0)
    const [openModal, setOpenModal] = useState(false)
    const [qtdRepostasCorretas, setQtdRepostasCorretas] = useState(0);
    const [percentualAcerto, setPercentualAcerto] = useState(0);

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 8,
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

    const { Step } = Steps;
    const history = useHistory();
    const expiryTimestamp = new Date()

    const { hours, minutes, seconds } = useTimer({
        expiryTimestamp, onExpire: () => {
            if (!openModal) {
                if (simulated.tempoPorProva > 0) {
                    toast.error(`Seu tempo acabou`)
                    setOpenModal(true)
                }
            }
        }
    })

    useEffect(() => {
        async function getSimulatedById() {
            await api.get<FormCreatedSimulated>(`Simulado/${uuidSimulado}`)
                .then(function (response) {
                    setSimulated(response.data)
                    if (response.data.perguntas[0])
                        setCurrentQuestion(response.data.perguntas[0])
                    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + response.data.tempoPorProva * 60);
                }).catch(function (error) {
                    toast.error(`Um erro inesperado aconteceu`)
                });
        }

        if (uuidSimulado)
            getSimulatedById()
    }, [uuidSimulado])

    function onFinishForm() {
        setShowResponses(true)
        setSelectedAnswers([...selectedAnswers, ...[{ id: currentQuestion.id, answered: true, respostasUserByQuestion: selectedAnswer, position: current }]])
        setSelectedAnswer([])

        if (current + 1 >= simulated?.perguntas.length) {
            setOpenModal(true)
        }
    }

    useEffect(() => {
        const question = simulated?.perguntas && simulated.perguntas[current] ? simulated.perguntas[current] : undefined;
        setCurrentQuestion(question);
    }, [current]);

    useEffect(() => {
        if (openModal) {
            getAnswersFinal();
        }
    }, [openModal])

    function getAnswersFinal() {
        var quantidadeAcertos = 0;
        var perguntasChecadas = [];
        var perguntas = simulated.perguntas;

        var respostasCorretas = selectedAnswers?.filter(item => item.respostasUserByQuestion.find(i => i.correta));
        respostasCorretas.forEach(respostaCorreta => {
            var pergunta = perguntas.find(e => e.id == respostaCorreta.id);
            if (!perguntasChecadas.includes(pergunta.id) && !pergunta.multiplaEscolha) {
                quantidadeAcertos += 1;
                perguntasChecadas.push(pergunta.id);
            }
            else if (!perguntasChecadas.includes(pergunta.id)) {
                var idsRespostasPerguntaCorretas = pergunta.respostas.filter(e => e.correta);
                var respostasUser = respostasCorretas.filter(e => e.id == pergunta.id)
                var respostasDessaPerguntaRespondida = respostasUser.filter(e => e.respostasUserByQuestion.filter(g => idsRespostasPerguntaCorretas.map(e => e.id).includes(g.id))).map(k => k);

                var idsUser = respostasDessaPerguntaRespondida.map(e => e.respostasUserByQuestion.map(e => e.id))[0];
                var respostasfinais = idsRespostasPerguntaCorretas.filter(e => idsUser.includes(e.id));

                if (idsRespostasPerguntaCorretas.length == respostasfinais.length && respostasfinais.find(e => !e.correta) == undefined) {
                    quantidadeAcertos += 1;
                    perguntasChecadas.push(pergunta.id);
                }
            }
        });

        setQtdRepostasCorretas(quantidadeAcertos);

        var quantidadePerguntasTotal = simulated?.perguntas?.length;
        var percentual = (quantidadeAcertos / quantidadePerguntasTotal) * 100;

        setPercentualAcerto(percentual);
    }

    function selectedAnswerCurrentQuestionNotMultiple(resposta) {
        setSelectedAnswer([resposta]);
    }

    function selectedAnswerCurrentQuestionMultiple(checked, resposta) {
        checked ? setSelectedAnswer([...selectedAnswer, resposta]) : setSelectedAnswer(selectedAnswer.filter(item => item.id !== resposta.id))
    }

    function goNextQuestion() {
        if (current >= simulated?.perguntas.length - 1) {
            toast.error('Perguntas nao respondidas')

        }

        setCurrent(current + 1);

        const answer = selectedAnswers.find(e => e.position == (current + 1));
        setSelectedAnswer(answer?.respostasUserByQuestion ?? [])
        setShowResponses(answer != undefined ?? answer?.answered)
    }

    function goBack() {
        setCurrent(current - 1);

        const answer = selectedAnswers.find(e => e.position == (current - 1));
        setShowResponses(answer != undefined ?? answer.answered)
        setSelectedAnswer(answer?.respostasUserByQuestion ?? [])
    }

    function showCorrectColor(resposta) {
        return showResponses ? resposta.correta ? '#85e985' : '#e74c1c' : selectedAnswers.find(e => e.position == (current)) ? resposta.correta ? '#85e985' : '#e74c1c' : 'transparent';
    }

    return <>
        {simulated &&
            <>
                <Modal title="Resultados" visible={openModal} onCancel={() => history.replace('/')}
                    footer={[
                        <Button key="submit" type="primary" onClick={() => history.replace('/')}>
                            Ok
                        </Button>]}
                >
                    <p>Acertou {qtdRepostasCorretas} de {simulated?.perguntas?.length}</p>
                    <p>Você Acertou {percentualAcerto}% das questões!</p>
                </Modal>
                <S.Content>
                    <S.ContainerCount>
                        <S.ContainerCountQuestions>{current >= simulated?.perguntas.length ?
                            <p>Final</p>
                            :
                            <p>Questão <S.NumberQuestion>{`${current + 1}/${simulated.perguntas.length}`}</S.NumberQuestion></p>

                        }
                        </S.ContainerCountQuestions>
                    </S.ContainerCount>
                    <S.ContainerCountAndSteps>
                        <S.StepContainer>
                            <S.ScrollStep>
                                <Steps
                                    size="small"
                                    status="process"
                                    className="KKKKKKKKK"
                                    current={current}
                                    direction="vertical"
                                >
                                    {simulated.perguntas?.map((item, index) => {
                                        return <Step key={item.id} onClick={() => {
                                            setCurrent(index)
                                        }} />
                                    })}

                                </Steps>
                            </S.ScrollStep>
                        </S.StepContainer>
                        <S.ContainerVideoOrImage>
                            <S.ContainerIframe>
                                {currentQuestion?.filenameImage ?
                                    <S.Image src={currentQuestion.filenameImage} alt='imagem simulado' /> :
                                    <S.Image src='/bynem0.png' width={500} alt='imagem simulado' />
                                }
                            </S.ContainerIframe>
                        </S.ContainerVideoOrImage>
                        <S.Spacer />
                    </S.ContainerCountAndSteps>

                    <S.ContainerSubTitle><span className='break-line'>{currentQuestion?.descricao}</span></S.ContainerSubTitle>
                    <Form {...layout} name="nest-messages" labelAlign={"left"} onFinish={onFinishForm} validateMessages={validateMessages}>
                        <S.ContainerOptions>
                            {currentQuestion ?
                                <S.CheckContainer>
                                    {currentQuestion.multiplaEscolha ?
                                        <Form.Item name={`checkbox-${currentQuestion.id}`}>
                                            {currentQuestion?.respostas?.map(resposta =>
                                                <Row key={resposta.id}>
                                                    <Col span={12} style={{
                                                        backgroundColor: showCorrectColor(resposta), padding: '8px',
                                                        borderRadius: '8px',
                                                    }}>
                                                        <input
                                                            type="checkbox"
                                                            style={{
                                                                margin: '3px 8px 0 0',
                                                            }}
                                                            multiple
                                                            disabled={!!selectedAnswers.find(e => e.position == (current))}
                                                            onChange={e => selectedAnswerCurrentQuestionMultiple(e.target.checked, resposta)}
                                                            checked={selectedAnswers?.find(g => g.id == resposta.idPergunta)?.respostasUserByQuestion.map(e => e.id)?.includes(resposta.id)}
                                                        />

                                                        <span className='break-line'>{resposta?.descricao}</span>
                                                    </Col>
                                                </Row>
                                            )}
                                        </Form.Item> :
                                        <>
                                            {currentQuestion?.respostas?.map(resposta => (
                                                <Form.Item name={`question-${currentQuestion.id}`} key={resposta.id} style={{
                                                    backgroundColor: showCorrectColor(resposta), width: '100%', padding: '8px',
                                                    borderRadius: '8px'
                                                }}>
                                                    <input type="radio"
                                                        disabled={!!selectedAnswers.find(e => e.position == (current))}
                                                        onChange={() => selectedAnswerCurrentQuestionNotMultiple(resposta)}
                                                        checked={selectedAnswer[0]?.id == resposta.id || selectedAnswers.find(g => g.id == resposta.idPergunta)?.respostasUserByQuestion[0]?.id == resposta.id}
                                                        style={{
                                                            backgroundColor: showCorrectColor(resposta),
                                                            margin: '3px 8px 0 0',
                                                        }}
                                                    />
                                                    <span className='break-line'>{resposta?.descricao}</span>
                                                </Form.Item>))
                                            }
                                        </>
                                    }
                                </S.CheckContainer>
                                : <p>Sem mais perguntas</p>}
                            {
                                (selectedAnswers[current] != undefined || (showResponses && selectedAnswer?.length)) &&
                                <>
                                    <p>Comentário Final</p>
                                    {currentQuestion?.comentarioFinal ?
                                        <p style={{ marginLeft: 20 }}>{currentQuestion?.comentarioFinal}</p> :
                                        <p style={{ marginLeft: 20, color: '#0005' }}>Sem Comentário...</p>
                                    }
                                </>
                            }
                        </S.ContainerOptions>
                        <S.ContainerButton>
                            <Button type="primary" danger onClick={goBack} disabled={current === 0}>
                                VOLTAR
                            </Button>
                            {selectedAnswer?.length > 0 && selectedAnswers.find(e => e.position == (current)) == undefined ?
                                <Button type="primary" style={{ backgroundColor: '#46a6e6' }} disabled={!selectedAnswer.length} onClick={() => onFinishForm()} >
                                    CONFIRMAR RESPOSTA
                                </Button>
                                :
                                <Button type="primary" style={{ backgroundColor: '#46a6e6', marginLeft: '10px' }} disabled={current >= simulated?.perguntas.length} onClick={() => goNextQuestion()}>
                                    PRÓXIMO
                                </Button>
                            }

                            {simulated.tempoPorProva > 0 &&
                                <S.ContainerCountTimer>
                                    <span>{hours === 0 ? '00' : hours}</span>:<span>{minutes === 0 ? '00' : minutes}</span>:<span>{seconds < 10 ? `0${seconds}` : seconds}</span>
                                    <svg style={{ width: 24, height: 24, marginLeft: 10 }} viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M19.03 7.39L20.45 5.97C20 5.46 19.55 5 19.04 4.56L17.62 6C16.07 4.74 14.12 4 12 4C7.03 4 3 8.03 3 13S7.03 22 12 22C17 22 21 17.97 21 13C21 10.88 20.26 8.93 19.03 7.39M13 14H11V7H13V14M15 1H9V3H15V1Z" />
                                    </svg>
                                </S.ContainerCountTimer>
                            }
                        </S.ContainerButton>
                    </Form>
                </S.Content>
            </>
        }
    </>
}
