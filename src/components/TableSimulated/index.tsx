import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import "antd/dist/antd.css";
import * as S from "./styles";

import api from "../../service/api";

import { useSearch } from '../../context/SearchContext'

import ConfirmDialog, { confirmDialog } from "../Dialog/index";

export type DataTable = {
  descricao: string;
  id: number;
  linkYouTube: string;
  ordemDasPerguntas: number;
  titulo: string;
};

export type Table = {
  setBottom: Function;
};

export default function TableSimulated({ setBottom }: Table) {
  const [data, setData] = useState<DataTable[]>()
  const [isLoading, setIsLoading] = useState(true);

  const antIcon = (<LoadingOutlined style={{ fontSize: 34, color: "#E414B2" }} spin />);
  const [isSpinning, setIsSpinning] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();

  const { search } = useSearch();

  const columns = [
    {
      title: "Nome",
      dataIndex: "titulo",
      key: "titulo",
    },
    {
      title: "Autor",
      dataIndex: "autor",
      key: "autor",
    },
    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: "20%",
      render: (id: number) => (
        <>
          <Button
            onClick={() => UpdateSimulated(id)}
            type="primary"
            style={{ width: "77px" }}
          >
            Editar
          </Button>

          <Button
            onClick={() => confirmDialog(
              "Ao confirmar o item selecionado será eliminado da lista",
              () => DeleteSimulated(id)
            )
            }
            type="primary"
            style={{ width: "77px" }}
            danger
          >
            Deletar
          </Button>
          <ConfirmDialog />
        </>
      ),
    },
  ];

  async function DeleteSimulated(id) {
    setIsSpinning(true);
    await api
      .delete(`Simulado/${id}`)
      .then(function () {
        setIsSpinning(false);
        toast.success("Simulado Deletado com sucesso ");
        getSimulateds();
      })
      .catch(function (error) {
        toast.error(`Um erro inesperado aconteceu`);
      });
  }

  function UpdateSimulated(id) {
    history.push(`/editar/simulado/${id}`);
  }

  useEffect(() => {
    const getSimulateds = async () => {
      if (user == null) {
        toast.error(`Você precisa estar logado`)

        setTimeout(() => {
          window.location.href = "/";
        }, 5000)
      }

      await api.get("Simulado/MySimulateds", {
        params: { filter: search },
      })
        .then(function (response) {
          if (response.data.length === 0) {
            setBottom(true);
          } else {
            setBottom(false);
          }
          setData(response.data);
          setIsLoading(false);
        }).catch(function (error) {
          setIsLoading(false);
          toast.error(`Um erro inesperado aconteceu `);
        });
    }

    getSimulateds();
  }, [search]);

  return (
    <Spin indicator={antIcon} spinning={isSpinning}>
      <S.DivTable>
        <Table
          pagination={{
            pageSizeOptions: ['10', '20', '30']
          }} loading={isLoading}
          columns={columns}
          dataSource={data}
          scroll={{ y: 430 }} />
      </S.DivTable>
    </Spin>
  );
}
