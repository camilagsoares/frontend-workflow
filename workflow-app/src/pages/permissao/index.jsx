import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddCircle from '@mui/icons-material/AddCircleOutline';
import InputAdornment from '@mui/material/InputAdornment';
import Lista from './components/lista';
import ModalForm from './components/modal_form';
import FilterAlt from '@mui/icons-material/FilterAltOutlined';
import ModalFormAtualizarUsuario from './components/modal_atualizar_usuario';

const Permissao = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalFormAberto, abrirFecharModalForm] = useState(false);

  const [drawerViewAberto, abrirFecharDrawerView] = useState(false);
  const [drawerViewAbertoDelete, abrirFecharDrawerViewDelete] = useState(false);

  const [projetosSelecionadoVisualizar, setProjetosSelecionadoVisualizar] = useState(null);
  const [modalFormAtualizarEtapa, abrirFecharModalFormAtualizarEtapa] = useState(false);
  const [modalDeleteAberto, abrirFecharModalDelete] = useState(false);
  const [projetoSelecionadoDeletar, setProjetoSelecionadoDeletar] = useState(null);
 

  const handleAbrirDeleteModal = (idProjeto) => {
    abrirFecharModalDelete(true);
    setProjetoSelecionadoDeletar(idProjeto);
  };

  const handleFecharDeleteModal = () => handleAbrirDeleteModal(false);

  const handleAbrirDrawerView = (idProjeto) => {
    abrirFecharDrawerView(true);
    setProjetosSelecionadoVisualizar(idProjeto);
  };

  const handleFecharDrawerView = () => abrirFecharDrawerView(false);

  const handleAbrirDelete = (idProjeto) => {
    abrirFecharDrawerViewDelete(true);
    setProjetoSelecionadoDeletar(idProjeto);
  };

  const handleFecharDelete = () => abrirFecharDrawerViewDelete(false);

  const handleFecharModalAtualizarEtapaProjeto = () => abrirFecharModalFormAtualizarEtapa(false);
  const handleAbrirModalAtualizarEtapaProjeto = () => abrirFecharModalFormAtualizarEtapa(true);

   const handleAbrirModalDelete = () => abrirFecharModalDelete(true);

  const handleSearchTermChange = (term) => setSearchTerm(term);

  const handleFecharModalForm = () => abrirFecharModalForm(false);
  const handleAbrirModalForm = () => abrirFecharModalForm(true);
  return (
    <div>
      <Box>
        <Typography component='h2' variant='h5' fontWeight={700} color='text.primary'>
        Tipo Permissão
        </Typography>
        <Divider />
        <Box display='flex' flexDirection='row' gap={2} paddingY={2}>
          <Button startIcon={<AddCircle />} variant='outlined' color='primary' onClick={handleAbrirModalForm}>
            Criar tipo permissão 
          </Button>
          <TextField
            size='small'
            variant='outlined'
            color='primary'
            value={searchTerm}
            onChange={(e) => handleSearchTermChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <FilterAlt color='primary' />
                </InputAdornment>
              ),
            }}
            placeholder='Filtrar'
            sx={{
              marginLeft: 'auto',
              width: '190px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#1976D2',
                },
                '&:hover fieldset': {
                  borderColor: '#1976D2',
                },
                '& input': {
                  color: 'gray',
                  textTransform: 'none',
                  fontWeight: '100',
                },
                '& input::placeholder': {
                  color: '#1976D2',
                  textTransform: 'uppercase',
                  fontWeight: '400',
                },
              },
            }}
          />

          {modalFormAberto && <ModalForm handleFecharModalForm={handleFecharModalForm} />}

          {drawerViewAberto && (
            <ModalFormAtualizarUsuario
              handleFecharDrawerView={handleFecharDrawerView}
              projetosSelecionadoVisualizar={projetosSelecionadoVisualizar}
              handleAbrirModalAtualizarEtapaProjeto={handleAbrirModalAtualizarEtapaProjeto}
            />
          )} 


        </Box>
        
       <Lista
          searchTerm={searchTerm}
          handleAbrirDrawerView={handleAbrirDrawerView}
          handleAbrirDelete={handleAbrirDelete}
        />  
      </Box>
    </div>
  );
};

export default Permissao;
