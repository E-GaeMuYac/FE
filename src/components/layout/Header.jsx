import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { userApi } from '../../apis/apiInstance';
import { useRecoilState } from 'recoil';
import { userInfoState } from '../../recoil/recoilStore';
import { useGetProfile } from '../../query/userQuery';

const Nav = ({ page }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [pageActive, setPageActive] = useState(false);

  useEffect(() => {
    if (page.pathName === location.pathname) {
      setPageActive(true);
    } else {
      setPageActive(false);
    }
  }, [page, location]);

  const gotoPage = () => {
    if (page.pathName === '/compare') {
      navigate(`${page.pathName}?tab=성분그래프`);
    } else {
      navigate(`${page.pathName}`);
    }
  };

  return (
    <StyledLink pageActive={pageActive} onClick={gotoPage}>
      {page.pageName}
    </StyledLink>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('refreshToken');

  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const userData = useGetProfile(token).data;

  useEffect(() => {
    if (token) {
      if (userData) {
        setUserInfo({
          email: userData.data.user.email,
          imageUrl: userData.data.user.imageUrl,
          loginCount: userData.data.user.loginCount,
          loginType: userData.data.user.loginType,
          nickname: userData.data.user.nickname,
          userId: userData.data.user.userId,
        });
      }
    }
  }, [userData]);

  const logoutHandler = async () => {
    try {
      await userApi.put('api/users/logout');
      localStorage.clear();
      navigate('/login');
    } catch (e) {
      console.log(e);
    }
  };
  // ---------------------------------------------------------------------

  const pageArr = [
    { pageName: '검색하기', pathName: '/search' },
    { pageName: '비교하기', pathName: '/compare' },
    { pageName: '이벤트', pathName: '/event' },
  ];

  const goToMypage = () => {
    navigate('/mypage?tab=내가 찜한 의약품');
  };

  // ---------------------------------------------------------------------

  return (
    <Wrap>
      <HeaderWrapper>
        <HeaderBox>
          <LogoBox to='/' />
          <CategoryBox>
            {pageArr.map((page) => (
              <Nav key={page.pageName} page={page} />
            ))}
          </CategoryBox>
          {!token ? (
            <SignBox>
              <LoginBtn to='/login'>로그인</LoginBtn>
            </SignBox>
          ) : (
            <SignBox>
              <BackgroundMypageBtn onClick={goToMypage}>
                <div className='myinfoImg'>
                  <MypageBtn props={userInfo.imageUrl} />
                </div>
                <div className='mypage'>마이페이지</div>
              </BackgroundMypageBtn>
              <LogoutBtn onClick={logoutHandler}>로그아웃</LogoutBtn>
            </SignBox>
          )}
        </HeaderBox>
      </HeaderWrapper>
    </Wrap>
  );
};

const Wrap = styled.div`
  @media screen and (max-width: 1700px) {
    height: 60px;
  }
  width: 100%;
  height: 80px;
`;

const HeaderWrapper = styled.div`
  @media screen and (max-width: 1700px) {
    height: 60px;
  }
  background-color: white;
  width: 100%;
  min-width: 1024px;
  margin: 0 auto;
  height: 80px;
  display: flex;
  align-items: center;
  position: fixed;
  justify-content: center;
  border-bottom: 1px solid #d0d0d0;
  z-index: 9999;
`;

const HeaderBox = styled.div`
  @media screen and (max-width: 1700px) {
    height: 55px;
    width: 1024px;
    min-width: 1024px;
  }
  width: 1380px;
  height: 80px;
  position: relative;
  display: flex;
  justify-content: center;
  gap: 50px;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
`;

const LogoBox = styled(Link)`
  @media screen and (max-width: 1700px) {
    width: 178.2px;
    height: 36px;
  }
  position: absolute;
  left: 0;
  width: 198px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: black;
  font-size: 40px;
  font-weight: 700;
  background-image: url('/assets/image/Logo.png');
  background-size: cover;
  background-position: center;
  margin-right: 292.5px;
`;

const CategoryBox = styled.div`
  @media screen and (max-width: 1700px) {
    font-size: 16px;
    gap: 40px;
  }

  height: 100%;
  display: flex;
  justify-content: center;
  gap: 50px;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
`;

const StyledLink = styled.div`
  text-decoration: none;
  color: ${({ pageActive }) => (pageActive ? '#242424' : '#868686')};
  cursor: pointer;
`;

const SignBox = styled.div`
  height: 100%;
  display: flex;
  gap: 18px;
  align-items: center;
  position: absolute;
  right: 0;
`;

const LoginBtn = styled(Link)`
  @media screen and (max-width: 1700px) {
    width: 80px;
    height: 34px;
    font-size: 13px;
    font-weight: 500;
  }
  background-color: #3366ff;
  width: 100px;
  height: 39px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  color: white !important;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const BackgroundMypageBtn = styled.div`
  @media screen and (max-width: 1700px) {
    height: 44px;
  }
  cursor: pointer;
  height: 50px;
  display: flex;
  align-items: center;
  .myinfoImg {
    @media screen and (max-width: 1700px) {
      width: 44px;
      height: 44px;
    }
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #f6f7fa;
  }
  .mypage {
    @media screen and (max-width: 1700px) {
      font-size: 13px;
    }
    margin-left: 5px;
    color: #868686;
    font-size: 15px;
  }
`;

const MypageBtn = styled.div`
  @media screen and (max-width: 1700px) {
    width: 36px;
    height: 36px;
    margin: 4px 4px;
  }
  background-image: ${({ props }) => `url(${props})`};
  background-size: cover;
  background-position: center;
  margin: 4.5px 4.5px;
  width: 41px;
  height: 41px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  /* z-index: 2; */
`;

const LogoutBtn = styled.button`
  @media screen and (max-width: 1700px) {
    width: 80px;
    height: 34px;
    font-size: 13px;
    font-weight: 500;
  }
  background-color: #242424;
  width: 100px;
  height: 39px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;
export default Header;
