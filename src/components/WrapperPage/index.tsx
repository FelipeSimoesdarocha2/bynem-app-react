import React, { useState, useEffect } from 'react';

// antd
import { Divider } from 'antd';

// Components
import Loading from '../Loading';

import * as S from './styles';

const WrapperPage = ({ children, title, subTitle, disabledLoading }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!disabledLoading) {
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }, [disabledLoading])

  if (!disabledLoading && loading) {
    return <Loading />;
  }

  return (
    <>
      {title && (
        <S.Title>{title}</S.Title>
      )}
      {subTitle && (
        <S.SubTitle>{subTitle}</S.SubTitle>
      )}
      {(title || subTitle) && (
        <Divider />
      )}
      {children}
    </>
  )
}

export const renderPage = ({ Component, title, subTitle, disabledLoading }: any) => (
  <WrapperPage title={title} subTitle={subTitle} disabledLoading={disabledLoading}>
    <Component />
  </WrapperPage>
)

export default WrapperPage;
