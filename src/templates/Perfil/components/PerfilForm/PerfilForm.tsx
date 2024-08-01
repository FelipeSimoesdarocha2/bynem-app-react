import React, { useEffect, useState, useRef } from 'react';

// MUI
import {
  Grid,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  ButtonBase
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// Service
import api from '../../../../service/api';

// Toast
import { toast } from 'react-toastify';

const defautlSocialMenu = [
  {
    label: 'Facebook',
    placeholder: 'Link do perfil',
    prop: 'facebook'
  },
  {
    label: 'Instagram',
    placeholder: 'Link do perfil',
    prop: 'instagram'
  },
  {
    label: 'Twitter',
    placeholder: 'Link do perfil',
    prop: 'twitter'
  },
  {
    label: 'Youtube',
    placeholder: 'Link do perfil',
    prop: 'youtube'
  },
  {
    label: 'Linkedin',
    placeholder: 'Link do perfil',
    prop: 'linkedin'
  },
]

const PerfilForm = ({ perfil, open, onClose, onSaveSuccess }) => {
  const [data, setData] = useState<any>(perfil);

  const [socialMenu, setSocialMenu] = useState(defautlSocialMenu);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const fileImagem = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const hasSocialMenu = socialMenu?.length > 0;

  const {
    nome,
    biografia,
    site,
    facebook,
    instagram,
    twitter,
    youtube,
    linkedin
  } = data;

  const handleRedesSociais = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderSocialItems = () =>
    socialMenu.map((item) => <MenuItem onClick={() => addSocial(item)}>{item.label}</MenuItem>);

  const renderSocialFields = () => {
    let fields = [];

    defautlSocialMenu.forEach((item) => {
      if ((data[item.prop] || data[item.prop] === '')) {
        fields.push(
          <Grid item xs={12}>
            <TextField
              label={item.label}
              variant="outlined"
              placeholder={item.placeholder}
              fullWidth
              value={data[item.prop] == 'null' ? null : data[item.prop]}
              onChange={({ target }) => handleOnChange(item.prop, target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => removeSocial(item.prop)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        );
      }
    });

    return fields;
  }

  const addSocial = (social) => {
    if (!data[social.prop]) {
      setData({
        ...data,
        [social.prop]: ''
      });
    }

    handleClose();
  }

  const removeSocial = (prop) => {
    setData({
      ...data,
      [prop]: undefined
    });
  }

  const changeSocialMenu = () => {
    const menu = defautlSocialMenu.filter(({ prop }) => !data[prop] && data[prop] !== '')

    setSocialMenu(menu);
  }

  const handleOnChange = (prop, value) => {
    setData({
      ...data,
      [prop]: value
    })
  }

  const changeImagem = ({ target }) => {
    const file = target.files[0];
    setData({
      ...data,
      fileImagem: file,
      linkFileName: URL.createObjectURL(file)
    });
  }

  const renderImagem = () => {
    if (data?.linkFileName) {
      return (
        <img
          alt="Imagem Perfil"
          style={{ height: "100%", width: "100%", objectFit: 'cover' }}
          src={data.linkFileName}
        />
      );
    }

    return (<Avatar />);
  }

  const handleOnSave = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      
      const formdata: FormData = new FormData();

      formdata.append("id", user.id);
      formdata.append("nome", data.nome);
      formdata.append("biografia", data.biografia);
      formdata.append("site", data.site);

      if (data.facebook) {
        formdata.append("facebook", data.facebook);
      }

      if (data.instagram) {
        formdata.append("instagram", data.instagram);
      }

      if (data.twitter) {
        formdata.append("twitter", data.twitter);
      }

      if (data.youtube) {
        formdata.append("youtube", data.youtube);
      }

      if (data.linkedin) {
        formdata.append("linkedin", data.linkedin);
      }

      if (data.fileImagem) {
        formdata.append("imagem", data.fileImagem);
      }

      await api.put('User', formdata);
      toast.success("Dados do perfil salvo com sucesso!");

      onSaveSuccess();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    changeSocialMenu();
  }, [facebook, instagram, twitter, youtube, linkedin]);

  useEffect(() => {
    setData(perfil)
  }, [perfil]);

  return (
    <Dialog
      open={open}
      scroll='paper'
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Editar Perfil</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={4}>
          <Grid container item spacing={2} xs={12}>
            <Grid item xs={12}>
              <Typography>Imagem do perfil</Typography>
            </Grid>
            <Grid container item xs={12}>
              <ButtonBase
                sx={{ width: 300, height: 300, border: 'solid 1px #cacaca' }}
                onClick={() => fileImagem.current.click()}
              >
                {renderImagem()}
              </ButtonBase>
              <input
                ref={fileImagem}
                type="file"
                accept=",.jpg,.png,.svg"
                onChange={changeImagem}
                style={{ display: 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Dados Pessoais</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nome"
                variant="outlined"
                fullWidth
                value={nome}
                onChange={({ target }) => handleOnChange('nome', target.value)}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={2} xs={12}>
            <Grid item xs={12}>
              <Typography>Biografia</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descrição"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={biografia}
                onChange={({ target }) => handleOnChange('biografia', target.value)}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={2} xs={12}>
            <Grid item xs={12}>
              <Typography>Site</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Endereço"
                variant="outlined"
                placeholder="www.site.com.br"
                fullWidth
                value={site == 'null' ? '' : site}
                onChange={({ target }) => handleOnChange('site', target.value)}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={2} xs={12}>
            <Grid container item xs={12}>
              <Grid item xs>
                <Typography>Redes Sociais</Typography>
              </Grid>
              {hasSocialMenu && (
                <Grid item>
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={handleRedesSociais}>
                    Adicionar
                  </Button>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    {renderSocialItems()}
                  </Menu>
                </Grid>
              )}
            </Grid>
            {renderSocialFields()}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleOnSave}>Salvar</Button>
      </DialogActions>
    </Dialog>
  )
}

export default PerfilForm;