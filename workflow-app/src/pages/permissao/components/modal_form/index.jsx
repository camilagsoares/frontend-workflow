import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/CloseOutlined';
import Save from '@mui/icons-material/SaveAltOutlined';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import {  axiosApi } from '../../../../services/api';
import Alert from '@mui/material/Alert';
import React, { useState } from 'react';
import AlertTitle from '@mui/material/AlertTitle';

const schema = yup
  .object({
    descricao: yup.string().required('Campo obrigatorio'),
    nome: yup.string().required('Campo obrigatorio'),

  })
  .required();

const ModalForm = (props) => {
  const { handleFecharModalForm } = props;
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState, control, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      descricao: '',
      nome: '',
    },
  });


  const { errors } = formState;

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleCriarSecretaria = (data) => {
    setLoading(true);
    axiosApi
      .post('/auth/permissoes', data)
      .then(() => {
        reset();
        handleFecharModalForm();
      })
      .catch((error) => {
      })
      .finally(() => {
        setLoading(false);
      });

  };

  return (
    <Dialog disableEscapeKeyDown fullWidth open={true} onClose={handleFecharModalForm} maxWidth='sm'>
      <DialogTitle>
        <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component='h5'>Criar tipo Permissão</Typography>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='clos modal create project'
            onClick={handleFecharModalForm}
          >
            <Close color='action' />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Box component='form' noValidate onSubmit={handleSubmit(handleCriarSecretaria)}>
        <DialogContent dividers sx={{ paddingTop: 1 }}>
          <Grid container columnSpacing={2} rowSpacing={2} marginTop={0.5}>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                {...register('descricao')}
                required
                fullWidth
                autoFocus
                label='Descrição'
                type='text'
                error={!!errors.descricao}
                helperText={errors.descricao?.message}
              />
            </Grid>
          
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                {...register('nome')}
                fullWidth
                required
                label='Nome'
                type='text'
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />
            </Grid>


       
           

          </Grid>

          {showSuccessMessage && (
            <Box mt={2} display='flex' justifyContent='center' alignItems='center'>
              <Alert severity='success'>
                <AlertTitle>Successo</AlertTitle>
                Usuário criado com sucesso!
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<Close width={24} />}
            variant='outlined'
            color='info'
            onClick={handleFecharModalForm}
            sx={{ minWidth: 156, height: '100%' }}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            startIcon={<Save width={24} />}
            variant='outlined'
            color='success'
            sx={{ minWidth: 156, height: '100%' }}
          >
            {!loading ? 'Salvar' : <CircularProgress color='success' size={23} />}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

ModalForm.propTypes = {
  handleFecharModalForm: PropTypes.func.isRequired,
};

export default ModalForm;
