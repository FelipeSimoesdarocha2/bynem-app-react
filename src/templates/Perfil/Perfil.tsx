import React, { useEffect, useState } from 'react';

// MUI
import { Grid, Typography, ButtonBase, Avatar, Button, Box } from '@mui/material';

// Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EditIcon from '@mui/icons-material/Edit';

// Components
import PerfilForm from './components/PerfilForm';
import Loading from '../../components/Loading';
import TableSimulatedsProfile from '../../components/TableSimulatedsProfile';

// Toast
import { toast } from 'react-toastify';

// Api
import api from '../../service/api';
import { useParams } from 'react-router-dom';

type Perfil = {
  nome?: string,
  biografia?: string,
  site?: string,
  facebook?: string,
  instagram?: string,
  twitter?: string,
  youtube?: string,
  linkedin?: string,
  linkFileName?: any
  simulados: any
};

export type DataTable = {
  descricao: string;
  id: number;
  linkYouTube: string;
  ordemDasPerguntas: number;
  titulo: string;
}

const Perfil = () => {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const { uuidProfile } = useParams<any>();

  const user = JSON.parse(localStorage.getItem("user"));

  const editarPerfil = (!uuidProfile && user?.id) || (uuidProfile === user?.id)

  const handleOpen = () => {
    setOpen(true);
  }

  const handleOnClose = () => {
    setOpen(false);
  }

  const openUrl = (url) => window.open(url);

  const handleSaveSuccess = () => {
    window.location.reload();
  }

  const renderImagem = () => {
    if (perfil?.linkFileName) {
      return (
        <img
          alt="Imagem Perfil"
          style={{ height: "100%", width: "100%", objectFit: 'cover' }}
          src={perfil?.linkFileName}
        />
      );
    }

    return (<Avatar />);
  }

  useEffect(() => {
    if (user == null) {
      toast.error(`Você precisa estar logado`)

      setTimeout(() => {
        window.location.href = "/";
      }, 5000)
    }

    const handleGetPerfil = async () => {
      try {
        setLoading(true);

        await api.get(`user/perfil/${uuidProfile ? uuidProfile : user.id}`)
          .then(response => {
            setPerfil(response.data);
          });
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    handleGetPerfil();
  }, []);

  if (loading) {
    return (
      <Loading />
    )
  };

  if (!perfil) {
    // Erro ao buscar o perfil
    return null;
  }

  return (
    <>
      <Grid container spacing={4} sx={{ paddingBottom: '20px' }}>
        <Grid item>
          <Box
            sx={{
              width: 300,
              height: 300,
              border: 'solid 1px #cacaca',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {renderImagem()}
          </Box>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs={10} container direction="column" spacing={2}>
            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div">
                <b>{perfil.nome}</b>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" gutterBottom>
                {perfil?.biografia != 'null' ? perfil.biografia : ""}
              </Typography>
            </Grid>
            {perfil?.site != 'null' && (
              <Grid item xs={1}>
                <Typography variant="body2" color="text.secondary">
                  Site:&nbsp;
                  <ButtonBase onClick={() => openUrl(perfil.site)}>
                    {perfil.site}
                  </ButtonBase>
                </Typography>
              </Grid>
            )}
            <Grid item xs={1}>
              {perfil.facebook && (
                <ButtonBase sx={{ width: 34, height: 34 }} onClick={() => openUrl(perfil.facebook)}>
                  <FacebookIcon />
                </ButtonBase>
              )}
              {perfil.instagram && (
                <ButtonBase sx={{ width: 34, height: 34 }} onClick={() => openUrl(perfil.instagram)}>
                  <InstagramIcon />
                </ButtonBase>
              )}
              {perfil.twitter && (
                <ButtonBase sx={{ width: 34, height: 34 }} onClick={() => openUrl(perfil.twitter)}>
                  <TwitterIcon />
                </ButtonBase>
              )}
              {perfil.youtube && (
                <ButtonBase sx={{ width: 34, height: 34 }} onClick={() => openUrl(perfil.youtube)}>
                  <YouTubeIcon />
                </ButtonBase>
              )}
              {perfil.linkedin && (
                <ButtonBase sx={{ width: 34, height: 34 }} onClick={() => openUrl(perfil.linkedin)}>
                  <LinkedInIcon />
                </ButtonBase>
              )}
            </Grid>
          </Grid>
          <Grid item xs />
          <Grid item>
            {editarPerfil && (
              <Button variant="outlined" startIcon={<EditIcon />} onClick={handleOpen}>
                Editar
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
      <TableSimulatedsProfile simulateds={perfil.simulados} />
      <PerfilForm perfil={perfil} open={open} onClose={handleOnClose} onSaveSuccess={handleSaveSuccess} />
    </>
  )
}

export default Perfil;
