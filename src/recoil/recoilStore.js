import { atom } from 'recoil';

export const nowRoute = atom({
  key: 'nowRoute',
  default: '',
});

export const searchWord = atom({
  key: 'searchWord',
  default: '',
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
