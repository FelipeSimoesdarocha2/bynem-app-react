import React, { useState } from 'react';
import * as S from './styles'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { useHistory } from "react-router-dom";

import { toast } from 'react-toastify';

import api from '../../service/api'

const NovaSenhaTemplate: React.FC = () => {
    const history = useHistory();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
    
            const data = new FormData(event.currentTarget);
            const dataRequest = {
                email: data.get('email'),
            };
        
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        
            if (reg.test(dataRequest.email) === false) {
                throw Error("Verifique se o email é valido");
            }
        
            await api.post('auth/email-recuperacao', dataRequest);

            toast.success("Foi enviado um email de recuperação de senha para o email informado!");

            history.push("/login");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <S.Container>
            <S.Content>
                <S.ConteinerLeft>
                    <S.LoginContainer>
                        <Container component="main" maxWidth="xs">
                            <S.ContainerImage>
                                <img alt="logo" src={"/bynem0.png"} />
                            </S.ContainerImage>
                            <CssBaseline />
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        style={{ borderRadius: 20, backgroundColor: '#338BFF' }}
                                    >
                                        Enviar E-Mail
                                    </Button>
                                </Box>
                            </Box>
                        </Container>
                        <a href="/login">Voltar</a>
                    </S.LoginContainer>
                </S.ConteinerLeft>
                <S.ConteinerRight>
                    <S.ContainerText>
                        <S.Title>Bem-Vindo</S.Title>
                        <S.Title>A Bynem</S.Title>
                        <S.SubTitle>A melhor plataforma de simulados</S.SubTitle>
                        <S.SubTitle>Gratuita  do Mundo !</S.SubTitle>
                    </S.ContainerText>
                </S.ConteinerRight>
            </S.Content>
        </S.Container>
    );
}

export default NovaSenhaTemplate;