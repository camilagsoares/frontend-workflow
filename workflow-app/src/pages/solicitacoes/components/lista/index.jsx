import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import EditOutlined from '@mui/icons-material/EditOutlined';
import MenuOpen from '@mui/icons-material/MenuOpenOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { useApiRequestGet } from '../../../../services/api';
import { Button } from '@mui/material';
import { AuthContext } from '../../../../contexts/auth.context';
import Pagination from '@mui/material/Pagination';
import "./styles.css"
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';


const Lista = (props) => {
  const theme = createTheme({
    palette: {
      secondary: {
        main: '#EC8718'
      },
    },
  });


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },

  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  }));



  const TableRowsLoaderSkeleton = ({ rowsNum }) => {
    return [...Array(rowsNum)].map((row, index) => (
      <TableRow key={index}>
        <StyledTableCell component='th' scope='row'>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
      </TableRow>
    ));
  };
  const { clickedProjectIds } = props;
  const { searchTerm } = props;
  const { filterByAta } = props;
  const { data, loading } = useApiRequestGet('/projetos');
  const { etapas } = useApiRequestGet('/etapas');

  localStorage.setItem('projetosData', JSON.stringify(data));
  //TESTE!
  const { data: listaDptos, loading: loadingTiposProjeto } = useApiRequestGet('/departamentos');
  const { token, session } = useContext(AuthContext);


  const isUsuarioCompras = session?.permissao.id === 2;

  // statusId === 2
  const { projetosSelecionadoVisualizar } = props;


  const [pageNumber, setPageNumber] = useState(0);
  const projectsPerPage = 6;
  const pagesVisited = pageNumber * projectsPerPage;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    setPageNumber(0);
  }, [data]);



  const dataIsValid = Array.isArray(data) && !isNaN(projectsPerPage);
  const { filterByDepartamento } = props;
  const { filterBySecretaria } = props;
  const { selectedTipoProjeto } = props;
  const { selectedFilter } = props;
  const { selectedSecretaria } = props;
  const [filteredData, setFilteredData] = useState(data);
  const [numProjetosPorSecretaria, setNumProjetosPorSecretaria] = useState({});
  const countProjectsBySecretaria = (data, secretaria) => {
    return data.filter((projeto) => projeto?.etapa[0]?.departamento?.secretaria?.nome === secretaria).length;
  };

  useEffect(() => {
    if (
      (searchTerm.trim() || filterByAta !== "all" || filterByDepartamento !== "all" || filterBySecretaria !== "" || selectedTipoProjeto || selectedFilter) &&
      data && Array.isArray(data) // Check if 'data' is not null and is an array
    ) {
      const filtered = data.filter((projeto) => {
        const valor = String(projeto.valor).trim();
        const formattedValor = formatarNumero(projeto?.valor).trim();
        const isAta = projeto.ata === true;
        const departamentoNome = (projeto?.etapa[0]?.departamento?.nome || "").trim();
        const secretariaNome = (projeto?.etapa[0]?.departamento?.secretaria?.nome || "").trim();
        const secretariaSigla = (projeto?.etapa[0]?.departamento?.secretaria?.sigla || "").trim();

        // Check if selectedFilter is not set or matches the current project
        const isMatchingSelectedFilter =
          !selectedFilter ||
          (
            projeto.usuario?.departamento?.nome.includes(selectedFilter.value.split(" - ")[0]) &&
            projeto.usuario?.departamento?.secretaria?.sigla.includes(selectedFilter.value.split(" - ")[1])
          );

        if (
          (projeto.idSonner.toString().includes(searchTerm.trim()) ||
            projeto?.titulo.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            departamentoNome.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            secretariaNome.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            secretariaSigla.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            projeto?.tipoProjeto?.nome.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            valor.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            formattedValor.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            departamentoNome.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            secretariaSigla.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            secretariaNome.toLowerCase().includes(searchTerm.trim().toLowerCase())) &&
          (filterByAta === "all" ||
            (filterByAta === "ata" && isAta) ||
            (filterByAta === "concluded" && projeto.situacao === "INATIVO") ||
            (filterByAta === "not-ata" && !isAta) ||
            (filterByAta === "urgent" &&
              projeto.prioridadeProjeto &&
              projeto.situacao !== "INATIVO")) &&
          (filterByDepartamento === "all" || departamentoNome === filterByDepartamento) &&
          (filterBySecretaria === "" || secretariaNome === filterBySecretaria) &&
          (selectedTipoProjeto === "" || projeto.tipoProjetoId === selectedTipoProjeto) &&
          isMatchingSelectedFilter
        ) {
          return true;
        }
        return false;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [data, searchTerm, filterByAta, filterByDepartamento, filterBySecretaria, selectedTipoProjeto, selectedFilter]);

  //teste
  function getBordaClasse(projeto) {
    if (projeto.situacao === 'INATIVO' && projeto.prioridadeProjeto) {
      // Se for concluído e urgente, borda verde
      return 'borda-verde';
    } else if (projeto.prioridadeProjeto) {
      // Se for apenas urgente, borda laranja
      return 'borda-laranja';
    } else if (projeto.situacao === 'INATIVO') {
      // Se for apenas concluído, borda verde
      return 'borda-verde';
    } else {
      // Para outros casos, borda cinza
      return 'borda-cinza';
    }
  }

  function formatarNumero(valor) {
    if (isNaN(valor)) {
      return valor;
    }

    return Number(valor).toLocaleString('pt-BR');
  }



  return (
    <React.Fragment>
      <Box marginY={1} paddingY={2}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label='customized table' >
            <TableHead className='borda-azul'>
              <StyledTableRow>
                {session?.id === 39 && (
                  <StyledTableCell align='left' width={112}>
                    Incluir
                  </StyledTableCell>
                )}


                <StyledTableCell align='left' width={112}>
                  N° Sonner
                </StyledTableCell>
                {session && (session.permissao.id === 1
                ) && (
                    <>
                      <StyledTableCell align='left' width={112} style={{ whiteSpace: 'nowrap' }}>
                        Departamento que criou
                      </StyledTableCell>
                    </>
                  )}

                <StyledTableCell width={192}>Descrição resumida</StyledTableCell>
                <StyledTableCell align='left' width={180}>
                  Parado em
                </StyledTableCell>
                <StyledTableCell align='left' width={196}>
                  Tipo Solicitação
                </StyledTableCell>
                <StyledTableCell align='left' width={96}>
                  Valor
                </StyledTableCell>
                {session && (session.id === 1 || session.id === 56) && (
                  <>
                    <StyledTableCell align='left' width={46}>
                      Prioridade
                    </StyledTableCell>
                  </>
                )}

                <StyledTableCell align='center' width={96}>
                  <MenuOpen />
                </StyledTableCell>

              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRowsLoaderSkeleton rowsNum={5} />
              ) : filteredData?.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={7}>
                    Nenhum projeto encontrado neste departamento.
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                filteredData
                  ?.slice(pagesVisited, pagesVisited + projectsPerPage)
                  .map((projeto) => (
                    <StyledTableRow key={projeto?.id}>
                      {session?.id === 39 && (
                        <StyledTableCell
                          align="left"
                          className={getBordaClasse(projeto)}
                        >
                          <Button
                            variant="contained"
                            onClick={() => props.handleIncluirClick(projeto?.id, projeto?.idSonner)}
                          >
                            {clickedProjectIds.includes(projeto?.id) ? 'Remover' : 'Incluir'}
                          </Button>
                        </StyledTableCell>
                      )}
                      <StyledTableCell align="left" className={isUsuarioCompras ? '' : getBordaClasse(projeto)}>
                        {projeto?.idSonner}
                      </StyledTableCell>
                      {session && (session.permissao.id === 1
                      ) && (
                          <>
                            <StyledTableCell align="left">


                              {projeto.usuario?.departamento?.secretaria?.sigla}  -&nbsp;
                              {projeto.usuario?.departamento?.nome}
                            </StyledTableCell>
                          </>
                        )}
                      <StyledTableCell component="th" scope="row" >
                        {projeto?.titulo}
                      </StyledTableCell>
                      <StyledTableCell align="left" >
                        {projeto?.etapa[0]?.departamento?.secretaria?.sigla}  -&nbsp;
                        {projeto?.etapa[0]?.departamento?.nome}
                      </StyledTableCell>
                      <StyledTableCell align="left">{projeto?.tipoProjeto?.nome}</StyledTableCell>
                      <StyledTableCell align="left" style={{ whiteSpace: 'nowrap' }}>R$ {formatarNumero(projeto?.valor)}</StyledTableCell>

                      {session && (session.id === 1 && !isUsuarioCompras || session.id === 56 && !isUsuarioCompras) && (

                        <StyledTableCell align="left">
                          <Tooltip title="Prioridade" arrow>
                            <div>
                              {projeto?.prioridadeProjeto ? (
                                <ThemeProvider theme={theme}>
                                  <Button
                                    startIcon={<ImportExportOutlinedIcon />}
                                    variant='outlined'
                                    color='secondary'
                                    sx={{ marginRight: 1 }}
                                    onClick={() => props.handleAbrirModalPrioridadeProjeto(projeto?.id)}
                                  >
                                    Reverter Prioridade
                                  </Button>
                                </ThemeProvider>
                              ) : (
                                <Button
                                  startIcon={<ImportExportOutlinedIcon />}
                                  variant='outlined'
                                  color='primary'
                                  sx={{ marginRight: 1 }}
                                  onClick={() => props.handleAbrirModalPrioridadeProjeto(projeto?.id)}
                                >
                                  Definir prioridade
                                </Button>
                              )}
                            </div>
                          </Tooltip>
                        </StyledTableCell>


                      )}
                      <StyledTableCell align="center">
                        <Tooltip title="Detalhes" arrow>
                          <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open modal details"
                            onClick={() => {
                              props.handleAbrirDrawerView(projeto?.id);
                            }}
                            style={{ margin: '9px' }}
                          >
                            <VisibilityOutlined fontSize="small" color="action" />
                          </IconButton>
                        </Tooltip>
                        {(projeto.etapa[0]?.statusId === 4 && projeto.usuarioId === session?.id || session.id === 56 && !isUsuarioCompras) &&
                          (
                            <Tooltip title="Editar" arrow>
                              <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open modal edit register"
                                onClick={() => {
                                  props.handleAbrirEditarProjeto(projeto?.id);
                                }}
                                style={{ marginRight: '-22px' }}
                              >
                                <EditOutlined fontSize="small" color="action" />
                              </IconButton>
                            </Tooltip>
                          )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {!loading && filteredData && filteredData.length > 0 && (
        <Box display="flex" justifyContent="end" mt={2} >
          <Pagination
            color="primary"
            count={Math.ceil(filteredData?.length / projectsPerPage)}
            page={pageNumber + 1}
            onChange={(event, page) => {
              changePage({ selected: page - 1 });
            }}
            variant="outlined"
            shape="rounded"
          />
        </Box>
      )}
    </React.Fragment>
  );
};


Lista.propTypes = {
  handleAbrirDrawerView: PropTypes.func.isRequired,
  handleIncluirClick: PropTypes.func.isRequired,
  handleAbrirEditarProjeto: PropTypes.func.isRequired,
  handleAbrirModalPrioridadeProjeto: PropTypes.func.isRequired,
  searchTerm: PropTypes.string,
  // setSelectedStatus: PropTypes.string,
};

Lista.defaultProps = {
  searchTerm: undefined,
  // setSelectedStatus: undefined,
};
export default Lista;
