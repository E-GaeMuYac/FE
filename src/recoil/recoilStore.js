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

const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const compareBoxData = atom({
  key: 'compareBoxData',
  default: {
    length: 0,
    isOpen: 'hide',
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
  effects: [localStorageEffect('compareBoxData')],
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
