import styled from 'styled-components'

export const Container = styled.main``

export const Content = styled.div`
    display: flex !important;
    flex-direction: column !important;
    user-select: none;
    background-color: white !important;
`

export const Title = styled.p`
    font-size: 2.5rem;
    margin: 0 0 0 2rem;
    color: #46a6e6;
`

export const SubTitle = styled.p`
    margin: 0 0 0 2rem; 
    color: black;
`

export const FormContainer = styled.div`
     width: 90%;
     padding: 2rem;
     .ant-form-horizontal .ant-form-item-label{
         max-width: 148px;
     }
     .ant-btn{
        color: white;
        border-radius: 3px;
        border: NONE;
    }
   .nest-messages_linkYoutube{
        position: relative;
        padding: 0 11px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: normal;
        font-size: 14px;
        text-align: center;
        background-color: #fafafa;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        transition: all 0.3s;
   }
`


export const ContianerTeste = styled.div`
    width: 600px;
    height: 200px;
    margin: 0 auto 0 auto;
`