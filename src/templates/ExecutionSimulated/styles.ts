import styled from 'styled-components'
import { Button } from 'antd'
export const Container = styled.main``

export const Content = styled.main`
    display: flex !important;
    flex-direction: column !important;
    user-select: none;
    background-color: white !important;
    min-height: 855px;
    min-height: calc(100vh - 198px);
`
export const ContainerCount = styled.div`
    margin: 0 2rem 0 2rem; 
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`
export const ContainerCountQuestions = styled.div`
    flex-direction: row;
    p{
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
    }
`
export const NumberQuestion = styled.span`
    color: #E414B2;
`

export const ContainerCountTimer = styled.div`
    margin-left: auto;
    display:flex;
    align-items: center;
    padding: 7px 14px ;
    background-color: #ffcb49;
    border-radius: 4px;
`


export const Title = styled.div`
    font-size: 2.5rem;
    margin: 0 0 0 2rem;
    color: #46a6e6;
    font-weight: bold;
`

export const SubTitle = styled.p`
    margin: 0 0 0 2rem; 
    color: black;
`

export const ContainerVideoOrImage = styled.div`
    margin: 0 auto 0 auto;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    padding: 20px ;
    border: 1px solid #E414B2;
    width: 100%;
    justify-content: center;
    @media (max-width: 768px) {
            margin: 0

    }
   
   
`
export const ScrollStep = styled.div`
    height: 400px;
    overflow-y: auto;
    width: 57px;

`

export const StepContainer = styled.div`
    width: 6rem;
    height: 400px;
    /* overflow-y: auto;
    direction: ltr; */
    .ant-steps {
        margin-left: auto !important;
        margin-right: auto !important;
        width: fit-content;
        margin: 0;
    }

    @media (max-width: 850px) {
        display: none;
    }

`
export const Spacer = styled.div`
    width: 6rem;
    @media (max-width: 850px) {
        display: none;
    }

`
export const ContainerCountAndSteps = styled.div`
    display: flex;
    width: 100%;

`

export const ContainerTableQuestions = styled.div`
    margin: 2rem 2rem 0 2rem;

`
export const ConsultancyVideo = styled.div`
  
`

export const ContainerIframe = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`

export const Image = styled.img`
    max-width: 100%;
    object-fit: 'contain'
`

export const ContainerSubTitle = styled.div`
    font-size: 1rem;
    font-weight: bold;
    margin: 2rem;
    text-align: left;
    margin-right: auto ;
`
export const ContainerOptions = styled.div`
    background-color: #f5f5f5;
    margin: 0 2rem;
    border-radius: 20px;
    padding:  2rem;
    @media (max-width: 768px) {
        margin: 0

    }
    h4 {
        font-weight: bold;
        margin-bottom: 18px;
    }
    .ant-radio-wrapper.ant-radio-wrapper-disabled {
        span {
            color: black !important;
        }
    }
    form {
        padding: 2rem;
    }
    @media (max-width: 600px) {
        width: 100%;

    }
    .ant-checkbox-group {
        flex-direction: column;
        width: 100%;
        /* .ant-col.ant-col-12 {
            flex: 1;
            max-width: 100%;
        } */
    }
`


export const CheckContainer = styled.div`
    .ant-col-8, .ant-col-12 {
        flex: 1;
        max-width: 100%;
    }
    .ant-row {
        margin-bottom: 10px;
    }
`

export const DivCheckBox = styled.div`
    display: flex;
    align-items: center;
    margin: 1rem 0 0 0;


    >input{
        width: 16px;
        height: 16px;
    }
`

export const ContainerDescription = styled.div`
    margin: 1rem 1rem 0 1rem;
    border: none;
    width: 100%;

    p{
        margin: 0
    }
`
export const ContainerButton = styled.div`
    display: flex;
    padding-top: 1rem;
    margin-left:2rem ;
    margin-right: 2rem;
    align-items: center;
     .ant-btn{
        margin: 2px;
        border-radius: 4px;
    }
    .labelYoutube{
        padding: 0 21px 0 22px;
    }
`

export const buttonTimer = styled.div`


`
