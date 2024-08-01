import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { useAuth } from '../../hooks/auth';

import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../../service/api'

import * as S from './styles';

import Cookie from 'universal-cookie';

// Enums
import { TipoLogin } from '../../utils/enums'

const clientId = "645582046209-30384enid41oatgjkseaajrhda5phnsa.apps.googleusercontent.com";

const Login: React.FC = () => {
    const { user, setUser } = useAuth()
    const history = useHistory();
    const [showloginButton, setShowloginButton] = useState(true);
    const cookie = new Cookie();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const userCookie = cookie.get("cookies");

        if (userCookie == null || userCookie === 'false') {
            toast.error('Você precisa aceitar os Cookies para usar essa função')
            return
        }
        const data = new FormData(event.currentTarget);
        const dataRequest = {
            email: data.get('email'),
            password: data.get('password'),
            tipoLogin: TipoLogin.Normal
        };

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        if (reg.test(dataRequest.email) === false) {
            toast.error("Verifique se o email é valido");
            return false;
        }

        await api.post('Auth/login', dataRequest)
            .then(function (response) {
                setUser(response.data)
                cookie.set("token_user", JSON.stringify(response.data.token))
                localStorage.setItem("user", JSON.stringify(response.data))
                history.push('/')
            }).catch(function (error) {
                toast.error("Email ou senha esta errado")
            });
    }

    async function onLoginSuccess(res) {
        if (user.logout) {
            setUser({ logout: false })
            return
        }
        let data = {
            email: res.profileObj.email,
            password: res.profileObj.googleId,
            username: res.profileObj.name,
            tipoLogin: TipoLogin.Google
        };
        await api.post('Auth/login', data)
            .then(function (response) {
                cookie.set("token_user", JSON.stringify(response.data.token))
                localStorage.setItem("user", JSON.stringify(response.data))
                history.push(`/`)
            }).catch(function (error) {
            });

        setShowloginButton(false);
    };

    const onLoginFailure = (res) => {
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
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Senha"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                    />
                                    {/* <FormControlLabel
                                        control={<Checkbox value="remember" color="primary" />}
                                        label=""
                                    /> */}
                                    <S.ContainerLogin>
                                        <S.ContainerGoogle2
                                            clientId={clientId}
                                            buttonText="Google"
                                            onSuccess={(e) => onLoginSuccess(e)}
                                            onFailure={onLoginFailure}
                                            cookiePolicy={'single_host_origin'}
                                            isSignedIn={true}
                                        />
                                    </S.ContainerLogin>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        style={{ borderRadius: 20, backgroundColor: '#338BFF' }}
                                    >
                                        Entrar
                                    </Button>
                                </Box>
                            </Box>
                            <a href="/criar-conta" style={{ marginRight: 'auto' }} >Criar Conta</a>
                        </Container>
                        <a href="/recuperar-senha">Esqueceu a Senha?</a>
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
    )
}

export default Login;
