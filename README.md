# 필넛츠 실전 프로젝트

## 프로젝트 개요

- 주제 : 약 서치 및 성분 비교 분석 사이트

- 진행 기간 : 2022.12.30 ~ 2023.02.10

- 팀 구성원

이재정

박수빈

김수정

- 기술 스택

<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> ![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white) ![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)

## 주제 선정 이유

## 트러블 슈팅
### react query 적용 중 데이터를 useQuery를 통해 가져올 때, 처음 랜더링 될 때는 undefined가 뜨고 다시 리랜더링이 되면 정상적으로 불러오는 문제
useQuery 안의 onSuccess에서 데이터를 로그로 찍으면 undefined가 되고 리랜더링하면 데이터가 잘 뜨는데,
밖에서 실행하면 리랜더링이 여러 번 일어나면서 마지막은 정상적으로 찍히고 있었다.
그래서 useEffect를 사용하여 그 data가 undefined가 아닐 경우에만 배열에 담았더니 정상적으로 작동하였다.



## 페이지
Medecine.jsx => 박수빈

Compare.jsx => 이재정

Login.jsx => 김수정

Signup.jsx => 김수정



## 공통 컴포넌트
Header.jsx => 김수정

Layout.jsx => 김수정

TabBar.jsx => 이재정

CompareBox.jsx => 이재정


## 와이어프레임
https://www.figma.com/file/2uItYSVY549Y4EV5rv1TFF/%EC%9D%B4%EA%B2%8C%EB%AD%90%EC%95%BD?node-id=0%3A1&t=hJEqdD2693aKcVG3-0
