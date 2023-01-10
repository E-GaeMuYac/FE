import { atom } from 'recoil';

export const compareBoxData = atom({
  key: 'compareBoxData',
  default: [
    {
      id: 1,
      name: 'null',
    },
    {
      id: 2,
      name: 'null',
    },
  ],
});
