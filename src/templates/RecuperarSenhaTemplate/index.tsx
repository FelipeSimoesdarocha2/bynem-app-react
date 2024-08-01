import React, { useState } from 'react';
import * as S from './styles'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { useHistory, useParams } from "react-router-dom";

import { toast } from 'react-toastify';

import api from '../../service/api'

const RecuperarSenhaTemplate: React.FC = () => {
    const history = useHistory();
    const { token } = useParams<any>();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
    
            const data = new FormData(event.currentTarget);
            const password = data.get('password');
            const passwordConfirm = data.get('passwordConfirm');

            const dataRequest = {
                password,
                token
            };
        
            if (!password || password === '') {
                throw Error("Senha não informada!");
            }

            if (password !== passwordConfirm) {
                throw Error("Senha de confirmação diferente da senha informada!");
            }
        
            await api.post('auth/resetar-senha', dataRequest);
            toast.success("Senha alterada com sucesso!");

            history.push("/login");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return <S.Container>
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
                                    name="password"
                                    label="Insira Nova Senha"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="passwordConfirm"
                                    label="Insira Novamente a Senha"
                                    type="password"
                                    id="passwordConfirm"
                                    autoComplete="current-password"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    style={{ borderRadius: 20, backgroundColor: '#338BFF' }}
                                >
                                    Salvar Nova Senha
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                    <a href="/login">Login</a>
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
}

export default RecuperarSenhaTemplate;