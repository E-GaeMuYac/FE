import { atom } from 'recoil';

export const nowRoute = atom({
  key: 'nowRoute',
  default: '',
});

export const searchWord = atom({
  key: 'searchWord',
  default: '',
});

export const isLogined = atom({
  key: 'isLogined',
  default: false,
});

export const compareBoxData = atom({
  key: 'compareBoxData',
  default: {
    length: 0,
    isOpen: 'close',
    arr: [
      {
        medicineId: 1,
        itemName: 'null',
      },
      {
        medicineId: 2,
        itemName: 'null',
      },
    ],
  },
});

export const userInfoState = atom({
  key: 'userInfo',
  default: {
    email: '',
    imageUrl: '',
    loginCount: 0,
    loginType: '',
    nickname: '',
    userId: 0,
  },
});
