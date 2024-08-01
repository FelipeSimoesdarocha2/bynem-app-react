import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom'

// Components
import WrapperMenu from "./components/WrapperMenu";
import { renderPage } from "./components/WrapperPage";

// Templates
import Home from "./templates/Home";
import MeusSimulados from "./templates/MySimulateds";
import CriarSimulados from "./templates/CreateSimulated";
import SimuladosFavoritos from './templates/SimuladosFavoritos'
import EditarSimulado from './templates/UpdateSimulated'
import CriarPerguntas from './templates/CreateQuestions'
import VisualizarSimulado from './templates/VisualizeSimulated'
import ResponderSimulado from './templates/ExecutionSimulated'
import EditarQuestao from './templates/EditQuestions'
import Perfil from './templates/Perfil'

// Pages
import Login from './pages/login'
import CriarConta from './pages/criarConta'
import RecuperarSenha from './pages/recuperarSenha'
import NovaSenha from './pages/novaSenha'

export default function App() {
  return (
    <BrowserRouter>
      <Switch>

        <Route path='/login' exact component={Login} />

        <Route path='/nova-senha/:token' exact component={NovaSenha} />

        <Route path='/criar-conta' exact component={CriarConta} />

        <Route path='/recuperar-senha' exact component={RecuperarSenha} />

        <Route path='/' component={() =>
          <WrapperMenu>
            <Switch>

              <Route path='/' exact component={() => renderPage({
                Component: Home,
                title: 'Simulados',
                subTitle: 'Estude utilizando o sistema de simulados totalmente grátis'
              })} />

              <Route path='/meus-simulados' exact component={() => renderPage({
                Component: MeusSimulados,
                title: 'Meus simulados'
              })} />

              <Route path='/criar-simulados' exact component={() => renderPage({
                Component: CriarSimulados,
                title: 'Crie seu simulado'
              })} />

              <Route path='/simulados-favoritos' exact component={() => renderPage({
                Component: SimuladosFavoritos,
                title: 'Simulados Favoritos',
                subTitle: 'Adicione seus simulados que ama em um só lugar'
              })} />

              <Route path='/editar/simulado/:uuid' exact component={() => renderPage({
                Component: EditarSimulado,
                title: 'Altere seu simulado'
              })} />

              <Route path='/criar-perguntas/:uuiSimulado' exact component={() => renderPage({
                Component: CriarPerguntas
              })} />

              <Route path='/criar-perguntas/:uuiSimulado/:numeroDaPergunta' exact component={() => renderPage({
                Component: CriarPerguntas
              })} />

              <Route path='/visualizar/simulado/:uuidSimulado' exact component={() => renderPage({
                Component: VisualizarSimulado
              })} />

              <Route path='/simulado/:uuidSimulado' exact component={() => renderPage({
                Component: ResponderSimulado
              })} />

              <Route path='/editar/questao/:uuidSimulado/:uuidQuestao' exact component={() => renderPage({
                Component: EditarQuestao
              })} />

              <Route path='/perfil' exact component={() => renderPage({ Component: Perfil, disabledLoading: true })} />

              <Route path='/visualizar/perfil/:uuidProfile' exact component={() => renderPage({ Component: Perfil, disabledLoading: true })} />
            </Switch>
          </WrapperMenu>
        } />
      </Switch>
    </BrowserRouter>
  )
}