import styled from "styled-components";
import CookieConsent from "react-cookie-consent";

export const Cookie = styled(CookieConsent)`
    background-color: #fff ;
    border: 2px solid blue;
    .ant-btn{
        margin: 2px;
        border-radius: 10px;
    }
`

export const Container = styled.div`
    max-width: 100%;
`
