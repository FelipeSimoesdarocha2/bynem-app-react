import React from "react";

// Styles
import * as S from "./styles";

import Cookie from 'universal-cookie';

export default function ICookie() {

    function aceitar() {
        const cookies = new Cookie();
        cookies.set('cookies', 'true')
    }
    function recusar() {
        const cookies = new Cookie();
        cookies.set('cookies', 'false')
    }

    return (
        <S.Container>
            <S.Cookie
                location="bottom"
                cookieName="cookies"
                style={{
                    alignItems: 'center',
                    padding: '0 15px 0 0',
                    background: "#fff",
                    color: '#4e503b',
                    border: '1px solid #f5f5f5',
                    boxShadow: '0 -1px 10px 0 rgb(172 171 171 / 30%)'
                }}
                buttonStyle={{ backgroundColor: '#46a6e6', color: "#fff", fontSize: "13px" }}
                expires={150}
                enableDeclineButton
                onDecline={() => recusar()}
                onAccept={() => aceitar()}
                declineButtonStyle={{ color: "#fff" }}
                buttonText='Aceitar'
                declineButtonText={'Rejeitar'}
            >
                Usamos cookies em nosso site para fornecer a experiência mais relevante,
                lembrando suas preferências e visitas repetidas. Ao clicar em “Aceitar”,
                você concorda com o uso de TODOS os cookies.<a href='https://bynem.com.br/politica-de-privacidade/'> Política de privacidade</a>
            </S.Cookie>
        </S.Container>

    )
}

