import { useState, useEffect } from 'react';

// Api
import api from '../service/api';

// Toast
import { toast } from 'react-toastify';

export const usePerfil = (user):any => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState();

  const handleGetPerfil = async () => {
    try {
      setLoading(true);

      const response = await api.get(`user/perfil/${user.id}`);

      setData(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      handleGetPerfil();
    } else {
      setData();
    }
  }, [user?.id])

  return {
    data,
    loading
  }
}
